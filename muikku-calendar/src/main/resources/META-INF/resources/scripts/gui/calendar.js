(function() {
  
  $.widget("custom.calendar", {
    options: {
      userEntityId: null
    },
    
    _create : function() {
        this._loadCalendarEvents();
        this.element.on('click', '.ca-create-event', $.proxy(this._onCreateClick, this));
        // TODO: What is the purpose of this script?
        var td = new Date();
        var tdD = td.getDate();
        var loc = _MUIKKU_LOCALE;
        
  //      var tdDN = td.getDay();
      
        var tdT = td.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
        
        var tdDDiv = $(".ca-date-primary span");
        var tdNDiv = $(".ca-date-day-name span");
        var tdTDiv = $(".ca-date-day-time span");
        
        tdDDiv.append(tdD);
        tdNDiv.append(moment().format("dddd"));
        tdTDiv.append(moment().format("HH:mm"));   
     
    },
    
    _onCreateClick : function(){

      var sendEvent = function(values){
        
       
        
        var eventStart = moment(values.startDate + " " + values.startTime, 'D.MM.YYYY HH:mm').format();    
        var eventStop = moment(values.endDate + " " + values.endTime, 'D.M.YYYY HH:mm').format();
        var calendarId = values.eventCalendar; 
        var recurrence = $('#eventRecurrence').recurrenceInput("rrule");
        
         delete values.startDate;
         delete values.startTime;
         delete values.endDate;
         delete values.endTime;
         delete values.eventCalendar;
         delete values.recurrenceFreq;
         delete values.recurrenceInterval;
         delete values.recurrenceCount;
         delete values.recurrenceUntil;
         delete values.recurrenceObject;
         delete values.endRecurrence;
         delete values.repeatable;
         
         if(values.recurrenceInputWeekday){
           delete values.recurrenceInputWeekday;
         }
         if(values.allDay == 'on'){
           delete values.allDay;         
           values.allDay = 'true';
         }else{
           delete values.allDay;           
           values.allDay = 'false';           
         }         
         var timezone = jstz.determine().name();
         
         values.recurrence = recurrence;
         values.start = eventStart;
         values.end = eventStop;
         values.status = 'CONFIRMED';
         values.startTimeZone = timezone;
         values.endTimeZone = timezone;        
         

////      location: calendarEvent.location,
////      latitude:calendarEvent.latitude,
////      longitude: calendarEvent.longitude,
////      url: calendarEvent.url,
////      attendees: attendees,
////      reminders: calendarEvent.reminders
        
        mApi({async: false}).calendar.calendars.events.create(calendarId, values).callback(function (err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            window.location.reload(true);
          }
        });        
      }

      var formContentFunctions = function(){
        
     
        var locale = getLocale().toLowerCase();
        var dpRegional = $.datepicker.regional[locale] || $.datepicker.regional[''];
        $.datepicker.setDefaults(dpRegional);        
        $('#eventRecurrence.recurrence-input').recurrenceInput('destroy');
        $('#eventRecurrence').recurrenceInput({
          texts: {
            label: getLocaleText('plugin.calendar.recurrenceInput.label'),
            freq: {
              "SECONDLY": getLocaleText('plugin.calendar.recurrenceInput.freqSecondly'),
              "MINUTELY": getLocaleText('plugin.calendar.recurrenceInput.freqMinutely'),
              "DAILY": getLocaleText('plugin.calendar.recurrenceInput.freqDaily'),
              "WEEKLY": getLocaleText('plugin.calendar.recurrenceInput.freqWeekly'),
              "MONTHLY": getLocaleText('plugin.calendar.recurrenceInput.freqMonthly'),
              "YEARLY": getLocaleText('plugin.calendar.recurrenceInput.freqYearly')
            },
            notRepeating: getLocaleText('plugin.calendar.recurrenceInput.notRepeating'),
            intervalLabel: getLocaleText('plugin.calendar.recurrenceInput.intervalLabel'),
            intervalDays: getLocaleText('plugin.calendar.recurrenceInput.intervalDays'),
            weekdaysLabel: getLocaleText('plugin.calendar.recurrenceInput.weekdaysLabel'),
            intervalWeeks: getLocaleText('plugin.calendar.recurrenceInput.intervalWeeks'),
            intervalMonths: getLocaleText('plugin.calendar.recurrenceInput.intervalMonths'),
            yearLabel: getLocaleText('plugin.calendar.recurrenceInput.yearLabel'),
            intervalYears: getLocaleText('plugin.calendar.recurrenceInput.intervalYears'),
            recurrenceLabel: getLocaleText('plugin.calendar.recurrenceInput.recurrenceLabel'),
            recurrenceNever: getLocaleText('plugin.calendar.recurrenceInput.recurrenceNever'),
            recurrenceOccurrencesLabel: getLocaleText('plugin.calendar.recurrenceInput.recurrenceOccurrencesLabel'),
            recurrenceOccurrences: getLocaleText('plugin.calendar.recurrenceInput.recurrenceOccurrences'),
            recurrenceUntilLabel: getLocaleText('plugin.calendar.recurrenceInput.recurrenceUntilLabel'),
            recurrenceUntil: getLocaleText('plugin.calendar.recurrenceInput.recurrenceUntil'),
            dayNamesShort: dpRegional.dayNamesShort
          }
        });       
        
        // Get the user calendars and append them to select field
        
        mApi({async: false}).calendar.calendars.read().callback($.proxy(function (err, calendars) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
           $('#eventCalendar option').remove();
            for (var i = 0, l = calendars.length; i < l; i++) {
              var calendar = calendars[i];
              $('#eventCalendar').append($('<option>').attr('value', calendar.id).text(calendar.summary));
            }
          }
        }));
        
        // Date and timepickers for start and end time/date
        
        var start = new Date();
        start.setMinutes(0);
        start.setHours(start.getHours() + 1);
        var end = new Date(start.getTime());
        end.setHours(end.getHours() + 1);
        
        $('#startDate')
          .datepicker()
          .datepicker('setDate', start);
        $('#startTime')
          .timepicker()
          .timepicker('setTime', start);
        
        $('#endDate')
          .datepicker()
          .datepicker('setDate', end);
        $('#endTime').timepicker()
          .timepicker()
          .timepicker('setTime', end);
        
        $('input[name="repeatable"]').click(function () {
          if ($(this).is(':checked')){          
  
  
              $('#eventRecurrence').recurrenceInput('show');
            } else {
              $('#eventRecurrence').hide();;      
  
              $('#eventRecurrence').recurrenceInput('rrule', null);  
              $('#eventRecurrence').recurrenceInput('hide');  
            }
        });
 
        $('input[name="allDay"]').click(function () {
          var timeInputs = $('.mf-textfield-time').parent('.mf-textfield-subelement');
          if ($(this).is(':checked')){          
              timeInputs.hide();
            } else {
              timeInputs.show();
            }
          });
        
        
        $('#eventRecurrence').on("show", function () {
          $('input[name="repeatable"]')
            .attr("checked", "checked")
            .prop("checked", "checked");
        });
        
        $('#eventRecurrence').on("hide", function () {
          if ($(this).recurrenceInput('rrule')) {
            $('input[name="repeatable"]')
              .attr("checked", "checked")
              .prop("checked", "checked");
          } else {
            $('input[name="repeatable"]')
              .removeAttr("checked")
              .prop("checked", false);
          }
        });
        
      }
      var cke = false;
      openInSN('/calendar/calendar_create_event.dust', null, sendEvent, formContentFunctions, cke);    
      
    },
    
    
   _loadCalendarEvents : function(){

     window.loadFullCalendarEvents = function (element) {
       var view = $(element).fullCalendar('getView');
       var calendarIds = $(element).attr('data-user-calendar-ids').split(',');
       var batchCalls = {};
       var viewStart = view.start;
       var viewEnd = view.end;
         
       var calls = $.map(calendarIds, function (calendarId) {
         return mApi().calendar.calendars.events.read(parseInt(calendarId), {
           timeMin: viewStart.toISOString(),
           timeMax: viewEnd.toISOString()
         });
       });
       
       mApi().batch(calls)
         .callback(function (err, results) {
           if (err) {
             $('.notification-queue').notificationQueue('notification', 'error', err);
           } else {
             var events = [];

             $.each(results, function (index, result) {
               events = $.merge(events, $.map(result, function (event) {
                 if (event.recurrence) {
                   var rule = new RRule($.extend(RRule.fromString(event.recurrence).origOptions, { dtstart: new Date(event.start) }));
                   return $.map(rule.between(viewStart, viewEnd), function (date) {
                     return {
                       title: event.summary,
                       start: date,
                       end: new Date(date.getTime() + (event.end - event.start)),
                       allDay: true,
                       allDay: event.allDay,
                       editable: false
                     };
                   });
                 } else {
                   return {
                     title: event.summary,
                     start: new Date(event.start),
                     end: new Date(event.end),
                     allDay: event.allDay,
                     editable: false
                   };
                 }
               }));
             });
             
             $(element).fullCalendar('removeEvents');
             $(element).fullCalendar("addEventSource", {
               events: events
             });          
           }
         });
     };
     
     
   },
   });
  
  $(document).ready(function(){

    $('.mf-content-master').calendar({
      userEntityId: MUIKKU_LOGGED_USER_ID
    });    
    
    $('#smallMonthCalendar').fullCalendar({
      header:{
        left: 'prev',
        center: 'title',
        right: 'next'
      },  
      firstDay : 1,
      titleFormat:{
        month: 'MMMM'
      },
      lang : _MUIKKU_LOCALE,
      height: 209
    }); 
    
    
    
  });
  
 

}).call(this);

