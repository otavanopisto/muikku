module([
], function(){
  $.widget("custom.communicatorToolbarControllerWidget", {
    options: {
    },
    _create: function(){
      this.folder = "";
      this.inMessage = false;
      this._render();
    },
    _render(){
      var self = this;
      renderDustTemplate('communicator/toolbar.dust', {inMessage: this.inMessage, folder: this.folder}, function(text) {
        self.element.html(text);
      });
    },
    updateFolder(folder){
      this.folder = folder || "";
      this._render();
    },
    updateInMessage(status){
      this.inMessage = status;
      this._render();
    }
  });
});