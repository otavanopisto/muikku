(function() {
  'use strict';
  
   var timeout = null;
   //this allows that when one user is scrolling really fast only if a section stays active for more than half
   //a second it'll be saved, this should be enough so that if the user decides to immediatly close, he/she'll probably
   //take longer
   var timeOneSectionMustBeOnViewUntilItIsSavedForTheContinueStudiesView = 500;
  
   function scrollToPage(workspaceMaterialId, animate) {
    var topOffset = 90;
    var scrollTop = $('#page-' + workspaceMaterialId).offset().top - topOffset;
    if (animate) {
      $(window).data('scrolling', true);
      $('html,body').animate({
        scrollTop : scrollTop
      }, {
        duration : 500,
        easing : "easeInOutQuad",
        complete : function() {
          $('#materialsScrollableTOC').find('a.active').removeClass('active');
          $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
          window.location.hash = 'p-' + workspaceMaterialId;
          scrollTop = $('#page-' + workspaceMaterialId).offset().top - topOffset;
          $('html,body').scrollTop(scrollTop);
          Waypoint.refreshAll();
          $(window).data('scrolling', false);
        }
      });
    }
    else {
      $('html,body').scrollTop(scrollTop);
      $('#materialsScrollableTOC').find('a.active').removeClass('active');
      $('#materialsScrollableTOC').find('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
      window.location.hash = 'p-' + workspaceMaterialId;
    }
  }
   
  function setLastWorkspace(){
    var tocItem = $('#materialsScrollableTOC').find('a.active'); 
    if (tocItem.length) {
      var workspaceEntityId = $('.workspaceEntityId').val();
      mApi().workspace.workspaces.amIMember
        .read(workspaceEntityId)
        .callback(function(err, result) {
          if (!err && result) {
            var url = window.location.href;
            var workspaceName = $('.workspaceName').val();
            var workspaceNameExtension = $('.workspaceNameExtension').val();
            if (workspaceNameExtension) {
              workspaceName += ' (' + workspaceNameExtension + ')';
            }
            var materialName = $(tocItem).text();
            var lastWorkspace = {
              url: url,
              workspaceName: workspaceName,
              materialName: materialName
            }
            mApi().user.property.create({key: 'last-workspace', value: JSON.stringify(lastWorkspace)});
          }
        });
    }
  }
  
  $(window).load(function() {
    if ($(window).data('initial-page')) {
      scrollToPage($(window).data('initial-page'), true);
    }
  });

  $(window).on('beforeunload', setLastWorkspace);
  
  $(document).on('click', '.workspace-materials-toc-item a', function (event) {
    event.preventDefault();
    scrollToPage($($(this).attr('href')).data('workspaceMaterialId'), true);
  });

  $(document).ready(function() {
    if (window.location.hash && (window.location.hash.indexOf('p-') > 0)) {
      $(window).data('initial-page', window.location.hash.substring(3)); 
    }
    
    $("#materialsScrollableTOC").perfectScrollbar({
      wheelSpeed:3,
      swipePropagation:false
    });

    $(window).data('initializing', true);
    $(document).muikkuMaterialLoader({
      loadAnswers: MUIKKU_LOGGED_USER ? true : false,
      readOnlyFields: MUIKKU_LOGGED_USER ? false: true,
      workspaceEntityId: $('.workspaceEntityId').val(),
      baseUrl: $('.materialsBaseUrl').val()
    }).muikkuMaterialLoader('loadMaterials', $('.material-page'));

    $('.material-page[data-assignment-type="EXERCISE"]').each(function (index, page) {
      $(page).prepend($('<div>')
          .addClass('muikku-page-assignment-type exercise')
          .text(getLocaleText("plugin.workspace.materialsLoader.exerciseAssignmentLabel"))
      );
    });
    
    $('.material-page[data-assignment-type="EVALUATED"]').each(function (index, page) {
      $(page).prepend($('<div>')
          .addClass('muikku-page-assignment-type assignment')
          .text(getLocaleText("plugin.workspace.materialsLoader.evaluatedAssignmentLabel"))
      );
    });

    $('.material-page').waypoint({
      handler : function(direction) {
        if ($(window).data('scrolling') !== true && $(window).data('initializing') !== true) {
          var workspaceMaterialId = $(this.element).data('workspace-material-id');
          $('#materialsScrollableTOC').find('a.active').removeClass('active');
          $('#materialsScrollableTOC').find('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
          window.location.hash = 'p-' + workspaceMaterialId;
          $(window).data('scrolling', true);
          Waypoint.refreshAll();
          $(window).data('scrolling', false);
          
          clearTimeout(timeout);
          timeout = setTimeout(setLastWorkspace, timeOneSectionMustBeOnViewUntilItIsSavedForTheContinueStudiesView);
        }
      }, 
      offset: 150
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
    var page = $(this).closest('.material-page');
    var saveButton = $(page).find('.muikku-save-page');
    if (saveButton.length) {
      saveButton
        .removeClass('save-successful')          
        .text(saveButton.data('unsaved-text'));
    }
  });
  
  $(document).ready(function () {
    var getEvaluationFee = function (workspaceEntityId, callback) {
      mApi().user.whoami.read()
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
    
    if ($('.isUserLoggedIn').val() == 'false') {
      
      var logInGuidingIcon = $('<div>')
        .addClass('notification-queue-login-guiding-icon');
      
      var backToFrontPageLink = $('<a>')
        .attr('href', '/')
        .text(getLocaleText('plugin.workspace.logInGuidingLink') + ' ');
      
      var logInGuide = $('<div>')
        .addClass('notification-queue-login-guiding-wrapper')
        .append(logInGuidingIcon)
        .append($('<div>')
          .addClass('notification-queue-login-guiding-title')
          .text(getLocaleText('plugin.workspace.logInGuidingTitle') + ' ')
        )
        .append($('<div>')
          .addClass('notification-queue-login-guiding-text')
          .text(getLocaleText('plugin.workspace.logInGuidingInformation') + ' ')
        )
        .append($('<div>')
          .addClass('notification-queue-login-guiding-link')
          .append(backToFrontPageLink)
        );
 
      $('.notification-queue').notificationQueue('notification', 'guiding', logInGuide);
    }
    
    if ($('.maySignUp').val() == 'true') {
      var workspaceEntityId = $('.workspaceEntityId').val();
      if ($('.canSignUp').val() == 'true') {
        mApi().workspace.workspaces.amIMember
          .read(workspaceEntityId)
          .callback(function(err, result) {
            if (!err && result === false) {
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
          });
      }
      else {
        mApi().workspace.workspaces.amIMember
          .read(workspaceEntityId)
          .callback(function(err, result) {
            if (!err && result === false) {
              var warning = $('<span>')
                .text(getLocaleText('plugin.workspace.materials.cannotSignUpWarning'));
              $('.notification-queue').notificationQueue('notification', 'warn', warning);
            }
          });
      }
    }
  });
  
  $(document).on('afterHtmlMaterialRender', function (event, data) {
    var license = $(data.pageElement).attr('data-license');
    var producers = $(data.pageElement).attr('data-producers');
    
    if (license || producers) {
      $('<footer>')
        .articleDetails({
          license: license,
          producers: producers
        })
        .appendTo(data.pageElement);
    }
  });
  
}).call(this);