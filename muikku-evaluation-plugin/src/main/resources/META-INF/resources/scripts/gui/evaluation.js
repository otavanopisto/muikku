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
      workspaceStudentId: null,
      studentStudyProgrammeName: null,
      studentDisplayName: null,
      workspaceName: null,
      workspaceAssignments: null,
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
                    +this.options.studentDisplayName + (this.options.studentStudyProgrammeName ? ' (' + this.options.studentStudyProgrammeName + ')' : '')
                    +'</span><span class="modal-title-workspace-name">'
                    +this.options.workspaceName
                    +'</span>',
          dialogClass: "evaluation-evaluate-modal workspace-evaluation-dialog",
          close: $.proxy(function () {
            this.element.remove();
          }, this),
          open: $.proxy(function() {
            $(this._dialog).find('input[name="evaluationDate"]')
              .css({'z-index': 9999, 'position': 'relative'})
              .attr('type', 'text')
              .datepicker();

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
            
            var batchCalls = $.map(this.options.workspaceAssignments, $.proxy(function (workspaceAssignment) {
              return mApi().workspace.workspaces.materials.compositeMaterialReplies.read(this.options.workspaceEntityId, workspaceAssignment.workspaceMaterial.id, {
                userEntityId: this.options.studentEntityId
              });
            }, this));
            
            mApi().batch(batchCalls).callback($.proxy(function (err, results) {
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
            
            $(this._dialog).find("#evaluationStudentAssignmentWrapper").perfectScrollbar({
              wheelSpeed:3,
              swipePropagation:false
            });
            
            $(this._dialog).find(".evaluation-modal-evaluateForm-content").perfectScrollbar({
              wheelSpeed:3,
              swipePropagation:false
            });
            
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
              this._loader = $('<div>').addClass('loading').appendTo('body.evaluation');
              if(this.options.assessmentId){
                mApi({async: false}).workspace.workspaces.assessments.update(workspaceEntityId, this.options.assessmentId, {
                  evaluated: assessedDate,
                  gradeIdentifier: grade[0],
                  gradeSchoolDataSource: grade[1],
                  gradingScaleIdentifier: gradingScale[0],
                  gradingScaleSchoolDataSource: gradingScale[1],
                  workspaceStudentId: this.options.workspaceStudentId,
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
                    } else {
                      var evaluatedDate = $('<div>')
                        .addClass('workspace-evaluated-date')
                        .text(formatDate(new Date(result.evaluated)));
                      if(studentElement.find('.workspace-evaluation-requested-date').length > 0){
                        studentElement.find('.workspace-evaluation-requested-date').after(evaluatedDate);
                      }else{
                        evaluatedDate.prependTo(studentElement);
                      }
                      studentElement.addClass('workspace-evaluated');
                    }
                    studentElement.removeClass('workspace-evaluation-requested');
                    if(result.passed){
                      studentElement.removeClass('workspace-reviewed-non-passing');
                    }else{
                      studentElement.addClass('workspace-reviewed-non-passing');
                    }
                    this._loader.remove();
                    $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.workspaceEvaluationDialog.evaluation.updateSuccessful"));
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
                  workspaceStudentId: this.options.workspaceStudentId,
                  assessorEntityId: assessorEntityId,
                  verbalAssessment: verbalAssessment
                }).callback($.proxy(function (err, result) {
                  if (err) {
                    this._loader.remove();
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  } else {
                    this.options.triggeringElement.options.assessment = result;
                    var studentElement = $(this.options.triggeringElement.element);
                    if(studentElement.hasClass('workspace-evaluated')){
                      studentElement.find('.workspace-evaluated-date')
                        .text(formatDate(new Date(result.evaluated)));
                    } else {
                      var evaluatedDate = $('<div>')
                        .addClass('workspace-evaluated-date')
                        .text(formatDate(new Date(result.evaluated)));
                      if(studentElement.find('.workspace-evaluation-requested-date').length > 0){
                        studentElement.find('.workspace-evaluation-requested-date').after(evaluatedDate);
                      }else{
                        evaluatedDate.prependTo(studentElement);
                      }
                      studentElement.addClass('workspace-evaluated');
                    }
                    studentElement.removeClass('workspace-evaluation-requested');
                    if(result.passed){
                      studentElement.removeClass('workspace-reviewed-non-passing');
                    }else{
                      studentElement.addClass('workspace-reviewed-non-passing');
                    }
                    this._loader.remove();
                    $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.workspaceEvaluationDialog.evaluation.updateSuccessful"));
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
      this._loader = $('<div>').addClass('loading').appendTo('body.evaluation');
      var materialIds = $.map(this.options.workspaceAssignments, function (workspaceAssignment) {
        return workspaceAssignment.workspaceMaterial.materialId;
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
          for (var i = 0; i<this.options.workspaceAssignments.length; i++) {
            assignments.push(this._loadAssigmentEvaluation(this.options.workspaceAssignments[i], htmlMaterialMap));
          } 
          
          async.parallel(assignments, $.proxy(function(err, results){
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              this._loadTemplate(results, callback);
              this._loader.remove();
            }
          }, this));
        }
      }, this));
    },
    _loadAssigmentEvaluation: function(workspaceAssignment, htmlMaterialMap){
      var replyLoad = $.proxy(function(replyCallback){
        mApi().workspace.workspaces.materials.compositeMaterialReplies
        .read(this.options.workspaceEntityId, workspaceAssignment.workspaceMaterial.id, {
          userEntityId: this.options.studentEntityId
        }).callback($.proxy(function(replyErr, reply){
          if(replyErr){
            replyCallback(replyErr);
          }else{
            replyCallback(null, reply);
          }
        },this))
      },this);
      
      var evaluationLoad = $.proxy(function(evaluationCallback){
        mApi().workspace.workspaces.materials.evaluations
        .read(this.options.workspaceEntityId, workspaceAssignment.workspaceMaterial.id, {userEntityId: this.options.studentEntityId})
        .callback($.proxy(function(err, evaluations) {
          if(err){
            evaluationCallback(err);
          }else{
            var evaluation = null;
            if (evaluations != null && evaluations.length > 0) {
              evaluation = evaluations[0];
            }
            evaluationCallback(null, evaluation);
          }
        },this));
      },this);

      return $.proxy(function(cb){
        async.parallel([evaluationLoad, replyLoad], function(err, results){
          cb(err, {
            workspaceMaterialId: workspaceAssignment.workspaceMaterial.id,
            materialId: workspaceAssignment.workspaceMaterial.materialId,
            type: 'html',
            title: workspaceAssignment.workspaceMaterial.title,
            path: workspaceAssignment.workspaceMaterial.path,
            html: htmlMaterialMap[workspaceAssignment.workspaceMaterial.materialId].html,
            assignmentType: workspaceAssignment.workspaceMaterial.assignmentType,
            evaluation: results[0],
            reply: results[1]
          }); 
        });
      },this)
    },
    _loadTemplate: function (assignments, callback) {
      renderDustTemplate('evaluation/evaluation_evaluate_workspace_modal_view.dust', {
        studentDisplayName: this.options.studentDisplayName,
        gradingScales: this.options.gradingScales,
        assessors: this.options.assessors,
        workspaceName: this.options.workspaceName,
        studentStudyProgrammeName: this.options.studentStudyProgrammeName,
        assignments: assignments,
        exercises: []
      }, callback);
    },
    
    _onAssignmentTitleClick: function (event) {
      var assignment = $(event.target).closest('.evaluation-assignmentlist-wrapper');
      var content = $(assignment).find('.evaluation-assignment-content');
      var state = content.attr('data-open-state');
      content.attr('data-open-state', state == 'closed' ? 'open' : 'closed');
      this._adjustTextareaHeight(content);
    },
    
    _adjustTextareaHeight: function(container) {
      var textareas = $(container).find('.muikku-memo-field');
      $(textareas).each( function(index,textarea) {        
        $(textarea).css({
          height: (textarea.scrollHeight)+"px"
        });
      }); 
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
                    +this.options.studentDisplayName + (this.options.studentStudyProgrammeName ? ' (' + this.options.studentStudyProgrammeName + ')' : '')
                    +'</span><span class="modal-title-workspace-name">'
                    +this.options.workspaceName
                    +'</span>',
          dialogClass: "evaluation-evaluate-modal assignment-evaluation-dialog",
          close: $.proxy(function () {
            this.element.remove();
          }, this),
          open: $.proxy(function() {
            $(this._dialog).find('input[name="evaluationDate"]')
              .css({'z-index': 9999, 'position': 'relative'})
              .attr('type', 'text')
              .datepicker();

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
            
            this._adjustTextareaHeight($(this._dialog).find('.evaluation-assignment'));
            
            $(this._dialog).find("#evaluationStudentAssignmentWrapper").perfectScrollbar({
              wheelSpeed:3,
              swipePropagation:false
            });
            
            $(this._dialog).find(".evaluation-modal-evaluateForm-content").perfectScrollbar({
              wheelSpeed:3,
              swipePropagation:false
            });
            
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
              this._loader = $('<div>').addClass('loading').appendTo('body.evaluation');
              
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
                    this._loader.remove();
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  } else {
                    this.options.triggeringElement.options.evaluation = result;
                    if (result.passed === true) {
                      this.options.triggeringElement.element.removeClass('assignment-reviewed-non-passing');
                      this.options.triggeringElement.element.addClass('assignment-evaluated');
                    }
                    else if (result.passed === false) {
                      this.options.triggeringElement.element.removeClass('assignment-evaluated');
                      this.options.triggeringElement.element.addClass('assignment-reviewed-non-passing');
                    }
                    this.options.triggeringElement.element.find('.evaluation-assignment-evaluated-date')
                      .text(getLocaleText("plugin.evaluation.evaluationGrid.evaluated.label") + " " + formatDate(new Date(result.evaluated)));
                    this._loader.remove();
                    $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.assignmentEvaluationDialog.evaluation.updateSuccessful"));
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
                    this._loader.remove();
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  } else {
                    this.options.triggeringElement.options.evaluation = result;
                    if (result.passed === true) {
                      this.options.triggeringElement.element.removeClass('assignment-reviewed-non-passing');
                      this.options.triggeringElement.element.addClass('assignment-evaluated');
                    }
                    else if (result.passed === false) {
                      this.options.triggeringElement.element.removeClass('assignment-evaluated');
                      this.options.triggeringElement.element.addClass('assignment-reviewed-non-passing');
                    }
                    this.options.triggeringElement.element.find('.evaluation-assignment-evaluated-date')
                      .text(getLocaleText("plugin.evaluation.evaluationGrid.evaluated.label") + " " + formatDate(new Date(result.evaluated)));
                    this._loader.remove();
                    $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.assignmentEvaluationDialog.evaluation.successful"));
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
      this._loader = $('<div>').addClass('loading').appendTo('body.evaluation');
      $('#evaluation').evaluationLoader("loadHtml", this.options.materialId, $.proxy(function (err, htmlMaterial) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          this._loadTemplate(this.options.workspaceMaterialId, 
            htmlMaterial.id, 
            'html', 
            this.options.workspaceMaterialTitle, 
            htmlMaterial.html, 
            this.options.workspaceMaterialPath,
            callback
          );
          this._loader.remove();
        }
      }, this));
    },
    
    _loadTemplate: function (workspaceMaterialId, materialId, materialType, materialTitle, materialHtml, path, callback) {
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
          type: materialType,
          path: path
        }], 
        journalEntries: [{
          id: 123,
          workspaceEntityId: 234,
          userEntityId: 456,
          content: 'Tänään tapasin todellisen Muikún, Ex his fabulas periculis, cu possim persequeris eum. Purto tantas conclusionemque id his. Ei veri fierent sit, ne sea erroribus mediocritatem, fabulas detracto consequuntur sea ad. Mea ad ridens saperet quaestio, eum te viris semper legendos, mazim cotidieque vix at. Cu aliquip repudiandae sit, antiopam mediocritatem est id.',
          title: 'Rakas päiväkirja',
          created: new Date().getTime()
        }]
      }, callback);
    },
    
    _adjustTextareaHeight: function(container) {
      var textareas = $(container).find('.muikku-memo-field');
      $(textareas).each( function(index,textarea) {        
        $(textarea).css({
          height: (textarea.scrollHeight)+"px"
        });
      }); 
    }
  });
  
  $.widget("custom.evaluationLoader", {
    
    _create : function() {
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
      
  
      async.parallel(loads, function (err, results) {
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
        
        mApi().materials.html
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
    }
  });
  
  $.widget("custom.evaluation", {
    options: {
      workspaceEntityId: null,
      filters: {
        requestedAssessment: null,
        assessed: null
      }
    },
    
    _create : function() {
      this._workspaceUsers = null;
      this._assignments = null;
      this._viewOffsetX = 0;
      this._viewOffsetY = 0;
      this._filters = this.options.filters;
      
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
    
    workspaceAssignments: function () {
      return this._workspaceAssignments;
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
    
    filter: function (filter, value) {
      if (value === undefined) {
        return this._filters[filter];
      } else {
        this._filters[filter] = value;
        this._reloadStudents();      
      }
    },
    
    _clearStudentsView: function () {
      this.element.find('.evaluation-student-wrapper').remove();
      this.element.find('.evaluation-assignments').empty();
      this.element.find('.evaluation-no-students-found').remove();
    },
    
    _reloadStudents: function () {
      this._clearStudentsView();
      this._loadStudents();
    },
    
    _loadStudents: function () {
      this.element.addClass('loading');
      var appliedFilters = {};
      for (var filter in this._filters) {
        if (this._filters.hasOwnProperty(filter)) {
            if(typeof(this._filters[filter]) !== 'undefined' && this._filters[filter] !== null){
              appliedFilters[filter] = this._filters[filter];
            }
        }
      }
      mApi().workspace.workspaces.students
        .read(this.options.workspaceEntityId,  $.extend({ archived: false }, appliedFilters))
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
              var studentElement = $('.evaluation-students').find('div[data-workspace-student="' + workspaceAssessmentRequest.workspaceUserIdentifier + '"]');
              if (!studentElement.hasClass('workspace-evaluated')) {
                studentElement.addClass('workspace-evaluation-requested');
              }
              
              if(studentElement.find('.workspace-evaluation-requested-date').length == 0){
                $('<div>')
                .attr('data-evaluation-date', workspaceAssessmentRequest.date)
                .attr('title', getLocaleText("plugin.evaluation.studentGrid.assessmentRequested.label"))
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
      var loads = $.map(["EVALUATED", "EXERCISE"], $.proxy(function (assignmentType) {
        return $.proxy(function (callback) {
          mApi().workspace.workspaces.materials
            .read(this.options.workspaceEntityId, { assignmentType : assignmentType})
            .callback(callback)
        }, this);
      }, this));
      
      async.parallel(loads, $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var evaluableAssignments = $.map(results[0]||[], function (assignment) {
            return {
              workspaceMaterial: assignment
            };
          });
          
          
          var exerciseAssignments = $.map(results[1]||[], function (assignment) {
            return {
              workspaceMaterial: assignment
            };
          });
          
          var workspaceAssignments = evaluableAssignments.concat(exerciseAssignments);
          
          this.element.trigger("materialsLoaded", {
            workspaceAssignments: workspaceAssignments,
            evaluableAssignments: evaluableAssignments,
            exerciseAssignments: exerciseAssignments
          });
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
    
    _loadStudentAssessments: function (workspaceStudent) {
      return $.proxy(function (callback) {
        mApi().workspace.workspaces.assessments
          .read(this.options.workspaceEntityId, { workspaceStudentIdentifier : workspaceStudent.id })
          .callback(function(err, workspaceAssessments) {
            if (err) {
              callback(err, null);
            } else {
              var workspaceAssessment = null;
              if (workspaceAssessments != null && workspaceAssessments.length > 0) {
                workspaceAssessment = workspaceAssessments[0];
              }
              workspaceStudent.assessment = workspaceAssessment;
              callback(err, workspaceStudent)
            };
          });
      }, this);
    },
    
    _onStudentsLoaded: function (event, data) {
      var studentLoads = $.map(data.workspaceUsers||[], $.proxy(function (workspaceUser) { 
        return this._loadStudentAssessments(workspaceUser);
      }, this));
      
      async.parallel(studentLoads, $.proxy(function (err, workspaceStudents) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          this._workspaceUsers = workspaceStudents;
          this._clearStudentsView();
          
          if (this._workspaceUsers.length > 0) {
            $.each(workspaceStudents, $.proxy(function (index, workspaceStudent) {
              $('<div>')
                .attr('data-workspace-student', workspaceStudent.id)
                .evaluationStudent({
                  workspaceStudentId: workspaceStudent.id,
                  studentEntityId: workspaceStudent.userId,
                  studentFirstName: workspaceStudent.firstName,
                  studentLastName: workspaceStudent.lastName,
                  studentStudyProgrammeName: workspaceStudent.studyProgrammeName,
                  assessment: workspaceStudent.assessment,
                  enrolmentTime: workspaceStudent.enrolmentTime
                  
                })
                .appendTo(this.element.find('.evaluation-students'));
            }, this));
          } else {
            $('<div>')
              .addClass('evaluation-no-students-found')
              .text(getLocaleText("plugin.evaluation.evaluationGrid.noStudentsFound"))
              .appendTo(this.element.find('.evaluation-students'));
          }

          this._loadAssessmentRequests();
          this._loadMaterials();
          
          this.element.removeClass('loading');
        }
      }, this));
    },
    
    _onMaterialsLoaded: function (event, data) {
      this._workspaceAssignments = data.workspaceAssignments;
      $(".evaluation-assignments").perfectScrollbar({
        wheelSpeed:3,
        swipePropagation:false,
        suppressScrollX:true
      });
      
      $.each(data.evaluableAssignments, $.proxy(function (materialIndex, evaluableAssignment) {
        var materialRow = $('<div>')
          .addClass('evaluation-student-assignment-listing-row')
          .appendTo($('.evaluation-assignments'));
        
        $.each(this._workspaceUsers, $.proxy(function (studentIndex, workspaceUser) {
          $('<div>')
              .evaluationAssignment({
                workspaceEntityId: this.options.workspaceEntityId,
                workspaceMaterialId: evaluableAssignment.workspaceMaterial.id,
                materialId: evaluableAssignment.workspaceMaterial.materialId,
                title: evaluableAssignment.workspaceMaterial.title,
                path: evaluableAssignment.workspaceMaterial.path,
                workspaceStudentId: workspaceUser.id,
                studentEntityId: workspaceUser.userId,
                workspaceAssignment: evaluableAssignment
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
      path: null,
      workspaceStudentId: null,
      studentEntityId: null,
      workspaceAssignment: null
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
      var workspaceStudent = $('*[data-workspace-student="' +  this.options.workspaceStudentId + '"]');
      var studentDisplayName = workspaceStudent.evaluationStudent('displayName');
      var studyProgrammeName = workspaceStudent.evaluationStudent('studyProgrammeName');
      var workspaceName = $('#evaluation').evaluation("workspaceName");
      var workspaceEntityId = $('#evaluation').evaluation("workspaceEntityId");
      
      mApi().workspace.workspaces.staffMembers.read(workspaceEntityId, {orderBy: 'name'}).callback($.proxy(function (err, teachers) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var assessors = $.map(teachers, function (teacher) {
            return $.extend(teacher, {
              displayName: teacher.lastName + ' ' + teacher.firstName,
              selected: teacher.userEntityId == MUIKKU_LOGGED_USER_ID
            });
          });
          
          mApi().workspace.workspaces.gradingScales.read(workspaceEntityId)
            .callback($.proxy(function(err, gradingScales) {
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', err);
              } else {
                $('<div>').evaluateAssignmentDialog({
                  studentDisplayName: studentDisplayName,
                  studentAnswers: this._studentAnswers,
                  gradingScales: gradingScales,
                  assessors: assessors,
                  workspaceName: workspaceName,
                  studentStudyProgrammeName: studyProgrammeName,
                  workspaceMaterialId: this.options.workspaceMaterialId,
                  workspaceMaterialTitle: this.options.title,
                  workspaceMaterialPath: this.options.path,
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
        
        this.options.workspaceAssignment.evaluation = evaluation;
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
              .text(getLocaleText("plugin.evaluation.evaluationGrid.submitted.label") + " " + formatDate(new Date(reply.submitted)));   
          }
        break;
        case 'WITHDRAWN':
//          this.element.addClass('assignment-withdrawn'); This seems to be unwanted feature for now
        break;
        case 'FAILED':
          this.element.on("click", $.proxy(this._onClick, this));
          this.element.addClass('assignment-reviewed-non-passing');
          if (reply.submitted) {
            this.element.find('.evaluation-assignment-submitted-date')
              .text(getLocaleText("plugin.evaluation.evaluationGrid.submitted.label") + " " + formatDate(new Date(reply.submitted)));   
          }
          if (evaluation && evaluation.evaluated) {
            this.options.evaluation = evaluation;
            this.element.find('.evaluation-assignment-evaluated-date')
              .text(getLocaleText("plugin.evaluation.evaluationGrid.evaluated.label") + " " + formatDate(new Date(evaluation.evaluated)));   
          }          
        break;
        case 'PASSED':
          this.element.on("click", $.proxy(this._onClick, this));
          this.element.addClass('assignment-evaluated');
          if (reply.submitted) {
            this.element.find('.evaluation-assignment-submitted-date')
              .text(getLocaleText("plugin.evaluation.evaluationGrid.submitted.label") + " " + formatDate(new Date(reply.submitted)));   
          }
          if (evaluation && evaluation.evaluated) {
            this.options.evaluation = evaluation;
            this.element.find('.evaluation-assignment-evaluated-date')
              .text(getLocaleText("plugin.evaluation.evaluationGrid.evaluated.label") + " " + formatDate(new Date(evaluation.evaluated)));   
          }
        break;
      }
      
      this._studentAnswers = reply.answers;
    }
    
  });
  
  $.widget("custom.evaluationStudent", {
    
    options: {
      workspaceStudentId: null,
      studentEntityId: null,
      assessment: null
    },
    
    _create : function() {
      this._displayName = this.options.studentFirstName + ' ' + this.options.studentLastName;
      this._studyProgrammeName = this.options.studentStudyProgrammeName;
      
      this.element.addClass('evaluation-student-wrapper');
      this.element.append($('<div>').addClass('evaluation-student-picture'));
      this.element.append($('<div>').addClass('evaluation-student-name').text(this._displayName).append($('<span>').text(this._studyProgrammeName)));
      this.element.prepend($('<div>').addClass('workspace-student-joined-date').text(formatDate(new Date(this.options.enrolmentTime))).attr("title", getLocaleText("plugin.evaluation.studentGrid.joined.label")));
      
      if (this.options.assessment) {
        this.element.removeClass('workspace-evaluation-requested');
        
        var evaluatedDate = $('<div>')
          .addClass('workspace-evaluated-date')
          .attr('title', getLocaleText("plugin.evaluation.studentGrid.evaluated.label"))
          .text(formatDate(new Date(this.options.assessment.evaluated)));
        
        evaluatedDate.prependTo(this.element);
        
        this.element.addClass('workspace-evaluated');
        
        if(!this.options.assessment.passed){
          this.element.addClass('workspace-reviewed-non-passing');
        }
      }

      this.element.addClass('evaluation-student-loaded');
      this.element.find(".evaluation-student-name").on("click", $.proxy(this._onClick, this));
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
    
    workspaceStudentId: function () {
      return this.options.workspaceStudentId;
    },
    
    _onClick: function (event) {
      var workspaceName = $('#evaluation').evaluation("workspaceName");
      var workspaceAssignments = $('#evaluation').evaluation("workspaceAssignments");
      var workspaceEntityId = $('#evaluation').evaluation("workspaceEntityId");

      mApi().workspace.workspaces.staffMembers.read(workspaceEntityId, {orderBy: 'name'}).callback($.proxy(function (err, teachers) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var assessors = $.map(teachers, function (teacher) {
            return $.extend(teacher, {
              displayName: teacher.lastName + ' ' + teacher.firstName,
              selected: teacher.userEntityId == MUIKKU_LOGGED_USER_ID
            });
          });

          mApi()
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
                  assessors: assessors,
                  evaluationDate: this.options.assessment ? new Date(this.options.assessment.evaluated) : null,
                  evaluationGradeId: this.options.assessment ? this.options.assessment.gradeIdentifier+'/'+this.options.assessment.gradeSchoolDataSource+'@'+this.options.assessment.gradingScaleIdentifier+'/'+this.options.assessment.gradingScaleSchoolDataSource : null,
                  assessorEntityId: this.options.assessment ? this.options.assessment.assessorEntityId : null,
                  verbalAssessment: this.options.assessment ? this.options.assessment.verbalAssessment : null,
                  assessmentId: this.options.assessment ? this.options.assessment.identifier : null,
                  studentEntityId: this.studentEntityId(),
                  workspaceStudentId: this.workspaceStudentId(),
                  workspaceAssignments: workspaceAssignments,
                  workspaceEntityId: workspaceEntityId,
                  triggeringElement: this
                });
              }
          }, this));
        }
      }, this));
    }
  
  });

  $(document).ready(function () {
    var workspaceEntityId = $('#evaluation').attr('data-workspace-entity-id');
    var materialsBaseUrl = $('#evaluation').attr('data-materials-base-url');
    $(document).muikkuMaterialLoader({
      prependTitle : false,
      readOnlyFields: true,
      baseUrl: materialsBaseUrl
    });
    
    $('#evaluation').evaluationLoader();
    $('#evaluation').evaluation({
      workspaceEntityId: workspaceEntityId,
      filters: {
        requestedAssessment: $('#filter-students-by-assessment-requested').prop('checked') ? true : null,
        assessed: $('#filter-students-by-not-assessed').prop('checked') ? false : null
      }
    }); 
    
    $('#filter-students-by-assessment-requested').on("click", function () {
      $('#evaluation').evaluation('filter', 'requestedAssessment', $(this).prop('checked') ? true : null);
    });
    
    $('#filter-students-by-not-assessed').on("click", function () {
      $('#evaluation').evaluation('filter', 'assessed', $(this).prop('checked') ? false : null);
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
      .css({
        visibility: 'visible'
      })
      .animate({
        opacity:1,
        height:'195px'
      }, {
        duration : 300,
        easing : "easeInOutQuint",
        complete: function() {
          $('.evaluation-available-workspaces')
            .attr('data-hidden', '0');
          $('.evaluation-available-workspaces').perfectScrollbar('update');
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
        height:'0px'
      }, {
        duration : 200,
        easing : "easeInOutQuint",
        complete: function() {
          $('.evaluation-available-workspaces')
            .attr('data-hidden', '1')
            .css({
              visibility: 'hidden'
            });
          $('.evaluation-available-workspaces').perfectScrollbar('update');
        }
      });
    }

  });

}).call(this);
