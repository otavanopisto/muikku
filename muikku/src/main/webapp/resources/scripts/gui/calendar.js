$(document).ready(function(){

  /* Create new event modal */ 
  
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
        .append($('<div>').append($('<input>').attr({ 'placeholder': 'Tapahtuman nimi', 'name': 'eventSubject', 'required': 'required' })))
        .append($('<div>').append($('<select>').attr({'id': 'eventCalendar', 'required': 'required'}))))
      .append($('<div>').append($('<textarea>').attr({ 'placeholder': 'Tapahtuman kuvaus', 'name': 'eventContent', 'required': 'required' })));
  }
  
  $(".bt-mainFunction").m3modal({
	  title : "Uusi tapahtuma! ",
	  description : "Uuden tapahtuman luonti",
	  content: createModalContent(),
	  modalgrid : 24,
	  contentgrid : 24,
	  onBeforeOpen: function(modal){
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
	      
        });
	      
	      $('.md-background').fadeOut().remove();
	    }
	
	  }]
  });

/* Dummy events */ 
	
	
	var ce = [
					{
						title: 'All Day Event',
						start: '2014-12-16'
					},
					{
						title: 'Long Event',
						start: '2014-12-16',
						end: '2014-12-28'
					},
		
//					{
//						id: 999,
//						title: 'Repeating Event',
//						start: '2014-12-16T11:00:00'
//					},
//					{
//						title: 'Meeting',
//						start: '2014-12-16T10:30:00',
//						end: '2014-12-16T12:30:00'
//					},
//					{
//						title: 'Lunch',
//						start: '2014-12-16T12:00:00'
//					},
//					{
//						title: 'Birthday Party',
//						start: '2014-12-17T07:00:00'
//					},
//					{
//						title: 'Click for Google',
//						url: 'http://google.com/',
//						start: '2014-12-28'
//					}
				];
	
	
	
//	var cLang = 'fi';
	var td = new Date();
	var tdD = td.getDate();
	var tdDN = td.getDay();

	var tdT = td.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
	
	var tdDDiv = $(".ca-date-primary span");
    var tdNDiv = $(".ca-date-day-name span");
	var tdTDiv = $(".ca-date-day-time span");
	
	function removeHeader(container){
		 var hdr = $(container).find('.fc-header');
	     hdr.remove();			
			
		}    
	
   function quickEvent(el, date){
	  var mutter = $(el);
	  
   }	
    
	
	$('#smallMonthCalendar').fullCalendar({
		
	  header:{
		  left: 'prev',
		  center: 'title',
		  right: 'next'
	  },	
	  titleFormat:{
		  month: 'MMMM'
		  
	  },
	    	  
	  
	});

	
	$('#fpDayEvents').fullCalendar({

	  defaultView : 'basicDay',  	
	  
      events :  ce
	  
	});

	removeHeader('#fpDayEvents');
	
	$('#fpWeekView').fullCalendar({

		
		
		  defaultView : 'agendaWeek',  	
		  columnFormat:{
			  week: 'ddd',
	
		  },
		  contentHeight: 500,
		  
	      events :  ce
		  
		});
	
		removeHeader('#fpWeekView');


	
	
	tdDDiv.append(tdD);
	tdNDiv.append("Päivä " + tdDN);
	tdTDiv.append(tdT);
    
	
	/* Day view */
	
	$('#dayView').fullCalendar({

		  defaultView : 'agendaDay',  	
		  
	      events :  ce
	});
	removeHeader('#dayView');	
	

	/*Week view */
	
	$('#weekView').fullCalendar({

		  defaultView : 'basicWeek',  	
		  columnFormat:{
			  week: 'ddd',
	
		  },		  
		  header:{
			  left: '',
			  center: 'title',
			  right: ''
		  },	
	      events :  ce		  
	});	

	
	/*Month view */
	
	$('#monthView').fullCalendar({

		  header:{
			  left: '',
			  center: 'title',
			  right: ''
		  },	

	      events :  ce,
	      
	      dayClick : function(date, ev, view){
	    	   quickEvent(this, date);
              
	      }	      
	});	

	
	/*Agenda view */
	
	$('#agendaView').fullCalendar({
		
		defaultView : 'basicDay',
	    events :  ce,
		timeFormat:{
		  agenda: 'h:mm',
	
		  },	    
	    
	});		
	
	removeHeader('#agendaView');
    
	});

