(function() {
  function removeHeader(container) {
    var hdr = $(container).find('.fc-header');
    hdr.remove();
  }
  
  $(document).ready(function(){
    $('#dayView').fullCalendar({
      defaultView : 'agendaDay'
    });
    
    loadFullCalendarEvents($('#dayView'));
    removeHeader('#dayView');
  });
  
})(this);  