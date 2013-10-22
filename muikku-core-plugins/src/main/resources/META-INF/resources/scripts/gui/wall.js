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
//      this._wallEntriesContainer.on("click", ".wallEntryReplyLink", $.proxy(this._onEntryElementClick, this));
//      this._wallEntriesContainer.on("submit", ".wallEntryCommentFormForm", $.proxy(this._onPostCommentClick, this));
      
      
      widgetElement.find("input[name='newWallEntryButton']").click($.proxy(this._onNewWallEntryButtonClick, this));
      widgetElement.find("input[name='newGuidanceRequestButton']").click($.proxy(this._onNewGuidanceRequestButtonClick, this));

      this._listUserFeedItems();
      
      this._tabsContainer = widgetElement.find('.newWallEntryTabs');
//      this._tabControl = new S2.UI.Tabs(this._tabsContainer);
    },
    deinitialize: function () {
    },
    _listUserFeedItems: function () {
      var _this = this;

      RESTful.doGet(CONTEXTPATH + "/rest/wall/{wallId}/listWallEntries", {
        parameters: {
          'wallId': this._wallId
        }
      }).success(function (data, textStatus, jqXHR) {
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
    _onNewWallEntryButtonClick: function () {
      var _this = this;
      var wallId = this._wallId;
      var text = this._widgetElement.find("input[name='newWallEntryText']").val();
      var visibility = "PUBLIC";
      
      RESTful.doPost(CONTEXTPATH + '/rest/wall/{wallId}/addTextEntry', {
        parameters: {
          'wallId': wallId,
          'text': text,
          'visibility': visibility
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('wall/wallentry.dust', data, function (text) {
          _this._wallEntriesContainer.append($.parseHTML(text));
        });
      });
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
