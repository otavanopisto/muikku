(function() {

  $(document).ready(function() {
    
    mApi().user.users.read()
    .callback(function (err, teachers) {

      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', err);
      } else {
        renderDustTemplate('workspace/workspace-users-teachers.dust', {teachers:teachers}, function (text) {
          $(".workspace-teachers-listing-wrapper").append($.parseHTML(text));  
        });
      }
      
    });  
    
    mApi().user.users.read()
    .callback(function (err, students) {

      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', err);
      } else {
        renderDustTemplate('workspace/workspace-users-students.dust', {students:students}, function (text) {
          $(".workspace-students-listing-wrapper").append($.parseHTML(text));
        });
      }
      
    }); 

  });
  
}).call(this);
