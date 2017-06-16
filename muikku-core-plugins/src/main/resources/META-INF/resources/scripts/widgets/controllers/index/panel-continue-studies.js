module([
], function(){
  $.widget("custom.panelContinueStudiesControllerWidget", {
    _create(){
      var self = this;
      renderDustTemplate('index/panel-continue-studies.dust', null, function(text) {
        self.element.html(text);
      });
    }
  });
});