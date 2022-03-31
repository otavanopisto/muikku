  $.widget("custom.muikkuWebSocket", {
    
    options: {
      reconnectInterval: 2000,
      pingTimeStep: 10000
    },
    
    _create : function() {
      this._ticket = null;
      this._webSocket = null;
      this._socketOpen = false;
      this._messagesPending = [];
      this._pingHandle = null;
      this._pinging = false;
      this._pingTime = 0;
      this._listeners = {};
      
      this.addEventListener("webSocketConnected", $.proxy(this._onWebSocketConnected, this));
      this.addEventListener("webSocketDisconnected", $.proxy(this._onWebSocketDisconnected, this));
      
      this._getTicket($.proxy(function (ticket) {
        if (this._ticket) {
          this._openWebSocket();
        }
        else {
          $('.notification-queue').notificationQueue('notification', 'error', "Could not open WebSocket because ticket was missing");
        }
      }, this));

      $(window).on("beforeunload", $.proxy(this._onBeforeWindowUnload, this));
    },
    
    sendMessage: function (eventType, data) {
      var message = {
        eventType: eventType,
        data: data
      };
      
      if (this._socketOpen) {
        try {
          this._webSocket.send(JSON.stringify(message));
        }
        catch (e) {
          this._messagesPending.push({
            eventType: eventType,
            data: data
          });
        }
      }
      else {
        this._messagesPending.push({
          eventType: eventType,
          data: data
        });
      }
    },
    
    ticket: function () {
      return this._ticket;
    },
    
    addEventListener: function(event, listener){
      this._listeners[event] = this._listeners[event] || [];
      this._listeners[event].push(listener);
    },
    
    removeEventListener: function(event, listener){
      if (!this._listeners[event]){
        return;
      }
      var index = this._listeners[event].indexOf(listener);
      if (index > -1){
        this._listeners[event].splice(index, 1);
      }
    },
    
    trigger: function(event, data){
      if (!this._listeners[event]){
        return;
      }
      this._listeners[event].forEach(function(listener){
        listener(data);
      });
    },
    
    _getTicket: function (callback) {
      try {
        if (this._ticket) {
          // We have a ticket, so we need to validate it before using it
          mApi().websocket.cacheClear().ticket.check.read(this._ticket).callback($.proxy(function (err, response) {
            if (err) {
              // Ticket did not pass validation, so we need to create a new one
              this._createTicket($.proxy(function (ticket) {
                this._ticket = ticket;
                callback(ticket);
              }, this));
            } else {
              // Ticket passed validation, so we use it
              callback(this._ticket);
            }
          }, this));
        } else {
          // Create new ticket
          this._createTicket($.proxy(function (ticket) {
            this._ticket = ticket;
            callback(ticket);
          }, this));
        }
      } catch (e) {
        $('.notification-queue').notificationQueue('notification', 'error', "Ticket creation failed on an internal error");
      }
    },
    
    _createTicket: function (callback) {
      mApi().websocket.ticket.read()
        .callback($.proxy(function (err, ticket) {
          if (!err) {
            callback(ticket.ticket);
          } else {
            $('.notification-queue').notificationQueue('notification', 'error', "Could not create WebSocket ticket");
          }
        }, this));
    },
    
    _openWebSocket: function () {
      var host = window.location.host;
      var secure = location.protocol == 'https:';
      this._webSocket = this._createWebSocket((secure ? 'wss://' : 'ws://') + host + '/ws/socket/' + this._ticket);
      
      if (this._webSocket) {
        this._webSocket.onmessage = $.proxy(this._onWebSocketMessage, this);
        this._webSocket.onclose = $.proxy(this._onWebSocketClose, this);
        switch (this._webSocket.readyState) {
          case this._webSocket.CONNECTING:
            this._webSocket.onopen = $.proxy(this._onWebSocketOpen, this);
          break;
          case this._webSocket.OPEN:
            this.trigger("webSocketConnected"); 
          break;
          default:
            $('.notification-queue').notificationQueue('notification', 'error', "WebSocket connection failed");
          break;
        }
      } else {
        $('.notification-queue').notificationQueue('notification', 'error', "Could not open WebSocket connection");
      }
    },
    
    _createWebSocket: function (url) {
      if ((typeof window.WebSocket) !== 'undefined') {
        return new WebSocket(url);
      }
      else if ((typeof window.MozWebSocket) !== 'undefined') {
        return new MozWebSocket(url);
      }
      return null;
    },
    
    _startPinging: function () {
      this._pingHandle = setInterval($.proxy(function() {
        if (this._socketOpen === false) {
          return;
        }
        if (!this._pinging) {
          this.sendMessage("ping:ping", {});
          this._pinging = true;
        }
        else {
          this._pinging = false;
          clearInterval(this._pingHandle);
          this._pingHandle = null;
          this._reconnect();
        }
      }, this), this.options.pingTimeStep);
    },
    
    _reconnect: function () {
      var wasOpen = this._socketOpen; 
      this._socketOpen = false;
      clearTimeout(this._reconnectTimeout);
      
      this._reconnectTimeout = setTimeout($.proxy(function () {
        try {
          if (this._webSocket) {
            this._webSocket.onmessage = function () {};
            this._webSocket.onclose = function () {};
            if (wasOpen) {
              this._webSocket.close();
            }
          }
        } catch (e) {
          // Ignore exceptions related to discarding a WebSocket 
        }
        
        this._getTicket($.proxy(function (ticket) {
          if (this._ticket) {
            this._openWebSocket();
          }
          else {
            $('.notification-queue').notificationQueue('notification', 'error', "Could not open WebSocket because ticket was missing");
          }
        }, this));
        
      }, this), this.options.reconnectInterval);
    },

    _onWebSocketOpen: function (event, data) {
      this.trigger("webSocketConnected"); 
    },
    
    _onWebSocketClose: function () {
      this.trigger("webSocketDisconnected"); 
      this._reconnect();
    },
    
    _onWebSocketConnected: function () {
      this._socketOpen = true;
      this._startPinging();
      while (this._socketOpen && this._messagesPending.length) {
        var message = this._messagesPending.shift();
        this.sendMessage(message.eventType, message.data);
      }
    },
    
    _onWebSocketDisconnected: function () {
      this._socketOpen = false;
      clearInterval(this._pingHandle);
      this._pingHandle = null;
    },
   
    _onWebSocketMessage: function (event) {
      var message = JSON.parse(event.data);
      var eventType = message.eventType;
      if (eventType == "ping:pong") {
        this._pinging = false;
        this._pingTime = 0;
      } else {
        this.trigger(eventType, message.data);
      }
    },
    
    _onBeforeWindowUnload: function () {
      if (this._webSocket) {
        this._webSocket.onmessage = function () {};
        this._webSocket.onclose = function () {};
        if (this._socketOpen) {
          this._webSocket.close();
        }
      }
    }
  });

  $(document).muikkuWebSocket();
