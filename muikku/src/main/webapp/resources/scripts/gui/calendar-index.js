(function() {
  $(document).ready(function(){
    $('#fpDayEvents').fullCalendar({
      defaultView : 'basicDay',
      timeFormat : 'HH', 
      firstDay : 1,
      header: false,
      lang : _MUIKKU_LOCALE,
      viewRender: function(view, element) {
        element.find('.fc-day-header').html('');
       }
    });
    
    $('#fpWeekView').fullCalendar({
      defaultView : 'agendaWeek',
      header: false,
      firstDay : 1,
      columnFormat : {
        week : 'ddd',
      },
      height : 500,
      lang : _MUIKKU_LOCALE,
    });
  
    loadFullCalendarEvents($('#fpDayEvents'));
    loadFullCalendarEvents($('#fpWeekView'));
  });
  
})(this);