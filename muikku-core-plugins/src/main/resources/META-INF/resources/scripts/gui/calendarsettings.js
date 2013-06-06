(function() {
  
  CalendarSettingsWidgetController = $.klass(WidgetController, {
    init: function () {
      this._super(arguments);
    },
    setup: function (widgetElement) {
      this._widgetElement = $(widgetElement);
      
      this._calendarSettingsButton = this._widgetElement.find(".calendarSettingsButton");
      this._calendarSettingsButton.click($.proxy(this._onCalendarSettingsButtonClick, this));
    },
    _onCalendarSettingsButtonClick: function (event) {
      var _this = this;
      
      RESTful.doGet(CONTEXTPATH + '/rest/calendar/settings').success(function (data, textStatus, jqXHR) {
        renderDustTemplate('/calendar/calendarsettings.dust', data, function (text) {

          var buttons = {};
          buttons[getLocaleText('plugin.calendar.settingsDialog.saveButton')] = function() {
            var _this = this;
            RESTful.doPut(CONTEXTPATH + '/rest/calendar/settings', {
              data: {
                firstDay: $(this).find('select[name="firstDay"]').val()
              }
            })
            .success(function (data, textStatus, jqXHR) {
              $(document).trigger($.Event("calendarSettingsWidget:settingsSaved", {
                settings: data
              })); 
              
              $(_this).dialog("close"); 
            });
          };
          buttons[getLocaleText('plugin.calendar.settingsDialog.cancelButton')] = function() {
            $(this).dialog("close");
          };

          var dialog = $(text)
            .attr('title', getLocaleText("plugin.calendar.settingsDialog.title"))
            .dialog({
              modal: true,
              width: 500,
              buttons: buttons
            }
          );
        });      
      });
    }
  });
  
  addWidgetController('calendarSettingsWidget', CalendarSettingsWidgetController);
  
}).call(this);