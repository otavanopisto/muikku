module([
], function(){
  $.widget("custom.panelMessagesControllerWidget", {
    _create(){
      var self = this;
      renderDustTemplate('index/panel-last-messages.dust', null, function(text) {
        self.element.html(text);
      });
    }
  });
});