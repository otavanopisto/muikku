module([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/communicator/toolbar/labels-dropdown.js.jsf",
], function(){
  $.widget("custom.communicatorToolbarControllerWidget", {
    options: {
      onDeleteClick: null,
      onToggleMarkAsReadClick: null,
      onLabelsUpdated: null,
      onLabelAdded: null,
      onLabelRemoved: null
    },
    _create: function(){
      this.folder = "";
      this.inMessage = false;
      this.active = false;
      this.dropdown = null;
      this.currentMessageHasUnreadMessages = false;
      this._render();
    },
    _render: function(){
      var self = this;
      renderDustTemplate('communicator/toolbar.dust', {
        inMessage: this.inMessage,
        folder: this.folder,
        active: this.active,
        currentMessageHasUnreadMessages: this.currentMessageHasUnreadMessages
      }, function(text) {
        self.element.html(text);
        self._setupEvents();
      });
    },
    _setupEvents: function(){
      var self = this;
      self.element.find(".communicator-toolbar-interact-delete").click(function(){
        if (self.active){
          self.options.onDeleteClick();
        }
      });
      self.element.find(".communicator-toolbar-interact-toggle-read").click(function(){
        if (self.active){
          self.options.onToggleMarkAsReadClick();
        }
      });
      self.dropdown = self.element.getWidgetContainerFor("communicator-toolbar-labels-dropdown");
      self.dropdown.communicatorToolbarLabelsDropdownControllerWidget({
        onLabelsUpdated: this.options.onLabelsUpdated,
        onLabelAdded: this.options.onLabelAdded,
        onLabelRemoved: this.options.onLabelRemoved
      });
      self.element.find(".communicator-toolbar-interact-label").click(function(e){
        if (self.active){
          self.dropdown.communicatorToolbarLabelsDropdownControllerWidget("open", e.currentTarget);
        }
      });
    },
    updateFolder: function(folder){
      this.folder = folder || "";
      this.active = false;
      this.currentMessageHasUnreadMessages = false;
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
    },
    setCurrentMessageHasUnreadMessages: function(status){
      this.currentMessageHasUnreadMessages = status;
      this._render();
    },
    setCurrentActiveLabels: function(activeLabels){
      this.dropdown.communicatorToolbarLabelsDropdownControllerWidget("setCurrentActiveLabels", activeLabels);
    }
  });
});