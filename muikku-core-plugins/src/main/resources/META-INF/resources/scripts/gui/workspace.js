(function() {
  'use strict';
  
  $(document).on('click', '.workspace-publish-button', function (event) {
    var workspaceEntityId = $('.workspaceEntityId').val();

    mApi().workspace.workspaces.read(workspaceEntityId).callback(function (err, workspace) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', err);
      } else {
        workspace.published = true;        
        mApi().workspace.workspaces.update(workspaceEntityId, workspace).callback(function (updErr) {
          if (updErr) {
            $('.notification-queue').notificationQueue('notification', 'error', updErr);
          } else {
            window.location.reload(true); 
          }
        });
      }
    });
  });
    
  $(document).on('click', '.workspace-unpublish-button', function (event) {
    var workspaceEntityId = $('.workspaceEntityId').val();

    mApi().workspace.workspaces.read(workspaceEntityId).callback(function (err, workspace) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', err);
      } else {
        workspace.published = false;        
        mApi().workspace.workspaces.update(workspaceEntityId, workspace).callback(function (updErr) {
          if (updErr) {
            $('.notification-queue').notificationQueue('notification', 'error', updErr);
          } else {
            window.location.reload(true); 
          }
        });
      }
    });
  });
  
  function refreshNavigationWrapperPosition() {
    var contentContainer = ($('#contentWorkspaceMaterials').length > 0 ? contentContainer = $('#contentWorkspaceMaterials') : contentContainer = $('#content'));
    var naviWrapper = $('#workspaceNavigationWrapper');
    $(naviWrapper).css({
      left:(Math.max(contentContainer.offset().left - naviWrapper.width() - 30, 10)) + 'px'
    });
  }

  $(document).ready(function() {
    
    $('#staticNavigationWrapperWorkspace').waypoint('sticky', {
      stuckClass : 'stuckStNav'
    });
  
    var contentContainer = ($('#contentWorkspaceMaterials').length > 0 ? contentContainer = $('#contentWorkspaceMaterials') : contentContainer = $('#content'));
    
    // Workspace navigation
    if ($('#workspaceNavigationWrapper').length > 0) {
      refreshNavigationWrapperPosition();
      $(window).resize(function(){
        refreshNavigationWrapperPosition();
      });
      
      // Workspace's material's TOC
      if ($('#workspaceMaterialsTOCWrapper').length > 0) {
        
        var tocWrapper = $('#workspaceMaterialsTOCWrapper');
        var cOffset = contentContainer.offset();
        var tocLeftPos = cOffset.left + contentContainer.width() - tocWrapper.width();
        
        $(tocWrapper).css({
          left:tocLeftPos + 'px'
        })
        
        $(window).resize(function(){
          cOffset = contentContainer.offset();
          tocLeftPos = cOffset.left + contentContainer.width() - tocWrapper.width();
          
          $(tocWrapper).css({
            left:tocLeftPos + 'px'
          })
          
        });
        
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
  
    }
    
    if ($('.wi-workspace-dock-navi-button-cancel-evaluation'.length > 0)) {
      $('.wi-workspace-dock-navi-button-cancel-evaluation').hide();
    }
   
  });

  $(document).on('click', '.wi-workspace-dock-navi-button-evaluation', function (event) {
    
    if ($(this).attr('data-state') == 'unassessed') {
      confirmEvaluationRequest(); 
    }
    
    if ($(this).attr('data-state') == 'pending') {
      $(this).attr('data-state', 'cancel');
      $(this).children('.icon-assessment-pending').removeClass('icon-assessment-pending').addClass('icon-assessment-cancel');
      confirmEvaluationCancellation();
    }
    
    if ($(this).attr('data-state') == 'canceled') {
      confirmEvaluationRequest(); 
    }
    
    if ($(this).attr('data-state') == 'pass') {
      confirmEvaluationRequest(); 
    }
    
    if ($(this).attr('data-state') == 'fail') {
      confirmEvaluationRequest();
    }
    
  });
  

  function confirmEvaluationRequest() {
    renderDustTemplate('workspace/workspace-evaluation-request-confirm.dust', { }, $.proxy(function (text) {
      var dialog = $(text);
      $(text).dialog({
        modal: true, 
        minHeight: 200,
        maxHeight: $(window).height() - 50,
        resizable: false,
        width: 560,
        dialogClass: "workspace-evaluation-confirm-dialog",
        buttons: [{
          'text': dialog.data('button-request-text'),
          'class': 'request-button',
          'click': function(event) {
            
            var evalButton = $('.wi-workspace-dock-navi-button-evaluation');

            evalButton
              .children('.icon-assessment-' + evalButton.attr('data-state'))
                .removeClass('icon-assessment-' + evalButton.attr('data-state'))
                .addClass('icon-assessment-pending')
                .children('span')
                  .text(getLocaleText("plugin.workspace.evaluation.cancelEvaluationButtonTooltip"));
          
            evalButton.attr('data-state', 'pending');
            
            var workspaceEntityId = $('.workspaceEntityId').val();
            var message = $('#evaluationRequestAdditionalMessage').val();

            mApi().assessmentrequest.workspace.assessmentRequests.create(parseInt(workspaceEntityId, 10), {
              'requestText': message
            }).callback(function(err, result) {
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', err);
              } else {
                $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.workspace.evaluation.requestEvaluation.notificationText"));
              }
            });
            
            $(this).dialog("destroy").remove();
            
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog("destroy").remove();
          }
        }]
      });
    }, this));
  }
  
  function confirmEvaluationCancellation() {
    renderDustTemplate('workspace/workspace-evaluation-cancellation-confirm.dust', { }, $.proxy(function (text) {
      var dialog = $(text);
      $(text).dialog({
        modal: true, 
        minHeight: 200,
        maxHeight: $(window).height() - 50,
        resizable: false,
        width: 560,
        dialogClass: "workspace-evaluation-confirm-dialog",
        buttons: [{
          'text': dialog.data('button-cancellation-text'),
          'class': 'cancellation-button',
          'click': function(event) {
            
            var evalButton = $('.wi-workspace-dock-navi-button-evaluation');

            evalButton
              .children('.icon-assessment-' + evalButton.attr('data-state'))
                .removeClass('icon-assessment-' + evalButton.attr('data-state'))
                .addClass('icon-assessment-unassessed')
                .children('span')
                  .text(getLocaleText("plugin.workspace.evaluation.requestEvaluationButtonTooltip"));
          
            evalButton.attr('data-state', 'canceled');
            
            var workspaceEntityId = parseInt($('.workspaceEntityId').val(), 10);
            
            mApi().assessmentrequest.workspace.request.read(workspaceEntityId).callback(function(err, result) {
              var assessmentRequestId = result.id;
              
              mApi().assessmentrequest.workspace.assessmentRequests.del(workspaceEntityId, assessmentRequestId).callback(function(err, result) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                } else {
                  $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.workspace.evaluation.cancelEvaluation.notificationText"));
                }
              });
            });
            
            $(this).dialog("destroy").remove();
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            
            var evalButton = $('.wi-workspace-dock-navi-button-evaluation');

            
            evalButton.attr('data-state', 'pending');
            evalButton.children('.icon-assessment-cancel').removeClass('icon-assessment-cancel').addClass('icon-assessment-pending');
            $(this).dialog("destroy").remove();
          }
        }]
      });
    }, this));
  }

}).call(this);
