module([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/dropdown.js.jsf"
], function(){
  $.widget("custom.communicatorLabelsDropdownControllerWidget", {
    options: {
      
    },
    _create: function(){
      this.dropdown = null;
      this._render();
    },
    _render: function(){
      var self = this;
      renderDustTemplate('communicator/toolbar/labels-dropdown.dust', {
      }, function(text) {
        self.element.html(text);
        self._setupEvents();
      });
    },
    _setupEvents: function(){
      this.dropdown = this.element.find(".dropdown").dropdownWidget();
    },
    open(target){
      if (this.dropdown){
        this.dropdown.dropdownWidget("open", target);
      }
    }
  });
});