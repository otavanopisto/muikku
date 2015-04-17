(function() {
  $(document).ready(function(){
    $('#fpDayEvents').fullCalendar({
      defaultView : 'basicDay',
      header: false
    });
    
    $('#fpWeekView').fullCalendar({
      defaultView : 'agendaWeek',
      header: false,
      columnFormat : {
        week : 'ddd',
      },
      contentHeight : 500
    });
  
    loadFullCalendarEvents($('#fpDayEvents'));
    loadFullCalendarEvents($('#fpWeekView'));
  });
  
})(this);