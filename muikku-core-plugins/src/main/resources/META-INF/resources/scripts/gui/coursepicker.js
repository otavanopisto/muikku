(function() {
  
  CoursePickerController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      this._firstResult = 0;
      this._maxResults = 25;
      this._hasEvaluationFees = true;
      
      var _this = this;
      widgetElement = $(widgetElement);
      this._widgetElement = widgetElement;
      this._coursesContainer = $('#coursesList');

      this._searchInput = widgetElement.find("input[name='coursePickerSearch']");
      
      $("#cpCategories").find("span").click($.proxy(this._onDropdownChange, this));
      
      this._coursesContainer.on("click", ".cp-course-tour-button", $.proxy(this._onCheckCourseClick, this));
      this._coursesContainer.on("click", ".cp-course-copy-button", $.proxy(this._onCopyCourseClick, this));
      
      var coursePickerSearchCoursesInput = widgetElement.find("input[name='coursePickerSearch']");
      coursePickerSearchCoursesInput.keyup($.proxy(this._onSearchCoursesChange, this));      

      // Toggle course details

      this._coursesContainer.on('click', '.cp-course-details', function() {
        var dDiv = $(this).find($(".cp-course-content-details"));
        var aBt = $(this).find($(".cp-course-attend-button"));
        var par = $(this);
        var parW = par.width();
        var closeDiv = $('<div class="cp-course-details-close"></div>');
        var workspaceId = $(this).parents('.cp-course').find("input[name='workspaceId']").val();
        var workspaceUrl = $(this).parents('.cp-course').find("input[name='workspaceUrl']").val();
     
        dDiv.show(10, function(){        	
        	var odDiv = $(this) ;
        	var title = $(par).find($('.cp-course-long'));
        	var desc = $(par).find($('.cp-course-description-text'));
        	var courseHasFee = $(par).attr('data-fee') ? true : false ;
        	par.prepend(closeDiv);
        	closeDiv.width(parW);
        	
        	
        	$(aBt).m3modal({
        		title : title.html(),
        		description : desc.html(),
        		content: $('<div id="m3modalContent"><div><label>' + getLocaleText("plugin.coursepicker.singup.messageLabel") + '</label><textarea name="signUpMessage"></textarea></div></div>'),
        		conditionalContent : $('<div id="courseHasFee"><div><label>' + getLocaleText("plugin.coursepicker.singup.fee.label") + '</label><div>' + getLocaleText("plugin.coursepicker.singup.fee.content") + '</div></div></div>'),
            conditional : courseHasFee,
        		modalgrid : 24,
        		contentgrid : 16,
        		
        		options: [
            		  {
            		    caption: getLocaleText("plugin.coursepicker.singup.notificationLabel"),
            		    name : "excitation",
            		    type : "checkbox",
            		    action: function (e) {
            		      var opt = e.contentElement.find("checkbox[name='signUpOptionExcitation']").val();
            		      
            		      _this._joinCourse(msg);
            		    }
            		  }
            		],
        	    buttons: [
        		  {
        		    caption: getLocaleText("plugin.coursepicker.singup.buttonLabel"),
        		    name : "signup",
        		    action: function (e) {
        		      var msg = e.contentElement.find("textarea[name='signUpMessage']").val();
        		      _this._joinCourse(workspaceId, workspaceUrl, msg);
        		    }
        		  }
        		]
        	});
        	closeDiv.on('click', function(){
        		odDiv.hide();
        		$(this).remove();
        	});
        });
      });     
      
      // Dropdown
      
      $(".bt-main-functionality").click( function() {
        var mfb = $(this) ;
        var mfd = mfb.find(".bt-main-functionality-decoration");
        
         mfb.addClass("bt-main-functionality-active");
         mfd.removeClass("icon-arrow-down");
         mfd.addClass("icon-arrow-up");
         $(".cp-side-button-dropdown").show(10, function(){
           var dd = $(this);
           $(document).bind("click", function(){
             dd.hide(10, function(){
               mfd.removeClass("icon-arrow-up");               
               mfd.addClass("icon-arrow-down");
               mfb.removeClass("bt-main-functionality-active");
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
        
        _this._refreshListTimer();
      });
      
      if (!MUIKKU_LOGGED_USER) {
        this._hasEvaluationFees = false;
        this._initializeAllCoursesList();
      } else {
        mApi().user.users.basicinfo
          .read(MUIKKU_LOGGED_USER)
          .callback($.proxy(function (err, basicInfo) {
            if (!err) {
              this._hasEvaluationFees = basicInfo && basicInfo.hasEvaluationFees;
              this._initializeAllCoursesList();
            }
          }, this));
      }
      
      $('.cp-page-link-load-more').click($.proxy(this._onLoadMoreClick, this));
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
      
      var ownWorkspaces = hash == "my" || hash == "te";
      var includeUnpublished = hash == "te";
      if (((term != undefined) && (term != "")) || (subjects.length > 0)) {
        this._reloadCourses({
          subjects: subjects,
          search: term,
          myWorkspaces: ownWorkspaces,
          includeUnpublished: includeUnpublished
        });
      } else {
        this._reloadCourses({
          myWorkspaces: ownWorkspaces,
          includeUnpublished: includeUnpublished
        });
      }
    },
    
    _initializeAllCoursesList: function () {
      this._reloadCourses();
    },
    
    _loadMore: function () {
      this._firstResult += this._maxResults;
      this._loadCourses();
    },
    
    _onLoadMoreClick: function (event) {
      if (!$(event.target).hasClass('disabled')) {
        this._loadMore();
      }
    },
    
    _reloadCourses: function (params) {
      this._firstResult = 0;
      this._coursesContainer.children().remove();
      this._params = $.extend(params||{}, {
        orderBy: ['alphabet']
      });
      
      this._loadCourses();
    },
    
    _loadCourses: function () {
      var loader = $('<div>') 
        .addClass('loading')
        .appendTo($(this._coursesContainer));

      this._searchInput.prop('disabled', true);
      
      $('.cp-page-link-load-more').addClass('disabled');
      
      mApi().coursepicker.workspaces
        .read($.extend(this._params||{}, {
          firstResult: this._firstResult,
          maxResults: this._maxResults + 1
        }))
        .on('$', $.proxy(function (workspaceEntity, workspaceCallback) {
          // TODO: Implement these
          workspaceEntity.hasCourseFee = false;
          workspaceEntity.rating = 5;
          workspaceEntity.ratingCount = 3;
          workspaceEntity.teachers = [];

          if (!this._hasEvaluationFees) {
            workspaceCallback();
          } else {
            mApi().
              workspace.workspaces.feeInfo.read(workspaceEntity.id)
              .callback(function (err, feeInfo) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                } else {
                  workspaceEntity.evaluationHasFee = feeInfo && feeInfo.evaluationHasFee;
                  workspaceCallback();
                }
              });
          }
      }, this))
      .callback($.proxy(function (err, workspaces) {
        $(loader).remove();
        this._searchInput.prop('disabled', false);
        
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var hasMore = workspaces && workspaces.length > this._maxResults;
          if (workspaces && hasMore) {
            workspaces.pop();
          }
          
          renderDustTemplate('coursepicker/coursepickercourse.dust', workspaces, $.proxy(function (text) {
            this._coursesContainer.append(text);
          }, this));
          
          if (hasMore) {
            $('.cp-page-link-load-more').removeClass('disabled');
          } else {
            $('.cp-page-link-load-more').addClass('disabled');
          }
        }
      }, this));        
    },
    
    _loadUserCourses: function (callback) {
      if (MUIKKU_LOGGED_USER_ID) {
        mApi({async: false}).coursepicker.workspaces
          .read({ userId: MUIKKU_LOGGED_USER_ID })
          .callback($.proxy(function (err, workspaces) {
            var ids = $.map(workspaces||[], function (workspace) {
              return workspace.id;
            });
            
            callback(ids); 
          }));
      } else {
        callback([]);
      }
    },
    
    _refreshListTimer: function () {
      var _this = this;
      
      clearTimeout(_this.listReloadTimer);
      _this.listReloadTimer = setTimeout(
          function () {
            _this._refreshList();
          }, 500);
    },
    _onSearchAllCoursesClick: function (event) {
      this._refreshListTimer();
    },
    _onSearchMyCoursesClick: function (event) {
      this._refreshListTimer();
    },
    _onSearchCoursesChange: function (event) {
      this._refreshListTimer();
    },
    _onDropdownChange: function (event) {
      this._refreshListTimer();
    },
    _onCheckCourseClick: function (event) {
      event.stopPropagation();
      var element = $(event.target);
      var coursePickerCourse = element.parents(".cp-course");
      var workspaceRoleId = coursePickerCourse.find("input[name='workspaceRoleId']").val();
      var workspaceId = coursePickerCourse.find("input[name='workspaceId']").val();
      var workspaceUrl = coursePickerCourse.find("input[name='workspaceUrl']").val();
      
      window.location = CONTEXTPATH + '/workspace/' + workspaceUrl;
    },
    
    _onCopyCourseClick: function (event) {
      var workspaceEntityId = $(event.target)
        .closest(".cp-course")
        .find("input[name='workspaceId']").val();
      
      $('<div>')
        .appendTo(document.body)
        .workspaceCopyWizard({
          workspaceEntityId: workspaceEntityId
        });
    },
    _joinCourse: function (workspaceId, workspaceUrl, joinMessage) {
      mApi({async: false}).coursepicker.workspaces.signup.create(workspaceId, {
        message: joinMessage
      })
      .callback(function (workspaceUsersErr, workspaceUsers) {
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
  
  addWidgetController('mf-content-master', CoursePickerController);

  
  
}).call(this);


