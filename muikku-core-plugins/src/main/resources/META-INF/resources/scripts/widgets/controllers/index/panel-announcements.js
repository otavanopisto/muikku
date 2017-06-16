module([
], function(){
  $.widget("custom.panelAnnouncementsControllerWidget", {
    _create(){
      var self = this;
      renderDustTemplate('index/panel-announcements.dust', null, function(text) {
        self.element.html(text);
      });
    }
  });
});