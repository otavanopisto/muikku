(function() {
  
  /** ModeHandler **/
  
  ModeHandler = $.klass({
    init: function (widgetElement) {
      this._widgetElement = widgetElement;
    },
    destroy: function () {
      
    },
    getWidgetElement: function () {
      return this._widgetElement;
    },
    getViewStartTime: function () {
      throw new Error("Unimplemented");
    },
    getViewEndTime: function () {
      throw new Error("Unimplemented");
    }
  });
  
  EventListHandler = $.klass(ModeHandler, {
    init: function (widgetElement, options) {
      this._super(arguments, widgetElement);
      
      widgetElement.append($('<h3>coming soon</h3>'));
    },
    destroy: function () {
      this.getWidgetElement().find('h3').remove();
    }
  });
  
  FullCalendarBasedModeHandler = $.klass(ModeHandler, {
    init: function (widgetElement, options) {
      this._super(arguments, widgetElement);
      
      this._pendingEventObjects = null;
      this._maxDayEvents = options.maxDayEvents||Number.POSITIVE_INFINITY;
      this._maxSummaryLength = options.maxSummaryLength;

      var calendarElement = $('<div class="monthCalendar">');
      
      this._fullCalendar = calendarElement.appendTo(widgetElement).fullCalendar($.extend({
        header: {
          left: '',
          center: '',
          right: ''
        },
        height: calendarElement.outerHeight(),
        editable: true,
        dayClick: $.proxy(this._onDayClick, this),
        eventClick: $.proxy(this._onEventClick, this)
      }, options));

      this._calendarEventsLoadListener = $.proxy(this._onCalendarEventsLoad, this);
      
      widgetElement.on("calendarEventsLoad", this._calendarEventsLoadListener);           
    },
    destroy: function () {
      this._fullCalendar.remove();
      this._super(arguments);
    },
    getViewStartTime: function () {
      var view = this._fullCalendar.fullCalendar('getView');
      return view.start;
    },
    getViewEndTime: function () {
      var view = this._fullCalendar.fullCalendar('getView');
      return view.end;
    },
    getCalendarElement: function () {
      return this._fullCalendar;
    },
    next: function () {
      this._fullCalendar.fullCalendar('next');
    },
    previous: function () {
      this._fullCalendar.fullCalendar('prev');
    },
    today: function () {
      this._fullCalendar.fullCalendar('today');
    },
    _truncateString: function (string, maxLength) {
      if (!string)
        return '';
      
      if (string.length > maxLength) {
        return string.substring(0, maxLength - 1) + '...';
      }
      
      return string;
    },
    _getDaySpan: function (startTime, endTime) {
      var startDate = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 0, 0, 0, 0);
      var endDate = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate(), 23, 59, 0, 0);
      return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    },
    _onCalendarEventsLoad: function (event) {
      this._fullCalendar.fullCalendar('removeEvents');
      
      var widgetController = event.source;
      var datas = event.datas;
      var eventObjects = new Array();
      var dayEventsMeta = {};
      
      var getOffsetDate = function (date, dateOffset) {
        var time = date.getTime();
        
        if (dateOffset > 0) {
          time += dateOffset * (1000 * 60 * 60 * 24);
        }
        
        return new Date(time);
      };
      
      var getDayKey = function (date) {
        var result = [date.getFullYear(), date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth(), date.getDate() > 9 ? date.getDate() : '0' + date.getDate()].join('-');
        return result;
      };

      for (var dataIndex = 0, datasLength = datas.length; dataIndex < datasLength; dataIndex++) {
        var meta = datas[dataIndex].calendarMeta;
        var events = datas[dataIndex].events;

        var colorProfile = widgetController.getCalendarColorProfile(meta.id);
        
        for (var i = 0, l = events.length; i < l; i++) {
          
          var editable = meta.type == 'LOCAL';
          var startTime = new Date(events[i].startTime);
          var endTime = new Date(events[i].endTime);
          
          var eventObject = {
            id: events[i].id,
            calendarId: meta.id,
            title: this._maxSummaryLength ? this._truncateString(events[i].summary, this._maxSummaryLength) : events[i].summary,
            summary: events[i].summary,
            description: events[i].description,
            start: startTime,
            end: endTime,
            url: events[i].url,
            location: events[i].location, 
            longitude: events[i].longitude,
            latitude: events[i].latitude,
            editable: editable,
            allDay: events[i].allDayEvent,
            borderColor: colorProfile.borderColor,
            backgroundColor: colorProfile.backgroundColor
          };
          
          var days = this._getDaySpan(startTime, endTime);
          while (days > 0) {
            var date = getOffsetDate(startTime, days - 1);
            var key = getDayKey(date);
            
            if (!dayEventsMeta[key]) {
              dayEventsMeta[key] = {
                events: new Array(),
                hiddenCount: 0,
                date: date
              }
            }
            
            dayEventsMeta[key].events.push(eventObject);
            
            days--;
          }
        }
      }
      
      var keys = new Array();
      for (var key in dayEventsMeta) {
        keys.push(key);
      }
      
      keys.sort();
      
      for (var keyIndex = 0, keysLength = keys.length; keyIndex < keysLength; keyIndex++) {
        var key = keys[keyIndex];
        var eventsMeta = dayEventsMeta[key];
        if (eventsMeta) {
          while (eventsMeta.events.length > this._maxDayEvents) {
            var overflowingEvent = eventsMeta.events[eventsMeta.events.length - 1];
            var days = this._getDaySpan(overflowingEvent.start, overflowingEvent.end);
            for (var i = 0; i < days; i++) {
              var peekKey = getDayKey(getOffsetDate(overflowingEvent.start, i));
              
              var peekEventIndex = dayEventsMeta[peekKey].events.indexOf(overflowingEvent);
              if (peekEventIndex > -1) {
                dayEventsMeta[peekKey].events.splice(peekEventIndex, 1);
              }
              
              dayEventsMeta[peekKey].hiddenCount++;
            }
          }
        }
      }
      
      var visibleEvents = new Array();
      for (var key in dayEventsMeta) {
        var eventsMeta = dayEventsMeta[key];
        if (eventsMeta) {
          for (var i = 0, l = eventsMeta.events.length; i < l; i++) {
            var visibleEvent = eventsMeta.events[i];
            if (visibleEvents.indexOf(visibleEvent) == -1) {
              visibleEvents.push(visibleEvent);
            }
          }
          
          if (eventsMeta.hiddenCount > 0) {
            visibleEvents.pop();
            eventsMeta.hiddenCount++;
            
            var overflowDate = eventsMeta.date;
            overflowDate.setHours(23,59,59,999);
            // TODO: Localize
            visibleEvents.push({
              title: '... and ' + eventsMeta.hiddenCount + ' more',
              start: overflowDate,
              end: overflowDate,
              allDay: false,
              className: 'moreInfo',
              editable: false
            });
          }
        }
      }

      this._fullCalendar.fullCalendar("addEventSource", {
        events: visibleEvents
      });

    },
    
    _onEventClick: function (event) {
      if (event.editable) {
        this.getWidgetElement().trigger($.Event("editEvent", {
          event: event
        })); 
      }
    },
    
    _onDayClick: function (date, allDay, jsEvent, view) {
      this.getWidgetElement().trigger($.Event("createEvent", {
        event: {
          id: null,
          calendarId: null,
          start: date,
          end: new Date(allDay ? date : date.getTime() + (1000 * 60 * 60)),
          editable: true,
          allDay: allDay      
        }  
      })); 
    }
  });
  
  MonthModeHandler = $.klass(FullCalendarBasedModeHandler, {
    init: function (widgetElement) {
      this._super(arguments, widgetElement, {
        defaultView: 'month',
        maxDayEvents: 4,
        maxSummaryLength: 18
      }); 
    }
  });
  
  WeekModeHandler = $.klass(FullCalendarBasedModeHandler, {
    init: function (widgetElement) {
      this._super(arguments, widgetElement, {
        defaultView: 'agendaWeek'
      }); 
    }
  });
  
  DayModeHandler = $.klass(FullCalendarBasedModeHandler, {
    init: function (widgetElement) {
      this._super(arguments, widgetElement, {
        defaultView: 'agendaDay'
      }); 
    }
  });

  FullCalendarWidgetController = $.klass(WidgetController, {
    init: function () {
      this._super(arguments);
    },
    setup: function (widgetElement) {
      this._widgetElement = $(widgetElement);
      
      this._modeHandler = null;
      this._calendarMetas = new Array();
      this._calendarsInitialized = false;
      this._nextColorProfile = 1;
      this._colorProfileCount = 15;
      
      // Register mode handlers
      
      this._modeHandlers = {
        "EVENT_LIST": EventListHandler,
        "DAY": DayModeHandler,
        "WEEK": WeekModeHandler,
        "MONTH": MonthModeHandler
      };
      
      // Listen buttons
      this._widgetElement.find('.fullCalendarWidgetNavigationLeft').click($.proxy(this._onNavigationLeftClick, this));
      this._widgetElement.find('.fullCalendarWidgetNavigationToday').click($.proxy(this._onNavigationTodayClick, this));
      this._widgetElement.find('.fullCalendarWidgetNavigationRight').click($.proxy(this._onNavigationRightClick, this));
      this._widgetElement.find('.fullCalendarWidgetModeButton').click($.proxy(this._onModeButtonClick, this));
      
      // Listen mode changes
      this._widgetElement.on("modeChange", $.proxy(this._onModeChange, this));

      // Listen calendar initialization
      this._widgetElement.on("calendarsLoad", $.proxy(this._onCalendarsLoad, this));
      this._widgetElement.on("calendarsInit", $.proxy(this._onCalendarsInit, this));

      // Listen date changes
      this._widgetElement.on("dateChange", $.proxy(this._onDateChange, this));
      
      this._widgetElement.on("createEvent", $.proxy(this._onCreateEvent, this));
      this._widgetElement.on("editEvent", $.proxy(this._onEditEvent, this));
      this._widgetElement.on("updateEvent", $.proxy(this._onUpdateEvent, this));
      
      this._changeMode("WEEK");
    },
    
    getViewStartTime: function () {
      return this._modeHandler.getViewStartTime();
    },
    getViewEndTime: function () {
      return this._modeHandler.getViewEndTime();
    },
    getCalendarColorProfile: function (id) {
      for (var i = 0, l = this._calendarMetas.length; i < l; i++) {
        if (this._calendarMetas[i].id == id) {
          var colorProfile = this._calendarMetas[i].colorProfile;
          
          if ((colorProfile.borderColor === undefined)&&(colorProfile.backgroundColor === undefined)) {
            var selectorText = '.' + colorProfile.className;
            
            for (var stylesheetIndex = 0, stylesheetsLength = document.styleSheets.length; stylesheetIndex < stylesheetsLength; stylesheetIndex++) {
              var rules = document.styleSheets[stylesheetIndex].cssRules ? document.styleSheets[stylesheetIndex].cssRules : document.styleSheets[stylesheetIndex].rules;
              
              for (var ruleIndex = 0, rulesLength = rules.length; ruleIndex < rulesLength; ruleIndex++) {
                var rule = rules[ruleIndex];
                if (rule.selectorText && (rule.selectorText.toLowerCase() == selectorText.toLowerCase())) {
                  colorProfile.backgroundColor = rule.style['backgroundColor'];
                  colorProfile.borderColor = rule.style['borderColor'];
                  break;
                }
              }
            }
          }
          
          return colorProfile;
        }
      }

      return null;
    },  
    
    /* Private */
    
    _getNextColorProfile: function () {
      var colorProfile = 'calendarColorProfile_' + this._nextColorProfile;
      this._nextColorProfile = (this._nextColorProfile % this._colorProfileCount) + 1;
      return colorProfile;
    },

    _changeMode: function (mode) {
      var event = $.Event("modeChange", {
        from: this._mode,
        to: mode
      });
      
      this._widgetElement.trigger(event);
      
      if (!event.isDefaultPrevented()) {
        this._mode = mode;
      }
    },
    
    /* API -calls */ 
    
    _loadCalendars: function () {
      // TODO: Error handling

      var _this = this;
      RESTful.doGet(CONTEXTPATH + "/rest/calendar/calendars")
        .success(function (data, textStatus, jqXHR) {
          
          var event = $.Event("calendarsLoad", {
            calendars: data
          });
          
          _this._widgetElement.trigger(event);
        });
    },
    
    _loadCalendarEvents: function (calendarMeta, startTime, endTime, callback) {
      RESTful.doGet(CONTEXTPATH + "/rest/calendar/calendars/{calendarId}/events", {
        parameters: {
          calendarId: calendarMeta.id,
          timeMin: startTime.getTime(),
          timeMax: endTime.getTime()
        }
      })
      .success(function (data, textStatus, jqXHR) {
        callback(calendarMeta, data);
      });
    },
    
    _loadEvents: function () {
      var viewStartTime = this.getViewStartTime();
      var viewEndTime = this.getViewEndTime();
      
      var datas = new Array();

      var i = this._calendarMetas.length - 1;
      while (i >= 0) {
        var _this = this;
        this._loadCalendarEvents(this._calendarMetas[i], viewStartTime, viewEndTime, function (calendarMeta, events) {
          datas.push({
            calendarMeta: calendarMeta, 
            events: events
          }); 

          if (i == 0) {
            _this._widgetElement.trigger($.Event("calendarEventsLoad", {
              source: _this,
              datas: datas
            }));
          }
        });
        
        i--;
      }
    },
    
    _openEventEditor: function (event) {
      
      var createField = function (dialogContent, className, label, editor) {
        var field = $('<div class="fullCalendarWidgetEventEditorField"/>');
        field.addClass("fullCalendarWidgetEventEditorField" + className);
        
        var label = $('<label>').text(label);
        label.attr("for", editor.uniqueId().attr("id"));
        
        label.appendTo(field);
        editor.appendTo(field);      
        field.appendTo(dialogContent);   
        
        return field;
      };
      
      // TODO: Localize
      
      var dialogContent = $('<div>')
        .attr('title', "New Event");
      
      var allDayElement = $('<input name="allDay" type="checkbox"/>').attr('checked', event.allDay);
      
      var fromDate = $('<input name="fromDate" type="text"/>').datepicker();
      fromDate.datepicker("setDate", event.start);
      var fromTime = $('<input name="fromTime" type="text"/>').timepicker();
      fromTime.timepicker("setTime", event.start);
      
      var toDate = $('<input name="toDate" type="text"/>').datepicker();
      toDate.datepicker("setDate", event.end);
      var toTime = $('<input name="toTime" type="text"/>').timepicker();
      toTime.timepicker("setTime", event.end);
      
      allDayElement.change(function (events) {
        if ($(this).is(":checked")) {
          fromTime.hide();
          toTime.hide();
        } else {
          fromTime.show();
          toTime.show();
        }
      });
      
      if (event.allDay) {          
        fromTime.hide();
        toTime.hide();
      }

      var fromField = $('<div>')
        .append(fromDate, fromTime);
      
      var toField = $('<div>')
        .append(toDate, toTime);
      
      var calendarSelect = $('<select name="calendarId">');
      for (var i = 0, l = this._calendarMetas.length; i < l; i++) {
        var calendarMeta = this._calendarMetas[i];
        if (calendarMeta.type == 'LOCAL') {
          $('<option>')
            .attr('value', calendarMeta.id)
            .text(calendarMeta.name)
            .appendTo(calendarSelect);
        }
      }

      createField(dialogContent, "Calendar", "Calendar", calendarSelect);
      createField(dialogContent, "Summary", "Summary", $('<input name="summary" type="text"/>').val(event.summary));
      createField(dialogContent, "AllDay", "All day", allDayElement);
      createField(dialogContent, "From", "From", fromField);
      createField(dialogContent, "To", "To", toField);
      createField(dialogContent, "Description", "Description", $('<textarea name="description"/>').val(event.description));
      dialogContent.data("event", event);
      
      var buttons = {};
      buttons[event.id ? 'Edit' : 'Create'] = function() {
        var calendarEvent = $(this).data('event');
        
        var startDate = $(this).find('input[name="fromDate"]').datepicker("getDate");
        var endDate = $(this).find('input[name="toDate"]').datepicker("getDate");
        if (!$(this).find('input[name="allDay"]').is(":checked")) {
          var startTime = $(this).find('input[name="fromTime"]').timepicker("getTime");
          var endTime = $(this).find('input[name="toTime"]').timepicker("getTime");
          
          startDate.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
          endDate.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
          calendarEvent.allDay = false;
        } else {
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          calendarEvent.allDay = true;
        }

        calendarEvent.calendarId = $(this).find('select[name="calendarId"]').val();
        calendarEvent.summary = $(this).find('input[name="summary"]').val();
        calendarEvent.start = startDate;
        calendarEvent.end = endDate;
        calendarEvent.description = $(this).find('input[name="description"]').val();

        var event = $.Event("eventEdit", {
          event: calendarEvent
        });
        
        $(this).trigger(event);
        
        if (!event.isDefaultPrevented()) {
          $(this).dialog("close");
        }
      };
      
      buttons["Cancel"] = function() {
        $(this).trigger($.Event("editCancel", {
          event: $(this).data('event')
        }));
        
        $(this).dialog("close");
      };
      
      dialogContent.dialog({
        modal: true,
        width: 500,
        buttons: buttons
      });
      
      var _this = this;
      dialogContent.on("eventEdit", function (event) {
        _this._widgetElement.trigger($.Event("updateEvent", {
          event: event.event
        }));
      });
      
      dialogContent.on("editCancel", function (event) {
        _this._widgetElement.trigger($.Event("cancelEventUpdate", {
          event: event.event
        }));
      });
    },
    
    /* DOM Events*/
    
    _onNavigationLeftClick: function (event) {
      this._modeHandler.previous();
      this._widgetElement.trigger("dateChange");
    },
    _onNavigationTodayClick: function (event) {
      this._modeHandler.today();
      this._widgetElement.trigger("dateChange");
    },
    _onNavigationRightClick: function (event) {
      this._modeHandler.next();
      this._widgetElement.trigger("dateChange");
    },
    _onModeButtonClick: function (event) {
      var button = $(event.target);
      
      var mode = button.data('mode');
      this._changeMode(mode);
    },
    
    /* Custom events */
    
    _onModeChange: function (event) {
      if (this._modeHandler) {
        this._modeHandler.destroy();
        delete this._modeHandler;
      }
      
      var handlerClass = this._modeHandlers[event.to];
      
      if (handlerClass) {
        this._modeHandler = new handlerClass(this._widgetElement);
      }
      
      if (!this._calendarsInitialized) {
        this._loadCalendars();        
      } else {
        this._loadEvents();
      }
    },
    
    _onCalendarsLoad: function (event) {
      var calendars = event.calendars;
      
      var calendarMetas = new Array();
      for (var i = 0, l = calendars.length; i < l; i++) {
        var calendar = calendars[i];
        calendarMetas.push({
          id: calendar.id,
          name: calendar.name,
          type: calendar.calendarType,
          colorProfile: {
            className: this._getNextColorProfile(),
            borderColor: undefined,
            backgroundColor: undefined
          }
        });
      }
      
      var event = $.Event("calendarsInit", {
        calendarMetas: calendarMetas
      });
      
      this._widgetElement.trigger(event);
    },
    
    _onCalendarsInit: function (event) {
      this._calendarMetas = event.calendarMetas;
      this._calendarsInitialized = true;
      this._loadEvents();
    },
    
    _onDateChange: function (event) {
      this._loadEvents();
    },
    
    _onCreateEvent: function (event) {
      this._openEventEditor(event.event);
    },

    _onEditEvent: function (event) {
      this._openEventEditor(event.event);
    },

    _onUpdateEvent: function (event) {
      var calendarEvent = event.event;
      
      if (calendarEvent.id == null) {
        // Creating new event 

        var _this = this;
        RESTful.doPost(CONTEXTPATH + '/rest/calendar/calendars/{calendarId}/events', {
          parameters: {
            calendarId: calendarEvent.calendarId,
            type: 'DEFAULT',
            summary: calendarEvent.summary,
            description: calendarEvent.description,
            location: calendarEvent.location,
            url: calendarEvent.url,
            startTime: calendarEvent.start,
            endTime: calendarEvent.end,
            allDayEvent: calendarEvent.allDay,
            latitude: calendarEvent.latitude,
            longitude: calendarEvent.longitude
          }
        })
        .success(function (data, textStatus, jqXHR) {
          _this._widgetElement.trigger($.Event("afterEventCreate", {
            source: _this,
            event: calendarEvent
          }));
        });

      } else {
        // TODO: Updating existing event
      }
    }
    
  });
  
  addWidgetController('fullCalendarWidget', FullCalendarWidgetController);
  
}).call(this);