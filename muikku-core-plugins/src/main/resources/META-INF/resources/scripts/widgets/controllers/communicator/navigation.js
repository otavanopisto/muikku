module([
], function(){
  $.widget("custom.communicatorNavigationControllerWidget", {
    options: {
      onResolved: null,
      onError: null,
      defaultItems: [
        {
          link: "#inbox",
          icon: "folder",
          text: getLocaleText("plugin.communicator.category.title.inbox", [])
        },
        {
          link: "#unread",
          icon: "unread",
          text: getLocaleText("plugin.communicator.category.title.unread", [])
        },
        {
          link: "#sent",
          icon: "sent",
          text: getLocaleText("plugin.communicator.category.title.sent", [])
        },
        {
          link: "#trash",
          icon: "trash",
          text: getLocaleText("plugin.communicator.category.title.trash", [])
        }
      ]
    },
    _create: function(){
      this.items = this.options.defaultItems;
      this._render();
    },
    _getTagsFromSever: function(){
      
    },
    _render(){
      var self = this;
      renderDustTemplate('communicator/navigation.dust', {items: self.items}, function(text) {
        self.element.html(text);
      });
    }
  });
});