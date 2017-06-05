(function() {
  'use strict';
  
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
  
  $(document).on('click', '#workspaceNavigationWrapperBuble', function (event) {
    
    if ($(this).attr('data-nav-visibility-state') == 'open') {
      $(this).find('.navmore-container').hide();
      $(this).attr('data-nav-visibility-state', 'close');
    } else {
      $(this).find('.navmore-container').show();
      $(this).attr('data-nav-visibility-state', 'open');
    }
    
  });

  $(document).on('click', '.workspace-dock-navi-button-evaluation', function (event) {
    if ($.inArray($(this).attr('data-state'), ['pending', 'pending_pass', 'pending_fail']) >= 0) {
      confirmEvaluationCancellation();
    }
    else {
      confirmEvaluationRequest(); 
    }
  });

  function confirmEvaluationRequest() {
    var workspaceEntityId = $('.workspaceEntityId').val();
    mApi().workspace.workspaces.feeInfo.read(workspaceEntityId).callback($.proxy(function (err, data) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', err);
      }
      else {
        renderDustTemplate('workspace/workspace-evaluation-request-confirm.dust', data, $.proxy(function (text) {
          var dialog = $(text);
          $(text).dialog({
            modal: true, 
            minHeight: 200,
            resizable: false,
            width: 560,
            dialogClass: "workspace-evaluation-confirm-dialog",
            beforeClose: function(event, ui) {
              $(this).dialog().remove(); 
            },
            buttons: [{
              'text': dialog.data('button-request-text'),
              'class': 'save-evaluation-button',
              'click': function() {
                $('.save-evaluation-button').prop('disabled', true);
                var workspaceEntityId = $('.workspaceEntityId').val();
                var message = $('#evaluationRequestAdditionalMessage').val();

                mApi({async: false}).assessmentrequest.workspace.assessmentRequests.create(parseInt(workspaceEntityId, 10), {
                  'requestText': message
                }).callback(function(err) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  }
                  else {
                    var evalButton = $('.workspace-dock-navi-button-evaluation');
                    var state = evalButton.attr('data-state');
                    if (state == 'unassessed') {
                      state = 'pending';
                    }
                    else if (state == 'pass') {
                      state = 'pending_pass';
                    }
                    else if (state == 'fail') {
                      state = 'pending_fail';
                    }
                    evalButton
                      .attr('data-state', state)
                      .children('a')
                        .attr('class', '')
                        .attr('title', getLocaleText("plugin.workspace.evaluation.cancelEvaluationButtonTooltip"))
                        .addClass('icon-assessment-pending tooltip')
                        .children('span')
                          .text(getLocaleText("plugin.workspace.evaluation.cancelEvaluationButtonTooltip"));
                    $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.workspace.evaluation.requestEvaluation.notificationText"));
                  }
                });
                
                $(this).dialog("destroy");
                
              }
            }, {
              'text': dialog.data('button-cancel-text'),
              'class': 'cancel-button',
              'click': function() {
                $(this).dialog("destroy");
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
                    }
                    else {
                      var evalButton = $('.workspace-dock-navi-button-evaluation');
                      var state = evalButton.attr('data-state');
                      var tooltip = 'plugin.workspace.evaluation.resendRequestEvaluationButtonTooltip';
                      if (state == 'pending') {
                        state = 'unassessed';
                        tooltip = 'plugin.workspace.evaluation.requestEvaluationButtonTooltip';
                      }
                      else if (state == 'pending_pass') {
                        state = 'pass';
                      }
                      else if (state == 'pending_fail') {
                        state = 'fail';
                      }
                      evalButton
                        .attr('data-state', state)
                        .children('a')
                          .attr('class', '')
                          .attr('title', getLocaleText(tooltip))
                          .addClass('icon-assessment-' + state + ' tooltip')
                          .children('span')
                            .text(getLocaleText(tooltip));
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

  $(document).ready(function () {
    var workspaceEntityId = $('.workspaceEntityId').val();
    if (workspaceEntityId) {
      var evaluationLink = $('.dock-static-navi-button-evaluation > a.icon-evaluate');
      if (evaluationLink) {
        var href = $(evaluationLink).attr('href');
        $(evaluationLink).attr('href', href + '?workspaceEntityId=' + workspaceEntityId);
        $(evaluationLink).attr('target', '_blank');
      }
    }
  });

}).call(this);