import actions from '../actions/base/notifications';

export default class MuikkuWebsocket {
  constructor(store, listeners=[], options={
    reconnectInterval: 200,
    pingTimeStep: 1000,
    pingTimeout: 10000
  }) {
    this.options = options;
    this.listeners = listeners;
    
    this.ticket = null;
    this.webSocket = null;
    this.socketOpen = false;
    this.messagesPending = [];
    this.pingHandle = null;
    this.pinging = false;
    this.pingTime = 0;
    this.listeners = {};
    this.store = store;
    
    this.getTicket((ticket)=> {
      if (this.ticket) {
        this.openWebSocket();
        this.startPinging();
      } else {
        this.store.dispatch(actions.displayNotification("Could not open WebSocket because ticket was missing", 'error'));
      }
    });

    $(window).on("beforeunload", this.onBeforeWindowUnload.bind(this));
  }
  sendMessage(eventType, data){
    let message = {
      eventType,
      data
    }
    
    if (this.socketOpen) {
      try {
        this.webSocket.send(JSON.stringify(message));
      } catch (e) {
        this.messagesPending.push({
          eventType: eventType,
          data: data
        });
        this.reconnect();
      }
    } else {
      this.messagesPending.push(message);
    }
  }
  
  trigger(event, data=null){
    this.store.dispatch({
      'type': 'WEBSOCKET_EVENT',
      'payload': {
        event,
        data
      }
    });
    
    if (this.listeners[event]){
      let listeners = this.listeners[event] instanceof Array ? this.listeners[event] : this.listeners[event].actions;
      if (listeners){
        if (typeof listeners === "function"){
          listeners = listeners(data);
        }
        for (action of listeners){
          if (typeof action === "function"){
            this.store.dispatch(action());
          } else {
            this.store.dispatch(action);
          }
        }
      }
      
      let otherListeners = this.listeners[event].callbacks;
      if (otherListeners){
        for (callback of otherListeners){
          callback(data);
        }
      }
    }
  }
  
  getTicket(callback) {
    try {
      if (this.ticket) {
        // We have a ticket, so we need to validate it before using it
        mApi().websocket.cacheClear().ticket.check.read(this.ticket).callback($.proxy(function (err, response) {
          if (err) {
            // Ticket did not pass validation, so we need to create a new one
            this.createTicket($.proxy(function (ticket) {
              this.ticket = ticket;
              callback(ticket);
            }, this));
          } else {
            // Ticket passed validation, so we use it
            callback(this.ticket);
          }
        }, this));
      } else {
        // Create new ticket
        this.createTicket((ticket)=>{
          this.ticket = ticket;
          callback(ticket);
        });
      }
    } catch (e) {
      this.store.dispatch(actions.displayNotification("Ticket creation failed on an internal error", 'error'));
    }
  }
  
  createTicket(callback) {
    mApi().websocket.ticket.create()
      .callback((err, ticket)=>{
        if (!err) {
          callback(ticket.ticket);
        } else {
          this.store.dispatch(actions.displayNotification("Could not create WebSocket ticket", 'error'));
        }
      });
  }
  
  onWebSocketConnected() {
    this.socketOpen = true;
    this.trigger("webSocketConnected"); 
    
    while (this.socketOpen && this.messagesPending.length) {
      var message = this.messagesPending.shift();
      this.sendMessage(message.eventType, message.data);
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
          this.store.dispatch(actions.displayNotification("WebSocket connection failed", 'error'));
        break;
      }
    } else {
      this.store.dispatch(actions.displayNotification("Could not open WebSocket connection", 'error'));
    }
  }
  
  createWebSocket(url) {
    if ((typeof window.WebSocket) !== 'undefined') {
      return new WebSocket(url);
    } else if ((typeof window.MozWebSocket) !== 'undefined') {
      return new MozWebSocket(url);
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
    var wasOpen = this.socketOpen; 
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
      
      this.getTicket((ticket)=>{
        if (this.ticket) {
          this.openWebSocket();
        } else {
          this.store.dispatch(actions.displayNotification("Could not open WebSocket because ticket was missing", 'error'));
        }
      });
      
    }, this.options.reconnectInterval);
  }
  
  onWebSocketMessage(event) {
    var message = JSON.parse(event.data);
    var eventType = message.eventType;
    
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