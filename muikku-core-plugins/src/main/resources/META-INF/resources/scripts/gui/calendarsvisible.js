(function() {
  
  CalendarsVisibleWidgetController = $.klass(WidgetController, {
    init: function () {
      this._super(arguments);
      
      this._calendarCheckboxClickListener = $.proxy(this._onCalendarCheckboxClick, this);
    },
    
    setup: function (widgetElement) {
      this._widgetElement = $(widgetElement);
      
      this._overlayVisible = false;
      
      this._calendarsVisibleButton = this._widgetElement.find(".calendarsVisibleButton");
      this._calendarsVisibleButton.click($.proxy(this._onCalendarsVisibleButtonClick, this));
      $(document).mousedown($.proxy(this._onDocumentMouseDown, this));
    },
    _onCalendarsVisibleButtonClick: function (event) {
      if (this._overlayVisible == false) {
        var _this = this;
        
        // TODO: Error handling
        RESTful.doGet(CONTEXTPATH + "/rest/calendar/calendars").success(function (calendars, textStatus, jqXHR) {
          renderDustTemplate('/calendar/calendarsvisible.dust', { calendars : calendars }, function (text) {
            var widgetOffset = _this._widgetElement.offset();
            var widgetHeight = _this._widgetElement.outerHeight();
            var widgetWidth =  _this._widgetElement.outerWidth();
            var marginTop = 4;
            
            var calendarsVisibleContainer = $(text).appendTo(document.body);
            $(calendarsVisibleContainer)
              .css({
                opacity: 0
              })
              .offset({
                left: widgetOffset.left + widgetWidth - calendarsVisibleContainer.outerWidth(),
                top: widgetOffset.top + widgetHeight + marginTop
              })
              .hide()
              .css({
                opacity: 1
              })
              .show("blind", { direction: "vertical" }, 300);
            
            _this._overlayVisible = true;
            
            calendarsVisibleContainer.find('input[type="checkbox"]').click(_this._calendarCheckboxClickListener);
          });
        });
      }
    },
    _onDocumentMouseDown: function (event) {
      if (this._overlayVisible) {
        var closest = $(event.target).closest('.visibleCalendars');
        
        if (closest.length == 0) {
          $('.visibleCalendars')
            .hide("blind", { direction: "vertical" }, 300, function () {
              $(this).remove()
            });
          this._overlayVisible = false;
        }
      }
    },
    _onCalendarCheckboxClick: function (event) {
      var target = event.target;
      var calendarId = $(target).data('calendar-id');
      if ($(target).is(":checked")) {
        RESTful.doPut(CONTEXTPATH + '/rest/calendar/calendars/' + calendarId, {
          data: {
            "visible": true
          }
        })
        .success(function (data, textStatus, jqXHR) {
          $(document).trigger($.Event("calendarVisibleWidget:calendarShow", {
            calendarId: calendarId
          })); 
        });
      } else {
        RESTful.doPut(CONTEXTPATH + '/rest/calendar/calendars/' + calendarId, {
          data: {
            "visible": false
          }
        })
        .success(function (data, textStatus, jqXHR) {
          $(document).trigger($.Event("calendarVisibleWidget:calendarHide", {
            calendarId: calendarId
          })); 
        });
      }
    }
  });
  
  addWidgetController('calendarsVisibleWidget', CalendarsVisibleWidgetController);
  
}).call(this);