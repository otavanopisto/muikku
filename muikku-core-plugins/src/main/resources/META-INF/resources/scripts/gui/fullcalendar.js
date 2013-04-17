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
    getWidgetController: function () {
      return this.getWidgetElement().data("widgetController");
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
      
      this._options = options;
      this._maxDayEvents = options.maxDayEvents||Number.POSITIVE_INFINITY;
      this._maxSummaryLength = options.maxSummaryLength;
      this._loadedDatas = null;
      
      this._fullCalendar = this._createCalendar();
      
      this._calendarEventsLoadListener = $.proxy(this._onCalendarEventsLoad, this);
      this._afterEventCreateListener = $.proxy(this._onAfterEventCreate, this);
      this._calendarVisibilityChangeListener = $.proxy(this._onCalendarVisibilityChange, this);
      this._updateEventListener = $.proxy(this._onUpdateEvent, this);
      this._calendarSettingsChangeListener = $.proxy(this._onCalendarSettingsChange, this);
      
      widgetElement.on("calendarEventsLoad", this._calendarEventsLoadListener);      
      widgetElement.on("afterEventCreate", this._afterEventCreateListener);      
      widgetElement.on("calendarVisibilityChange", this._calendarVisibilityChangeListener);   
      widgetElement.on("updateEvent", this._updateEventListener);
      widgetElement.on("calendarSettingsChange", this._calendarSettingsChangeListener);
    },
    destroy: function () {
      var widgetElement = this.getWidgetElement();
      
      widgetElement.off("calendarEventsLoad", this._calendarEventsLoadListener);      
      widgetElement.off("afterEventCreate", this._afterEventCreateListener);     
      widgetElement.off("calendarVisibilityChange", this._calendarVisibilityChangeListener);    
      widgetElement.off("updateEvent", this._updateEventListener); 
      widgetElement.off("calendarSettingsChange", this._calendarSettingsChangeListener);

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
    _createCalendar: function () {
      var widgetElement = this.getWidgetElement();
      var calendarElement = $('<div class="monthCalendar">');
      
      return calendarElement.appendTo(widgetElement).fullCalendar($.extend({
        header: {
          left: '',
          center: '',
          right: ''
        },
        firstDay: widgetElement.find('input[name="firstDay"]').val(),
        height: calendarElement.outerHeight(),
        editable: true,
        dayClick: $.proxy(this._onDayClick, this),
        eventClick: $.proxy(this._onEventClick, this),
        eventDrop: $.proxy(this._onEventDrop, this),
        eventResize: $.proxy(this._onEventResize, this)
      }, this._options));
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
    
    _reloadEvents: function (datas) {
      var widgetController = this.getWidgetController();
      this._fullCalendar.fullCalendar('removeEvents');
      
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
        if (meta.visible) {
          var events = datas[dataIndex].events;
  
          var colorProfile = widgetController.getCalendarColorProfile(meta.id);
          
          for (var i = 0, l = events.length; i < l; i++) {
            
            var editable = meta.type == 'LOCAL';
            var startTime = new Date(events[i].start);
            var endTime = new Date(events[i].end);
            
            var eventObject = {
              id: events[i].id,
              calendarId: meta.id,
              typeId: events[i]['type_id'],
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
              allDay: events[i].allDay,
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
    
    _onCalendarEventsLoad: function (event) {
      var datas = event.datas;
      this._reloadEvents(datas);
      this._loadedDatas = datas;
    },
    
    _onAfterEventCreate: function (event) {
      var newEvent = event.event;
      
      for (var i = 0, l = this._loadedDatas.length; i < l; i++) {
        if (this._loadedDatas[i].calendarMeta.id == newEvent['calendar_id']) {
          this._loadedDatas[i].events.push(newEvent);
          break;
        }
      }
      
      this._reloadEvents(this._loadedDatas);
    },
    
    _onCalendarVisibilityChange: function (event) {
      this._reloadEvents(this._loadedDatas);
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
    },
    
    _onEventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc) {
      this.getWidgetElement().trigger($.Event("updateEvent", {
        event: event
      }));
    },
    
    _onEventResize: function(event, dayDelta, minuteDelta, revertFunc) {
      this.getWidgetElement().trigger($.Event("updateEvent", {
        event: event
      }));
    },
    
    _onUpdateEvent: function (event) {
      this._fullCalendar.fullCalendar('rerenderEvents');
    },

    _onCalendarSettingsChange: function (event) {
      if (this.getWidgetElement().find('input[name="firstDay"]').val() != this._fullCalendar.fullCalendar('firstDay')) {
        this._fullCalendar.remove();
        this._fullCalendar = this._createCalendar();
        this._reloadEvents(this._loadedDatas);
      }
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
      this._widgetElement.data("widgetController", this);
      $(document).on("calendarSettingsWidget:afterCalendarSubscribe", $.proxy(this._onCalendarSettingsWidgetAfterCalendarSubscribe, this));      
      $(document).on("calendarSettingsWidget:settingsSaved", $.proxy(this._onCalendarSettingsWidgetSettingsSaved, this));      
      $(document).on("calendarVisibleWidget:calendarShow", $.proxy(this._onCalendarVisibleWidgetCalendarShow, this));      
      $(document).on("calendarVisibleWidget:calendarHide", $.proxy(this._onCalendarVisibleWidgetCalendarHide, this));      
      
      this._initialMode = 'MONTH';
      this._modeHandler = null;
      this._localEventTypes = null;
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
      this._widgetElement.on("basicInfoLoad", $.proxy(this._onBasicInfoLoad, this));
      this._widgetElement.on("calendarsLoad", $.proxy(this._onCalendarsLoad, this));
      this._widgetElement.on("calendarsInit", $.proxy(this._onCalendarsInit, this));

      // Listen date changes
      this._widgetElement.on("dateChange", $.proxy(this._onDateChange, this));
      
      this._widgetElement.on("createEvent", $.proxy(this._onCreateEvent, this));
      this._widgetElement.on("editEvent", $.proxy(this._onEditEvent, this));
      this._widgetElement.on("updateEvent", $.proxy(this._onUpdateEvent, this));
      
      this._loadBasicInfo();
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
    
    _loadBasicInfo: function () {
      var _this = this;
      RESTful.doGet(CONTEXTPATH + "/rest/calendar/localEventTypes")
        .success(function (data, textStatus, jqXHR) {
          _this._localEventTypes = data;
          _this._widgetElement.trigger($.Event("basicInfoLoad", {
          }));
        });
    },
    
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
      
      var typeSelect = $('<select name="typeId">');
      for (var i = 0, l = this._localEventTypes.length; i < l; i++) {
        var type = this._localEventTypes[i];
        $('<option>')
          .attr('value', type.id)
          .text(type.name)
          .appendTo(typeSelect);
      }
      
      createField(dialogContent, "Calendar", "Calendar", calendarSelect);
      createField(dialogContent, "Type", "Type", typeSelect);
      createField(dialogContent, "Summary", "Summary", $('<input name="summary" type="text"/>').val(event.summary));
      createField(dialogContent, "AllDay", "All day", allDayElement);
      createField(dialogContent, "From", "From", fromField);
      createField(dialogContent, "To", "To", toField);
      createField(dialogContent, "Description", "Description", $('<textarea name="description"/>').val(event.description));
      dialogContent.data("event", event);
      
      var buttons = {};
      
      buttons["Cancel"] = function() {
        $(this).trigger($.Event("editCancel", {
          event: $(this).data('event')
        }));
        
        $(this).dialog("close");
      };
      
      buttons['Save'] = function() {
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
        calendarEvent.typeId = $(this).find('select[name="typeId"]').val();
        calendarEvent.summary = $(this).find('input[name="summary"]').val();
        calendarEvent.start = startDate;
        calendarEvent.end = endDate;
        calendarEvent.description = $(this).find('textarea[name="description"]').val();

        var event = $.Event("eventEdit", {
          event: calendarEvent
        });
        
        $(this).trigger(event);
        
        if (!event.isDefaultPrevented()) {
          $(this).dialog("close");
        }
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
    
    /**
     * Event triggered by calendar settings widget when new calendar has been subscribed
     */
    _onCalendarSettingsWidgetAfterCalendarSubscribe: function (event) {
      var subscribedCalendar = event.subscribedCalendar;
      var calendarMeta = {
        id: subscribedCalendar.id,
        name: subscribedCalendar.name,
        type: subscribedCalendar.calendarType,
        visible: true,
        colorProfile: {
          className: this._getNextColorProfile(),
          borderColor: undefined,
          backgroundColor: undefined
        }
      };
      
      this._calendarMetas.push(calendarMeta);
      this._loadEvents();
    },  

    _onCalendarSettingsWidgetSettingsSaved: function (event) {
      this._widgetElement.find('input[name="firstDay"]').val(event.settings['firstDay']);
      this._widgetElement.trigger($.Event("calendarSettingsChange"));
    },
    
    /**
     * Event triggered by calendar visible widget when calendar has been toggled visible
     */
    _onCalendarVisibleWidgetCalendarShow: function (event) {
      for (var i = 0, l = this._calendarMetas.length; i < l; i++) {
        if (this._calendarMetas[i].id == event.calendarId) {
          this._calendarMetas[i].visible = true;
          break;
        }
      }

      this._widgetElement.trigger($.Event("calendarVisibilityChange"));
    },
    
    /**
     * Event triggered by calendar visible widget when calendar has been toggled hidden
     */
    _onCalendarVisibleWidgetCalendarHide: function (event) {
      for (var i = 0, l = this._calendarMetas.length; i < l; i++) {
        if (this._calendarMetas[i].id == event.calendarId) {
          this._calendarMetas[i].visible = false;
          break;
        }
      }

      this._widgetElement.trigger($.Event("calendarVisibilityChange"));
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
    
    _onBasicInfoLoad: function (event) {
      this._changeMode(this._initialMode);
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
          visible: calendar.visible,
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
      this._loadEvents(this._calendarMetas);
    },
    
    _onDateChange: function (event) {
      this._loadEvents(this._calendarMetas);
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
        RESTful.doPost(CONTEXTPATH + '/rest/calendar/calendars/' + calendarEvent.calendarId + '/events', {
          data: {
            type_id: parseInt(calendarEvent.typeId),
            summary: calendarEvent.summary,
            description: calendarEvent.description,
            location: calendarEvent.location,
            url: calendarEvent.url,
            start: calendarEvent.start.getTime(),
            end: calendarEvent.end.getTime(),
            allDay: calendarEvent.allDay,
            latitude: calendarEvent.latitude,
            longitude: calendarEvent.longitude
          }
        })
        .success(function (data, textStatus, jqXHR) {
          // calendarEvent.id = data.id;
          _this._widgetElement.trigger($.Event("afterEventCreate", {
            event: data
          }));
        });

      } else {
        // Updating existing event
        
        var _this = this;
        RESTful.doPut(CONTEXTPATH + '/rest/calendar/calendars/' + calendarEvent.calendarId + '/events/' + calendarEvent.id, {
          data: {
            type_id: parseInt(calendarEvent.typeId),
            summary: calendarEvent.summary,
            description: calendarEvent.description,
            location: calendarEvent.location,
            url: calendarEvent.url,
            start: calendarEvent.start.getTime(),
            end: calendarEvent.end.getTime(),
            allDay: calendarEvent.allDay,
            latitude: calendarEvent.latitude,
            longitude: calendarEvent.longitude
          }
        })
        .success(function (data, textStatus, jqXHR) {
          _this._widgetElement.trigger($.Event("afterEventUpdate", {
            event: calendarEvent
          }));
        });
      }
    }
    
  });
  
  addWidgetController('fullCalendarWidget', FullCalendarWidgetController);
  
}).call(this);