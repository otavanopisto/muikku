(function() {
  
  CalendarSettingsWidgetController = $.klass(WidgetController, {
    init: function () {
      this._super(arguments);
    },
    setup: function (widgetElement) {
      this._widgetElement = $(widgetElement);
      
      // TODO: Localize
      this._exampleSubscribeUrl = 'webcal://www.example.com/mycal.ics';
      
      this._calendarSettingsButton = this._widgetElement.find(".calendarSettingsButton");
      this._calendarSettingsButton.click($.proxy(this._onCalendarSettingsButtonClick, this));
    },
    _onCalendarSettingsButtonClick: function (event) {
      var _this = this;
      
      RESTful.doGet(CONTEXTPATH + '/rest/calendar/settings').success(function (data, textStatus, jqXHR) {
        renderDustTemplate('/calendar/calendarsettings.dust', data, function (text) {
          var dialog = $(text)
            .attr('title', "Calendar Settings")
            .dialog({
              modal: true,
              width: 500,
              buttons: {
                "Save": function() {
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
                },
                "Cancel": function() {
                  $(this).dialog("close"); 
                }
              }
            }
          );
          
          var subscribeButton = dialog.find(".calendarSettingsShowSubscribeCalendarButton");
          subscribeButton.click(function (event) {
            var container = dialog.find(".calendarSettingsSubscribeCalendarOptionsContainer");
            if (container.is(":visible")) {
              container.hide("blind", { direction: "vertical" }, 300);
            } else {
              container.show("blind", { direction: "vertical" }, 300);
            };
          });
          
          var subscribeUrlInput = dialog.find(".calendarSettingsSubscribeUrl");
          subscribeUrlInput.val(_this._exampleSubscribeUrl);
          
          subscribeUrlInput.focus(function (event) {
            if ($(this).val() == _this._exampleSubscribeUrl) {
              $(this).val('');
              $(this).removeClass('calendarSettingsSubscribeUrlEmpty');
            }
          });
          
          subscribeUrlInput.blur(function (event) {
            if ($(this).val() == '') {
              $(this).val(_this._exampleSubscribeUrl);
              $(this).addClass('calendarSettingsSubscribeUrlEmpty');
            }
          });
          
          dialog.find(".calendarSettingsSubscribeCalendarButton").click(function (event) {
            var beforeEvent = $.Event("calendarSettingsWidget:beforeCalendarSubscribe");
            $(document).trigger(beforeEvent);    
            if (!beforeEvent.isDefaultPrevented()) {
              var url = subscribeUrlInput.val();
              if (url && (url != _this._exampleSubscribeUrl)) {
                RESTful.doPost(CONTEXTPATH + '/rest/calendar/subscribedCalendars', {
                  parameters: {
                    url: url
                  }
                })
                .success(function (data, textStatus, jqXHR) {
                  $(dialog).dialog("close");
                  
                  $(document).trigger($.Event("calendarSettingsWidget:afterCalendarSubscribe", {
                    subscribedCalendar: data
                  }));    
                });
              }  
            }
          });
        });      
      });
    }
  });
  
  addWidgetController('calendarSettingsWidget', CalendarSettingsWidgetController);
  
}).call(this);