UserRolePermissionsWidgetController = Class.create(WidgetController, {
  initialize: function () {
    this._togglePermissionClickListener = this._onToggleUserRolePermission.bindAsEventListener(this);
  },
  setup: function (widgetElement) {
    var _this = this;
    this._context = widgetElement.down("input[name='context']").value;
    this._contextId = widgetElement.down("input[name='contextId']").value;
    
    widgetElement.select('.userRolePermissionsCheckbox').forEach(function (box) {
      Event.observe(box, 'click', _this._togglePermissionClickListener);
    });
  },
  deinitialize: function () {
    var _this = this;
    widgetElement.select('.userRolePermissionsCheckbox').forEach(function (box) {
      Event.stopObserving(box, 'click', _this._togglePermissionClickListener);
    });
  },
  _onToggleUserRolePermission: function (event) {
    var _this = this;
    
    var element = Event.element(event);
    var cell = element.up("td");
    
    var userRoleId = cell.down("input[name='userRoleId']").value;
    var permissionId = cell.down("input[name='permissionId']").value;

    var path = "";
    var params = {
      'userRoleId': userRoleId,
      'permissionId': permissionId
    };
    switch (this._context) {
      case "RESOURCE":
        path = element.checked == true ? "/rest/permission/addResourceUserRolePermission" : "/rest/permission/deleteResourceUserRolePermission";
        params["resourceRightsId"] = _this._contextId;
      break;
      case "COURSE":
        path = element.checked == true ? "/rest/permission/addCourseUserRolePermission" : "/rest/permission/deleteCourseUserRolePermission";
        params["courseId"] = _this._contextId;
      break;
      case "ENVIRONMENT":
        path = element.checked == true ? "/rest/permission/addEnvironmentUserRolePermission" : "/rest/permission/deleteEnvironmentUserRolePermission";
        params["environmentId"] = _this._contextId;
      break;
      
      default:
        return;
    }
    
    RESTful.doPost(CONTEXTPATH + path, {
      parameters: params,
      onSuccess: function (response) {
//        _this._fullCalendar.redraw();
//        var events = response.responseJSON;
//        for (var i = 0, l = events.length; i < l; i++) {
//          var event = events[i];
//          _this._addEvent(event.id, event.name, event.startTime, event.endTime);
//        }
      }
    });
  }
});

addWidgetController('userRolePermissionsWidget', UserRolePermissionsWidgetController);