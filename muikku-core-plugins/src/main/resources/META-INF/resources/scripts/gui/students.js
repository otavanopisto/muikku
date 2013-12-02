
(function() {
  
  StudentsViewController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      var _this = this;

      _this._studentsContainer = $("#st-content-browser");
      _this._searchStudentsInput = $("#st-content-search-textfield");
      
      _this._searchStudentsInput.on("input", $.proxy(_this._onSearchStudentsInputChange, _this));
    },
    deinitialize: function () {
    },
    _onSearchStudentsInputChange: function (event) {
      var term = this._searchStudentsInput.val();
      var users = this._searchUsers(term);
      var _this = this;
      
      renderDustTemplate('students/student_searchresult.dust', users, function (text) {
        _this._studentsContainer.children().remove();
        _this._studentsContainer.append($.parseHTML(text));
      });
    },
    _searchUsers: function (searchTerm) {
      var _this = this;
      var users = new Array();

      RESTful.doGet(CONTEXTPATH + "/rest/users/searchUsers", {
        parameters: {
          'searchString': searchTerm
        }
      }).success(function (data, textStatus, jqXHR) {
        users = data;
      });

      return users;
    },
    _searchGroups: function (searchTerm) {
      var _this = this;
      var userGroups = new Array();

      RESTful.doGet(CONTEXTPATH + "/rest/usergroup/searchGroups", {
        parameters: {
          'searchString': searchTerm
        }
      }).success(function (data, textStatus, jqXHR) {
        for (var i = 0, l = data.length; i < l; i++) {
          userGroups.push({
            category: getLocaleText("plugin.communicator.usergroups"),
            label: data[i].name,
            id: data[i].id,
            memberCount: data[i].memberCount,
            image: undefined, // TODO usergroup image
            type: "GROUP"
          });
        }
      });

      return userGroups;
    },
    _doSearch: function (searchTerm) {
      var groups = this._searchGroups(searchTerm);
      var users = this._searchUsers(searchTerm);
      
      return $.merge(groups, users);
    },
    _split: function(val) {
      return val.split(/,\s*/);
    },
    _extractLast: function(term) {
      return this._split(term).pop();
    }
  });
  
//  addWidgetController('students', StudentsViewController);
  
  $(document).ready(function () {
    var controller = new StudentsViewController();
    controller.setup(undefined);
  });

}).call(this);