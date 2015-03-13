(function() {
  function removeHeader(container) {
    var hdr = $(container).find('.fc-header');
    hdr.remove();
  }   
  
  function quickEvent(el, date){
    var mutter = $(el);
  }  

  $(document).ready(function(){
    $('#monthView').fullCalendar({
      header : {
        left : '',
        center : 'title',
        right : ''
      },
      dayClick : function(date, ev, view) {
        quickEvent(this, date);
      }
    });
    
    loadFullCalendarEvents($('#monthView'));
    removeHeader('#monthView');
 });

})(this);