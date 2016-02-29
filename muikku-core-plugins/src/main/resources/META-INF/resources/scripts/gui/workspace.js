(function() {
  'use strict';
  
  $(document).on('click', '.dock-static-navi-button-evaluation > a.icon-evaluate', function(event){
    event.preventDefault();
    var workspaceEntityId = $('.workspaceEntityId').length > 0 ? $('.workspaceEntityId').val() : $('input[name="workspaceEntityId"]').val();
    var evaluationUrl = $(this).attr('href')+'?workspaceEntityId='+workspaceEntityId;
    window.open(evaluationUrl, '_blank');
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

    if ($('.workspace-dock-navi-button-cancel-evaluation'.length > 0)) {
      $('.workspace-dock-navi-button-cancel-evaluation').hide();
    }
   
  });

  $(document).on('click', '.workspace-dock-navi-button-evaluation', function (event) {
    
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
    var workspaceEntityId = $('.workspaceEntityId').val();

    mApi().workspace.workspaces.feeInfo.read(workspaceEntityId).callback($.proxy(function (err, data) {
      if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
      } else {
        renderDustTemplate('workspace/workspace-evaluation-request-confirm.dust', data, $.proxy(function (text) {
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
                
                var workspaceEntityId = $('.workspaceEntityId').val();
                var message = $('#evaluationRequestAdditionalMessage').val();

                mApi({async: false}).assessmentrequest.workspace.assessmentRequests.create(parseInt(workspaceEntityId, 10), {
                  'requestText': message
                }).callback(function(err, result) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  } else {
                    
                    var evalButton = $('.workspace-dock-navi-button-evaluation');

                    evalButton
                      .children('.icon-assessment-' + evalButton.attr('data-state'))
                        .removeClass('icon-assessment-' + evalButton.attr('data-state'))
                        .addClass('icon-assessment-pending')
                        .children('span')
                          .text(getLocaleText("plugin.workspace.evaluation.cancelEvaluationButtonTooltip"));
                  
                    evalButton.attr('data-state', 'pending');
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
        }, this))
      }
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
            
            var workspaceEntityId = parseInt($('.workspaceEntityId').val(), 10);
            
            mApi().assessmentrequest.workspace.assessmentRequests.read(workspaceEntityId, { studentIdentifier: MUIKKU_LOGGED_USER }).callback($.proxy(function(err, result) {
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', err);
              } else {
                if (result && result.length) {
                  var assessmentRequestId = result[result.length - 1].id;
                  mApi().assessmentrequest.workspace.assessmentRequests.del(workspaceEntityId, assessmentRequestId).callback($.proxy(function(err, result) {
                    if (err) {
                      $('.notification-queue').notificationQueue('notification', 'error', err);
                    } else {
                      
                      var evalButton = $('.workspace-dock-navi-button-evaluation');

                      evalButton
                        .children('.icon-assessment-' + evalButton.attr('data-state'))
                          .removeClass('icon-assessment-' + evalButton.attr('data-state'))
                          .addClass('icon-assessment-unassessed')
                          .children('span')
                            .text(getLocaleText("plugin.workspace.evaluation.requestEvaluationButtonTooltip"));
                    
                      evalButton.attr('data-state', 'canceled');
                      
                      $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.workspace.evaluation.cancelEvaluation.notificationText"));
                    }
    
                    $(this).dialog("destroy").remove();
                  }, this));
                } else {
                  // TODO: Localize
                  $('.notification-queue').notificationQueue('notification', 'error', 'Could not find assessment request');
                }
              }
            }, this));
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {         
            var evalButton = $('.workspace-dock-navi-button-evaluation');

            evalButton.attr('data-state', 'pending');
            evalButton.children('.icon-assessment-cancel').removeClass('icon-assessment-cancel').addClass('icon-assessment-pending');
            $(this).dialog("destroy").remove();
          }
        }]
      });
    }, this));
  }

}).call(this);