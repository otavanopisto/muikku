(function() {

  MuikkuWebSocketImpl = $.klass({
    init: function () {
      var _this = this;
      mApi().websocket.ticket.read().callback(function (err, ticket) {
        _this._ticket = ticket.ticket;
      });

      this._webSocket = this._openWebSocket('wss://dev.muikku.fi:8443/ws/socket/' + _this._ticket);
      this._webSocket.onmessage = this._onWebSocketMessage;
      
      $(window).on('unload', function() {
        if (_this._webSocket) {
          _this._webSocket.onclose = function () {};
          _this._webSocket.close();
        }
      });
    },
    _openWebSocket: function (url) {
      if ((typeof window.WebSocket) !== 'undefined') {
        return new WebSocket(url);
      } else if ((typeof window.MozWebSocket) !== 'undefined') {
        return new MozWebSocket(url);
      }
      
      return null;
    },
    _onWebSocketMessage: function (event) {
      var message = JSON.parse(event.data);
      var eventType = message.eventType;
      
      $(document).trigger(eventType, message.data);
    },
    sendMessage: function (eventType, data) {
      var message = {
        eventType: eventType,
        data: data
      };
      
      this._webSocket.send(JSON.stringify(message));
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
      