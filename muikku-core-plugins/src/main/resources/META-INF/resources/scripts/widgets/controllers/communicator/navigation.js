module([
], function(){
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