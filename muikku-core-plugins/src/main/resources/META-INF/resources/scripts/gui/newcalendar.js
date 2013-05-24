(function() {
  
  NewCalendarWidgetController = $.klass(WidgetController, {
    init: function () {
      this._super(arguments);
    },
    setup: function (widgetElement) {
      this._widgetElement = $(widgetElement);
      
      // TODO: Localize
      this._exampleSubscribeUrl = 'webcal://www.example.com/mycal.ics';
      
      this._widgetElement.find(".newCalendarButton")
        .click($.proxy(this._onNewCalendarButtonClick, this));
    },
    _onNewCalendarButtonClick: function (event) {
      
      // TODO: Localize
      var _this = this;
      renderDustTemplate('/calendar/newcalendar.dust', {}, function (text) {
        var dialog = $(text)
          .attr('title', "New Calendar")
          .dialog({
            modal: true,
            width: 500,
            buttons: {
              "Cancel": function() {
                $(this).dialog("close"); 
              }
            }
          });
        
          var localContainer = dialog.find('.newLocalCalendarContainer');
          var subscribedContainer = dialog.find('.newSubscribedCalendarContainer');
       
          dialog.find('button[name="newLocalCalendarButton"]').click(function (event) {
            if (subscribedContainer.is(":visible")) { 
              subscribedContainer.hide("blind", { direction: "vertical" }, 300);
            }
            
            if (localContainer.is(":visible")) {
              localContainer.hide("blind", { direction: "vertical" }, 300);
            } else {
              localContainer.show("blind", { direction: "vertical" }, 300);
            };
          });
          
          dialog.find('input[name="createNewCalendar"]').click(function (event) {
            var beforeEvent = $.Event("newCalendarWidget:beforeCalendarCreate");
            $(document).trigger(beforeEvent);    
            if (!beforeEvent.isDefaultPrevented()) {
              var name = dialog.find('.newLocalCalendarName').val();
              var color = dialog.find('.newCalendarColor').spectrum("get").toHexString();
              if (name) {
                RESTful.doPost(CONTEXTPATH + '/rest/calendar/calendars', {
                  data: JSON.stringify({
                    color: color,
                    calendarType: "LOCAL",
                    visible: true,
                    name: name
                  })
                })
                .success(function (data, textStatus, jqXHR) {
                  $(dialog).dialog("close");
                  
                  $(document).trigger($.Event("newCalendarWidget:afterCalendarCreate", {
                    subscribedCalendar: data
                  }));    
                });
              }  
            }
          });
          
          dialog.find('button[name="newSubscribedCalendarButton"]').click(function (event) {
            if (localContainer.is(":visible")) { 
              localContainer.hide("blind", { direction: "vertical" }, 300);
            }
            
            if (subscribedContainer.is(":visible")) {
              subscribedContainer.hide("blind", { direction: "vertical" }, 300);
            } else {
              subscribedContainer.show("blind", { direction: "vertical" }, 300);
            };
          });
          
          dialog.find('input[type="color"]').spectrum({
            showButtons: false
          });
          
          var subscribeUrlInput = dialog.find(".newSubscribedCalendarUrl");
          subscribeUrlInput.val(_this._exampleSubscribeUrl);
          
          subscribeUrlInput.focus(function (event) {
            if ($(this).val() == _this._exampleSubscribeUrl) {
              $(this).val('');
              $(this).removeClass('newSubscribedCalendarUrlEmpty');
            }
          });
          
          subscribeUrlInput.blur(function (event) {
            if ($(this).val() == '') {
              $(this).val(_this._exampleSubscribeUrl);
              $(this).addClass('newSubscribedCalendarUrlEmpty');
            }
          });
          
          // TODO: Error handling
          dialog.find('input[name="subscribeNewCalendar"]').click(function (event) {
            var beforeEvent = $.Event("newCalendarWidget:beforeCalendarSubscribe");
            $(document).trigger(beforeEvent);    
            if (!beforeEvent.isDefaultPrevented()) {
              var url = subscribeUrlInput.val();
              var color = dialog.find('.calendarSettingsSubscribeColor').spectrum("get").toHexString();
              
              // TODO: Older browsers without native JSON support
              if (url && (url != _this._exampleSubscribeUrl)) {
                RESTful.doPost(CONTEXTPATH + '/rest/calendar/calendars', {
                  data: JSON.stringify({
                    color: color,
                    calendarType: "SUBSCRIBED",
                    visible: true,
                    url: url
                  })
                })
                .success(function (data, textStatus, jqXHR) {
                  $(dialog).dialog("close");
                  
                  $(document).trigger($.Event("newCalendarWidget:afterCalendarSubscribe", {
                    subscribedCalendar: data
                  }));    
                });
              }  
            }
          });
      });
    }
  });
  
  addWidgetController('newCalendarWidget', NewCalendarWidgetController);
  
}).call(this);