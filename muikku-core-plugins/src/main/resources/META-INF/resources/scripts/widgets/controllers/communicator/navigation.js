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
  
  var initialLoadHasBeenCalled = false;
  
  $.widget("custom.communicatorNavigationControllerWidget", {
    options: {
      onLocationChange: null,
      defaultItems: [
        {
          location: "inbox",
          type: "folder",
          id: "inbox",
          icon: "new-section",
          text: getLocaleText("plugin.communicator.category.title.inbox", [])
        },
        {
          location: "unread",
          type: "folder",
          id: "unread",
          icon: "new-section",
          text: getLocaleText("plugin.communicator.category.title.unread", [])
        },
        {
          location: "sent",
          type: "folder",
          id: "sent",
          icon: "new-section",
          text: getLocaleText("plugin.communicator.category.title.sent", [])
        },
        {
          location: "trash",
          type: "folder",
          id: "trash",
          icon: "new-section",
          text: getLocaleText("plugin.communicator.category.title.trash", [])
        }
      ]
    },
    getCurrentLocation: function(){
      return this.currentLocation;
    },
    _setCurrentLocation: function(location){
      this.currentLocation = location;
      this.options.onLocationChange(location);
    },
    
    _create: function(){
      this.items = this.options.defaultItems;
      if (!window.location.hash){
        window.location.hash = this.items[0].location
        this._setCurrentLocation(this.items[0]);
        initialLoadHasBeenCalled = true;
      } else if (!initialLoadHasBeenCalled) {
        var hash = window.location.hash.replace("#","");
        var item = this.items.find(function(item){
          return item.location === hash;
        });
        if (item){
          this._setCurrentLocation(item);
          initialLoadHasBeenCalled = true;
        }
      }
      
      this._render();
      this._getLabelsFromServer();
      
      var self = this;
      $(window).off("hashchange").bind("hashchange", function(){
        var hash = window.location.hash.replace("#","");
        self._setCurrentLocation(self.items.find(function(item){
          return item.location === hash;
        }));
        self._render();
      });
    },
    _getLabelsFromServer: function(){
      var self = this;
      mApi().communicator.userLabels.read().callback(function (err, results) {
        if (err){
          //TODO make a message
          return;
        }
        self.items = self.options.defaultItems.concat(results.map(function(label){
          return {
            location: ("label-" + label.id),
            type: "label",
            id: label.id,
            icon: "tag",
            text: label.name,
            color: colorIntToHex(label.color)
          }
        }));
        if (!initialLoadHasBeenCalled){
          var hash = window.location.hash.replace("#","");
          var item = self.items.find(function(item){
            return item.location === hash;
          });
          self._setCurrentLocation(item);
        }
        initialLoadHasBeenCalled = true;
        self._render();
      });
    },
    _render(){
      var hash = window.location.hash.replace("#","");
      var self = this;
      renderDustTemplate('communicator/navigation.dust', {items: self.items, currentLocation: hash}, function(text) {
        self.element.html(text);
      });
    },
    reloadLabels(){
      this._getLabelsFromServer();
    }
  });
});