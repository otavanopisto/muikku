(function() {
  $(document).ready(function(){
    $('#dayView').fullCalendar({
      defaultView : 'agendaDay',
      firstDay : 0,
      header: false
      
    });
    
    loadFullCalendarEvents($('#dayView'));
  });
  
})(this);  