(function() {
//  function quickEvent(el, date){
//    var mutter = $(el);
//  }  

  $(document).ready(function(){
    $('#monthView').fullCalendar({
      header: false,
//      dayClick : function(date, ev, view) {
//        quickEvent(this, date);
//      }
      dayClick: function(date, jsEvent, view) {

        alert('Clicked on: ' + date.format());

        alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);

        alert('Current view: ' + view.name);

        // change the day's background color just for fun
        $(this).css('background-color', 'red');

      },      
    });
    
    loadFullCalendarEvents($('#monthView'));
 });

})(this);