module([
], function(){
  $.widget("custom.panelAnnouncementsControllerWidget", {
    options: {
      onResolved: null,
      onError: null
    },
    _create(){
      var self = this;
      
      mApi()
      .announcer
      .announcements
      .read({ hideWorkspaceAnnouncements: "false" })
      .callback(function(err, announcements) {
        if( err ){
          $('.notification-queue').notificationQueue('notification', 'error', err.message);
          self.options.onError && self.options.onError(self, err);
        } else {
          self.options.onResolved && self.options.onResolved(self, messages);
          renderDustTemplate('index/panel-announcements.dust', {announcements: announcements}, function(text) {
            self.element.html(text);
          });
        }
      });
    }
  });
});