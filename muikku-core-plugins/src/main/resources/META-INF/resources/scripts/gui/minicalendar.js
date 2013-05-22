(function() {
  
  MiniCalendarWidgetController = $.klass(WidgetController, {
    init: function () {
      this._super(arguments);
      
      this._visibleEvents = new Object();
    },
    
    setup: function (widgetElement) {
      var firstDay = parseInt($(widgetElement).find('input[name="firstDay"]').val());

      this._widgetElement = $(widgetElement);
      
      var _this = this;
      this._createMiniCalendar({
        showOtherMonths: true,
        selectOtherMonths: true,
        showWeek: true,
        firstDay: firstDay,
        onSelect: function (text, inst) {
          if ((inst.drawYear != inst.selectedYear) || (inst.drawMonth != inst.selectedMonth)) {
            // Move to current month when "other month" has been selected
            $(this).datepicker("setDate", $(this).datepicker("getDate"));
            _this._updateDates();
            _this._reloadEvents();
          }
        },
        onChangeMonthYear: function (year, month, inst) {
          _this._updateDates();
          _this._reloadEvents();
        },
        beforeShowDay: function(date) {
          var classes = new Array();
          var summaries = new Array();
          
          var ymd = [date.getFullYear(), date.getMonth(), date.getDate()];
          var key = ymd.join('-');
          
          if (_this._visibleEvents[key]) {
            classes.push('has-events');
            for (var i = 0, l = _this._visibleEvents[key].length; i < l; i++) {
              var visibleEvent = _this._visibleEvents[key][i];
              if (visibleEvent.summary) {
                summaries.push(visibleEvent.summary);
              }
              
              var className = "miniCalendar_" + visibleEvent.calendarId;
              
              if (classes.indexOf(className) == -1) {
                classes.push(className);
              }
            }
          }
          
          return [true, classes.join(' '), summaries.join('\n')];
        }
      });

      this._updateDates();
      
      $(document).on("calendarSettingsWidget:settingsSaved", $.proxy(this._onCalendarSettingsWidgetSettingsSaved, this)); 
      $(document).on("calendarVisibleWidget:calendarShow", $.proxy(this._onCalendarVisibleWidgetCalendarShow, this));      
      $(document).on("calendarVisibleWidget:calendarHide", $.proxy(this._onCalendarVisibleWidgetCalendarHide, this));      
      
      RESTful.doGet(CONTEXTPATH + "/rest/calendar/calendars")
        .success($.proxy(this._onCalendarsLoad, this));
    },
    destroy: function () {
      this._removeMiniCalendar();
    },
    
    _updateDates: function () {
      var firstDay = this._miniCalendar.datepicker( "option", 'firstDay' );
      var currentDate = this._miniCalendar.datepicker("getDate");
      this._currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      this._currentMonthEnd = new Date(this._currentMonthStart.getFullYear(), this._currentMonthStart.getMonth() + 1, 0);
      this._viewStart = new Date(this._currentMonthStart.getFullYear(), this._currentMonthStart.getMonth(), -(this._currentMonthStart.getDay() - (firstDay + 1)));
      this._viewEnd = new Date(this._currentMonthEnd.getFullYear(), this._currentMonthEnd.getMonth(), this._currentMonthEnd.getDate());
      this._viewEnd.setDate(this._viewEnd.getDate() + ((7 - this._currentMonthEnd.getDay()) + firstDay - 1));
    },
    
    _createMiniCalendar: function (options) {
      this._miniCalendar = $('<div class="miniCalendar">')
        .datepicker(options)
        .appendTo(this._widgetElement);

      this._miniCalendar.on('mouseenter', "td a", function () { 
        console.log($(this).text() + ' ' + $('.ui-datepicker-month').text() + ' ' +$('.ui-datepicker-year').text()  );    
      });
    },
    
    _removeMiniCalendar: function () {
      this._miniCalendar.remove();
    },
    
    _refreshVisibileEvents: function () {
      this._visibleEvents = new Object();
      
      var _this = this;
      $.each(this._calendars, function (index, calendar) {
        if (calendar.meta.visible) {
          $.each(calendar.events, function (index, event) {
            var startDate = new Date(event.start);
            var endDate = new Date(event.end);
            
            for (var ts = event.start; ts <= event.end; ts += (1000 * 60 * 60 * 24)) {
              var date = new Date(ts);
              var ymd = [date.getFullYear(), date.getMonth(), date.getDate()];
              var key = ymd.join('-');
              
              if (_this._visibleEvents[key] === undefined) {
                _this._visibleEvents[key] = new Array();
              }
              
              _this._visibleEvents[key].push({
                id: event.id,
                calendarId: calendar.meta.id,
                summary: event.summary
              });
            }
          });
        }
      });
    },
    
    _createCalendarStyles: function () {
      var styles = new Object();
      var _this = this;
      $.each(this._calendars, function (index, calendar) {
        var color = calendar.meta.color;
        
        styles[".miniCalendarWidget .miniCalendar_" + calendar.meta.id + ' a'] = {
          'background': color,
          'color': _this._getTextColor(color)
        };
      });

      $.injectCSS(styles);
    },
    
    _getTextColor: function (color) {
      var color = jQuery.Color(color);
      // Turn to complementary and increase lightness by 33%
      color = color.hue((color.hue() + 180) % 360).lightness('+=0.33');
      return color.toRgbaString();
    },

    _loadCalendars: function (calendarMetas, startTime, endTime, callback) {
      var waitingToComplete = calendarMetas.length;
      var results = new Array();
      
      var _this = this;
      $.each(calendarMetas, function (index, calendarMeta) {
        _this._loadCalendarEvents(calendarMeta, startTime, endTime, function (err, calendarMeta, events) {
          waitingToComplete--;
          if (err) {
            alert("Error occurred while loading calendar: " + err);
          } else {
            results.push({
              meta: calendarMeta,
              events: events
            });
          }
          
          if (waitingToComplete == 0) {
            callback(results);
          }
        });
      });
    },
    
    _loadCalendarEvents: function (calendar, startTime, endTime, callback) {
      RESTful.doGet(CONTEXTPATH + "/rest/calendar/calendars/{calendarId}/events", {
        parameters: {
          calendarId: calendar.id,
          timeMin: startTime.getTime(),
          timeMax: endTime.getTime()
        }
      }).error(function (jqXHR, textStatus, errorThrown) {
        callback(errorThrown, calendar, null);
      }).success(function (events, textStatus, jqXHR) {
        callback(null, calendar, events);
      });
    },
    
    _reloadEvents: function () {
      var calendarMetas = new Array();
      for (var i = 0, l = this._calendars.length; i < l; i++) {
        calendarMetas.push(this._calendars[i].meta);
      }

      this._loadCalendars(calendarMetas, this._viewStart, this._viewEnd, $.proxy(function (calendars) {
        this._calendars = calendars;
        this._refreshVisibileEvents()
        this._miniCalendar.datepicker('refresh');
      }, this));
    },
    
    _onCalendarsLoad: function (calendars, textStatus, jqXHR) {
      this._loadCalendars(calendars, this._viewStart, this._viewEnd, $.proxy(function (calendars) {
        this._calendars = calendars;
        this._createCalendarStyles();
        this._refreshVisibileEvents()
        this._miniCalendar.datepicker('refresh');
      }, this));
    },

    _onCalendarSettingsWidgetSettingsSaved: function (event) {
      var firstDay = event.settings['firstDay'];
      if (firstDay) {
        this._miniCalendar.datepicker( "option", 'firstDay', parseInt(firstDay));
      }
    },
    
    _onCalendarVisibleWidgetCalendarShow: function (event) {
      for (var i = 0, l = this._calendars.length; i < l; i++) {
        if (this._calendars[i].meta.id == event.calendarId) {
          this._calendars[i].meta.visible = true;
          break;
        }
      }
      
      this._refreshVisibileEvents();
      this._miniCalendar.datepicker('refresh');
    },
    
    _onCalendarVisibleWidgetCalendarHide: function (event) {
      for (var i = 0, l = this._calendars.length; i < l; i++) {
        if (this._calendars[i].meta.id == event.calendarId) {
          this._calendars[i].meta.visible = false;
          break;
        }
      }
      
      this._refreshVisibileEvents();
      this._miniCalendar.datepicker('refresh');
    }
  });
  
  addWidgetController('miniCalendarWidget', MiniCalendarWidgetController);
  
}).call(this);