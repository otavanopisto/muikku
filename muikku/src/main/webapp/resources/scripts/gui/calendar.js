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
      var sendEvent = function(){
        var startDate = $('#startDate').datepicker('getDate');
        var startISO = getISODateTime(startDate, $('#startTime').timepicker('getTime'));
        var endISO = getISODateTime($('#endDate').datepicker('getDate'), $('#endTime').timepicker('getTime'));
        var recurrence = $('#eventRecurrence').recurrenceInput("rrule");

        mApi().calendar.calendars.events.create($('#eventCalendar').val(), {
          summary: $('input[name="eventSubject"]').val(),
          description: $('input[name="eventContent"]').val(),
          recurrence: recurrence,
//        location: calendarEvent.location,
//        latitude:calendarEvent.latitude,
//        longitude: calendarEvent.longitude,
//        url: calendarEvent.url,
          status: 'CONFIRMED',
          start: startISO,
          startTimeZone: 'GMT',
          end: endISO ,
          endTimeZone: 'GMT',
          allDay: false,
//        attendees: attendees,
//        reminders: calendarEvent.reminders
        }).callback(function (err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            window.location.reload(true);
          }
        });        
      }
      
      var formParams = function(){
        
        // Get the user calendars and append them to select field
        
        mApi().calendar.calendars.read().callback($.proxy(function (err, calendars) {
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
        
//        $('.ca-event-new').on('focus', 'input', function(){
//          var dval = this.defaultValue;
//          var cval = $(this).val();
//          if (dval == cval){
//            $(this).val('');
//          } 
//        });
        
      }
      
      openInSN('/calendar/calendar_create_event.dust', null, sendEvent, formParams);    
      
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

