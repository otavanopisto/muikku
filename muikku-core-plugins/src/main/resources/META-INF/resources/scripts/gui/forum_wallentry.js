(function() {
  
  WallForumMessageEntryController = $.klass(WallEntryController, {
    render: function (data) {
      // TODO: sync issues with renderDustTemplate
      dust.preload('wall/forummessagewallentry.dust');
      
      var rtn = undefined;
      
      renderDustTemplate('wall/forummessagewallentry.dust', data, function (text) {
        rtn = $.parseHTML(text);
      });
      
      return rtn;
    }
  });
  
  addWallEntryController('UserFeedForumMessageItem', WallForumMessageEntryController);
  
}).call(this);