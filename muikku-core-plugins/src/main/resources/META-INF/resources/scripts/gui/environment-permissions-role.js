(function() {
  
  $(document).ready(function() {
    
    $(document).on("click", ".environmentPermissionCheckbox", function (event) {
      alert('TODO Environment role override');
//      var element = $(event.target);
//      var cell = element.closest("td");
//      
//      var userRoleId = cell.find("input[name='roleId']").val();
//      var permissionId = cell.find("input[name='permissionId']").val();
//  
//      var params = {
//        'userRoleId': userRoleId,
//        'permissionId': permissionId,
//        'permitted': element.is(':checked')
//      };
//  
//      mApi()
//        .permission
//        .environmentUserRolePermissions
//        .update(params)
//        .callback(function (err, result) {
//          if (err) {
//            $('.notification-queue').notificationQueue('notification', 'error', 'Error occured while doing the operation. You may not have the necessary rights to change the permissions.');
//          }
//        });
    });
  });
  
}).call(this);
