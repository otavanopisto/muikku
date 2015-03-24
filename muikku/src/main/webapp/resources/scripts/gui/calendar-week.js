(function() {
  $(document).ready(function(){
    $('#weekView').fullCalendar({
      defaultView : 'basicWeek',
      columnFormat : {
        week : 'ddd'
      },
      header: false
    });
    
    loadFullCalendarEvents($('#weekView'));
  });

})(this);