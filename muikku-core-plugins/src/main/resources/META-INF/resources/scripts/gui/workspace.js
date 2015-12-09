(function() {
  'use strict';
  
  $(document).on('click', '.wi-dock-static-navi-button-evaluation > a.icon-evaluate', function(event){
    event.preventDefault();
    var evaluationUrl = $(this).attr('href')+'?workspaceEntityId='+$('.workspaceEntityId').val();
    window.location.href = evaluationUrl;
  });
  
  $(document).on('click', '.workspace-publish-button', function (event) {
    var workspaceEntityId = $('.workspaceEntityId').val();

    mApi({async: false}).workspace.workspaces.read(workspaceEntityId).callback(function (err, workspace) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', err);
      } else {
        workspace.published = true;        
        mApi({async: false}).workspace.workspaces.update(workspaceEntityId, workspace).callback(function (updErr) {
          if (updErr) {
            $('.notification-queue').notificationQueue('notification', 'error', updErr);
          } else {
            $('.workspace-publish-button').hide();
            $('.workspace-unpublish-button').show();
            $('.workspace-publication-container').data('published', true);
          }
        });
      }
    });
  });
    
  $(document).on('click', '.workspace-unpublish-button', function (event) {
    var workspaceEntityId = $('.workspaceEntityId').val();

    mApi({async: false}).workspace.workspaces.read(workspaceEntityId).callback(function (err, workspace) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', err);
      } else {
        workspace.published = false;        
        mApi({async: false}).workspace.workspaces.update(workspaceEntityId, workspace).callback(function (updErr) {
          if (updErr) {
            $('.notification-queue').notificationQueue('notification', 'error', updErr);
          } else {
            $('.workspace-publish-button').show();
            $('.workspace-unpublish-button').hide();
            $('.workspace-publication-container').data('published', false);
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

  window.onload = function(e) {
    if ($('.workspace-publication-container')) {
      var published = $('.workspace-publication-container').data('published');
      if (published) {
        $('.workspace-publish-button').hide();
        $('.workspace-unpublish-button').show();
      }
      else {
        $('.workspace-publish-button').show();
        $('.workspace-unpublish-button').hide();
      }
    }
  };

  $(document).ready(function() {
    $('#staticNavigationWrapperWorkspace').waypoint('sticky', {
      stuckClass : 'stuckStNav'
    });
  
    // Workspace navigation
    if ($('#workspaceNavigationWrapper').length > 0) {
      refreshNavigationWrapperPosition();
      $(window).resize(function(){
        refreshNavigationWrapperPosition();
      });
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
          'class': 'save-evaluation-button',
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

            mApi({async: false}).assessmentrequest.workspace.assessmentRequests.create(parseInt(workspaceEntityId, 10), {
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
          'class': 'cancel-evaluation-button',
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
            
            mApi({async: false}).assessmentrequest.workspace.request.read(workspaceEntityId).callback(function(err, result) {
              var assessmentRequestId = result.id;
              
              mApi({async: false}).assessmentrequest.workspace.assessmentRequests.del(workspaceEntityId, assessmentRequestId).callback(function(err, result) {
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
