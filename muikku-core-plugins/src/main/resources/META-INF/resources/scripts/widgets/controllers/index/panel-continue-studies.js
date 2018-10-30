module([
], function(){
  $.widget("custom.panelContinueStudiesControllerWidget", {
    options: {
      onResolved: null,
      onError: null
    },
    _create(){
      var self = this;
      mApi().user.property.read('last-workspace').callback(function(err, property) {
        
        if(err){
          $('.notification-queue').notificationQueue('notification', 'error', err.message);
          self.options.onError && self.options.onError(self, err);
        } else {
          var lastWorkspace = JSON.parse(property.value);
          self.options.onResolved && self.options.onResolved(self, lastWorkspace);
          if (lastWorkspace){
            renderDustTemplate('index/panel-continue-studies.dust', {
              lastWorkspace : lastWorkspace
            }, function(text) {
              self.element.html(text);
            });
          }
        }
        
      });
    }
  });
});