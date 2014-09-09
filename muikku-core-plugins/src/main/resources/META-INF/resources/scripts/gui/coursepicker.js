(function() {
  
  CoursePickerController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      var _this = this;
      widgetElement = $(widgetElement);
      this._widgetElement = widgetElement;
      this._userId = widgetElement.find("input[name='userId']").val();
      this._coursesContainer = $('#coursesList');
  //    this._myCoursesContainer = $('#myCoursesList');
      
      this._searchInput = widgetElement.find("input[name='coursePickerSearch']");
      
      this._initializeAllCoursesList();
 
      var coursePickerAllCoursesSearchBtn = widgetElement.find(".cp-category-allCourses");
      coursePickerAllCoursesSearchBtn.click($.proxy(this._onSearchAllCoursesClick, this));

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

      var coursePickerSearchCoursesInput = widgetElement.find("input[name='coursePickerSearch']");
      coursePickerSearchCoursesInput.keyup($.proxy(this._onSearchCoursesChange, this));      

      // Toggle course details

      $(document).on('click', '.cp-course-details', function(){
       var dDiv = $(this).find($(".cp-course-content-details"));
       dDiv.toggle();
      });     
      
      // Dropdown
      
      $(".bt-mainFunction").click( function() {
        var mfb = $(this) ;
        var mfd = mfb.find(".bt-mainFunction-decoration");
        
         mfb.addClass("bt-mainFunction-active");
         mfd.removeClass("icon-arrow-down");
         mfd.addClass("icon-arrow-up");
         $(".cp-side-button-dropdown").show(10, function(){
           var dd = $(this);
           $(document).bind("click", function(){
             dd.hide(10, function(){
               mfd.removeClass("icon-arrow-up");               
               mfd.addClass("icon-arrow-down");
               mfb.removeClass("bt-mainFunction-active");
                $(document).unbind('click');
              });
           });
           
         });
      });
      
      
      
      var cpCat = $("#cpCategories").find("span");
      var btnVal = $("#btnValue").html();
      
      // Find category names, append the first one to button
      
      
      // TODO: Remember users's selection
      
      if(btnVal == ''){
        var fCat = $(cpCat[0]);  
        var fCatId = fCat.attr('id');
        $("#btnValue").append(fCat.html());
        $("#btnValue").attr('data-name', fCatId);      
      }

      // Choose category
      
      $("#cpCategories span").each(function(){    
       $(this).click(function(){
         var eId = $(this).attr('id');            
         $("#btnValue").empty();
         $("#btnValue").attr('data-name', eId);
         $("#btnValue").append($(this).html());
         $(".cp-side-button-dropdown").hide();      
       }); 
        
      });
      
      // Filters 
      
      $(".cp-filter").click(function() {
        var isDsb = $(this).hasClass("cp-filter-disabled");  
        
        if(isDsb == true){
          $(this).removeClass("cp-filter-disabled");
        } else {
          $(this).addClass("cp-filter-disabled");               
        }
        
        _this._refreshList();
      });
    },
    deinitialize: function () {
    },
    _refreshList: function () {
      var _this = this;
      var term = this._searchInput.val();
      var hash = $("#btnValue").attr('data-name');

      var subjects = new Array();
      
      var list = _this._widgetElement.find(".cp-side-content > .cp-subjectfilter:not(.cp-filter-disabled)");
      list.each(function (index) {
        subjects.push($(this).find("input[name='subjectId']").val());
      });
      
      if (((term != undefined) && (term != "")) || (subjects.length > 0)) {
        if (term.length <= 2) 
          term = "";
        
        _this._coursesContainer.children().remove();
        
        if (hash == "my") {
          RESTful.doGet(CONTEXTPATH + "/rest/course/searchUserCourses", {
            parameters: {
              userId: _this._userId,
              searchString: term,
              subjects: subjects
            }
          }).success(function (data, textStatus, jqXHR) {
            renderDustTemplate('coursepicker/coursepickermycourse.dust', data, function (text) {
              _this._coursesContainer.append($.parseHTML(text));
            });
          });
        } else {
          RESTful.doGet(CONTEXTPATH + "/rest/course/searchCourses", {
            parameters: {
              searchString: term,
              subjects: subjects
            }
          }).success(function (data, textStatus, jqXHR) {
            renderDustTemplate('coursepicker/coursepickercourse.dust', data, function (text) {
              _this._coursesContainer.append($.parseHTML(text));
            });
          });
        }
      } else {
        if (hash == "my") {
//          _this._onSearchMyCoursesClick(event);
          _this._coursesContainer.children().remove();
          
          RESTful.doGet(CONTEXTPATH + "/rest/course/listUserCourses", {
            parameters: {
              'userId': _this._userId
            }
          }).success(function (data, textStatus, jqXHR) {
            renderDustTemplate('coursepicker/coursepickermycourse.dust', data, function (text) {
              _this._coursesContainer.append($.parseHTML(text));
            });
          });
        }
        else {
//          _this._onSearchAllCoursesClick(event);
          _this._coursesContainer.children().remove();
          
          RESTful.doGet(CONTEXTPATH + "/rest/course/", {
            parameters: {
            }
          }).success(function (data, textStatus, jqXHR) {
            renderDustTemplate('coursepicker/coursepickercourse.dust', data, function (text) {
              _this._coursesContainer.append($.parseHTML(text));
            });
          });
        }
      }
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
      this._refreshList();
//      var _this = this;
//
//      _this._coursesContainer.children().remove();
//      
//      RESTful.doGet(CONTEXTPATH + "/rest/course/", {
//        parameters: {
//        }
//      }).success(function (data, textStatus, jqXHR) {
//        renderDustTemplate('coursepicker/coursepickercourse.dust', data, function (text) {
//          _this._coursesContainer.append($.parseHTML(text));
//        });
//      });
    },
    _onSearchMyCoursesClick: function (event) {
      this._refreshList();
    },
    _onSearchCoursesChange: function (event) {
      this._refreshList();
    },
    _onCheckCourseClick: function (event) {
      event.stopPropagation();
      var element = $(event.target);
      var coursePickerCourse = element.parents(".cp-course");
      var workspaceId = coursePickerCourse.find("input[name='workspaceId']").val();
      var workspaceUrl = coursePickerCourse.find("input[name='workspaceUrl']").val();
      
      window.location = CONTEXTPATH + '/workspace/' + workspaceUrl;
    },
    _onJoinCourseClick: function (event) {
      event.stopPropagation();
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


