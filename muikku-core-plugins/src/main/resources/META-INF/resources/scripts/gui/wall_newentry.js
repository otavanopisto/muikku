(function() {
  
  $(document).on('click', '.newWallEntry input[name="newWallEntryButton"]', function () {
    var wallId = $(this).closest('.newWallEntry').find('input[name="wallId"]').val();
    var text = $(this).closest('.newWallEntry').find('input[name="newWallEntryText"]').val();
      
    mApi({async: false}).wall.walls.wallEntries.create(wallId, {
      visibility: "PUBLIC",
      text: text,
      archived: false
    }).callback($.proxy(function (err, result) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', err);
      } else {
        $(document).trigger('wall_newWallEntry', {
          wallId: wallId,
          newEntryData: result
        });
      }
    }));
    
  });

}).call(this);
