$(document).ready(function(){
  var cont = $('#announcements');

  mApi()
  .announcer
  .announcements
  .read({ hideWorkspaceAnnouncements: "false" })
  .callback($.proxy(function(err, result) {
      if (err) {
        $(".notification-queue").notificationQueue(
            'notification',
            'error',
            err);
      } else {
        async.map(result, function(announcement, callback) {
          if (announcement.workspaceEntityIds.length === 0) {
            announcement.link = "announcements?announcementId=" + announcement.id;
            callback(null, announcement);
          } else {
            var workspaceNames = $.map(announcement.workspaces, function(workspace) {
              return workspace.name;
            });
            announcement.workspaceName = workspaceNames.join(", ");

            var workspace = announcement.workspaces[0];
            if (workspace) {
              announcement.link = "workspace/" + workspace.urlName +
                "/announcements?announcementId=" + announcement.id;
            }
            callback(null, announcement);
          }
        },
        function(err, result) {
          if (err) {
            $(".notification-queue").notificationQueue(
                'notification',
                'error',
                err);
          } else {
            renderDustTemplate('announcer/announcer_widget_items.dust', result, $.proxy(function (text) {
              cont.html(text);
              var is_xs = $(window).width() < 769;
              if (!is_xs) {
                cont.perfectScrollbar({
                  wheelSpeed:3,
                  swipePropagation:false,
                  wheelPropagation:true
                });
              }
            }, this));
          }
        });
      }
  }, this));
});