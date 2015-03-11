(function() {
  function removeHeader(container) {
    var hdr = $(container).find('.fc-header');
    hdr.remove();
  }
  
  $(document).ready(function(){
    $('#weekView').fullCalendar({
      defaultView : 'basicWeek',
      columnFormat : {
        week : 'ddd'
      },
      header : {
        left : '',
        center : 'title',
        right : ''
      }
    });
    
    loadFullCalendarEvents($('#weekView'));
    removeHeader($('#weekView'));
  });

})(this);