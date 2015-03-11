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
  
    removeHeader('#fpWeekView');
    removeHeader('#fpDayEvents');
  });
  
})(this);