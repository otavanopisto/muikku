 
$(document).ready(function(){

	$('#calendarWidget').fullCalendar({
		
		  header:{
			  left: 'prev',
			  center: 'title',
			  right: 'next'
		  },	
      firstDay : 1,
		  titleFormat:{
			  month: 'MMMM'
			  
		  },
      height: 170
		  
		});
	});

