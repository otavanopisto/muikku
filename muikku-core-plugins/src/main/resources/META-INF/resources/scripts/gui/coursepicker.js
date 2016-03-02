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
    
    _joinCourse: function (workspaceId, workspaceUrl, joinMessage) {
      
      mApi().coursepicker.workspaces.signup.create(workspaceId, {
        message: joinMessage
      })
      .callback(function (err) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          window.location = CONTEXTPATH + '/workspace/' + workspaceUrl;
        }
      });
    },    
    
    _loadMore: function () {
      this._firstResult += this._maxResults;
      this._reloadWorkspaces();
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
    
    _disablePageScrolling: function () {
      $("body").addClass("disable-page-scrolling");
    },
    
    _enablePageScrolling: function () {
      $("body").removeClass("disable-page-scrolling");
    },
    
    _onAttendButtonClick: function (event) {
      event.preventDefault();
      event.stopPropagation();

      var details = $(event.target).closest('.mf-item-details');
      var title = $(details).find($('.cp-course-long-name')).html();
      var nameExtension = $(details).find($('.cp-course-extension')).html();
      var message = getLocaleText("plugin.coursepicker.singup.messageLabel");
      var hasCourseFee = $(details).attr('data-fee') == 'yes';
      var workspaceId =$(event.target).closest('.cp-course').find("input[name='workspaceId']").val();
      var workspaceUrl = $(event.target).closest('.cp-course').find("input[name='workspaceUrl']").val();
      
      var dialogContent = $('<div>')
        .append($('<div>').addClass("flex-row")
          .append($('<div>').addClass("cp-course-message lg-flex-cell-full md-flex-cell-full sm-flex-cell-full lg-flex-cell-first").append([
            $('<label>').html(message),
            $('<textarea>').attr({ 'name': "signUpMessage"})  
          ]))
        );

      if (hasCourseFee) {
        $('<div>').addClass("flex-row")
          .append($('<div>').addClass("cp-course-fee lg-flex-cell-full md-flex-cell-full sm-flex-cell-full")
            .append($('<label>').html(getLocaleText("plugin.coursepicker.singup.fee.label")))
            .append($('<div>').html(getLocaleText("plugin.coursepicker.singup.fee.content")))
          ).prependTo(dialogContent)
      }
      
      dialogContent.dialog({
        dialogClass: "main-functionality-dialog",
        title: getLocaleText("plugin.coursepicker.signup.title", title, nameExtension),
        draggable: false,
        modal: true,
        resizable: false,
        open: $.proxy(function () {
            this._disablePageScrolling;
          }, this),
        beforeClose: $.proxy(function () {
            this._enablePageScrolling;
          }, this),
        buttons: [ 
          {
            'class': 'send-button',
            'text': getLocaleText("plugin.coursepicker.singup.signupButtonLabel"),
            'click': $.proxy(function () {
              var signUpMessage = dialogContent.find('textarea[name="signUpMessage"]').val();
              this._joinCourse(workspaceId, workspaceUrl, signUpMessage);
            }, this)
          }
        ]
      });  
      dialogContent.dialog( "widget" ).addClass('flex-dialog');
    }
  });

  $(document).ready(function () {
    $('#course-picker').coursePicker();
  });
  
}).call(this);


