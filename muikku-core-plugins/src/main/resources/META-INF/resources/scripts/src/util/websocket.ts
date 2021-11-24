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
  private reconnectRetries:number;
  private messagesPending:{
    eventType: string,
    data: any,
    onSent?: ()=>any,
    stackId?: string
  }[];
  private pingHandler:any;
  private waitingPong:boolean;
  private gotPong:boolean;
  private discarded:boolean;
  private listeners:ListenerType;
  private baseListeners:ListenerType;
  private store: Store<any>;
  private reconnectHandler: NodeJS.Timer;

  constructor(store: Store<any>, listeners: ListenerType, options={
    reconnectInterval: 10000,
    pingInterval: 5000
  }) {
    this.options = options;

    this.ticket = null;
    this.webSocket = null;
    this.socketOpen = false;
    this.discarded = false;
    this.reconnecting = false;
    this.reconnectRetries = 0;
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
    });

    this.store.dispatch({
      'type': 'INITIALIZE_WEBSOCKET',
      'payload': this
    });

    $(window).on("beforeunload", this.onBeforeWindowUnload.bind(this));
  }

  sendMessage(eventType: string, data: any, onSent?: ()=>any, stackId?: string){
    if (this.socketOpen && !this.reconnecting) {

      // Check if message queue already has this message. This can happen if it was previously
      // sent to the server but the server failed to respond within two seconds, causing that
      // message to be added to queue. Since the message we are sending now is the latest,
      // clear the previous one from the queue so that it doesn't accidentally overwrite this
      // message later (if we lose connection and restore it)

      let index = stackId && this.messagesPending.findIndex((m)=>m.stackId === stackId);
      if (typeof index === "number" && index !== -1) {
        this.messagesPending.splice(index, 1);
      }

      // Send message

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
    // Check if we have given up for good
    if (this.discarded) {
      this.ticket = null;
      callback();
    }
    if (this.ticket) {
      // We have a ticket, so we need to validate it before using it
      $.ajax({
        url: '/rest/websocket/ticket/' + this.ticket + '/check',
        type: 'GET',
        cache: false,
        success: function(data:any, textStatus:any, jqXHR:any) {
          callback(this.ticket);
        },
        error: $.proxy(function(jqXHR:any) {
          if (jqXHR.status == 403) {
            // According to server, we are no longer logged in. Stop everything, user needs to login again
            // TODO localization
            this.store.dispatch(actions.displayNotification("Muikku-istuntosi on vanhentunut. Jos olet vastaamassa tehtäviin, kopioi varmuuden vuoksi vastauksesi talteen omalle koneellesi ja kirjaudu uudelleen sisään.", 'error') as Action);
            this.ticket = null;
            this.discarded = true;
            this.discardCurrentWebSocket(true);
            callback();
          }
          else if (jqXHR.status == 404) {
            // Ticket no longer passes validation but we are still logged in, so try to renew the ticket
            this.createTicket((ticket: any)=>{
              this.ticket = ticket;
              callback(ticket);
            });
          }
          else if (jqXHR.status == 502) {
            // Server is down. Stop everything, user needs to reload page
            // TODO localization
            this.store.dispatch(actions.displayNotification("Muikkuun ei saada yhteyttä. Jos olet vastaamassa tehtäviin, kopioi varmuuden vuoksi vastauksesi talteen omalle koneellesi ja lataa sivu uudelleen.", 'error') as Action);
            this.ticket = null;
            this.discarded = true;
            this.discardCurrentWebSocket(true);
            callback();
          }
          else {
            // Something else happened. Carry on since we're most likely reconnecting anyway
            this.ticket = null;
            callback();
          }
        }, this)
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

  createTicket(callback: Function) {
    // Check if we have given up for good
    if (this.discarded) {
      callback();
    }
    $.ajax({
      url: '/rest/websocket/ticket',
      type: 'GET',
      dataType: 'text',
      success: function(data:any, textStatus:any, jqXHR:any) {
        callback(data);
      },
      error: function(jqXHR:any) {
        callback();
      }
    });
  }

  onWebSocketConnected() {
    // Clear possible reconnection handler
    if (this.reconnectHandler) {
      clearTimeout(this.reconnectHandler);
      this.reconnectHandler = null;
    }
    this.reconnecting = false;
    this.reconnectRetries = 0;

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
    if (!this.reconnecting && !this.discarded) {
      this.startReconnecting();
    }
  }

  openWebSocket() {
    let host = window.location.host;
    let secure = location.protocol == 'https:';
    this.webSocket = this.createWebSocket((secure ? 'wss://' : 'ws://') + host + '/ws/socket/' + this.ticket);
    if (this.webSocket) {
      this.webSocket.onmessage = this.onWebSocketMessage.bind(this);
      this.webSocket.onerror = this.onWebSocketError.bind(this);
      this.webSocket.onopen = this.onWebSocketConnected.bind(this);
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
      if (!this.socketOpen || this.reconnecting || this.discarded) {
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
        if (!this.reconnecting && !this.discarded) {
          this.startReconnecting();
        }
      }
    }, this.options.pingInterval);
  }

  startReconnecting() {
    // Ignore if we are already busy reconnecting
    if (this.reconnecting || this.discarded) {
      return;
    }
    this.reconnecting = true;
    this.reconnectRetries = 0;

    // Ditch the old websocket and anything related to it (except that we are reconnecting)
    this.discardCurrentWebSocket(false);

    // Start the initial reconnect attempt
    this.reconnect();
  }

  reconnect() {
    // Skip if we are discarded already
    if (this.discarded) {
      return;
    }
    this.getTicket((ticket: any)=>{
      if (this.ticket) {
        // Re-acquired ticket, ditch reconnect handler and open socket
        if (this.reconnectHandler) {
          clearTimeout(this.reconnectHandler);
          this.reconnectHandler = null;
        }
        this.openWebSocket();
      }
      else {
        this.reconnectRetries++;
        if (this.reconnectRetries == 12) { // two minutes have passed, let's give up
          this.discarded = true;
          this.discardCurrentWebSocket(true);
          // TODO localization
          this.store.dispatch(actions.displayNotification("Muikkuun ei saada yhteyttä. Ole hyvä ja lataa sivu uudelleen. Jos olet vastaamassa tehtäviin, kopioi varmuuden vuoksi vastauksesi talteen omalle koneellesi.", 'error') as Action);
        }
        else {
          // Reconnect retry failed, retry after reconnectInterval
          this.reconnectHandler = setTimeout(()=>{
            this.reconnect();
          }, this.options.reconnectInterval) as any;
        }
      }
    });
  }

  discardCurrentWebSocket(resetReconnectionParams:boolean) {
    // Inform everyone we're no longer open for business...
    let wasOpen = this.socketOpen;
    this.socketOpen = false;

    // ...and stop pinging...
    if (this.pingHandler) {
      clearInterval(this.pingHandler);
    }
    this.waitingPong = false;
    this.gotPong = false;

      // ...and detach possible reconnect handler...
    if (this.reconnectHandler) {
      clearTimeout(this.reconnectHandler);
      this.reconnectHandler = null;
    }
    if (resetReconnectionParams) {
      this.reconnecting = false;
      this.reconnectRetries = 0;
    }

    // ...and get rid of the current websocket
    if (this.webSocket) {
      this.webSocket.onmessage = null;
      this.webSocket.onerror = null;
      this.webSocket.onopen = null;
      if (wasOpen) {
        try {
          this.webSocket.close();
        }
        catch (e) {
          // Ignore exceptions related to closing a WebSocket
        }
      }
      this.webSocket = null;
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
    this.discarded = true;
    this.discardCurrentWebSocket(true);
  }

}
