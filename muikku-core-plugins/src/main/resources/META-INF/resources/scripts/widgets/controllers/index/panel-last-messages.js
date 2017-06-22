module([
], function(){
  $.widget("custom.panelMessagesControllerWidget", {
    options: {
      onResolved: null,
      onError: null
    },
    _create: function(){
      var self = this;
      $(document).muikkuWebSocket("addEventListener", "Communicator:newmessagereceived", function (data) {
        self._refreshMessagesWidgetMessagesList();
      });
      self._refreshMessagesWidgetMessagesList();
    },
    _refreshMessagesWidgetMessagesList: function() {
      var self = this;
      mApi().communicator.items.read({
        'firstResult': 0,
        'maxResults': 6
      }).callback(function (err, messages) {
        if( err ){
          $('.notification-queue').notificationQueue('notification', 'error', err.message);
          self.options.onError && self.options.onError(self, err);
        } else {
          self.options.onResolved && self.options.onResolved(self, messages);
          renderDustTemplate('index/panel-last-messages.dust', {messages: messages}, function(text) {
            self.element.html(text);
          });
        }
      });
    }
  });
});