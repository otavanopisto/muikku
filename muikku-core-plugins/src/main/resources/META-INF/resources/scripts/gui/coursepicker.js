(function() {
  
  CoursePickerController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      widgetElement = $(widgetElement);
      this._widgetElement = widgetElement;
      this._environmentId = widgetElement.find("input[name='environmentId']").val();
      this._userId = widgetElement.find("input[name='userId']").val();
      this._allCoursesContainer = $('#allCoursesList');
      this._myCoursesContainer = $('#myCoursesList');
      
      this._initializeAllCoursesList();
  
      this._tabsContainer = widgetElement.find('.coursePickerTabs');
      this._tabsContainer.tabs();
      
      var searchAllCoursesButton = widgetElement.find('input[name="coursePickerAllCoursesFilterBtn"]');
      searchAllCoursesButton.click($.proxy(this._onSearchAllCoursesClick, this));
      
      var searchMyCoursesButton = widgetElement.find('input[name="coursePickerMyCoursesFilterBtn"]');
      if (searchMyCoursesButton) {
        searchMyCoursesButton.click($.proxy(this._onSearchMyCoursesClick, this));
      }
    },
    deinitialize: function () {
  //    var widgetElement = this._widgetElement;
  //    
  //    var searchAllCoursesButton = widgetElement.find('.coursePickerAllCoursesFilterBtn');
  //    Event.stopObserving(searchAllCoursesButton, "click", this._searchAllCoursesClickListener);
  //    
  //    var searchMyCoursesButton = widgetElement.find('.coursePickerMyCoursesFilterBtn');
  //    if (searchMyCoursesButton) {
  //      Event.stopObserving(searchMyCoursesButton, "click", this._onSearchMyCoursesClick);
  //    }
    },
    _initializeAllCoursesList: function () {
      var _this = this;
      
//      _this._myCoursesContainer.children().remove();
      
//      _this._allCoursesContainer.select('.coursePickerCourse').each(function (node) {
//        node.purge();
//        node.remove();
//      });
      
      RESTful.doGet(CONTEXTPATH + "/rest/course/listAllCourses", {
        parameters: {
          'environmentId': this._environmentId
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('coursepicker/coursepickercourse.dust', data, function (text) {
          _this._allCoursesContainer.append($.parseHTML(text));
          
          _this._allCoursesContainer.find('.coursePickerCheckOutCourseButton').click($.proxy(_this._onCheckCourseClick, _this));
        });
      });
    },
    _onSearchAllCoursesClick: function (event) {
      var _this = this;
      
      _this._myCoursesContainer.children().remove();

  //    _this._allCoursesContainer.select('.coursePickerCourse').each(function (node) {
  //      node.purge();
  //      node.remove();
  //    });
      
      RESTful.doGet(CONTEXTPATH + "/rest/course/listAllCourses", {
        parameters: {
          'environmentId': this._environmentId
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('coursepicker/coursepickercourse.dust', data, function (text) {
          _this._allCoursesContainer.append($.parseHTML(text));
          
          _this._allCoursesContainer.find('.coursePickerCheckOutCourseButton').click($.proxy(_this._onCheckCourseClick, _this));
        });
      });
    },
    _onSearchMyCoursesClick: function (event) {
      var _this = this;
      
      _this._myCoursesContainer.children().remove();
      
//      _this._myCoursesContainer.select('.coursePickerCourse').each(function (node) {
//        node.purge();
//        node.remove();
//      });
      
      RESTful.doGet(CONTEXTPATH + "/rest/course/listUserCourses", {
        parameters: {
          'environmentId': this._environmentId,
          'userId': this._userId
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('coursepicker/coursepickercourse.dust', data, function (text) {
          _this._myCoursesContainer.append($.parseHTML(text));
          
          _this._allCoursesContainer.find('.coursePickerCheckOutCourseButton').click($.proxy(_this._onCheckCourseClick, _this));
        });
      });
    },
    _onCheckCourseClick: function (event) {
      var element = $(event.target);
      var coursePickerCourse = element.parents(".coursePickerCourse");
      
      var courseId = coursePickerCourse.find("input[name='courseId']").val();
      
      window.location = CONTEXTPATH + '/course/index.jsf?courseId=' + courseId;
    }
  });
  
  addWidgetController('coursePicker', CoursePickerController);

}).call(this);