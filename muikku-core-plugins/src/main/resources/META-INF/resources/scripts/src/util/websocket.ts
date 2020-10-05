import actions from '../actions/base/notifications';
import {Store} from 'react-redux';
import $ from '~/lib/jquery';
import mApi from '~/lib/mApi';
import { Action } from 'redux';
import { WebsocketStateType } from '~/reducers/util/websocket';

type ListenerType = {
    [name: string]: {
      actions?: Array<Function>,
      callbacks?: Array<Function>
    }
  }

export default class MuikkuWebsocket {
  private options:any;
  private ticket:any;
  private webSocket:WebSocket;
  private socketOpen:boolean;
  private reconnecting:boolean;
  private messagesPending:{
    eventType: string,
    data: any,
    onSent?: ()=>any,
    stackId?: string
  }[];
  private pingHandler:any;
  private waitingPong:boolean;
  private gotPong:boolean;
  private listeners:ListenerType;
  private baseListeners:ListenerType;
  private store: Store<any>;
  private reconnectHandler: NodeJS.Timer;

  constructor(store: Store<any>, listeners: ListenerType, options={
    reconnectInterval: 2000,
    pingInterval: 5000
  }) {
    this.options = options;

    this.ticket = null;
    this.webSocket = null;
    this.socketOpen = false;
    this.reconnecting = false;
    this.messagesPending = [];
    this.pingHandler = null;
    this.waitingPong = false;
    this.gotPong = false;
    this.listeners = listeners;
    this.baseListeners = listeners;
    this.store = store;

    this.getTicket((ticket: any)=> {
      if (this.ticket) {
        this.openWebSocket();
      }
      else {
        this.store.dispatch(actions.displayNotification("Could not open WebSocket because ticket was missing", 'error') as Action);
      }
    });

    this.store.dispatch({
      'type': 'INITIALIZE_WEBSOCKET',
      'payload': this
    });

    $(window).on("beforeunload", this.onBeforeWindowUnload.bind(this));
  }
  
  sendMessage(eventType: string, data: any, onSent?: ()=>any, stackId?: string){
    if (this.socketOpen) {
      try {
        this.webSocket.send(JSON.stringify({
          eventType: eventType,
          data: data
        }));
        let websocketState:WebsocketStateType = this.store.getState().websocket;
        this.messagesPending.length === 0 && !websocketState.synchronized && this.trigger("webSocketSync");
        onSent && onSent();
      }
      catch (e) {
        if (eventType != 'ping:ping') {
          this.queueMessage(eventType, data, onSent, stackId);
        }
        this.trigger("webSocketDesync");
      }
    }
    else {
      if (eventType != 'ping:ping') {
        this.queueMessage(eventType, data, onSent, stackId);
      }
      this.trigger("webSocketDesync");
    }
  }
  
  queueMessage(eventType: string, data: any, onSent?: ()=>any, stackId?: string){
    let index = stackId && this.messagesPending.findIndex((m)=>m.stackId === stackId);
    let message = {
      eventType,
      data,
      onSent,
      stackId
    };
    if (typeof index === "number" && index !== -1){
      this.messagesPending[index] = message
    }
    else {
      this.messagesPending.push(message);
    }
  }
  
  addEventListener(event: string, actionCreator: Function){
    let evtListeners = this.listeners[event] || {
      actions: [],
      callbacks: []
    };
    evtListeners.actions.push(actionCreator);
    this.listeners[event] = evtListeners;
    return this;
  }
  
  removeEventCallback(event: string, actionCreator: Function){
    let index = this.listeners[event].callbacks.indexOf(actionCreator);
    if (index !== -1){
      this.listeners[event].callbacks.splice(index, 1);
    }
  }
  
  addEventCallback(event: string, action: Function){
    let evtListeners = this.listeners[event] || {
      actions: [],
      callbacks: []
    };
    evtListeners.callbacks.push(action);
    this.listeners[event] = evtListeners;
    return this;
  }
  
  restoreEventListeners(){
    this.listeners = this.baseListeners;
    return this;
  }
  
  trigger(event: any, data: any=null){
    this.store.dispatch({
      'type': 'WEBSOCKET_EVENT',
      'payload': {
        event,
        data
      }
    });

    if (this.listeners[event]){
      let listeners = this.listeners[event].actions;
      if (listeners){
        for (let action of listeners){
          if (typeof action === "function"){
            this.store.dispatch(action());
          }
          else {
            this.store.dispatch(action);
          }
        }
      }

      let otherListeners = this.listeners[event].callbacks;
      if (otherListeners){
        for (let callback of otherListeners){
          callback(data);
        }
      }
    }
  }

  getTicket(callback: Function) {
    try {
      if (this.ticket) {
        // We have a ticket, so we need to validate it before using it
        mApi().websocket.cacheClear().ticket.check.read(this.ticket).callback((err: Error, response: any)=>{
          if (err) {
            // Ticket did not pass validation, so we need to create a new one
            this.createTicket((ticket: any)=>{
              this.ticket = ticket;
              callback(ticket);
            });
          }
          else {
            // Ticket passed validation, so we use it
            callback(this.ticket);
          }
        });
      }
      else {
        // Create new ticket
        this.createTicket((ticket: any)=>{
          this.ticket = ticket;
          callback(ticket);
        });
      }
    }
    catch (e) {
      this.store.dispatch(actions.displayNotification("Ticket creation failed on an internal error", 'error') as Action);
    }
  }

  createTicket(callback: Function) {
    mApi().websocket.ticket.create().callback((err: Error, ticket: any)=>{
      if (!err) {
        callback(ticket.ticket);
      }
      else {
        this.store.dispatch(actions.displayNotification("Could not create WebSocket ticket", 'error') as Action);
      }
    });
  }

  onWebSocketConnected() {
    // Clear reconnection handlers, if any
    if (this.reconnectHandler) {
      clearInterval(this.reconnectHandler);
    }
    this.reconnecting = false;

    // Tell the world we're in business
    this.socketOpen = true;
    this.trigger("webSocketConnected");
	
	// If we have queued messages, send them now
    while (this.socketOpen && this.messagesPending.length) {
      let message = this.messagesPending.shift();
      this.sendMessage(message.eventType, message.data, message.onSent);
    }
    
    // Start pinging to ensure connection stays alive
    this.startPinging();
  }

  onWebSocketError() {
    this.reconnect();
  }

  onWebSocketClose() {
    this.trigger("webSocketDisconnected");
    this.reconnect();
  }

  openWebSocket() {
    let host = window.location.host;
    let secure = location.protocol == 'https:';
    this.webSocket = this.createWebSocket((secure ? 'wss://' : 'ws://') + host + '/ws/socket/' + this.ticket);
    if (this.webSocket) {
      this.webSocket.onmessage = this.onWebSocketMessage.bind(this);
      this.webSocket.onerror = this.onWebSocketError.bind(this);
      this.webSocket.onclose = this.onWebSocketClose.bind(this);
      this.webSocket.onopen = this.onWebSocketConnected.bind(this);
    }
    else {
      this.store.dispatch(actions.displayNotification("Could not open WebSocket connection", 'error') as Action);
    }
  }

  createWebSocket(url: string) {
    if ((typeof (<any>window).WebSocket) !== 'undefined') {
      return new WebSocket(url);
    }
    else if ((typeof (<any>window).MozWebSocket) !== 'undefined') {
      return new (<any>window).MozWebSocket(url);
    }
    return null;
  }

  startPinging() {
    this.pingHandler = setInterval(()=>{
      // Skip just in case we would be closed or reconnecting
      if (!this.socketOpen || this.reconnecting) {
        return;
      }
      
      if (!this.waitingPong) {
        // Ping pong match start
        this.waitingPong = true;
        this.gotPong = false;
        this.sendMessage("ping:ping", {});
      }
      else if (this.gotPong) {
        // Sent ping, got pong, just keep it up
        this.waitingPong = true;
        this.gotPong = false;
        this.sendMessage("ping:ping", {});
      }
      else {
        // Didn't get a pong to our latest ping in five seconds, reconnect 
        this.reconnect();
      }
    }, this.options.pingInterval);
  }

  reconnect() {
    // Ignore if we are already busy reconnecting
    if (this.reconnecting) {
      return;
    }
    
    // Ditch the old websocket and anything related to it
    this.discardCurrentWebSocket();
    
    // Try to re-establish connection every two seconds (onWebSocketConnected will eventually clear us)    
    this.reconnectHandler = setInterval(()=>{
      this.getTicket((ticket: any)=>{
        if (this.ticket) {
          this.openWebSocket();
        }
        else {
          this.store.dispatch(actions.displayNotification("Could not open WebSocket because ticket was missing", 'error') as Action);
        }
      });
    }, this.options.reconnectInterval);
  }
  
  discardCurrentWebSocket() {
    // Inform everyone we're no longer open for business...
    this.socketOpen = false;
    
    // ...and stop pinging...
    clearInterval(this.pingHandler);
    this.waitingPong = false;
    this.gotPong = false;
    
    // ...and try to get rid of the current websocket
    try {
      if (this.webSocket) {
        this.webSocket.onmessage = ()=>{};
        this.webSocket.onerror = ()=>{};
        this.webSocket.onclose = ()=>{};
        this.webSocket.onopen = ()=>{};
        this.webSocket.close();
        this.webSocket = null;
      }
    }
    catch (e) {
      // Ignore exceptions related to discarding a WebSocket
    }
  }

  onWebSocketMessage(event: any) {
    let message = JSON.parse(event.data);
    let eventType = message.eventType;
    if (eventType == 'ping:pong') {
      this.gotPong = true;
    }
    else {
      this.trigger(eventType, message.data);
    }
  }

  onBeforeWindowUnload() {
    this.discardCurrentWebSocket();
  }

}
