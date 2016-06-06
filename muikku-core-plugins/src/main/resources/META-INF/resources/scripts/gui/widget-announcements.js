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
        async.map(result, function(announcement, callback) {
          if (announcement.workspaceEntityIds.length === 0) {
            announcement.link = "announcements?announcementId=" + announcement.id;
            callback(null, announcement);
          } else {
            var workspaceEntityId = announcement.workspaceEntityIds[0];
            mApi().workspace.workspaces.read(workspaceEntityId)
              .callback(function (err, result) {
                if (err) {
                  callback(err);
                } else {
                  announcement.workspaceName = result.name;
                  announcement.link =
                    "workspace/" + result.urlName +
                    "/announcements?announcementId=" + announcement.id;
                  callback(null, announcement);
                }
              });
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
                  cont.perfectScrollbar({"suppressScrollY" : true});
            }, this));
          }
        });
      }
  }, this));
});