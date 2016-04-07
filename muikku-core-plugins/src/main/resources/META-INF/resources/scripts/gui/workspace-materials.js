(function() {
  'use strict';
  
   function scrollToPage(workspaceMaterialId, animate) {
    var topOffset = 90;
    var scrollTop = $('#page-' + workspaceMaterialId).offset().top - topOffset;
    if (animate) {
      $(window).data('scrolling', true);
      
      $('html, body').stop().animate({
        scrollTop : scrollTop
      }, {
        duration : 500,
        easing : "easeInOutQuad",
        complete : function() {
          $('a.active').removeClass('active');
          $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
          window.location.hash = 'p-' + workspaceMaterialId;
          $(window).data('scrolling', false);
        }
      });
    } else {
      $('html, body').stop().scrollTop(scrollTop);
      $('a.active').removeClass('active');
      $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
    }
  }

  $(window).load(function() {
    if (window.location.hash && (window.location.hash.indexOf('p-') > 0)) {
      scrollToPage(window.location.hash.substring(3), false);
    }
  });
  
  $(document).on('click', '.workspace-materials-toc-item a', function (event) {
    event.preventDefault();
    scrollToPage($($(this).attr('href')).data('workspaceMaterialId'), true);
  });

  $(document).ready(function() {
    
    $("#materialsScrollableTOC").perfectScrollbar({
      wheelSpeed:3,
      swipePropagation:false
    });

    $(window).data('initializing', true);
    $(document).muikkuMaterialLoader({
      loadAnswers: true,
      workspaceEntityId: $('.workspaceEntityId').val(),
      baseUrl: $('.materialsBaseUrl').val()
    }).muikkuMaterialLoader('loadMaterials', $('.workspace-materials-view-page'));

    $('.workspace-materials-view-page').waypoint(function(direction) {
      if ($(window).data('scrolling') !== true && $(window).data('initializing') !== true) {
        var workspaceMaterialId = $(this).data('workspace-material-id');
        $('a.active').removeClass('active');
        $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
        window.location.hash = 'p-' + workspaceMaterialId;
      }
    }, {
      offset: '60%'
    });
    
    $('.workspace-materials-view-page[data-workspace-material-assigment-type="EXERCISE"]').each(function (index, page) {
      $(page).prepend($('<div>')
          .addClass('muikku-page-assignment-type exercise')
          .text(getLocaleText("plugin.workspace.materialsLoader.exerciseAssignmentLabel"))
      );
    });
    
    $('.workspace-materials-view-page[data-workspace-material-assigment-type="EVALUATED"]').each(function (index, page) {
      $(page).prepend($('<div>')
          .addClass('muikku-page-assignment-type evaluated')
          .text(getLocaleText("plugin.workspace.materialsLoader.evaluatedAssignmentLabel"))
      );
    });
    
    $(window).data('initializing', false);
  });
  
  $(window).load(function () {
    // Workspace's material's TOC
    if ($('#workspaceMaterialsTOCWrapper').length > 0) {
      
      // Prevent page scroll happening if TOC scroll reaches bottom
      $('.workspace-materials-toc-content-inner').on('DOMMouseScroll mousewheel', function(ev) {
        var $this = $(this),
          scrollTop = this.scrollTop,
          scrollHeight = this.scrollHeight,
          height = $this.height(),
          delta = (ev.type == 'DOMMouseScroll' ?
                ev.originalEvent.detail * -40 :
                ev.originalEvent.wheelDelta),
              up = delta > 0;
    
         var prevent = function() {
           ev.stopPropagation();
           ev.preventDefault();
           ev.returnValue = false;
           return false;
         }
    
         if (!up && -delta > scrollHeight - height - scrollTop) {
           // Scrolling down, but this will take us past the bottom.
           $this.scrollTop(scrollHeight);
           return prevent();
         } else if (up && delta > scrollTop) {
           // Scrolling up, but this will take us past the top.
           $this.scrollTop(0);
           return prevent();
          }
      });
    }
  });

  $(document).on('change', '.muikku-field', function (event, data) {
    $(this).removeClass('muikku-field-correct-answer muikku-field-incorrect-answer');
    var page = $(this).closest('.workspace-materials-view-page');
    var saveButton = $(page).find('.muikku-save-page');
    if (saveButton.length) {
      saveButton
        .removeClass('save-successful')          
        .text(saveButton.data('unsaved-text'));
    }
  });
  
  $(document).ready(function () {
    var getEvaluationFee = function (workspaceEntityId, callback) {
      mApi().user.users.basicinfo
        .read(MUIKKU_LOGGED_USER)
        .callback($.proxy(function (err, basicInfo) {
          if (err) {
            callback(err);
          } else {
            if (basicInfo && basicInfo.hasEvaluationFees) {
              mApi().workspace.workspaces.feeInfo
                .read(workspaceEntityId)
                .callback(function (feeErr, feeInfo) {
                  if (feeErr) {
                    callback(feeErr);
                  } else {
                    callback(null, feeInfo && feeInfo.evaluationHasFee);
                  }
                });
            } else {
              callback(null, false);
            }
          }
        }, this));
    };
    
    if (MUIKKU_LOGGEDINROLES.student && ($('.canSignUp').val() == 'true')) {
      var workspaceEntityId = $('.workspaceEntityId').val();
      
      mApi().workspace.workspaces.students
        .read(workspaceEntityId, { studentIdentifier: MUIKKU_LOGGED_USER, archived: false })
        .callback(function(err, result) {
          if (!err) {
            if (!result || !result.length) {
              var signUpLink = $('<a>')
                .attr('href', 'javascript:void(null)').text(getLocaleText('plugin.workspace.materials.notSignedUpWarningLink'))
                .click(function () {
                  getEvaluationFee(workspaceEntityId, function (err, hasEvaluationFee) {
                    if (err) {
                      $('.notification-queue').notificationQueue('notification', 'error', err);
                    } else {
                      $('<div>').workspaceSignUpDialog({
                        workspaceName: $('.workspaceName').val(),
                        workspaceNameExtension: $('.workspaceNameExtension').val(),
                        hasEvaluationFee: hasEvaluationFee,
                        workspaceEntityId: workspaceEntityId
                      });
                    }
                  });
                });
              
              var warning = $('<span>')
                .text(getLocaleText('plugin.workspace.materials.notSignedUpWarning') + ' ')
                .append(signUpLink)
                .append('.');
           
              $('.notification-queue').notificationQueue('notification', 'warn', warning);
            }
          }
        });
    }
    else if (MUIKKU_LOGGEDINROLES.student) {
      var workspaceEntityId = $('.workspaceEntityId').val();
      mApi().workspace.workspaces.students
        .read(workspaceEntityId, { studentIdentifier: MUIKKU_LOGGED_USER, archived: false })
        .callback(function(err, result) {
          if (!err) {
            if (!result || !result.length) {
              var warning = $('<span>')
                .text(getLocaleText('plugin.workspace.materials.cannotSignUpWarning'));
              $('.notification-queue').notificationQueue('notification', 'warn', warning);
            }
          }
        });
    }
  });

}).call(this);