(function() {

  MuikkuWebSocketImpl = $.klass({
    init: function () {
      var _this = this;
      this._retryTimeout = undefined;
      this._retryTimeoutInterval = 5000;

      $(window).on('beforeunload', function() {
        if (_this._webSocket) {
          _this._webSocket.onclose = function () {};
          _this._webSocket.close();
        }
      });

      this._connect();
    },
    _openWebSocket: function (url) {
      if ((typeof window.WebSocket) !== 'undefined') {
        return new WebSocket(url);
      } else if ((typeof window.MozWebSocket) !== 'undefined') {
        return new MozWebSocket(url);
      }
      
      return null;
    },
    _connect: function () {
      var _this = this;
      
      clearTimeout(this._retryTimeout);
      this._retryTimeout = undefined;

      if (this._ticket) {
        // Validate existing ticket and if it fails, reset it
        mApi().websocket.ticket.check.read(this._ticket).callback(function (err, response) {
          if (err) {
            _this._ticket = undefined;
          }
        });
      }
      
      if (!this._ticket) {
        // Fetch new ticket if none exists
        mApi().websocket.ticket.read().callback(function (err, ticket) {
          if (!err)
            _this._ticket = ticket.ticket;
          else 
            _this._ticket = undefined;
        });
      }

      if (this._ticket) {
        var host = window.location.host;
        var secure = location.protocol == 'https:';
        this._webSocket = this._openWebSocket((secure ? 'wss://' : 'ws://')  + host + '/ws/socket/' + this._ticket);
        this._webSocket.onopen = this._onWebSocketOpen;
        this._webSocket.onmessage = this._onWebSocketMessage;
        this._webSocket.onclose = this._onWebSocketClose;
        this._webSocket.onerror = this._onWebSocketError;
      } else {
        this._tryReconnect();
      }
    },
    _onWebSocketOpen: function (event) {
      $(document).trigger("mSocket:connected");
    },
    _onWebSocketClose: function (event) {
      $(document).trigger("mSocket:disconnected");

      mSocket()._tryReconnect();
    },
    _onWebSocketError: function () {
      if (this._webSocket) {
        if (this._webSocket.readyState == 3) {
          mSocket()._tryReconnect();
        }
      }
    },
    _onWebSocketMessage: function (event) {
      var message = JSON.parse(event.data);
      var eventType = message.eventType;
      
      $(document).trigger(eventType, message.data);
    },
    _tryReconnect: function () {
      var _this = this;

      clearTimeout(this._retryTimeout);
      
      this._retryTimeout = setTimeout(function () {
        _this._connect();
      }, this._retryTimeoutInterval);
    },
    sendMessage: function (eventType, data) {
      var message = {
        eventType: eventType,
        data: data
      };
      
      if (this._webSocket.readyState == 1) {
        this._webSocket.send(JSON.stringify(message));
        return true;
      }
      
      return false;
    },
    getTicket: function () {
      return this._ticket;
    }
  });
      
  function getWebSocket() {
    if (!window.mWebSocket) {
      window.mWebSocket = new MuikkuWebSocketImpl();
    }
    
    return window.mWebSocket;
  };
  
  window.mSocket = getWebSocket;
  
  mSocket();
})(window);      
      