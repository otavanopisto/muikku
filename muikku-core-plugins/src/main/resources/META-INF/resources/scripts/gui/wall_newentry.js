(function() {
  
  $(document).ready(function () {
    
    $('.newWallEntry input[name="newWallEntryButton"]').click(function () {
      var wallId = $(this).closest('.newWallEntry').find('input[name="wallId"]').val();
      var text = $(this).closest('.newWallEntry').find('input[name="newWallEntryText"]').val();
        
      mApi().wall.walls.wallEntries.create(wallId, {
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
   
  });

}).call(this);
