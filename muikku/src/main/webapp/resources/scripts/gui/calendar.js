(function() {
  var createDateField = function (id, name, placeholder) {
    return $('<div>') 
      .addClass('ca-field-date')
      .append($('<input>').attr({
        'placeholder': placeholder,
        'type': 'date',
        'id': id,
        'name': placeholder, 
        'required': 'required'
      }));
  };
  
  var createTimeField = function (id, name, placeholder) {
    return $('<div>') 
      .addClass('ca-field-time')
      .append($('<input>').attr({
        'placeholder': placeholder,
        'type': 'time',
        'id': id,
        'name': placeholder, 
        'required': 'required'
      }));
  };
  
  function createModalContent() { 
    return $('<div>')
      .addClass('ca-event-new')
      .append($('<div>')
        .append(createDateField('startDate', 'eventStartDate', 'alkaa'))
        .append(createTimeField('startTime', 'eventStartTime', 'alkaa'))
        .append(createDateField('endDate', 'eventEndDate', 'loppuu'))
        .append(createTimeField('endTime', 'eventEndTime', 'loppuu'))
        .append($('<div>').attr({'id': 'eventRecurrence'}))
        .append($('<div>').append($('<input>').attr({ 'placeholder': 'Tapahtuman nimi', 'name': 'eventSubject', 'required': 'required' })))
        .append($('<div>').append($('<select>').attr({'id': 'eventCalendar', 'required': 'required'}))))
      .append($('<div>').append($('<textarea>').attr({ 'placeholder': 'Tapahtuman kuvaus', 'name': 'eventContent', 'required': 'required' })));
  }
  
  $(document).ready(function(){
    $(".bt-mainFunction").m3modal({
  	  title : "Uusi tapahtuma! ",
  	  description : "Uuden tapahtuman luonti",
  	  content: createModalContent(),
  	  modalgrid : 24,
  	  contentgrid : 24,
  	  onBeforeOpen: function(modal){
  	    $('#eventRecurrence').recurrenceInput();
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
        
  	    $('.ca-event-new').on('focus', 'input', function(){
  		    var dval = this.defaultValue;
  		    var cval = $(this).val();
  		    if (dval == cval){
  		      $(this).val('');
  		    } 
  	    });
  		  
  	    $('.ca-event-new').on('blur', 'input', function(){
  		    var dval = this.defaultValue;
  		    var cval = $(this).val();
  		    if (!cval){ 
  		      $(this).val(dval);	 
  		    }        	
  	    });	 	
  
  	  },
  
  	  options: [
  //						{
  //						    caption: "Koko päivän tapahtuma",
  //							name : "whole day",
  //							type : "checkbox",
  //							action: function (e) {			
  //											}
  //						},
  //								
      ],
  	  buttons: [{
  	    caption: "Luo tapahtuma",
  	    name : "sendEvent",
  	    action: function (e) {
  	      // TODO: switch to ISO8601 date so we can specify the 
  	      // timezone more easily?
          var start = new Date($('#startDate').datepicker('getDate').getTime() + $('#startTime').timepicker('getTime').getTime());
          var end = new Date($('#endDate').datepicker('getDate').getTime() + $('#endTime').timepicker('getTime').getTime());
  	      
  	      mApi().calendar.calendars.events.create($('#eventCalendar').val(), {
  	        summary: $('input[name="eventSubject"]').val(),
  	        description: $('input[name="eventContent"]').val(),
  //	      location: calendarEvent.location,
  //	      latitude:calendarEvent.latitude,
  //	      longitude: calendarEvent.longitude,
  //	      url: calendarEvent.url,
  	        status: 'CONFIRMED',
  	        start: start,
  	        startTimeZone: 'GMT',
  	        end: end ,
  	        endTimeZone: 'GMT',
  	        allDay: false,
  //	      attendees: attendees,
  //	      reminders: calendarEvent.reminders
          }).callback(function (err, result) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              $('.notification-queue').notificationQueue('notification', 'info', "Tapahtuma luotiin onnistuneesti");
            }
  
            $('#startDate,#endDate').datepicker('destroy');
            $('#startTime,#endTime').datepicker('destroy');
            $('.md-background').fadeOut().remove();
          });
  	    }
  	  }]
    });
  
  	// TODO: What is the purpose of this script?
  	var td = new Date();
  	var tdD = td.getDate();
  	var tdDN = td.getDay();
  
  	var tdT = td.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  	
  	var tdDDiv = $(".ca-date-primary span");
    var tdNDiv = $(".ca-date-day-name span");
  	var tdTDiv = $(".ca-date-day-time span");
  	
  	tdDDiv.append(tdD);
  	tdNDiv.append("Päivä " + tdDN);
  	tdTDiv.append(tdT);
        
    $('#smallMonthCalendar').fullCalendar({
      header:{
        left: 'prev',
        center: 'title',
        right: 'next'
      },  
      titleFormat:{
        month: 'MMMM'
      }
    });    
    
	});
  
})(this);