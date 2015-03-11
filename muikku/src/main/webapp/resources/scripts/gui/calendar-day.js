(function() {
  function removeHeader(container) {
    var hdr = $(container).find('.fc-header');
    hdr.remove();
  }
  
  $(document).ready(function(){
    $('#dayView').fullCalendar({
      defaultView : 'agendaDay'
    });
    
    removeHeader('#dayView');
  });
  
})(this);  