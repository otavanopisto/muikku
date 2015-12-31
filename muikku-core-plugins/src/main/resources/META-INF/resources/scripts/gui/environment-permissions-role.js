(function() {
  
  EnvironmentRolePermissionsWidgetController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      widgetElement = $(widgetElement);

      widgetElement.on("click", ".environmentPermissionCheckbox", $.proxy(this._onToggleUserRolePermission, this));
    },
    deinitialize: function () {
    },
    _onToggleUserRolePermission: function (event) {
      var _this = this;
      
      var element = $(event.target);
      var cell = element.parents("td");
      
      var userRoleId = cell.find("input[name='roleId']").val();
      var permissionId = cell.find("input[name='permissionId']").val();
  
      var params = {
        'userRoleId': userRoleId,
        'permissionId': permissionId,
        'permitted': element.is(':checked')
      };

      mApi({async: false}).permission.environmentUserRolePermissions.update(params).callback(function (err, result) {
        if (err) {
          alert('Error occured while doing the operation. You may not have the necessary rights to change the permissions.');
        }
      });
    }
  });
  
  addWidgetController('environmentRolePermissionsWidget', EnvironmentRolePermissionsWidgetController);

}).call(this);
