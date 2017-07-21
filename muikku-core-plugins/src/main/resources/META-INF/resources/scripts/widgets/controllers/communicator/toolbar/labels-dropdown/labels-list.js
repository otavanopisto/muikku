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
      onSelectedLabelsChanged: null
    },
    update: function(){
      this._populateLabels();
    },
    _create: function(){
      this.labels = [];
      this._populateLabels();
    },
    _render: function(){
      var self = this;
      renderDustTemplate('communicator/toolbar/labels-dropdown/labels-list.dust', {
        labels: self.labels
      }, function(text) {
        self.element.html(text);
        self._setupEvents();
      });
    },
    _populateLabels: function(){
      var self = this;
      mApi().communicator.userLabels.read().callback(function (err, results) {
        if (err){
          return;
        }
        
        self.labels = results.map(function(label){
          return {
            icon: "tag",
            text: label.name,
            color: colorIntToHex(label.color),
            isActive: false
          }
        });
        
        self._render();
      });
    },
    _setupEvents: function(){
      
    }
  });
});