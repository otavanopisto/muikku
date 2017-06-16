module([
], function(){
  $.widget("custom.panelImportantControllerWidget", {
    _create(){
      var self = this;
      renderDustTemplate('index/panel-important.dust', null, function(text) {
        self.element.html(text);
      });
    }
  });
});