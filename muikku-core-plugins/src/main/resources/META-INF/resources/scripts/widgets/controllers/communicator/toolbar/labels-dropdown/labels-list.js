module([
], function(){
  
  function colorIntToHex(color) {
    var b = (color & 255).toString(16);
    var g = ((color >> 8) & 255).toString(16);
    var r = ((color >> 16) & 255).toString(16);

    var rStr = r.length == 1 ? "0" + r : r;
    var gStr = g.length == 1 ? "0" + g : g;
    var bStr = b.length == 1 ? "0" + b : b;
    
    return "#" + rStr + gStr + bStr;
  }
  
  $.widget("custom.communicatorToolbarLabelsDropdownLabelsListControllerWidget", {
    options: {
      onLabelAdded: null,
      onLabelRemoved: null
    },
    update: function(){
      var self = this;
      this._populateLabels(function(){
        self.setCurrentActiveLabels(self.activeLabels);
      });
    },
    _create: function(){
      this.labels = [];
      this._populateLabels();
      this.activeLabels = [];
    },
    _render: function(callback){
      var self = this;
      renderDustTemplate('communicator/toolbar/labels-dropdown/labels-list.dust', {
        labels: self.labels
      }, function(text) {
        self.element.html(text);
        self._setupEvents();
        callback && callback();
      });
    },
    _populateLabels: function(callback){
      var self = this;
      mApi().communicator.userLabels.read().callback(function (err, results) {
        if (err){
          return;
        }
        
        self.labels = results;
        
        self._render(callback);
      });
    },
    _setupEvents: function(){
      var self = this;
      this.element.find(".link").click(function(e){
        e.stopPropagation();
        self._toggleLabel(e.currentTarget);
      });
    },
    _toggleLabel: function(element){
      var newState = $(element).toggleClass("active").hasClass("active");
      var toggledLabel = this.labels[element.dataset.index];
      if (!newState){
        this.options.onLabelRemoved(toggledLabel);
      } else {
        this.options.onLabelAdded(toggledLabel);
      }
    },
    setCurrentActiveLabels: function(activeLabels){
      var self = this;
      self.activeLabels = activeLabels;
      self.element.find('.communicator-link-label').removeClass("active");
      activeLabels.forEach(function(label){
        let id = label.labelId;
        self.element.find('.communicator-link-label[data-id="' + id + '"]').addClass("active");
      });
    }
  });
});