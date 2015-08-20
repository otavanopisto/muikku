(function() {
  $(document).ready(function(){
    $('#fpDayEvents').fullCalendar({
      defaultView : 'basicDay',
      firstDay : 1,
      header: false,
    });
    
    $('#fpWeekView').fullCalendar({
      defaultView : 'agendaWeek',
      header: false,
      firstDay : 1,
      columnFormat : {
        week : 'ddd',
      },
      height : 500
    });
  
    loadFullCalendarEvents($('#fpDayEvents'));
    loadFullCalendarEvents($('#fpWeekView'));
  });
  
})(this);