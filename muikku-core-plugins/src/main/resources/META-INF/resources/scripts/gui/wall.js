(function() {
  
  WallWidgetController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      widgetElement = $(widgetElement);
      this._widgetElement = widgetElement;
      this._wallId = widgetElement.find("input[name='wallId']").val();
      this._userId = widgetElement.find("input[name='userId']").val();
      this._wallEntriesContainer = widgetElement.find(".wallEntries");
      
      this._listWallEntries();
      
      $(document).on('wall_newWallEntry', $.proxy(this._onNewWallEntryNotification, this));
    },
    deinitialize: function () {
    },
    _listWallEntries: function () {
      var _this = this;

      RESTful.doGet(CONTEXTPATH + "/rest/wall/{wallId}/listWallEntries", {
        parameters: {
          'wallId': this._wallId
        }
      }).success(function (data, textStatus, jqXHR) {
        _this._wallEntriesContainer.children().remove();
        
        for (var i = 0, len = data.length; i < len; i++) {
          var dataNode = data[i];
          var renderer = _this._getWallItemRenderer(dataNode.wallFeedItemName);
          var element = renderer.render(dataNode);
          _this._wallEntriesContainer.append(element);
        }
      });
    },
    _getWallItemRenderer: function (wallItemName) {
      var controllerClass = window._wallEntryControllers[wallItemName];

      return new controllerClass();
    },
    _onNewWallEntryNotification: function (e, eventInfo) {
      var _this = this;
      if (eventInfo.wallId == _this._wallId) {
        renderDustTemplate('wall/wallentry.dust', eventInfo.newEntryData, function (text) {
          _this._wallEntriesContainer.append($.parseHTML(text));
        });
      }
    }
  });
  
  addWidgetController('wallWidget', WallWidgetController);
}).call(this);

WallEntryController = $.klass({
  render: function (data) {
  }
});

function addWallEntryController(wallEntryName, controllerClass) {
  if (!window._wallEntryControllers)
    window._wallEntryControllers = {};
  window._wallEntryControllers[wallEntryName] = controllerClass;
}
