module([
], function(){
  $.widget("custom.panelWorkspacesControllerWidget", {
    _create(){
      var self = this;
      mApi().workspace.workspaces
      .read({ userId: MUIKKU_LOGGED_USER_ID })
      .callback(function (err, workspaces) {
        if( err ){
          $('.notification-queue').notificationQueue('notification', 'error', err.message);
        } else {
          renderDustTemplate('index/panel-workspaces.dust', {workspaces: workspaces}, function(text) {
            self.element.html(text);
          });
        }
      });
    }
  });
});