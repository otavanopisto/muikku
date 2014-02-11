
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
      var _this = this;
      
      if (this._timer)
        clearTimeout(this._timer);
      
      this._timer = setTimeout(function() {
        var term = _this._searchStudentsInput.val();
        _this._searchUsers(term);
      }, 500);
    },
    _searchUsers: function (searchTerm) {
      var _this = this;

      if (_this.xhr)
        _this.xhr.abort();
      _this.xhr = $.ajax({
        url : CONTEXTPATH + "/rest/users/searchUsers",
        dataType : "json",
        data : {
          searchString : searchTerm
        },
        headers: {
          "Accept-Language": getLocale()
        },
        accepts: {
          'json' : 'application/json'
        },
        success : function(data) {
          renderDustTemplate('students/student_searchresult.dust', data, function (text) {
            _this._studentsContainer.children().remove();
            _this._studentsContainer.append($.parseHTML(text));
          });
        }
      });
      
//      RESTful.doGet(CONTEXTPATH + "/rest/users/searchUsers", {
//        parameters: {
//          'searchString': searchTerm
//        }
//      }).success(function (data, textStatus, jqXHR) {
//        users = data;
//      });

//      return users;
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