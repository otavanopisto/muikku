(function() {
  
  CourseListController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      widgetElement = $(widgetElement);
      this._widgetElement = widgetElement;
      this._settingsElement = this._widgetElement.find(".courselist-settings");

      var courseListSettingsBtn = widgetElement.find(".wi-settings-edit-link");
      courseListSettingsBtn.click($.proxy(this._onEditCourseListSettingsClick, this));

      this._settingsElement.dialog({ 
        autoOpen: false
      });
    },
    deinitialize: function () {
    },
    _onEditCourseListSettingsClick: function (event) {
      this._settingsElement.dialog("open");
    }
  });
  
  addWidgetController('courselist', CourseListController);

}).call(this);