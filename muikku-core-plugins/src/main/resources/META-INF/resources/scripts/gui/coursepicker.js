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
      
      var coursePickerAllCoursesSearchBtn = widgetElement.find(".coursePickerAllCoursesSearchBtn");
      coursePickerAllCoursesSearchBtn.click($.proxy(this._onSearchAllCoursesClick, this));

      var filterAllCoursesButton = widgetElement.find('input[name="coursePickerAllCoursesFilterBtn"]');
      filterAllCoursesButton.click($.proxy(this._onFilterAllCoursesClick, this));
      
      var searchMyCoursesButton = widgetElement.find('.coursePickerMyCoursesSearchBtn');
      if (searchMyCoursesButton) {
        searchMyCoursesButton.click($.proxy(this._onSearchMyCoursesClick, this));
      }
      
      var filterPopup = widgetElement.find(".coursePickerAllCoursesFilterSelectorPopup");
      filterPopup.find(".coursePickerFilterSelection").click($.proxy(this._onSelectAllCoursesFilterClick, this));
      
      var filterList = widgetElement.find(".coursePickerAllCoursesFilterList");
      filterList.on("click", ".coursePickerFilterRemoveBtn", $.proxy(this._onRemoveAllCoursesFilterClick, this));

      this._allCoursesContainer.on("click", ".coursePickerAttendCourseButton", $.proxy(this._onJoinCourseClick, this));
      this._allCoursesContainer.on("click", ".coursePickerCheckOutCourseButton", $.proxy(this._onCheckCourseClick, this));
      this._allCoursesContainer.on("click", ".coursePickerCourseName", $.proxy(this._onCourseNameClick, this));

      this._myCoursesContainer.on("click", ".coursePickerAttendCourseButton", $.proxy(this._onJoinCourseClick, this));
      this._myCoursesContainer.on("click", ".coursePickerCheckOutCourseButton", $.proxy(this._onCheckCourseClick, this));
      this._myCoursesContainer.on("click", ".coursePickerCourseName", $.proxy(this._onCourseNameClick, this));
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
      var coursePickerCourse = element.parents(".coursePickerCourse");
      
      var courseId = coursePickerCourse.find("input[name='courseId']").val();
      
      window.location = CONTEXTPATH + '/course/index.jsf?courseId=' + courseId;
    },
    _onJoinCourseClick: function (event) {
      var element = $(event.target);
      var coursePickerCourse = element.parents(".coursePickerCourse");
      
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
      var coursePickerCourse = element.parents(".coursePickerCourse");
      var courseDetails = coursePickerCourse.find(".coursePickerCourseDetails");
      
      if (courseDetails.is(':visible'))
        courseDetails.hide();
      else
        courseDetails.show();
    },
    _onFilterAllCoursesClick: function (event) {
      var element = $(event.target);
      var coursePickerCourse = element.parents(".coursePickerAllCoursesFilterPane");
      var filterPopup = coursePickerCourse.find(".coursePickerAllCoursesFilterSelectorPopup");
      
      if (filterPopup.is(':visible'))
        filterPopup.hide();
      else
        filterPopup.show();
    }, 
    _onSelectAllCoursesFilterClick: function (event) {
      var element = $(event.target);
      if (!element.hasClass("coursePickerFilterSelection"))
        element = element.parents(".coursePickerFilterSelection");
      
      var filterNameElement = element.find(".coursePickerFilterSelectionName");
      
      var filterListElement = this._widgetElement.find(".coursePickerAllCoursesFilterList");
      var filterElement = $("<div class=\"coursePickerFilter\">" + filterNameElement.text() + "<div class=\"coursePickerFilterRemoveBtn\">x</div></div>");
      filterListElement.append(filterElement);
    },
    _onRemoveAllCoursesFilterClick: function (event) {
      var element = $(event.target);
      
      if (!element.hasClass("coursePickerFilter"))
        element = element.parents(".coursePickerFilter");
      
      element.remove();
    }
  });
  
  addWidgetController('coursePicker', CoursePickerController);

}).call(this);