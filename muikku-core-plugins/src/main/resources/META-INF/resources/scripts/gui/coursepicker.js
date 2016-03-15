(function() {
  
  $.widget("custom.coursePicker", {

    _create : function() {
      this._firstResult = 0;
      this._maxResults = 25;
      this._hasEvaluationFees = true;
      this._categoryId = null;
      this._search = null;
      this.element.find('.cp-page-link-load-more').addClass('disabled');
      
      this._resolveEvaluationFees($.proxy(function () {
        this.element.on('change', ".cp-category-dropdown", $.proxy(this._onCategoryChange, this));
        this.element.on('keyup', "input[name='coursePickerSearch']", $.proxy(this._onSearchKeyUp, this));
        this.element.on("click", ".cp-page-link-load-more", $.proxy(this._onLoadMoreClick, this));
        this.element.on("click", ".cp-course-copy-button", $.proxy(this._onCopyCourseClick, this));
        this.element.on("click", ".cp-course-details", $.proxy(this._onDetailsClick, this));
        this.element.on("click", ".cp-course-tour-button", $.proxy(this._onTourButtonClick, this));
        this.element.on("click", ".cp-course-attend-button", $.proxy(this._onAttendButtonClick, this));
        
        this._reloadWorkspaces();
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
    
    _resolveEvaluationFees: function (callback) {
      if (!MUIKKU_LOGGED_USER) {
        this._hasEvaluationFees = false;
        callback();
      } else {
        mApi().user.users.basicinfo
          .read(MUIKKU_LOGGED_USER)
          .callback($.proxy(function (err, basicInfo) {
            if (!err) {
              this._hasEvaluationFees = basicInfo && basicInfo.hasEvaluationFees;
              callback();
            }
          }, this));
      }
    },
    
    _reloadWorkspaces: function () {
      this._firstResult = 0;
      this._loadWorkspaces();
    },
    
    _loadWorkspaces: function () {
      var loader = $('<div>') 
        .addClass('loading')
        .appendTo($(this.element.find('#coursesList')));
      
      this.element.find("input[name='coursePickerSearch']").prop('disabled', true);
      this.element.find('.cp-page-link-load-more').addClass('disabled');
    
      var params = {
        orderBy: ['alphabet'],
        search: this._search,
        myWorkspaces: this._categoryId == 'te' ||  this._categoryId == 'my',
        includeUnpublished: this._categoryId == 'te'
      };

      mApi().coursepicker.workspaces
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
          this.element.find("input[name='coursePickerSearch']").prop('disabled', false);
          
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            var hasMore = workspaces && workspaces.length > this._maxResults;
            if (workspaces && hasMore) {
              workspaces.pop();
            }
            
            renderDustTemplate('coursepicker/coursepickercourse.dust', workspaces, $.proxy(function (text) {
              this.element.find('#coursesList').html(text);
            }, this));
            
            if (hasMore) {
              this.element.find('.cp-page-link-load-more').removeClass('disabled');
            } else {
              this.element.find('.cp-page-link-load-more').addClass('disabled');
            }
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
      this.search($(event.target).closest('.search').val());
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
    }
  });

  $(document).ready(function () {
    $('#course-picker').coursePicker();
  });
  
}).call(this);


