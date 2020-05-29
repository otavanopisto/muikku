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
  private messagesPending:{
    eventType: string,
    data: any,
    onSent?: ()=>any,
    stackId?: string
  }[];
  private pingHandle:any;
  private pinging:boolean;
  private pingTime:number;
  private listeners:ListenerType;
  private baseListeners:ListenerType;
  private store: Store<any>;
  private reconnectTimeout: NodeJS.Timer;

  constructor(store: Store<any>, listeners: ListenerType, options={
    reconnectInterval: 200,
    pingTimeStep: 1000,
    pingTimeout: 10000
  }) {
    this.options = options;

    this.ticket = null;
    this.webSocket = null;
    this.socketOpen = false;
    this.messagesPending = [];
    this.pingHandle = null;
    this.pinging = false;
    this.pingTime = 0;
    this.listeners = listeners;
    this.baseListeners = listeners;
    this.store = store;

    this.getTicket((ticket: any)=> {
      if (this.ticket) {
        this.openWebSocket();
        this.startPinging();
      } else {
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
      } catch (e) {
        this.queueMessage(eventType, data, onSent, stackId);
        this.trigger("webSocketDesync");
        this.reconnect();
      }
    } else {
      this.queueMessage(eventType, data, onSent, stackId);
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
    } else {
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
          } else {
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
          } else {
            // Ticket passed validation, so we use it
            callback(this.ticket);
          }
        });
      } else {
        // Create new ticket
        this.createTicket((ticket: any)=>{
          this.ticket = ticket;
          callback(ticket);
        });
      }
    } catch (e) {
      this.store.dispatch(actions.displayNotification("Ticket creation failed on an internal error", 'error') as Action);
    }
  }

  createTicket(callback: Function) {
    mApi().websocket.ticket.create()
      .callback((err: Error, ticket: any)=>{
        if (!err) {
          callback(ticket.ticket);
        } else {
          this.store.dispatch(actions.displayNotification("Could not create WebSocket ticket", 'error') as Action);
        }
      });
  }

  onWebSocketConnected() {
    this.socketOpen = true;
    this.trigger("webSocketConnected");

    while (this.socketOpen && this.messagesPending.length) {
      let message = this.messagesPending.shift();
      this.sendMessage(message.eventType, message.data, message.onSent);
    }
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
      switch (this.webSocket.readyState) {
        case this.webSocket.CONNECTING:
          this.webSocket.onopen = this.onWebSocketConnected.bind(this);
        break;
        case this.webSocket.OPEN:
          this.onWebSocketConnected();
        break;
        default:
          this.store.dispatch(actions.displayNotification("WebSocket connection failed", 'error') as Action);
        break;
      }
    } else {
      this.store.dispatch(actions.displayNotification("Could not open WebSocket connection", 'error') as Action);
    }
  }

  createWebSocket(url: string) {
    if ((typeof (<any>window).WebSocket) !== 'undefined') {
      return new WebSocket(url);
    } else if ((typeof (<any>window).MozWebSocket) !== 'undefined') {
      return new (<any>window).MozWebSocket(url);
    }

    return null;
  }

  startPinging() {
    this.pingHandle = setInterval(()=>{
      if (this.socketOpen === false) {
        return;
      }
      if (!this.pinging) {
        this.sendMessage("ping:ping", {});
        this.pinging = true;
      } else {
        this.pingTime += this.options.pingTimeStep;

        if (this.pingTime > this.options.pingTimeout) {
          if (console) console.log("ping failed, reconnecting...");
          this.pinging = false;
          this.pingTime = 0;

          this.reconnect();
        }
      }
    }, this.options.pingTimeStep);
  }

  reconnect() {
    let wasOpen = this.socketOpen;
    this.socketOpen = false;
    clearTimeout(this.reconnectTimeout);

    this.reconnectTimeout = setTimeout(()=>{
      try {
        if (this.webSocket) {
          this.webSocket.onmessage = function () {};
          this.webSocket.onerror = function () {};
          this.webSocket.onclose = function () {};
          if (wasOpen) {
            this.webSocket.close();
          }
        }
      } catch (e) {
        // Ignore exceptions related to discarding a WebSocket
      }

      this.getTicket((ticket: any)=>{
        if (this.ticket) {
          this.openWebSocket();
        } else {
          this.store.dispatch(actions.displayNotification("Could not open WebSocket because ticket was missing", 'error') as Action);
        }
      });

    }, this.options.reconnectInterval);
  }

  onWebSocketMessage(event: any) {
    let message = JSON.parse(event.data);
    let eventType = message.eventType;

    if (eventType == "ping:pong") {
      this.pinging = false;
      this.pingTime = 0;
    } else {
      this.trigger(eventType, message.data);
    }
  }

  onBeforeWindowUnload() {
    if (this.webSocket) {
      this.webSocket.onmessage = ()=>{};
      this.webSocket.onerror = ()=>{};
      this.webSocket.onclose = ()=>{};
      if (this.socketOpen) {
        this.webSocket.close();
      }
    }
  }
}
