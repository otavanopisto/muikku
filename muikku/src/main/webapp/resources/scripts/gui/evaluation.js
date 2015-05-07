(function() {
  'use strict';
  
  // Overrides JQuery.UI dialog setting that prevents html being inserted into title
  $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
    _title: function(title) {
      if (!this.options.title ) {
          title.html("&#160;");
      } else {
          title.html(this.options.title);
      }
    }
  })); 
  
  $.widget("custom.evaluationSlyder", {
    options : {
      workspaceEntityId: null
    },
    
    _create : function() {
      this.element.append($('<div>').addClass('evaluation-views-slyder'));
      
      this._pagesLoaded = {};
      
      this._loadPage(0, $.proxy(function () {
        this._loadPage(1, $.proxy(function () {
          this.element.sly({
            horizontal: 1,
            itemNav: 'forceCentered',
            smart: false,
            activateMiddle: 1,
            mouseDragging: 1,
            touchDragging: 1,
            releaseSwing: 1,
            startAt: 0,
            scrollBy: 0,
            speed: 300,
            elasticBounds: 1,
            easing: 'easeOutExpo',
            scrollBar: '.scrollbar',
            prevPage: '.prevPage',
            nextPage: '.nextPage',
            dragHandle: 1,
            dynamicHandle: 1,
            minHandleSize: 50,
            clickBar: 1,
            syncSpeed: 0.5
          })
          .sly('on', 'active', $.proxy(this._onSlyActive, this));
        }, this));
      }, this));
    },
    
    _loadPage: function (pageId, callback) {
      console.log("look! im loading a page!");
      
      if (pageId == 0) {
        $('#contentEvaluation').append($('<div>').addClass('content-loading').append($('<div>').addClass('icon-spinner')));
      }

      this._pagesLoaded[pageId] = 'LOADING';
      
      $.ajax({
        url : CONTEXTPATH + '/evaluation/' + this.options.workspaceEntityId + '/page/' + pageId + '?maxStudents=' + this.options.maxStudents,
        success : $.proxy(function(data) {
          this._pagesLoaded[pageId] = 'LOADED';
          
          this.element.find('.evaluation-views-slyder').append($(data).css('width', this.element.width()));
          this.element.sly('reload');
              
          if ($.isFunction(callback)) {
            callback();
          }
        } ,this),
        complete : $.proxy(function(data) {
          
          if (pageId == 0) {
            $('.content-loading')
              .animate({
                opacity: 0
            },{
              duration:900,
              easing: "easeInOutQuint",
              complete: function () {
                $('.content-loading').remove();
              }
            });
          }
          
        } ,this)
      });
    },
    
    _onSlyActive: function (eventName, index) {
      if (!this._pagesLoaded[index + 1]) {
        this._loadPage(index + 1);
      } else {
        console.log("look! im NOT loading a page!");
      }
    },
    
    _destroy: function () {
      
    }
  });
  
  function openWorkspaceEvaluationDialog(workspaceEntityId, workspaceStudentEntityId){
    renderDustTemplate('evaluation/evaluation_evaluate_workspace_modal_view.dust', {
      gradingScales: $.parseJSON($('input[name="grading-scales"]').val())
    }, $.proxy(function (text) {
      var dialog = $(text); 
      
      dialog.dialog({
        modal: true, 
        resizable: false,
        width: 'auto',
        height: 'auto',
        title: '<span class="modal-title-student-name">Esimerkki Opiskelija 1</span><span class="modal-title-workspace-name">GE1 - Sininen planeetta</span>',
        dialogClass: "evaluation-evaluate-modal",
        open: function() {
          // TODO: Assessor select
          
          $(this).find('input[name="evaluated"]')
            .css({'z-index': 9999, 'position': 'relative'})
            .attr('type', 'text')
            .datepicker();
          
          $(this).find('input[name="evaluated"]')
            .datepicker('setDate', new Date());
        },
        buttons: [{
          'text': dialog.data('button-save-text'),
          'class': 'save-evaluation-button',
          'click': function(event) {
            var gradeValue = $(this).find('select[name="grade"]')
              .val()
              .split('@', 2);
            var grade = gradeValue[0].split('/', 2);
            var gradingScale = gradeValue[1].split('/', 2);
            // TODO: Switch to ISO 8601
            var evaluated = $(this).find('input[name="evaluated"]').datepicker('getDate').getTime();
            //TODO: Save to pyramus
            mApi().workspace.workspaces.assessments.create(workspaceEntityId, {
              evaluated: evaluated,
              gradeIdentifier: grade[0],
              gradeSchoolDataSource: grade[1],
              gradingScaleIdentifier: gradingScale[0],
              gradingScaleSchoolDataSource: gradingScale[1],
              workspaceUserEntityId: workspaceStudentEntityId,
              assessorEntityId: MUIKKU_LOGGED_USER_ID,
              verbalAssessment: $(this).find('#evaluateFormLiteralEvaluation').val()
            }).callback($.proxy(function (err, result) {
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', err);
                console.log(result);
              } else { 
                $(this).dialog("destroy").remove();
              }
            }, this));
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-evaluation-button',
          'click': function(event) {
            $(this).dialog("destroy").remove();
          }
        }]
      });
    }, this));
  };
  
  function openMaterialEvaluationDialog(workspaceEntityId, workspaceMaterialId, materialId, materialTitle, materialHtml, materialType, studentEntityId, studentDisplayName, workspaceMaterialEvaluation) {
    renderDustTemplate('evaluation/evaluation_evaluate_assignment_modal_view.dust', {
      studentDisplayName: studentDisplayName,
      gradingScales: $.parseJSON($('input[name="grading-scales"]').val()),
      assessors: $.parseJSON($('input[name="assessors"]').val()),
      workspaceName: $('input[name="workspaceName"]').val(),
      assignments: [{
        workspaceMaterialId: workspaceMaterialId,
        materialId: materialId,
        title: materialTitle, 
        html: materialHtml,
        type: materialType,
      }]
    }, $.proxy(function (text) {
      var dialog = $(text);
      
      dialog.dialog({
        modal: true, 
        resizable: false,
        width: 'auto',
        height: 'auto',
        dialogClass: "evaluation-evaluate-modal",
        open: function() {
          $(this).find('input[name="evaluated"]')
            .css({'z-index': 9999, 'position': 'relative'})
            .attr('type', 'text')
            .datepicker();
          
          if (!workspaceMaterialEvaluation) {
            $(this).find('input[name="evaluated"]')
              .datepicker('setDate', new Date());
          } else {
            var gradeId = 
              workspaceMaterialEvaluation.gradeIdentifier + '/' + workspaceMaterialEvaluation.gradeSchoolDataSource + '@' + 
              workspaceMaterialEvaluation.gradingScaleIdentifier + '/' + workspaceMaterialEvaluation.gradingScaleSchoolDataSource;
                
            $(this).find('input[name="evaluated"]')
              .datepicker('setDate', new Date(workspaceMaterialEvaluation.evaluated));
            $(this).find('#evaluateFormLiteralEvaluation').val(workspaceMaterialEvaluation.verbalAssessment);
            $(this).find('select[name="grade"]').val(gradeId);
            $(this).find('select[name="assessor"]').val(workspaceMaterialEvaluation.assessorEntityId);
          }
          
          mApi().workspace.workspaces.materials.replies.read(workspaceEntityId, workspaceMaterialId, {
            userEntityId: studentEntityId
          }).callback(function (err, reply) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {

              var fieldAnswers = {};
              if (reply && reply.answers.length) {
                for (var i = 0, l = reply.answers.length; i < l; i++) {
                  var answer = reply.answers[i];
                  var answerKey = [answer.materialId, answer.embedId, answer.fieldName].join('.');
                  fieldAnswers[answerKey] = answer.value;
                }
              }
              
              $(document).muikkuMaterialLoader('loadMaterials', $('.evaluation-assignment'), fieldAnswers);
            }
          });
          
        },
        buttons: [{
          'text': dialog.data('button-save-text'),
          'class': 'save-evaluation-button',
          'click': function(event) {
            var gradeValue = $(this).find('select[name="grade"]')
              .val()
              .split('@', 2);
            var grade = gradeValue[0].split('/', 2);
            var gradingScale = gradeValue[1].split('/', 2);
            // TODO: Switch to ISO 8601
            var evaluated = $(this).find('input[name="evaluated"]').datepicker('getDate').getTime();
            var assessorEntityId = $(this).find('select[name="assessor"]').val();
            
            if (workspaceMaterialEvaluation && workspaceMaterialEvaluation.id) {
              mApi().workspace.workspaces.materials.evaluations.update(workspaceEntityId, workspaceMaterialId, workspaceMaterialEvaluation.id, {
                evaluated: evaluated,
                gradeIdentifier: grade[0],
                gradeSchoolDataSource: grade[1],
                gradingScaleIdentifier: gradingScale[0],
                gradingScaleSchoolDataSource: gradingScale[1],
                assessorEntityId: assessorEntityId,
                studentEntityId: studentEntityId,
                workspaceMaterialId: workspaceMaterialId,
                verbalAssessment: $(this).find('#evaluateFormLiteralEvaluation').val()
              }).callback($.proxy(function (err, result) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                } else { 
                  $(this).dialog("destroy").remove();
                }
              }, this));
            } else {
              mApi().workspace.workspaces.materials.evaluations.create(workspaceEntityId, workspaceMaterialId, {
                evaluated: evaluated,
                gradeIdentifier: grade[0],
                gradeSchoolDataSource: grade[1],
                gradingScaleIdentifier: gradingScale[0],
                gradingScaleSchoolDataSource: gradingScale[1],
                assessorEntityId: assessorEntityId,
                studentEntityId: studentEntityId,
                workspaceMaterialId: workspaceMaterialId,
                verbalAssessment: $(this).find('#evaluateFormLiteralEvaluation').val()
              }).callback($.proxy(function (err, result) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                } else { 
                  $(this).dialog("destroy").remove();
                }
              }, this));
            }
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-evaluation-button',
          'click': function(event) {
            $(this).dialog("destroy").remove();
          }
        }]
      });
    }, this));
  }

  $(document).ready(function() {
    var workspaceEntityId = $('#evaluation-views-wrapper').attr('data-workspace-entity-id');
    
    $(document).muikkuMaterialLoader({
      loadAnswers: false,
      workspaceEntityId: workspaceEntityId
    });
    
    $('#evaluation-views-wrapper')
      .evaluationSlyder({
        workspaceEntityId: workspaceEntityId,
        maxStudents: 6
      });

    // Evaluation's workspaces
    if ($('#evaluationQueueWrapper').length > 0) {
      
      var height = $(window).height();
      var queueWrapper = $('#evaluationQueueContainer');
      var queueOpenCloseButton = $('.wi-evaluation-queue-navi-button-toc > .icon-navicon');
      var assigmentContainer = $('#evaluationStudentAssignmentListingWrapper');

      var queueWrapperWidth = queueWrapper.width();
      var queueWrapperLeftMargin = "-" + queueWrapperWidth + "px";
      var queueWrapperLeftMargin = "-" + queueWrapperWidth + "px";
      var contentMinLeftOffset = queueWrapperWidth + 20;
      var assigmentContainerRightPadding = 20;
        
      // Prevent icon-navicon link from working normally
      $(queueOpenCloseButton).bind('click', function(e) {
        e.stopPropagation();
      });

    };
    
    //Prevent page scroll happening if scrollable area reaches bottom
    $(document)
    .on('DOMMouseScroll mousewheel', '.evaluation-workspacelist-content-inner, .evaluation-modal-evaluateForm-header, .evaluation-modal-evaluateForm-content, .evaluation-modal-studentAssignmentWrapper', function(ev) {
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
    
    $(document).on('click', '.evaluation-student-wrapper', function(event){
      var workspaceEntityId = $('input[name="workspace-entity-id"]').val();
      var workspaceStudentEntityId = $(this).attr('data-workspace-student-entity-id');
      openWorkspaceEvaluationDialog(workspaceEntityId, workspaceStudentEntityId);
    });
    
    /* Evaluate assignment when its state is DONE or CRITICAL (means its late) */
    $(document).on('click', '.assignment-done, .assignment-evaluation-critical', function (event) {
      var workspaceEntityId = $('input[name="workspace-entity-id"]').val();
      var workspaceMaterialId = $(this).attr('data-workspace-material-id');
      var materialId = $(this).attr('data-material-id');
      var materialTitle = $(this).attr('data-material-title');
      var materialHtml = $(this).attr('data-material-html');
      var materialType = $(this).attr('data-material-type');
      var studentEntityId = $(this).attr('data-student-entity-id');
      var studentDisplayName = $(this)
        .closest('.evaluation-view-wrapper')
        .find('.evaluation-student-wrapper[data-user-entity-id=' + studentEntityId + ']')
        .attr('data-display-name');
      
      openMaterialEvaluationDialog(workspaceEntityId, workspaceMaterialId, materialId, materialTitle, materialHtml, materialType, studentEntityId, studentDisplayName, null);
    });
    
    /* View evaluation when assigment's state is EVALUATED */
    $(document).on('click', '.assignment-evaluated', function (event) {
      var workspaceEntityId = $('input[name="workspace-entity-id"]').val();
      var workspaceMaterialId = $(this).attr('data-workspace-material-id');
      var materialId = $(this).attr('data-material-id');
      var materialTitle = $(this).attr('data-material-title');
      var materialHtml = $(this).attr('data-material-html');
      var materialType = $(this).attr('data-material-type');
      var studentEntityId = $(this).attr('data-student-entity-id');
      var studentDisplayName = $(this)
        .closest('.evaluation-view-wrapper')
        .find('.evaluation-student-wrapper[data-user-entity-id=' + studentEntityId + ']')
        .attr('data-display-name');
      var workspaceMaterialEvaluationId = $(this).attr('data-workspace-material-evaluation-id');
      
      mApi().workspace.workspaces.materials.evaluations.read(workspaceEntityId, workspaceMaterialId, workspaceMaterialEvaluationId)
        .callback(function (err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else { 
            openMaterialEvaluationDialog(workspaceEntityId, workspaceMaterialId, materialId, materialTitle, materialHtml, materialType, studentEntityId,studentDisplayName,  result);
          }
        });
    });
    
    //Student user picture tooltip show on mouseover
    $(document).on('mouseover', '.evaluation-workspacelist-item', function (event) {
      
      var sName = $(this).attr('data-workspace-title');
      var sContainerLoc = $(this).offset().top - $('.evaluation-workspacelist-wrapper').offset().top;
      
      $('#workspaceTitleContainer').css({
        position: 'absolute',
        left: '30px',
        top: sContainerLoc
      })
      .show()
      .clearQueue()
      .stop()
      .animate({
          opacity: 1
        },{
          duration:150,
          easing: "easeInOutQuint",
          complete: function () {

          }
        })
      .text(sName);

    });
    
    //Student user picture tooltip hide on mouseout
    $(document).on('mouseout', '.evaluation-workspacelist-item', function (event) {
      
      $('#workspaceTitleContainer')
      .clearQueue()
      .stop()
      .animate({
          opacity: 0
        },{
          duration:150,
          easing: "easeInOutQuint",
          complete: function () {
            $(this).hide();
          }
        });

    });

  });
  

  
}).call(this);
