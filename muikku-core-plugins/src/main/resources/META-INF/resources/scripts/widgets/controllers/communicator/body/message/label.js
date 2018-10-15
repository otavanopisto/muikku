module([], function(){
  $.widget("custom.communicatorBodyMessageLabelControllerWidget", {
    options: {
      label: null
    },
    _create: function(){
      this._render();
    },
    _render: function(){
      var self = this;
      renderDustTemplate('communicator/body/message/label.dust', this.options.label, function(text) {
        self.element.html(text);
      });
    },
    removeLabelIfMatches(label){
      if (this.options.label.labelId === label.labelId){
        this.element.remove();
      }
    }
  });
});