(function() {
  
  function getFeedItemController(item) {
    var controllerClass = window._wallEntryControllers[item.type];
    return new controllerClass();
  }
  
  $(document).on('wall_newWallEntry', function (event, data) {
    $('.wallWidget>input[name="wallId"]').each(function (index, wallId) {
      if ($(wallId).val() == data.wallId) {
        var item = {
          type: 'wallEntries',
          entry: data.newEntryData
        };
        
        getFeedItemController(item).render(item, function (renderErr, html) {
          if (renderErr) {
            $('.notification-queue').notificationQueue('notification', 'error', renderErr);  
          } else {
            $(wallId).closest('.wallWidget').find('.wallEntries').prepend(html); 
          }
        });
      }
    });
  });
  
  $(document).ready(function () {
    var wallId = $('.wallWidget>input[name="wallId"]').val();
    
    mApi({async: false}).wall.walls.feed.read(wallId)
      .on('$', function (item, itemCallback) {
        mApi({async: false}).wall.walls[item.type].read(wallId, item.identifier).callback(function (entryErr, entry) {
          if (entryErr) {
            $('.notification-queue').notificationQueue('notification', 'error', entryErr);
          } else {
            item.entry = entry;
            itemCallback();
          }
        });   
      })
      .callback(function (err, result) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          for (var i = 0, l = result.length; i < l; i++) {
            var item = result[i];
            getFeedItemController(item).render(item, function (renderErr, html) {
              if (renderErr) {
                $('.notification-queue').notificationQueue('notification', 'error', renderErr);  
              } else {
                $('.wallEntries').append(html); 
              }
            });
          }
        }
      });
  });
  
}).call(this);

WallEntryController = $.klass({
  render: function (data) {
  }
});

function addWallEntryController(wallEntryName, controllerClass) {
  if (!window._wallEntryControllers)
    window._wallEntryControllers = {};
  window._wallEntryControllers[wallEntryName] = controllerClass;
}
