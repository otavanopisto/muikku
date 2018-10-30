module([
], function(){
  $.widget("custom.panelWorkspacesControllerWidget", {
    options: {
      onResolved: null,
      onError: null
    },
    _create(){
      var self = this;
      mApi().workspace.workspaces
      .read({ userId: MUIKKU_LOGGED_USER_ID })
      .callback(function (err, workspaces) {
        if( err ){
          $('.notification-queue').notificationQueue('notification', 'error', err.message);
          self.options.onError && self.options.onError(self, err);
        } else {
          self.options.onResolved && self.options.onResolved(self, workspaces);
          renderDustTemplate('index/panel-workspaces.dust', {workspaces: workspaces}, function(text) {
            self.element.html(text);
          });
        }
      });
    }
  });
});