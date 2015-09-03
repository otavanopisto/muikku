(function() {
  'use strict';
  
  var ASSIGNMENTS = null;
  
  function getAssignmentData(workspaceMaterialId) {
    for (var i = 0, l = ASSIGNMENTS.length; i < l; i++) {
      if (ASSIGNMENTS[i].workspaceMaterialId == parseInt(workspaceMaterialId)) {
        return ASSIGNMENTS[i];
      }
    }
    
    return null;
  }
  
  $(document).on('afterHtmlMaterialRender', function (event, data) {
    $(data.pageElement).find('textarea').each(function (index, textarea) {
      $(textarea).css("min-height", $(textarea).prop('scrollHeight'));
    });

    $(data.pageElement)
      .find('img')
      .trigger("appear");
    
    /* If last element inside article is floating this prevents mentioned element from overlapping its parent container */
    $(data.pageElement)
    .append($('<div>').addClass('clear'));
  });
  
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
      workspaceEntityId: null,
      workspaceStudentCount: 0
    },
    
    _create : function() {
      var placeholderHeight = $(window).height() - this.element.offset().top;
      
      this.element.append($('<div>').addClass('evaluation-views-slyder'));
      var pageCount = Math.ceil(this.options.workspaceStudentCount / this.options.maxStudents);
      for (var i = 0; i < pageCount; i++) {
        this.element.find('.evaluation-views-slyder')
          .append($('<div>')
            .attr('data-page-id', i)
            .css({
              'width': this.element.width(),
              'height': placeholderHeight + 'px'
            })
            .addClass('evaluation-view-wrapper evaluation-view-placeholder')
            .append($('<div>').addClass('content-loading').append($('<div>').addClass('icon-spinner')))
          );
      }
      
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
      
      this._pagesLoaded = {};

      this._loadPage(0, $.proxy(function() {
        this._loadPage(1);
      }, this));
    },
    
    _loadPage: function (pageId, callback) {
      this._pagesLoaded[pageId] = 'LOADING';
      
      $.ajax({
        url : CONTEXTPATH + '/evaluation/' + this.options.workspaceEntityId + '/page/' + pageId + '?maxStudents=' + this.options.maxStudents,
        success : $.proxy(function(data) {
          this._pagesLoaded[pageId] = 'LOADED';
          var parsed = $(data);
          var studentAssignmentDatas = {};
          
          var studentNodes = parsed.find('.evaluation-student-wrapper');
          studentNodes.each(function (studentIndex, studentElement) {
            var assignmentData = $.parseJSON($(studentElement).attr('data-assignment-data'));
            $.each(assignmentData, function (index, entry) {
              studentAssignmentDatas[$(studentElement).attr('data-workspace-student-entity-id') + '_' + entry.workspaceMaterialId] = entry;
            });
          });
          
          $.each(ASSIGNMENTS, function (assignmentIndex, assignment) {
            var row = $('<div>').addClass('evaluation-student-assignment-listing-row')

            studentNodes.each(function (studentIndex, studentElement) {
              var studentAssignmentData = studentAssignmentDatas[$(studentElement).attr('data-workspace-student-entity-id') + '_' + assignment.workspaceMaterialId];
              
              var wrapper = $('<div>')
                .addClass('evaluation-assignment-wrapper')
                .attr({
                  'data-workspace-material-id': assignment.workspaceMaterialId,
                  'data-workspace-material-evaluation-id': studentAssignmentData.workspaceMaterialEvaluationId,
                  'data-student-entity-id': $(studentElement).attr('data-user-entity-id')
                })
                .append($('<div>').addClass('evaluation-assignment-picture'))
                .append($('<div>').addClass('evaluation-assignment-title').text(assignment.title))
                .appendTo(row);
              
              if (studentAssignmentData.lastModified != null) {
                wrapper.append($('<div>').addClass('evaluation-assignment-date').text(formatDate(new Date(studentAssignmentData.lastModified))));
              }
              
              switch (studentAssignmentData.status) {
                case 'DONE':
                  wrapper.addClass('assignment-done');
                break;
                case 'EVALUATED':
                  wrapper.addClass('assignment-evaluated');
                break;
                case 'EVALUATION_CRITICAL':
                  wrapper.addClass('assignment-evaluation-critical');
                break;
              } 
            });
            parsed.find('.evaluation-student-assignment-listing-wrapper').append(row);
          });
          
          $('.evaluation-view-placeholder[data-page-id=' + pageId + ']')
            .replaceWith(parsed.css('width', this.element.width()));
              
          if ($.isFunction(callback)) {
            callback();
          }
        } ,this),
        complete : $.proxy(function(data) {

        } ,this)
      });
    },
    
    _onSlyActive: function (eventName, index) {
      if (!this._pagesLoaded[index + 1]) {
        this._loadPage(index + 1);
      } 
    },
    
    _destroy: function () {
      
    }
  });

  function openWorkspaceEvaluationDialog(workspaceEntityId, studentEntityId, workspaceStudentEntityId, studentDisplayName, studentStudyProgrammeName, alreadyEvaluated, evaluationData, studentElement){
    renderDustTemplate('evaluation/evaluation_evaluate_workspace_modal_view.dust', {
      studentDisplayName: studentDisplayName,
      gradingScales: $.parseJSON($('input[name="grading-scales"]').val()),
      assessors: $.parseJSON($('input[name="assessors"]').val()),
      workspaceName: $('input[name="workspaceName"]').val(),
      assignments: ASSIGNMENTS,
      studentStudyProgrammeName: studentStudyProgrammeName
    }, $.proxy(function (text) {
      var dialog = $(text); 
      
      dialog.dialog({
        modal: true, 
        resizable: false,
        width: 'auto',
        height: 'auto',
        title: '<span class="modal-title-student-name">'+studentDisplayName+'</span><span class="modal-title-workspace-name">'+$('input[name="workspaceName"]').val()+'</span>',
        dialogClass: "evaluation-evaluate-modal",
        close: function () {
          $(this).remove();
        },
        open: function() {
          
          var datePickerLocale = getLocale() == 'en' ? '' : getLocale();
          $(this).find('input[name="evaluationDate"]')
            .css({'z-index': 9999, 'position': 'relative'})
            .attr('type', 'text')
            .datepicker({
              firstDay: 1
            });
          $(this).find('input[name="evaluationDate"]').datepicker('option', $.datepicker.regional[datePickerLocale]);
          
          if (!alreadyEvaluated) {
            $(this).find('input[name="evaluationDate"]').datepicker('setDate', new Date()); 
          } else {
            $(this).find('input[name="evaluationDate"]').datepicker('setDate', new Date(evaluationData.date));
            $(this).find('#evaluateFormLiteralEvaluation').val(evaluationData.verbalAssessment);
            $(this).find('select[name="grade"]').val(evaluationData.gradeString);
            $(this).find('select[name="assessor"]').val(evaluationData.assessingUserEntityId);
          }
          
          var verbalAssessmentEditor = $("#evaluateFormLiteralEvaluation")[0];
        
          CKEDITOR.replace(verbalAssessmentEditor, {
            height : '200px',
            toolbar: [
                      { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
                      { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'Undo', 'Redo' ] },
                      { name: 'links', items: [ 'Link' ] },
                      { name: 'insert', items: [ 'Image', 'Table', 'Smiley', 'SpecialChar' ] },
                      { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
                      { name: 'styles', items: [ 'Format' ] },
                      { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
                      { name: 'tools', items: [ 'Maximize' ] }
                    ]
          });
        
          var workspaceMaterialIds = $.map(ASSIGNMENTS, function (assignment) {
            return assignment.workspaceMaterialId;
          });
         
          var batchCalls = $.map(workspaceMaterialIds, function (workspaceMaterialId) {
            return mApi().workspace.workspaces.materials.replies.read(workspaceEntityId, workspaceMaterialId, {
              userEntityId: studentEntityId
            });
          });
          
          mApi().batch(batchCalls).callback(function (err, results) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              var answers = $.map(results, function(result) {
                return result.answers;
              });

              var fieldAnswers = {};
              if (answers && answers.length) {
                for (var i = 0, l = answers.length; i < l; i++) {
                  var answer = answers[i];
                  var answerKey = [answer.materialId, answer.embedId, answer.fieldName].join('.');
                  fieldAnswers[answerKey] = answer.value;
                }
              }
              
              $(document).muikkuMaterialLoader('loadMaterials', $(dialog).find('.evaluation-assignment'), fieldAnswers);
            }
          });
          
        },
        buttons: [{
          'text': dialog.data('button-save-text'),
          'class': 'save-evaluation-button',
          'click': function(event) {
            var gradeString = $(this).find('select[name="grade"]').val();
            var gradeValue = gradeString.split('@', 2);
            var grade = gradeValue[0].split('/', 2);
            var gradingScale = gradeValue[1].split('/', 2);
            var evaluationDate = $(this).find('input[name="evaluationDate"]').datepicker('getDate').getTime();
            var assessorEntityId = $(this).find('select[name="assessor"]').val();

            var verbalAssessment = CKEDITOR.instances.evaluateFormLiteralEvaluation.getData();
            
            if(alreadyEvaluated){
              mApi().workspace.workspaces.assessments.update(workspaceEntityId, evaluationData.assessmentIdentifier, {
                evaluated: evaluationDate,
                gradeIdentifier: grade[0],
                gradeSchoolDataSource: grade[1],
                gradingScaleIdentifier: gradingScale[0],
                gradingScaleSchoolDataSource: gradingScale[1],
                workspaceUserEntityId: workspaceStudentEntityId,
                assessorEntityId: assessorEntityId,
                verbalAssessment: verbalAssessment
              }).callback($.proxy(function (err, result) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                } else {
                  var newEvaluationData = {
                      'assessmentIdentifier': evaluationData.assessmentIdentifier,
                      'gradeString': gradeString,
                      'verbalAssessment':verbalAssessment,
                      'assessingUserEntityId':assessorEntityId,
                      'date':evaluationDate
                  };
                  studentElement.removeClass('workspace-assessment-requested workspace-assessment-critical');
                  studentElement.addClass('workspace-evaluated');
                  studentElement.attr('data-workspace-evaluated', 'true');
                  studentElement.attr('data-workspace-evaluation-data', JSON.stringify(newEvaluationData));
                  $(this).dialog("destroy").remove();
                }
              }, this));
            } else {
              mApi().workspace.workspaces.assessments.create(workspaceEntityId, {
                evaluated: evaluationDate,
                gradeIdentifier: grade[0],
                gradeSchoolDataSource: grade[1],
                gradingScaleIdentifier: gradingScale[0],
                gradingScaleSchoolDataSource: gradingScale[1],
                workspaceUserEntityId: workspaceStudentEntityId,
                assessorEntityId: assessorEntityId,
                verbalAssessment: verbalAssessment
              }).callback($.proxy(function (err, result) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                } else { 
                  var evaluationData = {
                      'assessmentIdentifier': result.identifier,
                      'gradeString': gradeString,
                      'verbalAssessment':verbalAssessment,
                      'assessingUserEntityId':assessorEntityId,
                      'date':evaluationDate
                  };
                  studentElement.removeClass('workspace-assessment-requested workspace-assessment-critical');
                  studentElement.addClass('workspace-evaluated');
                  studentElement.attr('data-workspace-evaluated', 'true');
                  studentElement.attr('data-workspace-evaluation-data', JSON.stringify(evaluationData));
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
  };
  
  function openMaterialEvaluationDialog(workspaceEntityId, workspaceMaterialId, studentEntityId, studentDisplayName, studentStudyProgrammeName, workspaceMaterialEvaluation, assigmentElement) {
    var assignmentData = getAssignmentData(workspaceMaterialId);
    
    renderDustTemplate('evaluation/evaluation_evaluate_assignment_modal_view.dust', {
      studentDisplayName: studentDisplayName,
      gradingScales: $.parseJSON($('input[name="grading-scales"]').val()),
      assessors: $.parseJSON($('input[name="assessors"]').val()),
      workspaceName: $('input[name="workspaceName"]').val(),
      studentStudyProgrammeName: studentStudyProgrammeName,
      assignments: [{
        workspaceMaterialId: assignmentData.workspaceMaterialId,
        materialId: assignmentData.materialId,
        title: assignmentData.title, 
        html: assignmentData.html,
        type: assignmentData.type
      }]
    }, $.proxy(function (text) {
      var dialog = $(text);
      
      dialog.dialog({
        modal: true, 
        resizable: false,
        width: 'auto',
        height: 'auto',
        title: '<span class="modal-title-student-name">'+studentDisplayName+'</span><span class="modal-title-workspace-name">'+$('input[name="workspaceName"]').val()+'</span>',
        dialogClass: "evaluation-evaluate-modal",
        close: function () {
          $(this).remove();
        },
        open: function() {
          $(this).find('input[name="evaluationDate"]')
            .css({'z-index': 9999, 'position': 'relative'})
            .attr('type', 'text')
            .datepicker();
          
          if (!workspaceMaterialEvaluation) {
            $(this).find('input[name="evaluationDate"]')
              .datepicker('setDate', new Date());
          } else {
            var gradeId = 
              workspaceMaterialEvaluation.gradeIdentifier + '/' + workspaceMaterialEvaluation.gradeSchoolDataSource + '@' + 
              workspaceMaterialEvaluation.gradingScaleIdentifier + '/' + workspaceMaterialEvaluation.gradingScaleSchoolDataSource;
                
            $(this).find('input[name="evaluationDate"]')
              .datepicker('setDate', new Date(workspaceMaterialEvaluation.evaluated));
            $(this).find('#evaluateFormLiteralEvaluation').val(workspaceMaterialEvaluation.verbalAssessment);
            $(this).find('select[name="grade"]').val(gradeId);
            $(this).find('select[name="assessor"]').val(workspaceMaterialEvaluation.assessorEntityId);
          }
        
          var verbalAssessmentEditor = $("#evaluateFormLiteralEvaluation")[0];
      
          CKEDITOR.replace(verbalAssessmentEditor, {
            height : '200px',
            toolbar: [
                      { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
                      { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'Undo', 'Redo' ] },
                      { name: 'links', items: [ 'Link' ] },
                      { name: 'insert', items: [ 'Image', 'Table', 'Smiley', 'SpecialChar' ] },
                      { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
                      { name: 'styles', items: [ 'Format' ] },
                      { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
                      { name: 'tools', items: [ 'Maximize' ] }
                    ]
          });
            
          
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
              
              $(document).muikkuMaterialLoader('loadMaterials', $(dialog).find('.evaluation-assignment'), fieldAnswers);
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
            var evaluationDate = $(this).find('input[name="evaluationDate"]').datepicker('getDate').getTime();
            var assessorEntityId = $(this).find('select[name="assessor"]').val();
            var verbalAssessment = CKEDITOR.instances.evaluateFormLiteralEvaluation.getData();
            
            if (workspaceMaterialEvaluation && workspaceMaterialEvaluation.id) {
              mApi().workspace.workspaces.materials.evaluations.update(workspaceEntityId, workspaceMaterialId, workspaceMaterialEvaluation.id, {
                evaluated: evaluationDate,
                gradeIdentifier: grade[0],
                gradeSchoolDataSource: grade[1],
                gradingScaleIdentifier: gradingScale[0],
                gradingScaleSchoolDataSource: gradingScale[1],
                assessorEntityId: assessorEntityId,
                studentEntityId: studentEntityId,
                workspaceMaterialId: workspaceMaterialId,
                verbalAssessment: verbalAssessment
              }).callback($.proxy(function (err, result) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                } else {
                  assigmentElement.removeClass('assignment-done assignment-evaluation-critical');
                  assigmentElement.addClass('assignment-evaluated');
                  assigmentElement.attr('data-workspace-material-evaluation-id', result.id);
                  $(this).dialog("destroy").remove();
                }
              }, this));
            } else {
              mApi().workspace.workspaces.materials.evaluations.create(workspaceEntityId, workspaceMaterialId, {
                evaluated: evaluationDate,
                gradeIdentifier: grade[0],
                gradeSchoolDataSource: grade[1],
                gradingScaleIdentifier: gradingScale[0],
                gradingScaleSchoolDataSource: gradingScale[1],
                assessorEntityId: assessorEntityId,
                studentEntityId: studentEntityId,
                workspaceMaterialId: workspaceMaterialId,
                verbalAssessment: verbalAssessment
              }).callback($.proxy(function (err, result) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                } else {
                  assigmentElement.removeClass('assignment-done assignment-evaluation-critical');
                  assigmentElement.addClass('assignment-evaluated');
                  assigmentElement.attr('data-workspace-material-evaluation-id', result.id);
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
    ASSIGNMENTS = $.parseJSON($('input[name="assignments"]').val())
    
    $(document).muikkuMaterialLoader({
      loadAnswers: false,
      readOnlyFields: true,
      workspaceEntityId: workspaceEntityId
    });
    
    $('#evaluation-views-wrapper')
      .evaluationSlyder({
        workspaceEntityId: workspaceEntityId,
        maxStudents: 6,
        workspaceStudentCount: $('input[name="workspaceStudentCount"]').val()
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
      var studentElement = $(this).closest('.evaluation-student-wrapper');
      var studentDisplayName = studentElement.attr('data-display-name');
      var studentStudyProgrammeName = studentElement.attr('data-study-programme-name');
      
      var studentEntityId = $(this).attr('data-user-entity-id');
      var evaluated = $(this).attr('data-workspace-evaluated') == 'true' ? true : false;
      var evaluationData = {};
      if (evaluated) {
        evaluationData = JSON.parse($(this).attr('data-workspace-evaluation-data'));
      }
      
      openWorkspaceEvaluationDialog(workspaceEntityId, studentEntityId, workspaceStudentEntityId, studentDisplayName, studentStudyProgrammeName, evaluated, evaluationData, $(this));
    });
    
    /* Evaluate assignment when its state is DONE or CRITICAL (means its late) */
    $(document).on('click', '.assignment-done, .assignment-evaluation-critical', function (event) {
      var workspaceEntityId = $('input[name="workspace-entity-id"]').val();
      var workspaceMaterialId = $(this).attr('data-workspace-material-id');
      var studentEntityId = $(this).attr('data-student-entity-id');
      var studentElement = $(this)
        .closest('.evaluation-view-wrapper')
        .find('.evaluation-student-wrapper[data-user-entity-id=' + studentEntityId + ']');
    
      var studentDisplayName = studentElement.attr('data-display-name');
      var studentStudyProgrammeName = studentElement.attr('data-study-programme-name');
  
      openMaterialEvaluationDialog(workspaceEntityId, workspaceMaterialId, studentEntityId, studentDisplayName, studentStudyProgrammeName, null, $(this));
    });
    
    /* View evaluation when assigment's state is EVALUATED */
    $(document).on('click', '.assignment-evaluated', function (event) {
      var workspaceEntityId = $('input[name="workspace-entity-id"]').val();
      var workspaceMaterialId = $(this).attr('data-workspace-material-id');
      var studentEntityId = $(this).attr('data-student-entity-id');
      var studentElement = $(this)
        .closest('.evaluation-view-wrapper')
        .find('.evaluation-student-wrapper[data-user-entity-id=' + studentEntityId + ']');
      
      var studentDisplayName = studentElement.attr('data-display-name');
      var studentStudyProgrammeName = studentElement.attr('data-study-programme-name');
      var workspaceMaterialEvaluationId = $(this).attr('data-workspace-material-evaluation-id');
      
      mApi().workspace.workspaces.materials.evaluations.read(workspaceEntityId, workspaceMaterialId, workspaceMaterialEvaluationId)
        .callback(function (err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else { 
            openMaterialEvaluationDialog(workspaceEntityId, workspaceMaterialId, studentEntityId, studentDisplayName, studentStudyProgrammeName, result, $(this));
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
