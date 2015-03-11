(function() {
  function removeHeader(container) {
    var hdr = $(container).find('.fc-header');
    hdr.remove();
  }
  
  $(document).ready(function(){
    $('#fpDayEvents').fullCalendar({
      defaultView : 'basicDay'
    });
    
    $('#fpWeekView').fullCalendar({
      defaultView : 'agendaWeek',
      columnFormat : {
        week : 'ddd',
      },
      contentHeight : 500
    });
  
    loadFullCalendarEvents($('#fpDayEvents'));
    loadFullCalendarEvents($('#fpWeekView'));
    
    removeHeader('#fpWeekView');
    removeHeader('#fpDayEvents');
  });
  
})(this);