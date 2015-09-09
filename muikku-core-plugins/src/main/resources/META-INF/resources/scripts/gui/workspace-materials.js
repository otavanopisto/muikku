(function() {
  'use strict';
  
   function scrollToPage(workspaceMaterialId, animate) {
    var topOffset = 100;
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
      workspaceEntityId: $('.workspaceEntityId').val()
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
    
    $('.muikku-connect-field').muikkuConnectField('refresh');
    
    $(window).data('initializing', false);
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
  
  function createWorkspcaeMaterialReply(workspaceEntityId, workspaceMaterialId, state, callback) {
    mApi().workspace.workspaces.materials.replies
      .create(workspaceEntityId, workspaceMaterialId, {
        state: state
      }) 
      .callback(function (err, reply) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.workspace.materials.answerSavingFailed', err));
        } else {
          if ($.isFunction(callback)) {
            callback(reply);
          }
        }
      });
  }
  
  function updateWorkspaceMaterialReply(workspaceEntityId, workspaceMaterialId, id, state, callback) {
    mApi().workspace.workspaces.materials.replies
      .update(workspaceEntityId, workspaceMaterialId, id, {
        state: state
      }) 
      .callback(function (err, reply) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.workspace.materials.answerSavingFailed', err));
        } else {
          if ($.isFunction(callback)) {
            callback();
          }
        }
      });
  }
  
  function findWorkspaceMaterialReply(workspaceEntityId, workspaceMaterialId, callback) {
    mApi().workspace.workspaces.materials.replies
      .read(workspaceEntityId, workspaceMaterialId, {
        userEntityId: MUIKKU_LOGGED_USER_ID
      }) 
      .callback(function (err, replies) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.workspace.materials.answerSavingFailed', err));
        } else {
          if ($.isFunction(callback)) {
            callback(replies.length ? replies[0] : null);
          }
        }
      });
  }
  
  function saveWorkspaceMaterialReply(workspaceEntityId, workspaceMaterialId, state, callback) {
    findWorkspaceMaterialReply(workspaceEntityId, workspaceMaterialId, function (reply) {
      if (reply) {
        updateWorkspaceMaterialReply(workspaceEntityId, workspaceMaterialId, reply.id, state, function () {
          if ($.isFunction(callback)) {
            callback(reply);
          }
        });
      } else {
        createWorkspcaeMaterialReply(workspaceEntityId, workspaceMaterialId, state, function (createdReply) {
          if ($.isFunction(callback)) {
            callback(createdReply);
          }
        });
      }
    });
  }

  $(document).on('click', '.muikku-check-exercises, .muikku-withdraw-assignment, .muikku-update-assignment, .muikku-submit-assignment', function (event, data) {
    var button = $(event.target);
    var page = $(this).closest('.workspace-materials-view-page');
    var workspaceEntityId = $('.workspaceEntityId').val(); //  TODO: data?
    var workspaceMaterialId = $(page).data('workspace-material-id');
    var button.attr('data-state');

    saveWorkspaceMaterialReply(workspaceEntityId, workspaceMaterialId, state, function (reply) {
      button.text(button.attr('data-done-text'));
      page.attr({
        'data-workspace-material-state': state,
        'data-workspace-reply-id': reply.id
      });
    });
  });
  
/**
  $(document).on('click', '.muikku-save-page', function (event, data) {
    var page = $(this).closest('.workspace-materials-view-page');
    var workspaceEntityId = $('.workspaceEntityId').val(); //  TODO: data?
    var workspaceMaterialId = $(page).data('workspace-material-id');
    var reply = [];
    var exercise = $(page).data('workspace-material-assigment-type') == "EXERCISE" ;
      
    page.find('.muikku-field-examples').remove();
    page.find('.muikku-field').each(function (index, field) {
      $(field).removeClass('muikku-field-correct-answer muikku-field-incorrect-answer');
      
      reply.push({
        value: $(field).muikkuField('answer'),
        embedId: $(field).muikkuField('embedId'),
        materialId: $(field).muikkuField('materialId'),
        fieldName: $(field).muikkuField('fieldName')
      });
    });
    
    mApi().workspace.workspaces.materials.replies.create(workspaceEntityId, workspaceMaterialId, {
      workspaceMaterialId: workspaceMaterialId,
      state: 'SUBMITTED',
      answers: reply
    })
    .callback($.proxy(function (err) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error',getLocaleText('plugin.workspace.materials.answerSavingFailed', err));
      } else {
        if (exercise) {
          // Correct answer checking
          page.find('.muikku-field').each(function (index, field) {
            if ($(field).muikkuField('canCheckAnswer')) {
              $(field).addClass($(field).muikkuField('isCorrectAnswer') ? 'muikku-field-correct-answer' : 'muikku-field-incorrect-answer');
            }
            else {
              if ($(field).muikkuField('hasExamples')) {
                var exampleDetails = $('<span>')
                  .addClass('muikku-field-examples')
                  .attr('data-for-field', $(field).attr('name'));
                
                exampleDetails.append( 
                  $('<span>')
                    .addClass('muikku-field-examples-title')
                    .text(getLocaleText('plugin.workspace.assigment.checkAnswers.detailsSummary.title'))
                );
                
                $.each($(field).muikkuField('getExamples'), function (index, example) {
                  exampleDetails.append(
                    $('<span>') 
                      .addClass('muikku-field-example')
                      .text(example)    
                  );
                });

                $(field).after(exampleDetails);
              }
            }
          });
        } 
        
        // Save button
        $(this)
          .addClass("save-successful")
          .text(exercise ? getLocaleText('plugin.workspace.materials.exerciseSaved') : getLocaleText('plugin.workspace.materials.assignmentSaved'));
      } 
    }, this));
  });
**/
}).call(this);