(function() {
  
  $(document).ready(function() {
    $(document).on("click", ".workspaceRolePermissionsCheckbox", function (event) {
      alert('TOOD Implement workspace role permission override');
      /*
      var element = $(event.target);
      var cell = element.closest("td");
      
      var workspaceId = $(element).closest('.workspaceRolePermissionsWidget').find("input[name='workspaceId']").val();
      var userRoleId = cell.find("input[name='roleId']").val();
      var permissionId = cell.find("input[name='permissionId']").val();
  
      var params = {
        'workspaceId': workspaceId,
        'userRoleId': userRoleId,
        'permissionId': permissionId,
        'permitted': element.is(':checked')
      };
  
      mApi()
        .permission
        .workspaceUserRolePermissions
        .update(params)
        .callback(function (err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', 'Error occured while doing the operation. You may not have the necessary rights to change the permissions.');
          }
        });
      */
    });
  });

}).call(this);
