(function() {
  
  $.widget("custom.coursePicker", {

    _create : function() {
      this._typingTimer = null;
      this._firstResult = 0;
      this._maxResults = 25;
      this._hasEvaluationFees = true;
      this._categoryId = null;
      this._search = null;
      this._educationTypes = [];
      this.element.find('.cp-page-link-load-more').addClass('disabled');
      
      this._load($.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          this._hasEvaluationFees = results[0];
          var educationTypes = results[1];
          
          renderDustTemplate('coursepicker/coursepicker_educationtype_filters.dust', { educationTypes: educationTypes }, $.proxy(function (text) {
            this.element.find('.cp-filters').html(text);
          }, this));
          
          this.element.on('change', ".cp-category-dropdown", $.proxy(this._onCategoryChange, this));
          this.element.on('keyup', "input[name='coursePickerSearch']", $.proxy(this._onSearchKeyUp, this));
          this.element.on('keydown', "input[name='coursePickerSearch']", $.proxy(this._onSearchKeyDown, this));
          this.element.on("click", ".cp-page-link-load-more", $.proxy(this._onLoadMoreClick, this));
          this.element.on("click", ".cp-course-copy-button", $.proxy(this._onCopyCourseClick, this));
          this.element.on("click", ".cp-course-details", $.proxy(this._onDetailsClick, this));
          this.element.on("click", ".cp-course-tour-button", $.proxy(this._onTourButtonClick, this));
          this.element.on("click", ".cp-course-attend-button", $.proxy(this._onAttendButtonClick, this));
          this.element.on("click", ".cp-education-type-filter", $.proxy(this._onEducationTypeFilterClick, this));
          
          this._reloadWorkspaces();
        }
      }, this));
      
    },
    
    category: function (categoryId) {
      this._categoryId = categoryId;
      this._reloadWorkspaces();
    },
    
    search: function (search) {
      this._search = search;
      this._reloadWorkspaces();
    },
    
    educationTypes: function (educationTypes) {
      this._educationTypes = educationTypes||[];
 
      this.element.find('.cp-education-type-filter').each(function (index, element) {
        $(element).closest('li').removeClass('selected');
      });
      
      $.each(this._educationTypes, $.proxy(function (index, typeId) {
        this.element.find('.cp-education-type-filter[data-id="' + typeId + '"]').closest('li').addClass('selected');
      }, this));
      
      this._reloadWorkspaces();
    },
    
    _load: function (callback) {
      async.parallel([this._createResolveEvaluationFees(), this._createEducationTypesLoad()], function (err, results) {
        callback(err, results);
      }); 
    },
    
    _createResolveEvaluationFees: function () {
      return $.proxy(function (callback) {
        if (!MUIKKU_LOGGED_USER) {
          callback(null, false);
        } else {
          mApi().user.users.basicinfo
            .read(MUIKKU_LOGGED_USER)
            .callback($.proxy(function (err, basicInfo) {
              callback(err, basicInfo && basicInfo.hasEvaluationFees);
            }, this));
        }
      }, this);
    },
    
    _createEducationTypesLoad: function () {
      return $.proxy(function (callback) {
        mApi().workspace.educationTypes
          .read()
          .callback(callback);
      }, this);
    },
    
    _reloadWorkspaces: function () {
      this._firstResult = 0;
      this.element.find('#coursesList').empty();
      this._loadWorkspaces();
    },
    
    _loadWorkspaces: function () {
      var loader = $('<div>') 
        .addClass('loading')
        .appendTo($(this.element.find('#coursesList')));
      
      this.element.find('.cp-page-link-load-more').addClass('disabled');
    
      var params = {
        orderBy: ['alphabet'],
        search: this._search,
        myWorkspaces: this._categoryId == 'te' ||  this._categoryId == 'my',
        includeUnpublished: this._categoryId == 'te',
        educationTypes: this._educationTypes
      };
      
      mApi().coursepicker.workspaces
        .cacheClear()
        .read($.extend(params, {
          firstResult: this._firstResult,
          maxResults: this._maxResults + 1
        }))
        .on('$', $.proxy(function (workspaceEntity, workspaceCallback) {
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
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            var hasMore = workspaces && workspaces.length > this._maxResults;
            if (workspaces && hasMore) {
              workspaces.pop();
            }
            renderDustTemplate('coursepicker/coursepickercourse.dust', workspaces, $.proxy(function (text) {
              this.element.find('#coursesList').find('.cm-no-messages').remove();
              this.element.find('#coursesList').append(text);
              if (hasMore) {
                this.element.find('.cp-page-link-load-more').removeClass('disabled');
              }
            }, this));
            
          }
        }, this));   
    },
    
    _visitCourse: function (workspaceUrl) {
      window.location = CONTEXTPATH + '/workspace/' + workspaceUrl;
    }, 
    
    _loadMore: function () {        
      this._firstResult += this._maxResults;
      this._loadWorkspaces();
    },
    
    _onCategoryChange: function (event, data) {
      this.category(data.value);
    },
    
    _onSearchKeyUp: function (event) {
      if (this._typingTimer) {
        clearTimeout(this._typingTimer);
      }
      this._typingTimer = setTimeout($.proxy(function() {
        this.search($(event.target).closest('.search').val());
      }, this), 100);
    },

    _onSearchKeyDown: function (event) {
      if (this._typingTimer) {
        clearTimeout(this._typingTimer);
      }
    },

    _onLoadMoreClick: function (event) {
      if (!$(event.target).closest('.cp-page-link-load-more').hasClass('disabled')) {
        this._loadMore();
      }
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
    
    _onDetailsClick: function (event) {
      var course =  $(event.target).closest('.cp-course');
      var contentDetails = course.find(".cp-course-content-details");
      var details = $(event.target).closest('.mf-item-details');
      
      if (contentDetails.is(':visible')) {
        contentDetails.hide();
        details.removeClass('cp-course-details-open');
      } else {
        contentDetails.show();
        details.addClass('cp-course-details-open');
      }
    },
    
    _onTourButtonClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      
      var course =  $(event.target).closest('.cp-course');
      var workspaceUrl = course.find("input[name='workspaceUrl']").val();
      this._visitCourse(workspaceUrl);
    },
    
    _onAttendButtonClick: function (event) {
      event.preventDefault();
      event.stopPropagation();

      var details = $(event.target).closest('.mf-item-details');
      var workspaceName = $(details).find($('.cp-course-long-name')).html() ;
      var workspaceNameExtension = $(details).find($('.cp-course-extension')).html() || "";
      var hasEvaluationFee = $(details).attr('data-fee') == 'yes';
      var workspaceId =$(event.target).closest('.cp-course').find("input[name='workspaceId']").val();
      var workspaceUrlName = $(event.target).closest('.cp-course').find("input[name='workspaceUrl']").val();
      
      $('<div>').workspaceSignUpDialog({
        workspaceName: workspaceName,
        workspaceNameExtension: workspaceNameExtension,
        hasEvaluationFee: hasEvaluationFee,
        workspaceEntityId: workspaceId,
        signUpRedirectUrl: CONTEXTPATH + '/workspace/' + workspaceUrlName
      });
    },
    
    _onEducationTypeFilterClick: function (event) {
      var filterElement = $(event.target).closest('.cp-education-type-filter');
      if (filterElement.closest('li').hasClass('selected')) {
        this.educationTypes([]);
      } else {
        var typeId = filterElement.attr('data-id');
        this.educationTypes([typeId]);
      }
    }
  });

  $(document).ready(function () {
    $('#course-picker').coursePicker();
  });
  
}).call(this);


