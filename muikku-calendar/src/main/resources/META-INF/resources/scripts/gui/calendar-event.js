(function() {
 
  $(document).ready(function(){
    $('#agendaView').fullCalendar({
      defaultView : 'basicDay',
      header: false,
      timeFormat:{
        agenda: 'h:mm',
      }
    });

    loadFullCalendarEvents($('#agendaView'));
  });
  
})(this);  