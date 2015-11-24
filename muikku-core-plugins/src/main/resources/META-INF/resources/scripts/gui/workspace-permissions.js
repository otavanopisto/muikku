(function() {
  
  UserRolePermissionsWidgetController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      widgetElement = $(widgetElement);
      this._workspaceId = widgetElement.find("input[name='workspaceId']").val();

      widgetElement.on("click", ".userGroupPermissionsCheckbox", $.proxy(this._onToggleUserRolePermission, this));
    },
    deinitialize: function () {
    },
    _onToggleUserRolePermission: function (event) {
      var _this = this;
      
      var element = $(event.target);
      var cell = element.parents("td");
      
      var userGroupId = cell.find("input[name='userGroupId']").val();
      var permissionId = cell.find("input[name='permissionId']").val();
  
      var params = {
        'workspaceId': _this._workspaceId,
        'userGroupId': userGroupId,
        'permissionId': permissionId,
        'permitted': element.is(':checked')
      };

      mApi({async: false}).permission.workspaceUserGroupPermissions.update(params).callback(function (err, result) {
        if (err) {
          alert('Error occured while doing the operation. You may not have the necessary rights to change the permissions.');
        }
      });
    }
  });
  
  addWidgetController('userGroupPermissionsWidget', UserRolePermissionsWidgetController);

}).call(this);
