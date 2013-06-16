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
      
      var coursePickerAllCoursesSearchBtn = widgetElement.find(".cp-allCourses-searchBtn");
      coursePickerAllCoursesSearchBtn.click($.proxy(this._onSearchAllCoursesClick, this));

      var filterAllCoursesButton = widgetElement.find('input[name="cp-allCourses-filterBtn"]');
      filterAllCoursesButton.click($.proxy(this._onFilterAllCoursesClick, this));
      
      var searchMyCoursesButton = widgetElement.find('.cp-myCourses-searchBtn');
      if (searchMyCoursesButton) {
        searchMyCoursesButton.click($.proxy(this._onSearchMyCoursesClick, this));
      }
      
      var filterPopup = widgetElement.find(".cp-allCourses-filterSelector-popup");
      filterPopup.find(".cp-filterSelection").click($.proxy(this._onSelectAllCoursesFilterClick, this));
      
      var filterList = widgetElement.find(".cp-allCourses-filterList");
      filterList.on("click", ".cp-filterRemoveBtn", $.proxy(this._onRemoveAllCoursesFilterClick, this));

      this._allCoursesContainer.on("click", ".cp-attendCourse-button", $.proxy(this._onJoinCourseClick, this));
      this._allCoursesContainer.on("click", ".cp-checkOutCourse-button", $.proxy(this._onCheckCourseClick, this));
      this._allCoursesContainer.on("click", ".cp-courseName", $.proxy(this._onCourseNameClick, this));

      this._myCoursesContainer.on("click", ".cp-attendCourse-button", $.proxy(this._onJoinCourseClick, this));
      this._myCoursesContainer.on("click", ".cp-checkOutCourse-button", $.proxy(this._onCheckCourseClick, this));
      this._myCoursesContainer.on("click", ".cp-courseName", $.proxy(this._onCourseNameClick, this));
    },
    deinitialize: function () {
  //    var widgetElement = this._widgetElement;
  //    
  //    var searchAllCoursesButton = widgetElement.find('.cp-allCourses-FilterBtn');
  //    Event.stopObserving(searchAllCoursesButton, "click", this._searchAllCoursesClickListener);
  //    
  //    var searchMyCoursesButton = widgetElement.find('.cp-myCourses-FilterBtn');
  //    if (searchMyCoursesButton) {
  //      Event.stopObserving(searchMyCoursesButton, "click", this._onSearchMyCoursesClick);
  //    }
    },
    _initializeAllCoursesList: function () {
      var _this = this;
      
      _this._allCoursesContainer.children().remove();
      
      RESTful.doGet(CONTEXTPATH + "/rest/course/listAllCourses", {
        parameters: {
          'environmentId': this._environmentId
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('coursepicker/coursepickercourse.dust', data, function (text) {
          _this._allCoursesContainer.append($.parseHTML(text));
        });
      });
    },
    _onSearchAllCoursesClick: function (event) {
      var _this = this;
      
      _this._allCoursesContainer.children().remove();
      
      RESTful.doGet(CONTEXTPATH + "/rest/course/listAllCourses", {
        parameters: {
          'environmentId': this._environmentId
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('coursepicker/coursepickercourse.dust', data, function (text) {
          _this._allCoursesContainer.append($.parseHTML(text));
        });
      });
    },
    _onSearchMyCoursesClick: function (event) {
      var _this = this;
      
      _this._myCoursesContainer.children().remove();
      
      RESTful.doGet(CONTEXTPATH + "/rest/course/listUserCourses", {
        parameters: {
          'environmentId': this._environmentId,
          'userId': this._userId
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('coursepicker/coursepickercourse.dust', data, function (text) {
          _this._myCoursesContainer.append($.parseHTML(text));
        });
      });
    },
    _onCheckCourseClick: function (event) {
      var element = $(event.target);
      var coursePickerCourse = element.parents(".cp-course");
      var courseId = coursePickerCourse.find("input[name='courseId']").val();
      
      window.location = CONTEXTPATH + '/course/index.jsf?courseId=' + courseId;
    },
    _onJoinCourseClick: function (event) {
      var element = $(event.target);
      var coursePickerCourse = element.parents(".cp-course");
      
      var courseId = coursePickerCourse.find("input[name='courseId']").val();
      
      RESTful.doPost(CONTEXTPATH + "/rest/course/{courseId}/joinCourse", {
        parameters: {
          'courseId': courseId
        }
      }).success(function (data, textStatus, jqXHR) {
        window.location = CONTEXTPATH + '/course/index.jsf?courseId=' + courseId;
      });
    },
    _onCourseNameClick: function (event) {
      var element = $(event.target);
      var coursePickerCourse = element.parents(".cp-course");
      var courseDetails = coursePickerCourse.find(".cp-courseDetails");
      
      if (courseDetails.is(':visible'))
        courseDetails.hide();
      else
        courseDetails.show();
    },
    _onFilterAllCoursesClick: function (event) {
      var element = $(event.target);
      var coursePickerCourse = element.parents(".cp-allCourses-filterPane");
      var filterPopup = coursePickerCourse.find(".cp-allCourses-filterSelector-popup");
      
      if (filterPopup.is(':visible'))
        filterPopup.hide();
      else
        filterPopup.show();
    }, 
    _onSelectAllCoursesFilterClick: function (event) {
      var element = $(event.target);
      if (!element.hasClass("cp-filterSelection"))
        element = element.parents(".cp-filterSelection");
      
      var filterNameElement = element.find(".cp-filterSelection-name");
      
      var filterListElement = this._widgetElement.find(".cp-filterList");
      var filterElement = $("<div class=\"cp-filter\">" + "<span class=\"cp-filter-filternName\">" + filterNameElement.text() + "</span>"  + /* "<span class=\"cp-filterRemoveBtn\">x</span> */ "</div>");
      filterListElement.append(filterElement);
    },
    _onRemoveAllCoursesFilterClick: function (event) {
      var element = $(event.target);
      
      if (!element.hasClass("cp-filter"))
        element = element.parents(".cp-filter");
      
      element.remove();
    }
  });
  
  addWidgetController('coursePicker', CoursePickerController);

}).call(this);