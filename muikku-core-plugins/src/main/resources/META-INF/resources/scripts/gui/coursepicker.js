(function() {
  
  CoursePickerController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      widgetElement = $(widgetElement);
      this._widgetElement = widgetElement;
      this._userId = widgetElement.find("input[name='userId']").val();
      this._coursesContainer = $('#coursesList');
  //    this._myCoursesContainer = $('#myCoursesList');
      
      this._initializeAllCoursesList();
 
   //   this._tabsContainer = widgetElement.find('.coursePickerTabs');
   //   this._tabsContainer.tabs();
      
     var coursePickerAllCoursesSearchBtn = widgetElement.find(".cp-category-allCourses");
      coursePickerAllCoursesSearchBtn.click($.proxy(this._onSearchAllCoursesClick, this));

//      var filterAllCoursesButton = widgetElement.find('input[name="cp-allCourses-filterBtn"]');
 //     filterAllCoursesButton.click($.proxy(this._onFilterAllCoursesClick, this));
      
      var searchMyCoursesButton = widgetElement.find('.cp-category-myCourses');
      if (searchMyCoursesButton) {
        searchMyCoursesButton.click($.proxy(this._onSearchMyCoursesClick, this));
      }
      
 //     var filterPopup = widgetElement.find(".cp-allCourses-filterSelector-popup");
 //     filterPopup.find(".cp-filterSelection").click($.proxy(this._onSelectAllCoursesFilterClick, this));
      
//      var filterList = widgetElement.find(".cp-allCourses-filterList");
//      filterList.on("click", ".cp-filterRemoveBtn", $.proxy(this._onRemoveAllCoursesFilterClick, this));

      this._coursesContainer.on("click", ".cp-course-attend-button", $.proxy(this._onJoinCourseClick, this));
      this._coursesContainer.on("click", ".cp-course-tour-button", $.proxy(this._onCheckCourseClick, this));
  //    this._allCoursesContainer.on("click", ".cp-course-name", $.proxy(this._onCourseNameClick, this));

 //     this._myCoursesContainer.on("click", ".cp-course-attend-button", $.proxy(this._onJoinCourseClick, this));
 //     this._myCoursesContainer.on("click", ".cp-course-tour-button", $.proxy(this._onCheckCourseClick, this));
 //     this._myCoursesContainer.on("click", ".cp-course-name", $.proxy(this._onCourseNameClick, this));
    },
    deinitialize: function () {
    },
    _initializeAllCoursesList: function () {
      var _this = this;
      
      _this._coursesContainer.children().remove();
      
      RESTful.doGet(CONTEXTPATH + "/rest/course/", {
        parameters: {
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('coursepicker/coursepickercourse.dust', data, function (text) {
          _this._coursesContainer.append($.parseHTML(text));
        });
      });
    },
    _onSearchAllCoursesClick: function (event) {
      var _this = this;
      
      _this._coursesContainer.children().remove();
      
      RESTful.doGet(CONTEXTPATH + "/rest/course/", {
        parameters: {
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('coursepicker/coursepickercourse.dust', data, function (text) {
          _this._coursesContainer.append($.parseHTML(text));
        });
      });
    },
    _onSearchMyCoursesClick: function (event) {
      var _this = this;
      
      _this._coursesContainer.children().remove();
      
      RESTful.doGet(CONTEXTPATH + "/rest/course/listUserCourses", {
        parameters: {
          'userId': this._userId
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('coursepicker/coursepickermycourse.dust', data, function (text) {
          _this._coursesContainer.append($.parseHTML(text));
        });
      });
    },
    _onCheckCourseClick: function (event) {
      var element = $(event.target);
      var coursePickerCourse = element.parents(".cp-course");
      var workspaceId = coursePickerCourse.find("input[name='workspaceId']").val();
      var workspaceUrl = coursePickerCourse.find("input[name='workspaceUrl']").val();
      
      window.location = CONTEXTPATH + '/workspace/' + workspaceUrl;
    },
    _onJoinCourseClick: function (event) {
      var element = $(event.target);
      var coursePickerCourse = element.parents(".cp-course");
      
      var workspaceId = coursePickerCourse.find("input[name='workspaceId']").val();
      var workspaceUrl = coursePickerCourse.find("input[name='workspaceUrl']").val();
      
      RESTful.doPost(CONTEXTPATH + "/rest/course/{workspaceId}/joinWorkspace", {
        parameters: {
          'workspaceId': workspaceId
        }
      }).success(function (data, textStatus, jqXHR) {
        window.location = CONTEXTPATH + '/workspace/' + workspaceUrl;
      });
    },
    _onCourseNameClick: function (event) {
      var element = $(event.target);
      var coursePickerCourse = element.parents(".cp-course");
      var courseDetails = coursePickerCourse.find(".cp-course-details");
      
      if (courseDetails.is(':visible'))
        courseDetails.slideUp();
      else
        courseDetails.slideDown();
      
      return false;
    },
    _onFilterAllCoursesClick: function (event) {
      var element = $(event.target);
      var coursePickerCourse = element.parents(".cp-allCourses-filterPane");
      var filterPopup = coursePickerCourse.find(".cp-allCourses-filterSelector-popup");
      
      if (filterPopup.is(':visible'))
        filterPopup.slideUp('fast');
      else
        filterPopup.slideDown('fast');
      
      return false;
    }, 
    _onSelectAllCoursesFilterClick: function (event) {
      var element = $(event.target);
      if (!element.hasClass("cp-filterSelection"))
        element = element.parents(".cp-filterSelection");
      
      var filterNameElement = element.find(".cp-filterSelection-name");
      
      var filterListElement = this._widgetElement.find(".cp-filterList");
      var filterElement = $("<div class=\"cp-filter\">" + "<span class=\"cp-filter-filterName\">" + filterNameElement.text() + "</span>"  + /* "<span class=\"cp-filterRemoveBtn\">x</span> */ "</div>");
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