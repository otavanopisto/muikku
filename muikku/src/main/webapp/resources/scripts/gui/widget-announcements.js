 
$(document).ready(function(){
  var cont = $('.wi-announcements');
  
  mApi()
  .announcer
  .announcements
  .read()
  .callback($.proxy(function(err, result) {
      if (err) {
        $(".notification-queue").notificationQueue(
            'notification',
            'error',
            err);
      } else {
        renderDustTemplate(
            'announcer/announcer_widget_items.dust',
            result,
            $.proxy(function (text) {
              var element = $(text);
              cont.append(element);
              cont.perfectScrollbar({"suppressScrollY" : true});
              
              
            }, this));

      }

  }, this));
   
});
 	
