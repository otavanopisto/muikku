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
      studentIdentifier: null,
      workspaceEntityId: null,
      triggeringElement: null,
      studentAnswers: [],
      ckeditor: {
        baseFloatZIndex: 99999,
        language: getLocale(),
        height : '200px',
        entities: false,
        entities_latin: false,
        entities_greek: false,
        mathJaxLib: '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_HTMLorMML',
        toolbar: [
          { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
          { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'Undo', 'Redo' ] },
          { name: 'links', items: [ 'Link' ] },
          { name: 'insert', items: [ 'Image', 'Table', 'Smiley', 'SpecialChar' ] },
          { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
          { name: 'styles', items: [ 'Format' ] },
          { name: 'insert', items : [ 'Muikku-mathjax' ] },
          { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
          { name: 'tools', items: [ 'Maximize' ] }
        ],
        extraPlugins: {
          'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.8/',
          'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
          'draft' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.1/plugin.min.js',
          'widget': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/4.5.8/',
          'lineutils': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/4.5.8/',
          'muikku-mathjax': CONTEXTPATH + '/scripts/ckplugins/muikku-mathjax/'
        }
      }
    },
    _create: function () {
      var extraPlugins = [];
      
      $.each($.extend(this.options.ckeditor.extraPlugins, {}, true), $.proxy(function (plugin, url) {
        CKEDITOR.plugins.addExternal(plugin, url);
        extraPlugins.push(plugin);
      }, this));
      
      this.options.ckeditor.extraPlugins = extraPlugins.join(',');
      
      this._load($.proxy(function (text) {
        this._dialog = $(text);
        this._dialog.on("click", ".remove-evaluation", $.proxy(this._onRemoveEvaluationClick, this));
        
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
              var gradeSelector = $(this._dialog).find('select[name="grade"]');
              gradeSelector.val(this.options.evaluationGradeId);
              gradeSelector.change($.proxy(function(){
                $(this._dialog).find('input[name="evaluationDate"]').datepicker('setDate', new Date());
              }, this));
            }
            
            if (this.options.assessorEntityId) {
              $(this._dialog).find('select[name="assessor"]').val(this.options.assessorEntityId);
            }
            
            if (this.options.verbalAssessment) {
              $(this._dialog).find('#evaluateFormLiteralEvaluation').val(this.options.verbalAssessment);
            }

            CKEDITOR.replace(this._dialog.find("#evaluateFormLiteralEvaluation")[0], $.extend(this.options.ckeditor, {
              draftKey: ['workspace-evaluation-draft', this.options.workspaceEntityId, this.options.studentEntityId].join('-'),
              on: {
                instanceReady: $.proxy(this._onLiteralEvaluationEditorReady, this)
              }
            }));
            
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
            'disabled': true,
            'click': $.proxy(function(event) {
              var gradeString = $(this._dialog).find('select[name="grade"]').val();
              var gradeValue = gradeString.split('@', 2);
              var grade = gradeValue[0].split('/', 2);
              var gradingScale = gradeValue[1].split('/', 2);
              var assessedDate = $(this._dialog).find('input[name="evaluationDate"]').datepicker('getDate').getTime();
              var assessorEntityId = $(this._dialog).find('select[name="assessor"]').val();
              var workspaceEntityId = this.options.workspaceEntityId;
              var verbalAssessment = CKEDITOR.instances.evaluateFormLiteralEvaluation.getData();
              CKEDITOR.instances.evaluateFormLiteralEvaluation.discardDraft();
              
              this._loader = $('<div>').addClass('loading').appendTo('body.evaluation');
              if(this.options.assessmentId){
                mApi().workspace.workspaces.students.assessments.update(workspaceEntityId, this.options.studentIdentifier, this.options.assessmentId, {
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
                mApi().workspace.workspaces.students.assessments.create(workspaceEntityId, this.options.studentIdentifier, {
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
      try {
        CKEDITOR.instances.evaluateFormLiteralEvaluation.destroy();
      } catch (e) {
      }
      
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
    
    _loadAssigmentEvaluation: function(workspaceAssignment, htmlMaterialMap) {
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
      mApi().workspace.workspaces.journal.read(this.options.workspaceEntityId, {workspaceStudentId: this.options.workspaceStudentId}).callback(
        $.proxy(function(err, journalEntries) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else 
            renderDustTemplate('evaluation/evaluation_evaluate_workspace_modal_view.dust', {
              studentDisplayName: this.options.studentDisplayName,
              gradingScales: this.options.gradingScales,
              assessors: this.options.assessors,
              workspaceName: this.options.workspaceName,
              studentStudyProgrammeName: this.options.studentStudyProgrammeName,
              assignments: assignments,
              exercises: [],
              journalEntries: journalEntries,
              removable: !!this.options.assessmentId
            }, callback);
        }, this));
    },
    
    _confirmArchive: function(studentName, callback) {
      renderDustTemplate('evaluation/evaluation_remove_workspace_evaluation_confirm.dust', { studentName: studentName }, $.proxy(function(text) {
        var dialog = $(text);
        $(text).dialog({
          modal : true,
          minHeight : 200,
          resizable : false,
          width : 560,
          dialogClass : "evaluation-remove-workspace-evaluation-confirm-dialog",
          buttons : [ {
            'text' : dialog.attr('data-button-remove-text'),
            'class' : 'remove-button',
            'click' : function(event) {
              $(this).dialog("destroy").remove();
              callback();
            }
          }, {
            'text' : dialog.attr('data-button-cancel-text'),
            'class' : 'cancel-button',
            'click' : function(event) {
              $(this).dialog("destroy").remove();
            }
          } ]
        });
      }, this));
    },
    
    _onRemoveEvaluationClick: function (event) {
      this._confirmArchive(this.options.studentDisplayName, $.proxy(function () {
        mApi().workspace.workspaces.students.assessments
          .del(this.options.workspaceEntityId, this.options.studentIdentifier, this.options.assessmentId)
          .callback(function (err) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              window.location.reload(true);
            }
          });
      }, this));
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
    },
    
    _onLiteralEvaluationEditorReady: function (e) {
      var buttons = $.map(this._dialog.dialog('option', 'buttons'), function (button) {
        return $.extend(button, {
          disabled: false
        });
      });
      
      this._dialog.dialog('option', 'buttons', buttons)
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
      submitDate: null,
      ckeditor: {
        baseFloatZIndex: 99999,
        language: getLocale(),
        height : '200px',
        entities: false,
        entities_latin: false,
        entities_greek: false,
        mathJaxLib: '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_HTMLorMML',
        toolbar: [
          { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
          { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'Undo', 'Redo' ] },
          { name: 'links', items: [ 'Link' ] },
          { name: 'insert', items: [ 'Image', 'Table', 'Smiley', 'SpecialChar' ] },
          { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
          { name: 'styles', items: [ 'Format' ] },
          { name: 'insert', items : [ 'Muikku-mathjax' ] },
          { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
          { name: 'tools', items: [ 'Maximize' ] }
        ],
        extraPlugins: {
          'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.8/',
          'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
          'draft' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.1/plugin.min.js',
          'widget': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/4.5.8/',
          'lineutils': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/4.5.8/',
          'muikku-mathjax': CONTEXTPATH + '/scripts/ckplugins/muikku-mathjax/'
        }
      }
    },
    
    _create: function () {
      var extraPlugins = [];
      
      $.each($.extend(this.options.ckeditor.extraPlugins, {}, true), $.proxy(function (plugin, url) {
        CKEDITOR.plugins.addExternal(plugin, url);
        extraPlugins.push(plugin);
      }, this));
      
      this.options.ckeditor.extraPlugins = extraPlugins.join(',');
      
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
              var gradeSelector = $(this._dialog).find('select[name="grade"]');
              gradeSelector.val(this.options.evaluationGradeId);
              gradeSelector.change($.proxy(function(){
                $(this._dialog).find('input[name="evaluationDate"]').datepicker('setDate', new Date());
              }, this));
            }
            
            if (this.options.assessorEntityId) {
              $(this._dialog).find('select[name="assessor"]').val(this.options.assessorEntityId);
            }
            
            if (this.options.verbalAssessment) {
              $(this._dialog).find('#evaluateFormLiteralEvaluation').val(this.options.verbalAssessment);
            }
            
            CKEDITOR.replace(this._dialog.find("#evaluateFormLiteralEvaluation")[0], $.extend(this.options.ckeditor, {
              draftKey: ['material-evaluation-draft', this.options.workspaceMaterialId, this.options.workspaceEntityId, this.options.studentEntityId].join('-'),
              on: {
                instanceReady: $.proxy(this._onLiteralEvaluationEditorReady, this)
              }
            }));
            
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
            'disabled': true,
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
              CKEDITOR.instances.evaluateFormLiteralEvaluation.discardDraft();
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
      try {
        CKEDITOR.instances.evaluateFormLiteralEvaluation.destroy();
      } catch (e) {
      }
      
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
          submitDate: Date.parse(this.options.submitDate),
          assignments: [{
            workspaceMaterialId: workspaceMaterialId,
            materialId: materialId,
            title: materialTitle, 
            html: materialHtml,
            type: materialType,
            path: path
          }], 
        }, callback);
    },
    
    _adjustTextareaHeight: function(container) {
      var textareas = $(container).find('.muikku-memo-field');
      $(textareas).each( function(index,textarea) {        
        $(textarea).css({
          height: (textarea.scrollHeight)+"px"
        });
      }); 
    },
    
    _onLiteralEvaluationEditorReady: function (e) {
      var buttons = $.map(this._dialog.dialog('option', 'buttons'), function (button) {
        return $.extend(button, {
          disabled: false
        });
      });
      
      this._dialog.dialog('option', 'buttons', buttons)
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
              
              $.each(this._materialHtml[materialId].pending, function (index, pendingCallback) {
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
  
  $.widget("custom.evaluationView", {
    loadWorkspace: function(workspaceEntityId) {
      mApi().abortAll();
      $('#evaluation').evaluation('clearStudentsView');
      
      try {
        var newUrl = this._updateQueryStringParameter(window.location.href, 'workspaceEntityId', workspaceEntityId);
        window.history.pushState({path:newUrl}, '', newUrl);
      }
      catch (err) {}
      var workspaceItem = $('.evaluation-workspace-item[data-workspace-entity-id="' + workspaceEntityId + '"]');
      
      $('.evaluation-current-workspace').attr('data-workspace-entity-id', workspaceEntityId);
      $('.evaluation-current-workspace').text($(workspaceItem).attr('data-workspace-name'));
      
      var workspaceEntityId = $(workspaceItem).attr('data-workspace-entity-id');
      var workspaceName = $(workspaceItem).attr('data-workspace-name');
      var materialsBaseUrl = '/workspace/' + $(workspaceItem).attr('data-workspace-url-name') + '/materials';
      $(document).muikkuMaterialLoader('option', 'baseUrl', materialsBaseUrl);
      
      $('#evaluation').evaluation('option', 'workspaceEntityId', workspaceEntityId);
      $('#evaluation').evaluation('option', 'workspaceName', workspaceName);
      $('#evaluation').evaluation('filter', 'requestedAssessment', $('#filter-students-by-assessment-requested').prop('checked') ? true : null, true); 
      $('#evaluation').evaluation('filter', 'assessed', $('#filter-students-by-not-assessed').prop('checked') ? false : null, true);
      $('#evaluation').evaluation('loadStudents');
    },
    _updateQueryStringParameter: function(uri, key, value) {
      var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
      var separator = uri.indexOf('?') !== -1 ? "&" : "?";
      if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
      }
      else {
        return uri + separator + key + "=" + value;
      }
    }
  });
  
  $.widget("custom.evaluation", {
    options: {
      workspaceEntityId: null,
      workspaceName: null,
      filters: {
        requestedAssessment: null,
        assessed: null
      },
      searchString: null
    },
    
    _create : function() {
      this._workspaceUsers = null;
      this._assignments = null;
      this._viewOffsetX = 0;
      this._viewOffsetY = 0;
      this._filters = this.options.filters;
      this._searchString = this.options.searchString || null;
      
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
    },
    
    workspaceName: function () {
      return this.options.workspaceName;
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
    
    filter: function (filter, value, skipReload) {
      if (value === undefined) {
        return this._filters[filter];
      } else {
        this._filters[filter] = value;
        if (!skipReload) {
          this._reloadStudents();
        }
      }
    },
    
    search: function (searchString) {
      this._searchString = searchString;
      mApi().workspace.abortAll();
      this._reloadStudents();
    },
    
    clearStudentsView: function () {
      this.element.find('.evaluation-student-wrapper').remove();
      this.element.find('.evaluation-assignments').empty();
      this.element.find('.evaluation-no-students-found').remove();
    },
    
    _reloadStudents: function () {
      this.clearStudentsView();
      this.loadStudents();
    },
    
    loadStudents: function () {
      this.element.addClass('loading');
      var appliedFilters = {};
      for (var filter in this._filters) {
        if (this._filters.hasOwnProperty(filter)) {
            if(typeof(this._filters[filter]) !== 'undefined' && this._filters[filter] !== null){
              appliedFilters[filter] = this._filters[filter];
            }
        }
      }
      var options = { archived: false, orderBy: 'name' };
      if (this._searchString !== null && this._searchString !== "")  {
        options.search = this._searchString;
        options.maxResults = 10;
      }
      mApi().workspace.workspaces.students
        .read(this.options.workspaceEntityId,  $.extend(options, appliedFilters))
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
        mApi().workspace.workspaces.students.assessments
          .read(this.options.workspaceEntityId, workspaceStudent.studentIdentifier)
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
          this.clearStudentsView();
          
          if (this._workspaceUsers.length > 0) {
            $.each(workspaceStudents, $.proxy(function (index, workspaceStudent) {
              $('<div>')
                .attr('data-workspace-student', workspaceStudent.id)
                .evaluationStudent({
                  workspaceStudentId: workspaceStudent.id,
                  studentEntityId: workspaceStudent.studentEntityId,
                  studentIdentifier: workspaceStudent.studentIdentifier,
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
                studentEntityId: workspaceUser.studentEntityId,
                workspaceAssignment: evaluableAssignment
              })
              .appendTo(materialRow);
          }, this));
      }, this));
      
      this.element.trigger("viewInitialized");
      
      $(".evaluation-assignments").perfectScrollbar({
        wheelSpeed:3,
        swipePropagation:false,
        suppressScrollX:true
      });
      
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
      var submitDate = this.element.find('.evaluation-assignment-submitted-date').attr('data-submit-date');
      
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
                  submitDate: submitDate,
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
      if (evaluation && evaluation.evaluated) {
        this.options.evaluation = evaluation;
        this.element.find('.evaluation-assignment-evaluated-date')
          .text(getLocaleText("plugin.evaluation.evaluationGrid.evaluated.label") + " " + formatDate(new Date(evaluation.evaluated)));   
      }          

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
              .text(getLocaleText("plugin.evaluation.evaluationGrid.submitted.label") + " " + formatDate(new Date(reply.submitted)))
              .attr('data-submit-date', reply.submitted);   
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
              .text(getLocaleText("plugin.evaluation.evaluationGrid.submitted.label") + " " + formatDate(new Date(reply.submitted)))
              .attr('data-submit-date', reply.submitted);
          }
        break;
        case 'PASSED':
          this.element.on("click", $.proxy(this._onClick, this));
          this.element.addClass('assignment-evaluated');
          if (reply.submitted) {
            this.element.find('.evaluation-assignment-submitted-date')
              .text(getLocaleText("plugin.evaluation.evaluationGrid.submitted.label") + " " + formatDate(new Date(reply.submitted)))
              .attr('data-submit-date', reply.submitted);
          }
        break;
      }
      
      this._studentAnswers = reply.answers;
    }
    
  });
  
  $.widget("custom.evaluationStudent", {
    
    options: {
      studentIdentifier: null,
      workspaceStudentId: null,
      studentEntityId: null,
      assessment: null
    },
    
    _create : function() {
      this._displayName = this.options.studentLastName + ', ' + this.options.studentFirstName;
      this._studyProgrammeName = this.options.studentStudyProgrammeName;
      
      this.element.addClass('evaluation-student-wrapper');
      this.element.append($('<div>').addClass('evaluation-student-picture'));
      this.element.append($('<div>').addClass('evaluation-student-name-plate').append($('<span class="evaluation-student-name">').text(this._displayName)).append($('<span class="evaluation-student-studyprogramme">').text(this._studyProgrammeName)));
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
      this.element.find(".evaluation-student-name-plate").on("click", $.proxy(this._onClick, this));
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

    studentIdentifier: function () {
      return this.options.studentIdentifier;
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
                  evaluationGradeId: this.options.assessment ? this.options.assessment.gradeIdentifier + '/' + this.options.assessment.gradeSchoolDataSource+'@'+this.options.assessment.gradingScaleIdentifier+'/'+this.options.assessment.gradingScaleSchoolDataSource : null,
                  assessorEntityId: this.options.assessment ? this.options.assessment.assessorEntityId : null,
                  verbalAssessment: this.options.assessment ? this.options.assessment.verbalAssessment : null,
                  assessmentId: this.options.assessment ? this.options.assessment.identifier : null,
                  studentEntityId: this.studentEntityId(),
                  studentIdentifier: this.studentIdentifier(),
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
    var searchFieldTimer = null;
    var keyupDelay = 500;

    $(document).muikkuMaterialLoader({
      prependTitle: false,
      readOnlyFields: true
    }).evaluationView();

    $('#evaluation').evaluationLoader().evaluation();
    
    var currentWorkspaceSet = false;
    var currentWorkspaceEntityId = $('.evaluation-current-workspace').attr('data-workspace-entity-id');
    var params = {
      maxResults: 500,
      orderBy: ['alphabet']
    };
    if ($('.evaluation-available-workspaces').attr('data-list-all-workspaces') !== 'true') {
      params['userIdentifier'] = MUIKKU_LOGGED_USER;
    }
    
    $('.evaluation-workspacelisting-wrapper').hide();
    $('#evaluation').addClass('loading');
    mApi().workspace.workspaces.read(params).callback(function (err, workspaces) {
      $('#evaluation').removeClass('loading');
      if (err) {
        callback(err);
      }
      else {
        if (workspaces.length == 0) {
          $('.evaluation-current-workspace').text(getLocaleText('plugin.evaluation.noWorkspaces'));
        }
        else {
          var workspacesContainer = $('.evaluation-available-workspaces'); 
          for (var i = 0; i < workspaces.length; i++) {
            var workspaceName = workspaces[i].name;
            if (workspaces[i].nameExtension) {
              workspaceName += ' (' + workspaces[i].nameExtension + ')';
            }
            if (currentWorkspaceEntityId == workspaces[i].id) {
              $('.evaluation-current-workspace').text(workspaces[i].name);
              $('.evaluation-current-workspace').attr('data-workspace-entity-id', workspaces[i].id);
              currentWorkspaceSet = true;
            }
            var workspaceElement = $('<div>');
            workspaceElement.addClass('evaluation-workspace-item');
            workspaceElement.attr('data-workspace-entity-id', workspaces[i].id);
            workspaceElement.attr('data-workspace-name', workspaces[i].name);
            workspaceElement.attr('data-workspace-url-name', workspaces[i].urlName);
            workspaceElement.text(workspaceName);
            $(workspacesContainer).append(workspaceElement);
          }
          if (!currentWorkspaceSet) {
            $('.evaluation-current-workspace').text(workspaces[0].name);
            $('.evaluation-current-workspace').attr('data-workspace-entity-id', workspaces[0].id);
            currentWorkspaceSet = true;
          }
          $(document).evaluationView("loadWorkspace", $('.evaluation-current-workspace').attr('data-workspace-entity-id'));
        }
      }
      $('.evaluation-workspacelisting-wrapper').show();
    });

    $('.evaluation-available-workspaces').perfectScrollbar({
      wheelSpeed:3,
      swipePropagation:false
    });

    $('#filter-students-by-assessment-requested').on("click", function () {
      $('#evaluation').evaluation('filter', 'requestedAssessment', $(this).prop('checked') ? true : null);
    });
    
    $('#filter-students-by-not-assessed').on("click", function () {
      $('#evaluation').evaluation('filter', 'assessed', $(this).prop('checked') ? false : null);
    });

    $(document).on('click', '.evaluation-flag', function (event) {
      var filter = $(event.target).closest('.evaluation-flag');
      if (filter.hasClass('active')) {
        filter.removeClass('active');
      } else {
        filter.addClass('active');
      }
      
      var activeIds = $.map($('.evaluation-flag.active'), function (active) {
        return $(active).attr('data-flag-id');
      });
      
      $('#evaluation').evaluation('filter', 'flags', activeIds.length ? activeIds : null);
    });

    $('#student-search-field').on('keyup', function () {
      if (searchFieldTimer !== null) {
        clearTimeout(searchFieldTimer);
      }
      
      searchFieldTimer = setTimeout($.proxy(function() {
        $('#evaluation').evaluation('search', $(this).val());
      }, this), keyupDelay);
    });

    $('#student-search-field').on('keypress', function (event) {
      if (event.charCode === 13 || event.keyCode === 13) {
        $(".evaluation-search-container")
         .hide()
         .attr('data-hidden', '1');
      }
    });
    
    $(window).resize(function() {
      $(".evaluation-assignments").perfectScrollbar('update');
    });
    
    $('.evaluation-flags').click(function () {
      $('.evaluation-flags-container').toggle();
    });
    
    mApi().user.flags
      .read({ ownerIdentifier: MUIKKU_LOGGED_USER })
      .callback(function (err, flags) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          $.each(flags, function (index, flag) {
            $('<div>')
              .addClass("evaluation-flag icon-flag")
              .attr({
                'data-flag-color': flag.color,
                'data-flag-id': flag.id
              })
              .css({
                'color': flag.color
              })
              .append(
                $('<span>')
                  .text(flag.name))
              .appendTo($('.evaluation-flags-container'));
          });
        }
      });
  });
  
  $(document).on('click', '.evaluation-workspace-item', function (event) {
    var workspaceItem = $(event.target).closest('.evaluation-workspace-item');
    $(document).evaluationView('loadWorkspace', $(workspaceItem).attr('data-workspace-entity-id'));
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
  
  $(document).on('click', '.evaluation-search', function (event, data) {
    
    var elementHidden = $('.evaluation-search-container').attr('data-hidden');
    
    if (elementHidden > 0) {
      $('.evaluation-search-container')
        .show()
        .attr('data-hidden', '0');
      $('.evaluation-search-container').find("#student-search-field").focus();
    } else {
      $('.evaluation-search-container')
        .hide()
        .attr('data-hidden', '1');
    }

  });

  $(document).on('afterHtmlMaterialRender', function (event, data) {
    var replyState = $(data.pageElement).attr('data-reply-state');
    if (replyState != '') {
      $(data.pageElement).muikkuMaterialPage('checkExercises', true);
    }
  });

}).call(this);
