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
  
  $.widget("custom.communicatorNavigationControllerWidget", {
    options: {
      onLocationChange: null,
      defaultItems: [
        {
          location: "inbox",
          icon: "new-section",
          text: getLocaleText("plugin.communicator.category.title.inbox", [])
        },
        {
          location: "unread",
          icon: "new-section",
          text: getLocaleText("plugin.communicator.category.title.unread", [])
        },
        {
          location: "sent",
          icon: "new-section",
          text: getLocaleText("plugin.communicator.category.title.sent", [])
        },
        {
          location: "trash",
          icon: "new-section",
          text: getLocaleText("plugin.communicator.category.title.trash", [])
        }
      ]
    },
    _create: function(){
      this.items = this.options.defaultItems;
      if (!window.location.hash){
        window.location.hash = this.items[0].location
        this.options.onLocationChange(this.items[0]);
      } else {
        var hash = window.location.hash.replace("#","");
        this.options.onLocationChange(this.items.find(function(item){
          return item.location === hash;
        }));
      }
      
      this._render();
      this._getTagsFromSever();
      
      var self = this;
      $(window).bind("hashchange", function(){
        var hash = window.location.hash.replace("#","");
        self.options.onLocationChange(self.items.find(function(item){
          return item.location === hash;
        }));
        self._render();
      });
    },
    _getTagsFromSever: function(){
      var self = this;
      mApi().communicator.userLabels.read().callback(function (err, results) {
        if (err){
          return;
        }
        self.items = self.items.concat(results.map(function(label){
          return {
            location: ("label-" + label.id),
            icon: "tag",
            text: label.name,
            color: colorIntToHex(label.color)
          }
        }));
        self._render();
      });
    },
    _render(){
      var hash = window.location.hash.replace("#","");
      var self = this;
      renderDustTemplate('communicator/navigation.dust', {items: self.items, currentLocation: hash}, function(text) {
        self.element.html(text);
      });
    }
  });
});