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
      this._afterEventUpdateListener = $.proxy(this._onAfterEventUpdate, this);
      this._afterEventRemoveListener = $.proxy(this._onAfterEventRemove, this);
      this._calendarVisibilityChangeListener = $.proxy(this._onCalendarVisibilityChange, this);
      this._calendarSettingsChangeListener = $.proxy(this._onCalendarSettingsChange, this);
      
      widgetElement.on("calendarEventsLoad", this._calendarEventsLoadListener);      
      widgetElement.on("afterEventCreate", this._afterEventCreateListener);       
      widgetElement.on("afterEventUpdate", this._afterEventUpdateListener);          
      widgetElement.on("afterEventRemove", this._afterEventRemoveListener);    
      widgetElement.on("calendarVisibilityChange", this._calendarVisibilityChangeListener);   
      widgetElement.on("calendarSettingsChange", this._calendarSettingsChangeListener);
    },
    destroy: function () {
      var widgetElement = this.getWidgetElement();
      
      widgetElement.off("calendarEventsLoad", this._calendarEventsLoadListener);      
      widgetElement.off("afterEventCreate", this._afterEventCreateListener);     
      widgetElement.off("afterEventUpdate", this._afterEventUpdateListener);       
      widgetElement.off("afterEventRemove", this._afterEventRemoveListener);   
      widgetElement.off("calendarVisibilityChange", this._calendarVisibilityChangeListener);    
      widgetElement.off("calendarSettingsChange", this._calendarSettingsChangeListener);

      this._fullCalendar.remove();
      this._super(arguments);
    },
    getViewStartTime: function () {
      var view = this._fullCalendar.fullCalendar('getView');
      return view.visStart;
    },
    getViewEndTime: function () {
      var view = this._fullCalendar.fullCalendar('getView');
      return view.visEnd;
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
        eventResize: $.proxy(this._onEventResize, this),
        eventRender: $.proxy(this._renderEvent, this)
      }, this._options));
    },
    
    _renderEvent: function (event, element) {
    	
    	var contextMenuIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAApdJREFUeNp8U11IFGEUPd/sqPmXhbLmipKosSKZuPZjKhYW9mgIYr1Ez0FPFUQPYg89RCgUob1YT0VKCEkRPYW0mrFbIZrLsqbmz6rbYuvuDjvu/HS/WWdIjC6cuffbe8/hzHdnWcvgOngwxp5QcuE/EXp7rUvX9YCmaaCMsM8HkSqjST+4mqvzXMmkhuP2NLiXVdCcFeFwGBu63rpzDPBHvtMJgauZEHQNpVkqCrM0nCgkHOJiGuoJsVgMM8PDAzR3jriVpjBrHFgya09LzUGXJG2joTgD7iUZDY4MjC3KhpPZWZ/lJrC05aVUz2tRU1WrwVgKPBpLUiKHD4hY+K2gqsqJptIMeDYEJLPXLY6gkoAJuglDoDjHhokVGUft6ViJKxAEGNjRtubb3vSRA0XZ42A1ruI0vcY4iXCi1d+pOedu/xXkByZ3OzDtO8jBp6BsnbmIzUaZpeojPzw5zsDkCHk+I6ikZsJ0EYyrlhtTpDRPNMjqVhBaeDa3rLu7PQT0iOo/XoH9deZRXZCO6dA2yjAJaXELTwfvONrKy/su6fq7PQKpIlXzb4yvlF9o834v2GIvHnXWoqZzLBhOJJ51AlO7BMwtmGKnioi8KqMp14tN3wNcbq1D/9A4iqouRuOJrqmPCbrk+LzHuoN0G0MF7d2RbcNJInMnHYVfwRZ6DfLQ6wkUuW5jmdVF99V14X3JMQirz68jSuuQJQlJTcdcRMHPqILPazK+zX2H78t9XGisxeOXbqgVNzAtNhmznMO5fLOZoVc37bFIBKIoIDNTxEYSRs5eGcHV9ocYGB6HVHkLkYKzSEsTwGc5h3NF/iDYpXmvv6cnuuvvmxy553KPjm7OCOdDyx/WqPki1fjl93MOQfkjwACfLUbTPr/kawAAAABJRU5ErkJggg==";
    	
    	element.contextPopup({
    		  title: event.title,
    		  items: [
    		    {label:'Edit', icon:contextMenuIcon, action:function() {element.trigger($.Event("editEvent", {event: event})); } },
    		  ]
    	});
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
              borderColor: meta.colorProfile.borderColor,
              backgroundColor: meta.colorProfile.backgroundColor
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
    
    _onCalendarEventsLoad: function (event, data) {
      var datas = data.datas;
      this._reloadEvents(datas);
      this._loadedDatas = datas;
    },
    
    _onAfterEventCreate: function (event, data) {
      var newEvent = data.event;
      for (var i = 0, l = this._loadedDatas.length; i < l; i++) {
        if (this._loadedDatas[i].calendarMeta.id == newEvent['calendarId']) {
          this._loadedDatas[i].events.push(newEvent);
          break;
        }
      }
      
      this._reloadEvents(this._loadedDatas);
    },
    
    _onAfterEventRemove: function (event) {
      var eventId = event.id;
      var calendarId = event.calendarId;
      
      for (var i = 0, l = this._loadedDatas.length; i < l; i++) {
        if (this._loadedDatas[i].calendarMeta.id == calendarId) {
          for (var j = 0, jl = this._loadedDatas[i].events.length; j < jl; j++) {
            if (this._loadedDatas[i].events[j].id == eventId) { 
              this._loadedDatas[i].events.splice(j, 1);
              break;
            }
          }
          break;
        }
      }
      
      this._reloadEvents(this._loadedDatas);
    },
    
    _onAfterEventUpdate: function (event) {
      var newEvent = event.event;
      var originalEventData = event.originalEventData;
      
      // Remove original event
      for (var i = 0, l = this._loadedDatas.length; i < l; i++) {
        if (this._loadedDatas[i].calendarMeta.id == originalEventData.calendarId) {
          for (var j = 0, jl = this._loadedDatas[i].events.length; j < jl; j++) {
            if (this._loadedDatas[i].events[j].id == originalEventData.id) {
              this._loadedDatas[i].events.splice(j, 1);
              break;
            }
          }
          break;
        }
      }
      
      // Push new event to loaded datas
      for (var i = 0, l = this._loadedDatas.length; i < l; i++) {
        if (this._loadedDatas[i].calendarMeta.id == newEvent.calendarId) {
          this._loadedDatas[i].events.push(newEvent);
          break;
        }
      }
      
      this._reloadEvents(this._loadedDatas);
    },
    
    _onCalendarVisibilityChange: function (event) {
      this._reloadEvents(this._loadedDatas);
    },
    
    _onEventClick: function (event, originalEvent) {
      /*if (event.editable) {
        this.getWidgetElement().trigger($.Event("editEvent", {
          event: event
        }));
        return false;
      }*/
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
      this.getWidgetElement().trigger("updateEvent", {
        event: event
      });
    },
    
    _onEventResize: function(event, dayDelta, minuteDelta, revertFunc) {
      this.getWidgetElement().trigger("updateEvent", {
        event: event
      });
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
      $(document).on("newCalendarWidget:afterCalendarSubscribe", $.proxy(this._onNewCalendarWidgetAfterCalendarSubscribe, this));     
      $(document).on("newEventWidget:eventCreate", $.proxy(this._onNewEventWidgetEventCreate, this));     
      $(document).on("calendarSettingsWidget:settingsSaved", $.proxy(this._onCalendarSettingsWidgetSettingsSaved, this));      
      $(document).on("calendarVisibleWidget:calendarShow", $.proxy(this._onCalendarVisibleWidgetCalendarShow, this));      
      $(document).on("calendarVisibleWidget:calendarHide", $.proxy(this._onCalendarVisibleWidgetCalendarHide, this));      
      $(document).on("calendarEventDialog:eventRemoved", $.proxy(this._onCalendarEventDialogEventRemoved, this));    
      
      this._initialMode = 'MONTH';
      this._modeHandler = null;
      this._calendarMetas = new Array();
      this._calendarsInitialized = false;

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
      
      $(window).load($.proxy(function () {
        this._loadBasicInfo();
      }, this));
    },
    
    getViewStartTime: function () {
      return this._modeHandler.getViewStartTime();
    },
    getViewEndTime: function () {
      return this._modeHandler.getViewEndTime();
    },
    getCalendarColorProfile: function (meta) {
      var borderColor = jQuery.Color(meta.color).lightness('-=0.2');
      
      return {
        backgroundColor: meta.color,
        borderColor: borderColor.toRgbaString()
      };
    },  
    
    /* Private */

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
      this._widgetElement.trigger("basicInfoLoad");
    },
    
    _loadCalendars: function () {
      mApi().calendar.calendars.read().callback($.proxy(function (err, result) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          this._widgetElement.trigger("calendarsLoad", {
            calendars: result
          });
        }
      }, this));
    },
    
    _loadCalendarEvents: function (calendarMeta, startTime, endTime, callback) {
      mApi().calendar.calendars.events
        .read(calendarMeta.id, { timeMin: startTime, timeMax: endTime })
        .callback($.proxy(function (err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            callback(calendarMeta, result);
          }
        }, this));
    },
    
    _loadEvents: function () {
      var viewStartTime = this.getViewStartTime();
      var viewEndTime = this.getViewEndTime();
      
      var datas = new Array();
      var i = this._calendarMetas.length - 1;
      while (i >= 0) {
        this._loadCalendarEvents(this._calendarMetas[i], viewStartTime, viewEndTime, $.proxy(function (calendarMeta, events) {
          datas.push({
            calendarMeta: calendarMeta, 
            events: events
          }); 

          if (i == 0) {
            this._widgetElement.trigger("calendarEventsLoad", {
              datas: datas
            });
          }
        }, this));
        
        i--;
      }
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
     * Event triggered by new calendar widget when new calendar has been subscribed
     */
    _onNewCalendarWidgetAfterCalendarSubscribe: function (event) {
      var subscribedCalendar = event.subscribedCalendar;
      var calendarMeta = {
        id: subscribedCalendar.id,
        name: subscribedCalendar.name,
        type: subscribedCalendar.calendarType,
        visible: true,
        colorProfile: this.getCalendarColorProfile(subscribedCalendar)
      };
      
      this._calendarMetas.push(calendarMeta);
      this._loadEvents();
    },  
    
    _onNewEventWidgetEventCreate: function (event, data) {
      this._widgetElement.trigger("afterEventCreate", {
        event: event.event
      });
    },
    
    _onCalendarEventDialogEventRemoved: function (event) {
      this._widgetElement.trigger($.Event("afterEventRemove", {
        calendarId: event.calendarId,
        id: event.id
      }));
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

    _onCalendarsLoad: function (event, data) {
      var calendars = data.calendars;
      
      var calendarMetas = [];
      for (var i = 0, l = calendars.length; i < l; i++) {
        var calendar = calendars[i];
        calendarMetas.push({
          id: calendar.id,
          name: calendar.name,
          type: calendar.calendarType,
          visible: calendar.visible,
          colorProfile: this.getCalendarColorProfile(calendar)
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
      var _this = this;
      (new EventDialog(event.event))
        .save(function (originalData, eventData) {
          _this._widgetElement.trigger("updateEvent", {
            originalData: originalData,
            eventData: eventData
          });
        })
        .show();
    },

    _onEditEvent: function (event) {
      var _this = this;
      (new EventDialog(event.event))
        .save(function (originalData, eventData) {
          _this._widgetElement.trigger("updateEvent", {
            originalData: originalData,
            eventData: eventData
          });
        })
        .show();
    },

    _onUpdateEvent: function (event, data) {
      var calendarEvent = data.eventData;
      var calendarId = parseInt(calendarEvent.calendarId);
      var originalEventData = data.originalData;
      var timeZone = jstz.determine().name();
      // TODO: attendees, reminders
      var attendees = []; 
      var reminders = [];

      if (calendarEvent.id == null) {
        mApi().calendar.calendars.events.create(calendarId, {
          calendarId: calendarId,
          summary: calendarEvent.summary,
          description: calendarEvent.description,
          location: calendarEvent.location,
          latitude:calendarEvent.latitude,
          longitude: calendarEvent.longitude,
          url: calendarEvent.url,
          status: 'CONFIRMED',
          start: calendarEvent.start,
          startTimeZone: timeZone,
          end: calendarEvent.end,
          endTimeZone: timeZone,
          allDay: calendarEvent.allDay,
          attendees: attendees,
          reminders: reminders
        }).callback($.proxy(function (err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            this._widgetElement.trigger("afterEventCreate", {
              event: calendarEvent,
              originalEventData: originalEventData
            });
          }
        }, this));   
      } else {
        mApi().calendar.calendars.events.update(calendarId, calendarEvent.id, {
          id: calendarEvent.id,
          calendarId: calendarId,
          summary: calendarEvent.summary,
          description: calendarEvent.description,
          location: calendarEvent.location,
          latitude:calendarEvent.latitude,
          longitude: calendarEvent.longitude,
          url: calendarEvent.url,
          status: 'CONFIRMED',
          start: calendarEvent.start,
          startTimeZone: timeZone,
          end: calendarEvent.end,
          endTimeZone: timeZone,
          allDay: calendarEvent.allDay,
          attendees: attendees,
          reminders: reminders
        }).callback($.proxy(function (err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            this._widgetElement.trigger("afterEventUpdate", {
              event: calendarEvent,
              originalEventData: originalEventData
            });
          }
        }, this)); 
      }
    }
  });
  
  addWidgetController('fullCalendarWidget', FullCalendarWidgetController);
  
}).call(this);