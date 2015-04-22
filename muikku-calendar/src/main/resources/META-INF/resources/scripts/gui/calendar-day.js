(function() {
  $(document).ready(function(){
    $('#dayView').fullCalendar({
      defaultView : 'agendaDay',
      header: false
    });
    
    loadFullCalendarEvents($('#dayView'));
  });
  
})(this);  