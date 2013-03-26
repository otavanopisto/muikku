EnvironmentUsersWidgetController = Class.create(WidgetController, {
  initialize: function () {
  },
  setup: function (widgetElement) {
    var _this = this;
    this._widgetElement = widgetElement;

    // TODO: tarvittu?
    this._environmentId = widgetElement.down("input[name='environmentId']").value;

    this._tabsContainer = widgetElement.down('.userManagementTabs');
    this._tabControl = new S2.UI.Tabs(this._tabsContainer);
    
//    widgetElement.select('.environmentUserRolePermissionsCheckbox').forEach(function (box) {
//      Event.observe(box, 'click', _this._toggleUserRolePermission);
//    });
    
    this._loadUsers();
  },
  deinitialize: function () {
    var _this = this;
//    widgetElement.select('.environmentUserRolePermissionsCheckbox').forEach(function (box) {
//      Event.stopObserving(box, 'click', _this._toggleUserRolePermission);
//    });
    
    
  },
  _toggleUserRolePermission: function (event) {
//    var _this = this;
    
    var element = Event.element(event);
    var cell = element.up("td");
    
    var userRoleId = cell.down("input[name='userRoleId']").value;
    var permissionId = cell.down("input[name='permissionId']").value;

    var path = element.checked == true ? "/rest/permission/addEnvironmentUserRolePermission" : "/rest/permission/deleteEnvironmentUserRolePermission";
    
    RESTful.doPost(CONTEXTPATH + path, {
      parameters: {
        'userRoleId': userRoleId,
        'permissionId': permissionId
      },
      onSuccess: function (response) {
//        _this._fullCalendar.redraw();
//        var events = response.responseJSON;
//        for (var i = 0, l = events.length; i < l; i++) {
//          var event = events[i];
//          _this._addEvent(event.id, event.name, event.startTime, event.endTime);
//        }
      }
    });
  },
  _representUser: function (event) {
    var element = Event.element(event);
    var envUserElement = element.up(".environmentUser");
    var userId = envUserElement.down("input[name='userId']").value;
    
    $('representForm:userId').value = userId;
    $('representForm:representButton').click();
    
    /**
    RESTful.doPost(CONTEXTPATH + "/rest/user/representUser", {
      parameters: {
        'environmentUserId': userId
      },
      onSuccess: function (response) {
        alert('hep');
      }
    });
    **/
  },
  _addUser: function (id, firstName, lastName, email, roleName) {
    var e = new Element("div");
    e.update(firstName + " " + lastName + " " + roleName);
    
    var f = new Element("div");
    var g = new Element("a", { href: "#" });
    g.update("Edusta");
    
    Event.observe(g, 'click', this._representUser);
    f.appendChild(g);
    
    var a = new Element("div", { className: "environmentUser" });
    a.appendChild(new Element("input", { type: "hidden", name: "userId", value: id }));
    a.appendChild(e);
    a.appendChild(f);
    
    this._widgetElement.down(".environmentUsersWidgetTable").appendChild(a);
  },
  _loadUsers: function () {
    var _this = this;
    RESTful.doGet(CONTEXTPATH + "/rest/user/listEnvironmentUsers", {
      parameters: {
      },
      onSuccess: function (response) {
        var users = response.responseJSON;
        for (var i = 0, l = users.length; i < l; i++) {
          var user = users[i];
          _this._addUser(user.id, user.user.firstName, user.user.lastName, user.user.email, user.role.name);
        }
      }
    });
  }
});

addWidgetController('environmentUsersWidget', EnvironmentUsersWidgetController);