(function() {
  'use strict';
  
  $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
    _title: function(title) {
      if (this.options.htmlTitle) {
        title.html(this.options.htmlTitle);
      } else {
        title.text(this.options.title);
      }
    }
  }));
  
  $.widget( "custom.evaluateWorkspaceDialog", {
    options: {
      studentStudyProgrammeName: null,
      studentDisplayName: null,
      workspaceName: null,
      workspaceEvaluableAssignments: null,
      gradingScales: [],
      assessors: [],
      evaluationDate: null,
      evaluationGradeId: null,
      assessorEntityId: null,
      verbalAssessment: null,
      studentEntityId: null,
      workspaceEntityId: null,
      triggeringElement: null,
      studentAnswers: [],
      ckeditor: {
        height : '200px',
        entities: false,
        entities_latin: false,
        entities_greek: false,
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
      }
    },
    
    _create: function () {
      this._load($.proxy(function (text) {
        this._dialog = $(text);
        
        this._dialog.dialog({
          modal: true, 
          resizable: false,
          width: 'auto',
          height: 'auto',
          htmlTitle: '<span class="modal-title-student-name">'
                    +this.options.studentDisplayName
                    +'</span><span class="modal-title-workspace-name">'
                    +this.options.workspaceName
                    +'</span>',
          dialogClass: "evaluation-evaluate-modal",
          close: $.proxy(function () {
            this.element.remove();
          }, this),
          open: $.proxy(function() {
            $(this._dialog).find('input[name="evaluationDate"]')
              .css({'z-index': 9999, 'position': 'relative'})
              .attr('type', 'text')
              .datepicker();
            
            $(this._dialog).find("#evaluationStudentAssignmentWrapper").perfectScrollbar({
              wheelSpeed:3,
              swipePropagation:false
            });
            
            $(this._dialog).find(".evaluation-modal-evaluateForm-content").perfectScrollbar({
              wheelSpeed:3,
              swipePropagation:false
            });
            
            $(this._dialog).find('input[name="evaluationDate"]')
              .datepicker('setDate', this.options.evaluationDate||new Date());
            
            if (this.options.evaluationGradeId) {
              $(this._dialog).find('select[name="grade"]').val(this.options.evaluationGradeId);
            }
            
            if (this.options.assessorEntityId) {
              $(this._dialog).find('select[name="assessor"]').val(this.options.assessorEntityId);
            }
            
            if (this.options.verbalAssessment) {
              $(this._dialog).find('#evaluateFormLiteralEvaluation').val(this.options.verbalAssessment);
            }

            CKEDITOR.replace(this._dialog.find("#evaluateFormLiteralEvaluation")[0], this.options.ckeditor);
            
            var batchCalls = $.map(this.options.workspaceEvaluableAssignments, $.proxy(function (workspaceEvaluableAssignment) {
              return mApi({async: false}).workspace.workspaces.materials.compositeMaterialReplies.read(this.options.workspaceEntityId, workspaceEvaluableAssignment.workspaceMaterial.id, {
                userEntityId: this.options.studentEntityId
              });
            }, this));
            
            mApi({async: false}).batch(batchCalls).callback($.proxy(function (err, results) {
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
                
                $(document).muikkuMaterialLoader('loadMaterials', $(this._dialog).find('.evaluation-assignment'), fieldAnswers);
              }
            }, this));
            
            this._dialog.find(".evaluation-assignment-title-container").click($.proxy(this._onAssignmentTitleClick, this));
            
          }, this),
          buttons: [{
            'text': this._dialog.attr('data-button-save-text'),
            'class': 'save-evaluation-button',
            'click': $.proxy(function(event) {
              var gradeString = $(this._dialog).find('select[name="grade"]').val();
              var gradeValue = gradeString.split('@', 2);
              var grade = gradeValue[0].split('/', 2);
              var gradingScale = gradeValue[1].split('/', 2);
              var assessedDate = $(this._dialog).find('input[name="evaluationDate"]').datepicker('getDate').getTime();
              var assessorEntityId = $(this._dialog).find('select[name="assessor"]').val();
              var workspaceEntityId = this.options.workspaceEntityId;
              var verbalAssessment = CKEDITOR.instances.evaluateFormLiteralEvaluation.getData();
              
              if(this.options.assessmentId){
                mApi({async: false}).workspace.workspaces.assessments.update(workspaceEntityId, this.options.assessmentId, {
                  evaluated: assessedDate,
                  gradeIdentifier: grade[0],
                  gradeSchoolDataSource: grade[1],
                  gradingScaleIdentifier: gradingScale[0],
                  gradingScaleSchoolDataSource: gradingScale[1],
                  workspaceUserEntityId: this.options.workspaceStudentEntityId,
                  assessorEntityId: assessorEntityId,
                  verbalAssessment: verbalAssessment
                }).callback($.proxy(function (err, result) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  } else {
                    this.options.triggeringElement.options.assessment = result;
                    var studentElement = $(this.options.triggeringElement.element);
                    if(studentElement.hasClass('workspace-evaluated')){
                      studentElement.find('.workspace-evaluated-date')
                        .text(formatDate(new Date(result.evaluated)));
                    }else{
                      var evaluatedDate = $('<div>')
                        .addClass('workspace-evaluated-date')
                        .text(formatDate(new Date(result.evaluated)));
                    
                      if(studentElement.hasClass('workspace-evaluation-requested')){
                        studentElement.find('.workspace-evaluation-requested-date').after(evaluatedDate);
                      }else{
                        evaluatedDate.prependTo(studentElement);
                      }
                      studentElement.removeClass('workspace-evaluation-requested');
                      studentElement.addClass('workspace-evaluated');
                    }
                    this.element.remove();
                  }
                }, this));
              } else {
                mApi({async: false}).workspace.workspaces.assessments.create(workspaceEntityId, {
                  evaluated: assessedDate,
                  gradeIdentifier: grade[0],
                  gradeSchoolDataSource: grade[1],
                  gradingScaleIdentifier: gradingScale[0],
                  gradingScaleSchoolDataSource: gradingScale[1],
                  workspaceUserEntityId: this.options.workspaceStudentEntityId,
                  assessorEntityId: assessorEntityId,
                  verbalAssessment: verbalAssessment
                }).callback($.proxy(function (err, result) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  } else {
                    this.options.triggeringElement.options.assessment = result;
                    var studentElement = $(this.options.triggeringElement.element);
                    if(studentElement.hasClass('workspace-evaluated')){
                      studentElement.find('.workspace-evaluated-date')
                        .text(formatDate(new Date(result.evaluated)));
                    }else{
                      var evaluatedDate = $('<div>')
                        .addClass('workspace-evaluated-date')
                        .text(formatDate(new Date(result.evaluated)));
                    
                      if(studentElement.hasClass('workspace-evaluation-requested')){
                        studentElement.find('.workspace-evaluation-requested-date').after(evaluatedDate);
                      }else{
                        evaluatedDate.prependTo(studentElement);
                      }
                      studentElement.removeClass('workspace-evaluation-requested');
                      studentElement.addClass('workspace-evaluated');
                    }

                    this.element.remove();
                  }
                }, this));
              }
            }, this)
          }, {
            'text': this._dialog.attr('data-button-cancel-text'),
            'class': 'cancel-evaluation-button',
            'click': $.proxy(function(event) {
              this.element.remove();
            }, this)
          }]
        });
      }, this));
    },
    
    destroy: function () {
      this._dialog.remove();
    },
    
    _load: function (callback) {
      var materialIds = $.map(this.options.workspaceEvaluableAssignments, function (workspaceEvaluableAssignment) {
        return workspaceEvaluableAssignment.workspaceMaterial.materialId;
      });
      
      $('#evaluation').evaluationLoader("loadHtmls", materialIds, $.proxy(function (err, htmlMaterials) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var htmlMaterialMap = {};
          $.each(htmlMaterials, function (index, htmlMaterial) {
            htmlMaterialMap[htmlMaterial.id] = htmlMaterial;
          });
          
          var assignments = [];
          for (var i = 0; i<this.options.workspaceEvaluableAssignments.length; i++) {
            var workspaceEvaluableAssignment = this.options.workspaceEvaluableAssignments[i];
            mApi({async: false}).workspace.workspaces.materials.evaluations
            .read(this.options.workspaceEntityId, workspaceEvaluableAssignment.workspaceMaterial.id, {userEntityId: this.options.studentEntityId})
            .callback($.proxy(function(err, evaluations) {
              var evaluation = null;
              if (evaluations != null && evaluations.length > 0) {
                evaluation = evaluations[0];
              }
              assignments.push({
                workspaceMaterialId: workspaceEvaluableAssignment.workspaceMaterial.id,
                materialId: workspaceEvaluableAssignment.workspaceMaterial.materialId,
                type: 'html',
                title: workspaceEvaluableAssignment.workspaceMaterial.title,
                html: htmlMaterialMap[workspaceEvaluableAssignment.workspaceMaterial.materialId].html,
                evaluation: evaluation
              });
            }, this));
          }
          this._loadTemplate(assignments, callback);
        }
      }, this));
    },
    
    _loadTemplate: function (assignments, callback) {
      renderDustTemplate('evaluation/evaluation_evaluate_workspace_modal_view.dust', {
        studentDisplayName: this.options.studentDisplayName,
        gradingScales: this.options.gradingScales,
        assessors: this.options.assessors,
        workspaceName: this.options.workspaceName,
        studentStudyProgrammeName: this.options.studentStudyProgrammeName,
        evaluableAssignments: assignments,
        exercises: []
      }, callback);
    },
    
    _onAssignmentTitleClick: function (event) {
      var assignment = $(event.target).closest('.evaluation-assignmentlist-wrapper');
      var content = $(assignment).find('.evaluation-assignment-content');
      var state = content.attr('data-open-state');
      content.attr('data-open-state', state == 'closed' ? 'open' : 'closed');
    }
  });
  
  $.widget( "custom.evaluateAssignmentDialog", {
    
    options: {
      studentDisplayName: null,
      studentAnswers: [],
      gradingScales: [],
      assessors: [],
      workspaceEntityId: null,
      workspaceName: null,
      studentStudyProgrammeName: null,
      workspaceMaterialId: null,
      workspaceMaterialTitle: null,
      materialId: null,
      triggeringElement: null,
      ckeditor: {
        height : '200px',
        entities: false,
        entities_latin: false,
        entities_greek: false,
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
      }
    },
    
    _create: function () {
      this._load($.proxy(function (text) {
        this._dialog = $(text);
        
        this._dialog.dialog({
          modal: true, 
          resizable: false,
          width: 'auto',
          height: 'auto',
          htmlTitle: '<span class="modal-title-student-name">'
                    +this.options.studentDisplayName
                    +'</span><span class="modal-title-workspace-name">'
                    +this.options.workspaceName
                    +'</span>',
          dialogClass: "evaluation-evaluate-modal",
          close: $.proxy(function () {
            this.element.remove();
          }, this),
          open: $.proxy(function() {
            $(this._dialog).find('input[name="evaluationDate"]')
              .css({'z-index': 9999, 'position': 'relative'})
              .attr('type', 'text')
              .datepicker();
            
            $(this._dialog).find("#evaluationStudentAssignmentWrapper").perfectScrollbar({
              wheelSpeed:3,
              swipePropagation:false
            });
            
            $(this._dialog).find(".evaluation-modal-evaluateForm-content").perfectScrollbar({
              wheelSpeed:3,
              swipePropagation:false
            });
            
            $(this._dialog).find('input[name="evaluationDate"]')
              .datepicker('setDate', this.options.evaluationDate||new Date());
            
            if (this.options.evaluationGradeId) {
              $(this._dialog).find('select[name="grade"]').val(this.options.evaluationGradeId);
            }
            
            if (this.options.assessorEntityId) {
              $(this._dialog).find('select[name="assessor"]').val(this.options.assessorEntityId);
            }
            
            if (this.options.verbalAssessment) {
              $(this._dialog).find('#evaluateFormLiteralEvaluation').val(this.options.verbalAssessment);
            }

            CKEDITOR.replace(this._dialog.find("#evaluateFormLiteralEvaluation")[0], this.options.ckeditor);
            
            var fieldAnswers = {};
            
            if (this.options.studentAnswers) {
              for (var i = 0, l = this.options.studentAnswers.length; i < l; i++) {
                var answer = this.options.studentAnswers[i];
                var answerKey = [answer.materialId, answer.embedId, answer.fieldName].join('.');
                fieldAnswers[answerKey] = answer.value;
              }
            }
            
            $(document).muikkuMaterialLoader('loadMaterials', $(this._dialog).find('.evaluation-assignment'), fieldAnswers);
          }, this),
          buttons: [{
            'text': this._dialog.attr('data-button-save-text'),
            'class': 'save-evaluation-button',
            'click': $.proxy(function(event) {
              var gradeValue = $(this._dialog).find('select[name="grade"]')
                .val()
                .split('@', 2);
              var grade = gradeValue[0].split('/', 2);
              var gradingScale = gradeValue[1].split('/', 2);
              // TODO: Switch to ISO 8601
              var evaluationDate = $(this._dialog).find('input[name="evaluationDate"]').datepicker('getDate').getTime();
              var assessorEntityId = $(this._dialog).find('select[name="assessor"]').val();
              var verbalAssessment = CKEDITOR.instances.evaluateFormLiteralEvaluation.getData();
              var workspaceMaterialId = this.options.workspaceMaterialId;
              var workspaceEntityId = this.options.workspaceEntityId;
              
              if (this.options.evaluationId) {
                mApi({async: false}).workspace.workspaces.materials.evaluations.update(workspaceEntityId, workspaceMaterialId, this.options.evaluationId, {
                  evaluated: evaluationDate,
                  gradeIdentifier: grade[0],
                  gradeSchoolDataSource: grade[1],
                  gradingScaleIdentifier: gradingScale[0],
                  gradingScaleSchoolDataSource: gradingScale[1],
                  assessorEntityId: assessorEntityId,
                  studentEntityId: this.options.studentEntityId,
                  workspaceMaterialId: workspaceMaterialId,
                  verbalAssessment: verbalAssessment
                }).callback($.proxy(function (err, result) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  } else {
                    this.options.triggeringElement.options.evaluation = result;
                    this.options.triggeringElement.element.addClass('assignment-evaluated');
                    this.options.triggeringElement.element.find('.evaluation-assignment-evaluated-date')
                      .text(getLocaleText("plugin.evaluation.evaluationGridEvaluated.label") + " " + formatDate(new Date(result.evaluated)));
                    this.element.remove();
                  }
                }, this));
              } else {
                mApi({async: false}).workspace.workspaces.materials.evaluations.create(workspaceEntityId, workspaceMaterialId, {
                  evaluated: evaluationDate,
                  gradeIdentifier: grade[0],
                  gradeSchoolDataSource: grade[1],
                  gradingScaleIdentifier: gradingScale[0],
                  gradingScaleSchoolDataSource: gradingScale[1],
                  assessorEntityId: assessorEntityId,
                  studentEntityId: this.options.studentEntityId,
                  workspaceMaterialId: workspaceMaterialId,
                  verbalAssessment: verbalAssessment
                }).callback($.proxy(function (err, result) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  } else {
                    this.options.triggeringElement.options.evaluation = result;
                    this.options.triggeringElement.element.addClass('assignment-evaluated');
                    this.options.triggeringElement.element.find('.evaluation-assignment-evaluated-date')
                      .text(getLocaleText("plugin.evaluation.evaluationGridEvaluated.label") + " " + formatDate(new Date(result.evaluated)));
                    this.element.remove();
                    
                  }
                }, this));
              }
            }, this)
          }, {
            'text': this._dialog.attr('data-button-cancel-text'),
            'class': 'cancel-evaluation-button',
            'click': $.proxy(function(event) {
              this.element.remove();
            }, this)
          }]
        });
      }, this));
    },
    
    destroy: function () {
      this._dialog.remove();
    },
    
    _load: function (callback) {
      $('#evaluation').evaluationLoader("loadHtml", this.options.materialId, $.proxy(function (err, htmlMaterial) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          this._loadTemplate(this.options.workspaceMaterialId, 
            htmlMaterial.id, 
            'html', 
            this.options.workspaceMaterialTitle, 
            htmlMaterial.html, 
            callback
          );
        }
      }, this));
    },
    
    _loadTemplate: function (workspaceMaterialId, materialId, materialType, materialTitle, materialHtml, callback) {
      renderDustTemplate('evaluation/evaluation_evaluate_assignment_modal_view.dust', {
        studentDisplayName: this.options.studentDisplayName,
        gradingScales: this.options.gradingScales,
        assessors: this.options.assessors,
        workspaceName: this.options.workspaceName,
        studentStudyProgrammeName: this.options.studentStudyProgrammeName,
        assignments: [{
          workspaceMaterialId: workspaceMaterialId,
          materialId: materialId,
          title: materialTitle, 
          html: materialHtml,
          type: materialType
        }]
      }, callback);
    }
  });
  
  $.widget("custom.evaluationLoader", {
    
    _create : function() {
      this._pendingStudentLoads = [];
      this._loadingStudent = false;

      this._pendingWorkspaceMaterialReplyLoads = [];
      this._loadingWorkspaceMaterialReplies = false;
      this._materialHtml = {};
    },

    loadHtmls: function (materialIds, callback) {
      var loads = $.map(materialIds, $.proxy(function (materialId) {
        return $.proxy(function (callbackMethod) {
          this.loadHtml(materialId, function (err, response) {
            callbackMethod(err, response);
          });
        }, this);
      }, this));
      
  
      async.series(loads, function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          callback(err, results);
        }
      });
    },
    
    loadHtml: function (materialId, callback) {
      if (this._materialHtml[materialId]) {
        if (this._materialHtml[materialId].loading === true) {
          this._materialHtml[materialId].pending.push(callback);
        } else {
          callback(null, this._materialHtml[materialId].htmlMaterial);
        }
      } else { 
        this._materialHtml[materialId] = {
          loading: true,
          pending: []
        };
        
        mApi({async: false}).materials.html
          .read(materialId)
          .callback($.proxy(function (err, htmlMaterial) {
            if (err) {
              callback(err, null);
            } else {
              this._materialHtml[materialId].htmlMaterial = htmlMaterial;
              this._materialHtml[materialId].loading = false;
              
              callback(null, htmlMaterial);
              
              $.each(this._materialHtml[materialId].pending, function (pendingCallback) {
                pendingCallback(null, htmlMaterial);
              });
              
              delete this._materialHtml[materialId].pending;
          }
        }, this));
      }
    },
    
    loadStudent: function (id, callback) {
      this._pendingStudentLoads.push({
        id: id,
        callback: callback
      });
      
      if (!this._loadingStudent) {
        this._loadNextStudent();
      }
    },
    
    loadWorkspaceMaterialRepliesAndEvaluations: function (workspaceEntityId, workspaceMaterialId, studentEntityId, callback) {
      mApi().workspace.workspaces.materials.compositeMaterialReplies
        .read(workspaceEntityId, workspaceMaterialId, {
          userEntityId: studentEntityId
        })
        .callback($.proxy(function (err, reply) {
          mApi().workspace.workspaces.materials.evaluations
          .read(workspaceEntityId, workspaceMaterialId, {userEntityId: studentEntityId})
          .callback($.proxy(function (err, evaluations) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              var evaluation = null;
              if (evaluations != null) {
                if (evaluations.length > 0) {
                  evaluation = evaluations[0];
                }
              }
              callback(reply, evaluation);
            }
          }, this));
        }, this)); 
    },
    
    _loadNextStudent: function () {
      if (this._pendingStudentLoads.length) { 
        this._loadingStudent = true;
        var pendingLoad = this._pendingStudentLoads.shift();
        
        // TODO: remove async false
        mApi({async: false}).user.users.basicinfo
          .read(pendingLoad.id)
          .callback($.proxy(function (err, user) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              pendingLoad.callback(user);
            }
            
            this._loadingStudent = false;
            this._loadNextStudent();
          }, this)); 
      }
    },
  });
  
  $.widget("custom.evaluation", {
    options: {
      workspaceEntityId: null
    },
    
    _create : function() {
      this._workspaceUsers = null;
      this._workspaceEvaluableAssignments = null;
      this._viewOffsetX = 0;
      this._viewOffsetY = 0;
      
      $('<button>')
        .addClass('prevPage icon-arrow-left')
        .on("click", $.proxy(this._onPrevPageClick, this))
        .appendTo(this.element);
      
      $('<div>')
        .addClass('evaluation-students')
        .appendTo(this.element);
      
      $('<div>')
        .addClass('evaluation-assignments')
        .appendTo(this.element);

      $('<button>')
        .addClass('nextPage icon-arrow-right')
        .on("click", $.proxy(this._onNextPageClick, this))
        .appendTo(this.element);

      this.element.on("studentsLoaded", $.proxy(this._onStudentsLoaded, this));
      this.element.on("materialsLoaded", $.proxy(this._onMaterialsLoaded, this));
      
      this._loadStudents();
    },
    
    workspaceName: function () {
      return this.element.attr('data-workspace-name');
    },
    
    workspaceEntityId: function () {
      return this.options.workspaceEntityId;
    },
    
    workspaceEvaluableAssignments: function () {
      return this._workspaceEvaluableAssignments;
    },
    
    _scrollView: function (x, y) {
      this._viewOffsetX += x;
      this._viewOffsetY += y;
      
      this.element.find('.evaluation-assignments,.evaluation-students')
        .css({
          marginLeft: (-this._viewOffsetX) + 'px',
          marginTop: this._viewOffsetY + 'px'
        });
      
      this.element.trigger('viewScroll', {
        viewOffsetX: this._viewOffsetX,
        viewOffsetY: this._viewOffsetY,
        viewOffsetChangeX: x,
        viewOffsetChangeY: y
      });
    },

    _loadStudents: function () {
      mApi({async: false}).workspace.workspaces.users
        .read(this.options.workspaceEntityId, {roleArchetype: "STUDENT"})
        .callback($.proxy(function (err, workspaceUsers) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            this.element.trigger("studentsLoaded", {
              workspaceUsers: workspaceUsers
            });
          }
        }, this)); 
    },
    
    _loadAssessmentRequests: function() {
      mApi().assessmentrequest.workspace.assessmentRequests
        .read(this.options.workspaceEntityId)
        .callback($.proxy(function(err, workspaceAssessmentRequests){
          if(err){
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            for(var i = 0; i < workspaceAssessmentRequests.length;i++){
              var workspaceAssessmentRequest = workspaceAssessmentRequests[i];
              var studentElement = $('.evaluation-students').find('div[data-workspace-user="'+workspaceAssessmentRequest.userEntityId+'"]');
              if(!studentElement.hasClass('workspace-evaluated')){
                studentElement.addClass('workspace-evaluation-requested');
              }
              if(studentElement.find('.workspace-evaluation-requested-date').length == 0){
                $('<div>')
                .attr('data-evaluation-date', workspaceAssessmentRequest.date)
                .addClass('workspace-evaluation-requested-date')
                .text(formatDate(new Date(workspaceAssessmentRequest.date)))
                .prependTo(studentElement);
              }else{
                var evaluationDateElement = studentElement.find('.workspace-evaluation-requested-date');
                var oldDate = evaluationDateElement.attr('data-evaluation-date');
                if(workspaceAssessmentRequest.date > oldDate){
                  evaluationDateElement.attr('data-evaluation-date', workspaceAssessmentRequest.date);
                  evaluationDateElement.text(formatDate(new Date(workspaceAssessmentRequest.date)));
                }
              }
            }
          }
        }, this));
    },
    
    _loadMaterials: function () {
      mApi({async: true}).workspace.workspaces.materials
        .read(this.options.workspaceEntityId, { assignmentType : 'EVALUATED'})
        .callback($.proxy(function (err, workspaceEvaluableAssignmentMaterials) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            var workspaceEvaluableAssignments = [];
            
            for (var i=0; i<workspaceEvaluableAssignmentMaterials.length; i++) {
              workspaceEvaluableAssignments.push(
                  {workspaceMaterial: workspaceEvaluableAssignmentMaterials[i]}
              );
            }
          
            this.element.trigger("materialsLoaded", {
              workspaceEvaluableAssignments: workspaceEvaluableAssignments
            });
            
            this._workspaceEvaluableAssignments = workspaceEvaluableAssignments;
          }
        }, this)); 
    },
    
    _onPrevPageClick: function () {
      var cellWidth = this.element.find('.evaluation-student-wrapper').first().outerWidth(true);
      this._scrollView(-cellWidth * 5, 0);
    },
    
    _onNextPageClick: function () {
      var cellWidth = this.element.find('.evaluation-student-wrapper').first().outerWidth(true);
      this._scrollView(cellWidth * 5, 0);
    },
    
    _onStudentsLoaded: function (event, data) {
      this._workspaceUsers = data.workspaceUsers;
      
      $.each(this._workspaceUsers, $.proxy(function (index, workspaceUser) { 
        mApi({async: false}).workspace.workspaces.assessments.read(
              this.options.workspaceEntityId,
              {userEntityId: workspaceUser.userId})
          .callback($.proxy(function(err, workspaceAssessments) {
            var workspaceAssessment = null;
            if (workspaceAssessments != null && workspaceAssessments.length > 0) {
              workspaceAssessment = workspaceAssessments[0];
            }
            workspaceUser.assessment = workspaceAssessment;
  
          $('<div>')
            .attr('data-workspace-student', workspaceUser.id)
            .attr('data-workspace-user', workspaceUser.userId)
            .evaluationStudent({
              workspaceStudentEntityId: workspaceUser.id,
              studentEntityId: workspaceUser.userId,
              assessment: workspaceAssessment
            })
            .appendTo(this.element.find('.evaluation-students'));
        }, this));    
      }, this));
      
      this._loadAssessmentRequests();
      this._loadMaterials();
    },
    
    _onMaterialsLoaded: function (event, data) {
      this._workspaceEvaluableAssignments = data.workspaceEvaluableAssignments;
      
      $.each(this._workspaceEvaluableAssignments, $.proxy(function (materialIndex, workspaceEvaluableAssignment) {
        var materialRow = $('<div>')
          .addClass('evaluation-student-assignment-listing-row')
          .appendTo($('.evaluation-assignments'));
        
        $(".evaluation-assignments").perfectScrollbar({
          wheelSpeed:3,
          swipePropagation:false,
          suppressScrollX:true
        });
        
        $.each(this._workspaceUsers, $.proxy(function (studentIndex, workspaceUser) {
          $('<div>')
              .evaluationAssignment({
                workspaceEntityId: this.options.workspaceEntityId,
                workspaceMaterialId: workspaceEvaluableAssignment.workspaceMaterial.id,
                materialId: workspaceEvaluableAssignment.workspaceMaterial.materialId,
                title: workspaceEvaluableAssignment.workspaceMaterial.title,
                workspaceUserEntityId: workspaceUser.id,
                studentEntityId: workspaceUser.userId,
                workspaceEvaluableAssignment: workspaceEvaluableAssignment
              })
              .appendTo(materialRow);
          }, this));
      }, this));
      
      this.element.trigger("viewInitialized");
    }
    
  });
  
  $.widget("custom.evaluationAssignment", {
    
    options: {
      workspaceEntityId: null,
      workspaceMaterialId: null,
      title: null,
      workspaceUserEntityId: null,
      studentEntityId: null,
      workspaceEvaluableAssignment: null
    },
    
    _create : function() {
      this.element.addClass('evaluation-assignment-wrapper assignment-pending');
      this.element.append($('<div>').addClass('evaluation-assignment-submitted-date'));
      this.element.append($('<div>').addClass('evaluation-assignment-evaluated-date'));
      this.element.append($('<div>').addClass('evaluation-assignment-title').text(this.options.title));

      $('#evaluation').on("viewInitialized", $.proxy(this._onEvaluationViewInitialized, this));
      $('#evaluation').on("viewScroll", $.proxy(this._onEvaluationViewScroll, this));
    },
    
    _onClick: function (event) {
      var workspaceStudent = $('*[data-workspace-student="' +  this.options.workspaceUserEntityId + '"]');
      var studentDisplayName = workspaceStudent.evaluationStudent('displayName');
      var studyProgrammeName = workspaceStudent.evaluationStudent('studyProgrammeName');
      var workspaceName = $('#evaluation').evaluation("workspaceName");
      var workspaceEntityId = $('#evaluation').evaluation("workspaceEntityId");
      mApi({async: false})
      .workspace
      .workspaces
      .assessors
      .read(workspaceEntityId)
      .callback($.proxy(function(err, workspaceUsers) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          mApi({async: false})
            .workspace
            .workspaces
            .gradingScales
            .read(workspaceEntityId)
            .callback($.proxy(function(err, gradingScales) {
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', err);
              } else {
                $('<div>').evaluateAssignmentDialog({
                  studentDisplayName: studentDisplayName,
                  studentAnswers: this._studentAnswers,
                  gradingScales: gradingScales,
                  assessors: workspaceUsers,
                  workspaceName: workspaceName,
                  studentStudyProgrammeName: studyProgrammeName,
                  workspaceMaterialId: this.options.workspaceMaterialId,
                  workspaceMaterialTitle: this.options.title,
                  materialId: this.options.materialId,
                  studentEntityId: workspaceStudent.evaluationStudent('studentEntityId'),
                  evaluationId: this.options.evaluation ? this.options.evaluation.id : null,
                  evaluationDate: this.options.evaluation ? new Date(this.options.evaluation.evaluated)  : null,
                  evaluationGradeId: this.options.evaluation ? this.options.evaluation.gradeIdentifier+'/'+this.options.evaluation.gradeSchoolDataSource+'@'+this.options.evaluation.gradingScaleIdentifier+'/'+this.options.evaluation.gradingScaleSchoolDataSource : null,
                  verbalAssessment: this.options.evaluation ? this.options.evaluation.verbalAssessment : null,
                  workspaceEntityId: workspaceEntityId,
                  triggeringElement: this
                });
              }
            }, this));
        }
      }, this));
    },
    
    _load: function () {
      this.element
        .removeClass('assignment-pending')
        .addClass('assignment-loading');
            
      $('#evaluation').evaluationLoader(
          'loadWorkspaceMaterialRepliesAndEvaluations',
          this.options.workspaceEntityId,
          this.options.workspaceMaterialId,
          this.options.studentEntityId,
          $.proxy(function (reply, evaluation) {
        
        this.options.workspaceEvaluableAssignment.evaluation = evaluation;
        this.element
          .removeClass('assignment-loading')
          .addClass('assignment-loaded');
        this._onWorkspaceMaterialReplyAndEvaluationLoaded(reply, evaluation);
      }, this));
    },
    
    _onEvaluationViewInitialized: function (event, data) {
      if (this.element.hasClass('assignment-pending')) {
        var viewWidth = $(event.target).width();
        
        var offset = this.element.offset();
        if (offset.left < viewWidth) {
          this._load();  
        }
      }
    },
    
    _onEvaluationViewScroll: function (event, data) {
      if (this.element.hasClass('assignment-pending')) {
        var viewWidth = $(event.target).width();
        
        var offset = this.element.offset();
        if ((offset.left - data.viewOffsetChangeX) < (viewWidth)) {
          this._load();  
        }
      }
    },
    
    _onWorkspaceMaterialReplyAndEvaluationLoaded: function (reply, evaluation) {
      switch (reply.state) {
        case 'UNANSWERED':
          this.element.addClass('assignment-unaswered');
        break;
        case 'ANSWERED':
          this.element.addClass('assignment-aswered');
        break;
        case 'SUBMITTED':
          this.element.on("click", $.proxy(this._onClick, this));
          this.element.addClass('assignment-submitted');
          if (reply.submitted) {
            this.element.find('.evaluation-assignment-submitted-date')
              .text(getLocaleText("plugin.evaluation.evaluationGridSubmitted.label") + " " + formatDate(new Date(reply.submitted)));   
          }
        break;
        case 'WITHDRAWN':
          this.element.addClass('assignment-withdrawn');
        break;
        case 'EVALUATED':
          this.element.on("click", $.proxy(this._onClick, this));
          this.element.addClass('assignment-evaluated');
          if (reply.submitted) {
            this.element.find('.evaluation-assignment-submitted-date')
              .text(getLocaleText("plugin.evaluation.evaluationGridSubmitted.label") + " " + formatDate(new Date(reply.submitted)));   
          }
          if (evaluation && evaluation.evaluated) {
            this.options.evaluation = evaluation;
            this.element.find('.evaluation-assignment-evaluated-date')
              .text(getLocaleText("plugin.evaluation.evaluationGridEvaluated.label") + " " + formatDate(new Date(evaluation.evaluated)));   
          }
        break;
      }
      
      this._studentAnswers = reply.answers;
    }
    
  });
  
  $.widget("custom.evaluationStudent", {
    
    options: {
      workspaceStudentEntityId: null,
      studentEntityId: null,
      assessment: null
    },
    
    _create : function() {
      this._displayName = null;
      
      this.element.addClass('evaluation-student-wrapper evaluation-student-pending');
      this.element.append($('<div>').addClass('evaluation-student-picture'));
      this.element.append($('<div>').addClass('evaluation-student-name').text('Loading...'));

      $('#evaluation').on("viewInitialized", $.proxy(this._onEvaluationViewInitialized, this));
      $('#evaluation').on("viewScroll", $.proxy(this._onEvaluationViewScroll, this));

      this.element.on("click", $.proxy(this._onClick, this));
    },
    
    displayName: function () {
      return this._displayName;
    },
    
    studyProgrammeName: function () {
      return this._studyProgrammeName;
    },
    
    studentEntityId: function () {
      return this.options.studentEntityId;
    },
    
    workspaceStudentEntityId: function () {
      return this.options.workspaceStudentEntityId;
    },
    
    _loadBasicInfo: function () {
      this.element
        .removeClass('evaluation-student-pending')
        .addClass('evaluation-student-loading');
      
      $('#evaluation').evaluationLoader('loadStudent', this.studentEntityId(), $.proxy(function (user) {
        this.element
          .removeClass('evaluation-student-pending evaluation-student-loading')
          .addClass('evaluation-student-loaded');
        this._onBasicInfoLoaded(user);
      }, this));
    },
    
    _onClick: function (event) {
      var workspaceName = $('#evaluation').evaluation("workspaceName");
      var workspaceEvaluableAssignments = $('#evaluation').evaluation("workspaceEvaluableAssignments");
      var workspaceEntityId = $('#evaluation').evaluation("workspaceEntityId");
      mApi({async: false})
        .workspace
        .workspaces
        .assessors
        .read(workspaceEntityId)
        .callback($.proxy(function(err, workspaceUsers) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            mApi({async: false})
              .workspace
              .workspaces
              .gradingScales
              .read(workspaceEntityId)
              .callback($.proxy(function(err, gradingScales) {
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', err);
              } else {
                $('<div>').evaluateWorkspaceDialog({
                  studentStudyProgrammeName: this.studyProgrammeName(),
                  studentDisplayName: this.displayName(),
                  workspaceName: workspaceName,
                  gradingScales: gradingScales,
                  assessors: workspaceUsers,
                  evaluationDate: this.options.assessment ? new Date(this.options.assessment.evaluated) : null,
                  evaluationGradeId: this.options.assessment ? this.options.assessment.gradeIdentifier+'/'+this.options.assessment.gradeSchoolDataSource+'@'+this.options.assessment.gradingScaleIdentifier+'/'+this.options.assessment.gradingScaleSchoolDataSource : null,
                  assessorEntityId: this.options.assessment ? this.options.assessment.assessorEntityId : null,
                  verbalAssessment: this.options.assessment ? this.options.assessment.verbalAssessment : null,
                  assessmentId: this.options.assessment ? this.options.assessment.identifier : null,
                  studentEntityId: this.studentEntityId(),
                  workspaceStudentEntityId: this.workspaceStudentEntityId(),
                  workspaceEvaluableAssignments: workspaceEvaluableAssignments,
                  workspaceEntityId: workspaceEntityId,
                  triggeringElement: this
                });
              }
            }, this));
          }
        }, this));
    },

    _onEvaluationViewInitialized: function (event, data) {
      if (this.element.hasClass('evaluation-student-pending')) {
        var viewWidth = $(event.target).width();
        var studentOffset = this.element.offset();
        if (studentOffset.left < viewWidth) {
          this._loadBasicInfo();  
        }
      }
    },
    
    _onEvaluationViewScroll: function (event, data) {
      if (this.element.hasClass('evaluation-student-pending')) {
        var viewWidth = $(event.target).width();
        var studentOffset = this.element.offset();
        if ((studentOffset.left - data.viewOffsetChangeX) < (viewWidth)) {
          this._loadBasicInfo();  
        }
      }
    },
    
    _onBasicInfoLoaded: function (user) {
      this._displayName = user.firstName + ' ' + user.lastName;
      this._studyProgrammeName = user.studyProgrammeName;
      this.element.find('.evaluation-student-name').text(this._displayName);
      if(this.options.assessment){
        this.element.removeClass('workspace-evaluation-requested');
        var evaluatedDate = $('<div>')
          .addClass('workspace-evaluated-date')
          .text(formatDate(new Date(this.options.assessment.evaluated)));
        if(this.element.hasClass('workspace-evaluation-requested')){
          this.element.find('workspace-evaluation-requested-date').before(evaluatedDate);
        }else{
          evaluatedDate.prependTo(this.element);
        }
        this.element.addClass('workspace-evaluated');
      }
    }
  
  });

  $(document).ready(function () {
    var workspaceEntityId = $('#evaluation').attr('data-workspace-entity-id');
    
    $(document).muikkuMaterialLoader({
      prependTitle : false
    });
    
    $('#evaluation').evaluationLoader();
    $('#evaluation').evaluation({
      workspaceEntityId: workspaceEntityId
    }); 
    
    $('.evaluation-available-workspaces').perfectScrollbar({
      wheelSpeed:3,
      swipePropagation:false
    });
    
  });
  
  $(document).on('click', '.evaluation-workspacelisting-wrapper', function (event, data) {
    
    var elementHidden = $('.evaluation-available-workspaces').attr('data-hidden');
    
    if (elementHidden > 0) {
      $('.evaluation-select-workspace')
      .find('.w-tooltip')
      .removeClass('icon-arrow-down')
      .addClass('icon-arrow-up');
      
      $('.evaluation-available-workspaces')
      .animate({
        opacity:1,
        visibility: 'visible',
        height:'160px'
      }, {
        duration : 300,
        easing : "easeInOutQuint",
        complete: function() {
          $('.evaluation-available-workspaces').attr('data-hidden', '0');
        }
      });  
    } else {
      $('.evaluation-select-workspace')
      .find('.w-tooltip')
      .removeClass('icon-arrow-up')
      .addClass('icon-arrow-down');
      
      $('.evaluation-available-workspaces')
      .animate({
        opacity:0,
        visibility: 'hidden',
        height:'0px'
      }, {
        duration : 200,
        easing : "easeInOutQuint",
        complete: function() {
          $('.evaluation-available-workspaces').attr('data-hidden', '1');
        }
      });
    }
    
    

  });

}).call(this);
