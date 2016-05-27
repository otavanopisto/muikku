$(document).ready(function(){
  var cont = $('#announcements');

  mApi()
  .announcer
  .announcements
  .read({onlyActive: "true", onlyMine: "true", hideWorkspaceAnnouncements: "false"})
  .callback($.proxy(function(err, result) {
      if (err) {
        $(".notification-queue").notificationQueue(
            'notification',
            'error',
            err);
      } else {
        renderDustTemplate('announcer/announcer_widget_items.dust', result, $.proxy(function (text) {
              var element = $(text);
              cont.append(element);
              cont.perfectScrollbar({"suppressScrollY" : true});
            }, this));

      }

  }, this));
   
});