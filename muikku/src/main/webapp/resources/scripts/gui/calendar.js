 
$(document).ready(function(){

//	
//    mApi().calendar.calendars.read().callback(function (err, result) {
//
//    });
  	

    	

/* Create new event modal */ 
	
	$(".bt-mainFunction").m3modal({
	        		title : "Uusi tapahtuma! ",
	        		description : "Uuden tapahtuman luonti",
	        		content: $('<div class="ca-event-new"><div><div class="ca-field-date"><input value="alkaa" type="textfield" id="startDate" name="eventStartDate"></input></div><div class="ca-field-time"><input value="alkaa" type="textfield" id="startTime" name="eventStartTime"></input></div><div class="ca-field-date"><input value="loppuu" type="textfield" id="endDate" name="eventStartDate"></input></div><div class="ca-field-time"><input value="loppuu" type="textfield" id="endTime" class="ca-field-date" name="eventStartDate"></input></div><div><input type="textfield" value="Tapahtuman nimi" name="eventSubject"></input></div></div><div><textarea value="Tapahtuman kuvaus" name="eventContent"></textarea></div></div>'),
	        		modalgrid : 24,
	        		contentgrid : 24,
	     		    onBeforeOpen: function(modal){



	     		    	
	     		    	$('#startDate').datepicker();
	     		    	$('#endDate').datepicker();

	     		    	$('#startTime').timepicker();
	     		    	$('#endTime').timepicker();	     		    	
	     		    	
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
		     		    	 
		     		         if (!cval ){ 
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
	            		
	        	    buttons: [
	        		  {
	        		    caption: "Luo tapahtuma",
	        		    name : "sendEvent",
	        		    action: function (e) {
	        		    	
	        		    	mApi().
	        		    	
	        		        mApi().calendar.calendars.events.create(calendarId, {
	        		            calendarId: paska,
	        		            summary: 'Vittu mitä faindain homoilua',
	        		            description: 'Mitää elä viiitti',
//	        		            location: calendarEvent.location,
//	        		            latitude:calendarEvent.latitude,
//	        		            longitude: calendarEvent.longitude,
//	        		            url: calendarEvent.url,
//	        		            status: 'CONFIRMED',
	        		            start: new Date(),
	        		            startTimeZone: GMT,
	        		            end: new Date(),
	        		            endTimeZone: GMT,
	        		            allDay: 'false',
//	        		            attendees: attendees,
//	        		            reminders: calendarEvent.reminders
	        		          }).callback(function (err, result) {
	        		            });
	        		        
	        		        
	        	            $('.md-background').fadeOut().remove();
	        		        
	        		        
	        		    }
	
	        		  }
	        		]
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

