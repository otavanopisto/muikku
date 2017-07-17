module([
], function(){
  $.widget("custom.communicatorToolbarControllerWidget", {
    options: {
      onDeleteClick: null,
      onToggleMarkAsReadClick: null
    },
    _create: function(){
      this.folder = "";
      this.inMessage = false;
      this.active = false;
      this._render();
    },
    _render: function(){
      var self = this;
      renderDustTemplate('communicator/toolbar.dust', {inMessage: this.inMessage, folder: this.folder, active: this.active}, function(text) {
        self.element.html(text);
        self._setupEvents();
      });
    },
    _setupEvents: function(){
      var self = this;
      self.element.find(".communicator-toolbar-interact-delete").click(function(){
        self.options.onDeleteClick();
      });
      self.element.find(".communicator-toolbar-interact-toggle-read").click(function(){
        self.options.onToggleMarkAsReadClick();
      });
    },
    updateFolder: function(folder){
      this.folder = folder || "";
      this.active = false;
      this._render();
    },
    updateInMessage: function(status){
      this.inMessage = status;
      this._render();
    },
    activate: function(){
      this.active = true;
      this._render();
    },
    deactivate: function(){
      this.active = false;
      this._render();
    }
  });
});