(function() {
  
  UserNotificationSettingsWidgetController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      widgetElement = $(widgetElement);

      widgetElement.on("click", ".userNotifierSettingsCheckbox", $.proxy(this._onToggleNotification, this));
    },
    deinitialize: function () {
    },
    _onToggleNotification: function (event) {
      var _this = this;
      
      var element = $(event.target);
      var cell = element.parents("td");
      
      var methodName = cell.find("input[name='methodName']").val();
      var actionName = cell.find("input[name='actionName']").val();
  
      var path = element.is(':checked') ? "/rest/notifier/allowNotification" : "/rest/notifier/denyNotification";
      var params = {
        'methodName': methodName,
        'actionName': actionName
      };
      
      RESTful.doPost(CONTEXTPATH + path, {
        parameters: params
      }).success(function (data, textStatus, jqXHR) {
      });
    }
  });
  
  addWidgetController('userNotifierSettingsWidget', UserNotificationSettingsWidgetController);

}).call(this);
