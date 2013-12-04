(function() {
  
  NewWallEntryWidgetController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      widgetElement = $(widgetElement);
      this._widgetElement = widgetElement;
      this._wallId = widgetElement.find("input[name='wallId']").val();
      this._userId = widgetElement.find("input[name='userId']").val();
      
      widgetElement.find("input[name='newWallEntryButton']").click($.proxy(this._onNewWallEntryButtonClick, this));
//      widgetElement.find("input[name='newGuidanceRequestButton']").click($.proxy(this._onNewGuidanceRequestButtonClick, this));
      
      this._tabsContainer = widgetElement.find('.newWallEntryTabs');
//      this._tabControl = new S2.UI.Tabs(this._tabsContainer);
    },
    deinitialize: function () {
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
        $(document).trigger('wall_newWallEntry', {
          wallId: _this._wallId,
          newEntryData: data
        });
      });
    }
  });
  
  addWidgetController('newWallEntry', NewWallEntryWidgetController);
}).call(this);
