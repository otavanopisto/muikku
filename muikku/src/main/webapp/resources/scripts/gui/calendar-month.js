(function() {
  function quickEvent(el, date){
    var mutter = $(el);
  }  

  $(document).ready(function(){
    $('#monthView').fullCalendar({
      header: false,
      dayClick : function(date, ev, view) {
        quickEvent(this, date);
      }
    });
    
    loadFullCalendarEvents($('#monthView'));
 });

})(this);