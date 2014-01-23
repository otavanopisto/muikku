(function() {
  
  UserRolePermissionsWidgetController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      widgetElement = $(widgetElement);
      this._context = widgetElement.find("input[name='context']").val();
      this._contextId = widgetElement.find("input[name='contextId']").val();

      widgetElement.on("click", ".userRolePermissionsCheckbox", $.proxy(this._onToggleUserRolePermission, this));
    },
    deinitialize: function () {
    },
    _onToggleUserRolePermission: function (event) {
      var _this = this;
      
      var element = $(event.target);
      var cell = element.parents("td");
      
      var userRoleId = cell.find("input[name='userRoleId']").val();
      var permissionId = cell.find("input[name='permissionId']").val();
  
      var path = "";
      var params = {
        'userRoleId': userRoleId,
        'permissionId': permissionId
      };
      switch (this._context) {
        case "RESOURCE":
          path = element.is(':checked') ? "/rest/permission/addResourceUserRolePermission" : "/rest/permission/deleteResourceUserRolePermission";
          params["resourceRightsId"] = _this._contextId;
        break;
        case "WORKSPACE":
          path = element.is(':checked') ? "/rest/permission/addWorkspaceUserRolePermission" : "/rest/permission/deleteWorkspaceUserRolePermission";
          params["workspaceId"] = _this._contextId;
        break;
        case "ENVIRONMENT":
          path = element.is(':checked') ? "/rest/permission/addEnvironmentUserRolePermission" : "/rest/permission/deleteEnvironmentUserRolePermission";
        break;
        
        default:
          return;
      }

      RESTful.doPost(CONTEXTPATH + path, {
        parameters: params
      }).success(function (data, textStatus, jqXHR) {
      });
    }
  });
  
  addWidgetController('userRolePermissionsWidget', UserRolePermissionsWidgetController);

}).call(this);
