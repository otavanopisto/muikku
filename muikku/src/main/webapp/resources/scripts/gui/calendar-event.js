(function() {
  function removeHeader(container) {
    var hdr = $(container).find('.fc-header');
    hdr.remove();
  }

  $(document).ready(function(){
    $('#agendaView').fullCalendar({
      defaultView : 'basicDay',
      timeFormat:{
        agenda: 'h:mm',
      }
    });   
    
    removeHeader('#agendaView');
  });
  
})(this);  