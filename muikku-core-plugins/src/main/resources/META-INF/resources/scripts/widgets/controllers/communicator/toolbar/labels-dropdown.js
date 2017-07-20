module([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/dropdown.js.jsf"
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
  
  $.widget("custom.communicatorLabelsDropdownControllerWidget", {
    options: {
      onLabelsUpdated: null
    },
    _create: function(){
      this.dropdown = null;
      this.labels = [];
      
      this._render();
      this._populateLabels();
    },
    _render: function(){
      var self = this;
      renderDustTemplate('communicator/toolbar/labels-dropdown.dust', {
        labels: self.labels
      }, function(text) {
        self.element.html(text);
        self._setupEvents();
      });
    },
    _createLabel: function(){
      var self = this;
      var color = Math.round(Math.random() * 16777215);
      var label = {
        name: self.dropdown.find("input").val().trim(),
        color: color
      };
      
      mApi().communicator.userLabels.create(label).callback(function (err, label) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          self.options.onLabelsUpdated();
          self._populateLabels();
        }
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
      this.element.find(".communicator-toolbar-labels-dropdown-interact-create-label").click(this._createLabel.bind(this));
      this.dropdown = this.element.find(".dropdown").dropdownWidget();
    },
    open(target){
      if (this.dropdown){
        this.dropdown.dropdownWidget("open", target);
      }
    }
  });
});