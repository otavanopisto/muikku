(function() {
  'use strict';
  
  $.widget("custom.evaluationModal", {
    options: {
      assignmentAnswers: {},
      ckeditor: {
        baseFloatZIndex: 99999,
        language: getLocale(),
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
          { name: 'insert', items : [ 'Muikku-mathjax' ] },
          { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
          { name: 'tools', items: [ 'Maximize' ] }
        ],
        contentsCss : CONTEXTPATH +  '/css/flex/custom-ckeditor-contentcss_reading.css',
        extraPlugins: {
          'widget': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/4.5.8/',
          'lineutils': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/4.5.8/'
        }
      }
    },
    
    _create : function() {
      var extraPlugins = [];
      $.each($.extend(this.options.ckeditor.extraPlugins, {}, true), $.proxy(function (plugin, url) {
        CKEDITOR.plugins.addExternal(plugin, url);
        extraPlugins.push(plugin);
      }, this));
      this.options.ckeditor.extraPlugins = extraPlugins.join(',');

      this._gradingScales = null;
      
      this.element.on("dialogReady", $.proxy(this._onDialogReady, this));
      this.element.on("materialsLoaded", $.proxy(this._onMaterialsLoaded, this));
      this.element.on("workspaceAssessmentSaved", $.proxy(this._onWorkspaceAssessmentSaved, this));
    },
    
    open: function(requestCard, discardOnSave) {
      
      this._requestCard = requestCard;
      this._discardOnSave = discardOnSave;
      this._activeAssignment = null;
      
      this._evaluationModal = $('<div>')
        .addClass('eval-modal')
        .appendTo('body');
      $('body').addClass('no-scroll');
      
      // Initialize material loader
      
      var workspaceEntityId = $(requestCard).attr('data-workspace-entity-id');
      var workspaceUrlName = $(requestCard).attr('data-workspace-url-name');
      var materialsBaseUrl = '/workspace/' + workspaceUrlName + '/materials';
      $(document).muikkuMaterialLoader('option', 'workspaceEntityId', workspaceEntityId);
      $(document).muikkuMaterialLoader('option', 'baseUrl', materialsBaseUrl);

      // Load assessors
      
      mApi().workspace.workspaces.staffMembers
        .read(workspaceEntityId, {orderBy: 'name'})
        .callback($.proxy(function (err, staffMembers) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            
            // Render modal
            
            renderDustTemplate("evaluation/evaluation-modal-view.dust", {
              userEntityId: $(requestCard).attr('data-user-entity-id'), 
              studentName: $(requestCard).find('.evaluation-card-student').text(),
              studyProgrammeName: $(requestCard).find('.evaluation-card-study-programme').text(),
              courseName: $(requestCard).attr('data-workspace-name'),
              gradingScales: this._gradingScales||{},
              assessors: staffMembers,
              workspaceUserEntityId: $(requestCard).attr('data-workspace-user-entity-id')
            }, $.proxy(function (html) {
              
              // Modal UI
              
              this._evaluationModal.append(html);
              
              // Material's loading animation start
              
              this.element.trigger("loadStart", $('.eval-modal-assignment-content'));
              
              // Workspace assessment editor

              var workspaceLiteralEditor = this._evaluationModal.find("#workspaceEvaluateFormLiteralEvaluation")[0]; 
              CKEDITOR.replace(workspaceLiteralEditor, $.extend({}, this.options.ckeditor, {
                on: {
                  instanceReady: $.proxy(this._onLiteralEvaluationEditorReady, this)
                }
              }));
              var workspaceDateEditor = $(this._evaluationModal).find('#workspaceEvaluationDate'); 
              $(workspaceDateEditor)
                .css({'z-index': 999, 'position': 'relative'})
                .attr('type', 'text')
                .datepicker();
              if ($(this._requestCard).attr('data-evaluated')) {
                $('#workspaceDeleteButton').show();
              }
              $('#workspaceDeleteButton').click($.proxy(function(event) {
                this._confirmAssessmentDeletion($.proxy(function () {
                  this._deleteAssessment();
                }, this));
              }, this));
              $('#workspaceSaveButton').click($.proxy(function(event) {
                this._saveAssessment();
              }, this));
              $('#workspaceCancelButton').click($.proxy(function(event) {
                this.close();
              }, this));
              
              // Assignment assessment editor

              var assignmentLiteralEditor = this._evaluationModal.find("#assignmentEvaluateFormLiteralEvaluation")[0]; 
              CKEDITOR.replace(assignmentLiteralEditor, this.options.ckeditor);
              var assignmentDateEditor = $(this._evaluationModal).find('#assignmentEvaluationDate'); 
              $(assignmentDateEditor)
                .css({'z-index': 999, 'position': 'relative'})
                .attr('type', 'text')
                .datepicker();
              $('#assignmentSaveButton').click($.proxy(function(event) {
                this._saveMaterialAssessment();
              }, this));
              $('#assignmentCancelButton, .eval-modal-assignment-close').click($.proxy(function(event) {
                this._toggleMaterialAssessmentView(false);
              }, this));
              
              // Discard modal button (top right)  

              $('.eval-modal-close').click($.proxy(function (event) {
                this.close();
              }, this));
            
            }, this));
          }
        }, this));
    },
    
    close: function() {
      $('body').removeClass('no-scroll');
      this._evaluationModal.remove();
    },

    setGradingScales: function(gradingScales) {
      this._gradingScales = gradingScales;
    },
    
    _onLiteralEvaluationEditorReady: function() {
      this.element.trigger("dialogReady");
    },
    
    _loadMaterials: function() {
      var userEntityId = $(this._requestCard).attr('data-user-entity-id');
      var workspaceEntityId = $(this._requestCard).attr('data-workspace-entity-id');
      mApi().evaluation.workspace.assignments
        .read(workspaceEntityId, { userEntityId : userEntityId})
        .callback($.proxy(function (err, assignments) {
          this.element.trigger("materialsLoaded", {
            assignments: assignments
          });
        }, this));
    },
    
    toggleAssignment: function(assignment) {
      if ($(assignment).attr('data-loaded') == 'true') {
        if ($(assignment).attr('data-open') == 'true') {
          $(assignment).attr('data-open', false);
          $(assignment).hide();
        }
        else {
          $(assignment).attr('data-open', true);
          $(assignment).show();
        }
      }
      else {
        var workspaceEntityId = $(this._requestCard).attr('data-workspace-entity-id');
        var workspaceMaterialId = $(assignment).attr('data-workspace-material-id');
        var userEntityId = $(this._requestCard).attr('data-user-entity-id');
        mApi().workspace.workspaces.materials.compositeMaterialReplies
          .read(workspaceEntityId, workspaceMaterialId, {userEntityId: userEntityId})
          .callback($.proxy(function (err, replies) {
            var fieldAnswers = {};
            for (var i = 0, l = replies.answers.length; i < l; i++) {
              var answer = replies.answers[i];
              var answerKey = [answer.materialId, answer.embedId, answer.fieldName].join('.');
              fieldAnswers[answerKey] = answer.value;
            }
            var materialId = $(assignment).attr('data-material-id');
            mApi().materials.html
              .read(materialId)
              .callback($.proxy(function (err, htmlMaterial) {
                $(assignment)
                  .attr('data-material-type', 'html')
                  .attr('data-material-title', htmlMaterial.title)
                  .attr('data-material-content', htmlMaterial.html)
                  .attr('data-view-restricted', htmlMaterial.viewRestrict)
                  .attr('data-loaded', true)
                  .attr('data-open', true);
                $(document).muikkuMaterialLoader('loadMaterial', $(assignment), fieldAnswers);
              }, this));
          }, this));
      }
    },
    
    _onDialogReady: function() {
      if ($(this._requestCard).attr('data-evaluated')) {
        this._loadAssessment($(this._requestCard).attr('data-workspace-user-entity-id'));
      }
      else {
        $('#workspaceEvaluationDate').datepicker('setDate', new Date());
      }
      this._loadMaterials();
    },
    
    _onMaterialsLoaded: function(event, data) {
      $.each(data.assignments, $.proxy(function(index, assignment) {
        renderDustTemplate("evaluation/evaluation-assignment-wrapper.dust", {
          materialType: assignment.evaluable ? 'assignment' : 'exercise',
          title: assignment.title,
          submitDate: assignment.submitted,
          workspaceMaterialId: assignment.workspaceMaterialId,
          materialId: assignment.materialId,
          path: assignment.path,
          evaluationDate: assignment.evaluated,
          grade: assignment.grade
        }, $.proxy(function (html) {
          $('.eval-modal-assignment-content').append(html);
        }, this));
      }, this));
      // Material's loading animation end
      this.element.trigger("loadEnd", $('.eval-modal-assignment-content'));
    },
    
    _onWorkspaceAssessmentSaved: function(event, data) {
      this.confirmStudentArchive(this._requestCard, $.proxy(function(archived) {
        var assessment = data.assessment;
        if (archived === true || this._discardOnSave === true) {
          this.element.trigger("discardCard", {workspaceUserEntityId: $(this._requestCard).attr('data-workspace-user-entity-id')});          
        }
        else {
          this.element.trigger("cardStateChange", {
            card: $(this._requestCard),
            evaluated: true,
            passing: assessment.passing,
            evaluationDate: moment(assessment.assessmentDate).toDate()});
        }
        this.close();
      }, this));
    },
    
    setActiveAssignment: function(assignment) {
      this._activeAssignment = assignment;
    },
    
    loadMaterialAssessment: function(userEntityId, workspaceMaterialId, evaluated) {
      $('#assignmentWorkspaceMaterialId').val(workspaceMaterialId);
      $('#assignmentUserEntityId').val(userEntityId);
      if (evaluated) {
        mApi().evaluation.user.workspacematerial.assessment
          .read(userEntityId, workspaceMaterialId)
          .callback($.proxy(function (err, assessment) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              $('#assignmentAssessmentId').val(assessment.identifier);
              // Verbal assessment
              CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.setData(assessment.verbalAssessment);
              // Date
              $('#assignmentEvaluationDate').datepicker('setDate', moment(assessment.assessmentDate).toDate());
              // Assessor
              $('#assignmentAssessor').val(assessment.assessorIdentifier);
              // Grade
              $('#assignmentGrade').val(assessment.gradingScaleIdentifier + '@' + assessment.gradeIdentifier);
              // Show material evaluation view
              this._toggleMaterialAssessmentView(true);
            }
          }, this));
      }
      else {
        $('#assignmentAssessmentId').val('');
        CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.setData('');
        $('#assignmentEvaluationDate').datepicker('setDate', new Date());
        $('#assignmentAssessor').prop('selectedIndex', 0);
        $('#assignmentGrade').prop('selectedIndex', 0);
        this._toggleMaterialAssessmentView(true);
      }
    },
    
    _toggleMaterialAssessmentView(show) {
      
      // View width check so we know how modal is rendered
      if ($(document).width() > 1023) {
        var slidePosition = 50;
        var boxShadow = "-5px 0 30px rgba(0,0,0,0.25)";
      } else {
        var slidePosition = 2;
        var boxShadow = "-5px 0 30px rgba(0,0,0,1)";
      }
      
      if (show) {
        this._disableModalScrolling();
        $('.eval-modal-assignment-evaluate-container')
          .show()
          .css({
            width: 100 - slidePosition + "%",
          })
          .animate({
            left: slidePosition + "%"
        }, 300, "swing", function() {
          $(this).css({
            "box-shadow" : boxShadow
          });
        });
      }
      else {
        this._enableModalScrolling();
        $('.eval-modal-assignment-evaluate-container')
          .css({
            width: 100 - slidePosition + "%",
            "box-shadow" : "none"
          })
          .animate({
            left: "100%"
        }, 250, "swing", function() {
          $('.eval-modal-assignment-evaluate-container').hide();
        });
      }
    },
    
    _disableModalScrolling: function() {
      $('.eval-modal').addClass('no-scroll');
    },
    
    _enableModalScrolling: function() {
      $('.eval-modal').removeClass('no-scroll');
    },
    
    _loadAssessment: function(workspaceUserEntityId) {
      mApi().evaluation.workspaceuser.assessment
        .read(workspaceUserEntityId)
        .callback($.proxy(function (err, assessment) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            // Verbal assessment
            CKEDITOR.instances.workspaceEvaluateFormLiteralEvaluation.setData(assessment.verbalAssessment);
            // Date
            $('#workspaceEvaluationDate').datepicker('setDate', moment(assessment.assessmentDate).toDate());
            // Assessor
            $('#workspaceAssessor').val(assessment.assessorIdentifier);
            // Grade
            $('#workspaceGrade').val(assessment.gradingScaleIdentifier + '@' + assessment.gradeIdentifier);
            // Remove assessment button
            $('.button-delete').show();
          }
        }, this));
    },

    confirmStudentArchive: function(card, callback) {
      var workspaceEntityId = $(card).attr('data-workspace-entity-id');
      var workspaceUserIdentifier = $(card).attr('data-workspace-user-identifier');
      var studentName = $(card).find('.evaluation-card-student').text();
      renderDustTemplate('evaluation/evaluation-archive-student-confirm.dust', {studentName: studentName}, $.proxy(function(text) {
        var dialog = $(text);
        $(text).dialog({
          modal : true,
          minHeight : 200,
          resizable : false,
          width : 560,
          dialogClass : "evaluation-archive-student-confirm-dialog",
          buttons : [ {
            'text' : dialog.attr('data-button-remove-text'),
            'class' : 'remove-button',
            'click' : function(event) {
              mApi().workspace.workspaces.students
                .read(workspaceEntityId, workspaceUserIdentifier)
                .callback($.proxy(function (err, workspaceUserEntity) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  }
                  else {
                    workspaceUserEntity.archived = true;
                    mApi().workspace.workspaces.students
                      .update(workspaceEntityId, workspaceUserIdentifier, workspaceUserEntity)
                      .callback($.proxy(function (err, html) {
                        if (err) {
                          $('.notification-queue').notificationQueue('notification', 'error', err);
                        }
                        else {
                          $(this).dialog("destroy").remove();
                          if (callback) {
                            callback(true);
                          }
                        }
                      }, this));
                  }
                }, this));
            }
          }, {
            'text' : dialog.attr('data-button-cancel-text'),
            'class' : 'cancel-button',
            'click' : function(event) {
              $(this).dialog("destroy").remove();
              if (callback) {
                callback(false);
              }
            }
          } ]
        });
      }, this));
    },
    
    _confirmAssessmentDeletion: function(callback) {
      var studentName = $(this._requestCard).find('.evaluation-card-student').text();
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
    
    _deleteAssessment: function() {
      var workspaceUserEntityId = $('#workspaceWorkspaceUserEntityId').val();
      mApi().evaluation.workspaceuser.assessment
        .del(workspaceUserEntityId)
        .callback($.proxy(function (err) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            $('.button-delete').hide();
            this.element.trigger("cardStateChange", {card: $(this._requestCard), evaluated: false});
            $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.notifications.workspaceEvaluation.deleteSuccessful"));
            this.close();
          }
        }, this));
    },

    _saveAssessment: function() {
      var workspaceUserEntityId = $('#workspaceWorkspaceUserEntityId').val();
      if ($(this._requestCard).attr('data-evaluated')) {
        mApi().evaluation.workspaceuser.assessment
          .read(workspaceUserEntityId)
          .callback($.proxy(function (err, assessment) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              var scaleAndGrade = $('#workspaceGrade').val().split('@');
              assessment.verbalAssessment = CKEDITOR.instances.workspaceEvaluateFormLiteralEvaluation.getData();
              assessment.assessmentDate = $('#workspaceEvaluationDate').datepicker('getDate').getTime();
              assessment.assessorIdentifier = $('#workspaceAssessor').val();
              assessment.gradingScaleIdentifier = scaleAndGrade[0];
              assessment.gradeIdentifier = scaleAndGrade[1];
              mApi().evaluation.workspaceuser.assessment
                .update(workspaceUserEntityId, assessment)
                .callback($.proxy(function (err, assessment) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  }
                  else {
                    $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.notifications.workspaceEvaluation.updateSuccessful"));
                    this.element.trigger("workspaceAssessmentSaved", {
                      assessment: assessment
                    });
                  }
                }, this));
            }
          }, this));
      }
      else {
        var scaleAndGrade = $('#workspaceGrade').val().split('@');
        mApi().evaluation.workspaceuser.assessment
          .create(workspaceUserEntityId, {
            assessorIdentifier: $('#workspaceAssessor').val(),
            gradingScaleIdentifier: scaleAndGrade[0],
            gradeIdentifier: scaleAndGrade[1],
            verbalAssessment: CKEDITOR.instances.workspaceEvaluateFormLiteralEvaluation.getData(),
            assessmentDate: $('#workspaceEvaluationDate').datepicker('getDate').getTime()
          })
          .callback($.proxy(function (err, assessment) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.notifications.workspaceEvaluation.saveSuccessful"));
              this.element.trigger("workspaceAssessmentSaved", {
                assessment: assessment
              });
            }
          }, this));
      }
    },

    _saveMaterialAssessment: function() {
      var assessmentId = $('#assignmentAssessmentId').val();
      var userEntityId = $('#assignmentUserEntityId').val();
      var workspaceMaterialId = $('#assignmentWorkspaceMaterialId').val();
      if (assessmentId) {
        mApi().evaluation.user.workspacematerial.assessment
          .read(userEntityId, workspaceMaterialId)
          .callback($.proxy(function (err, assessment) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              var scaleAndGrade = $('#assignmentGrade').val().split('@');
              assessment.verbalAssessment = CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.getData();
              assessment.assessmentDate = $('#assignmentEvaluationDate').datepicker('getDate').getTime();
              assessment.assessorIdentifier = $('#assignmentAssessor').val();
              assessment.gradingScaleIdentifier = scaleAndGrade[0];
              assessment.gradeIdentifier = scaleAndGrade[1];
              mApi().evaluation.user.workspacematerial.assessment
                .update(userEntityId, workspaceMaterialId, assessment)
                .callback($.proxy(function (err, assessment) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  }
                  else {
                    $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.notifications.assignmentEvaluation.updateSuccessful"));
                    $(this._activeAssignment).attr('data-evaluated', true);
                    $(this._activeAssignment).find('.assignment-evaluated-data').text(formatDate($('#assignmentEvaluationDate').datepicker('getDate')));
                    $(this._activeAssignment).find('.assignment-grade-data').text($('#assignmentGrade option:selected').text());
                    this._toggleMaterialAssessmentView(false);
                  }
                }, this));
            }
          }, this));
      }
      else {
        var scaleAndGrade = $('#assignmentGrade').val().split('@');
        mApi().evaluation.user.workspacematerial.assessment
          .create(userEntityId, workspaceMaterialId, {
            assessorIdentifier: $('#assignmentAssessor').val(),
            gradingScaleIdentifier: scaleAndGrade[0],
            gradeIdentifier: scaleAndGrade[1],
            verbalAssessment: CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.getData(),
            assessmentDate: $('#assignmentEvaluationDate').datepicker('getDate').getTime()
          })
          .callback($.proxy(function (err, assessment) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.notifications.assignmentEvaluation.saveSuccessful"));
              $(this._activeAssignment).attr('data-evaluated', true);
              var evaluationDateElement = $('<div>')
                .addClass('assignment-evaluated')
                .append($('<span>').addClass('assignment-evaluated-label').text(getLocaleText("plugin.evaluation.evaluationModal.assignmentEvaluatedLabel")))
                .append($('<span>').addClass('assignment-evaluated-data').text(formatDate($('#assignmentEvaluationDate').datepicker('getDate'))));
              var gradeElement = $('<div>')
                .addClass('assignment-grade')
                .append($('<span>').addClass('assignment-grade-label').text(getLocaleText("plugin.evaluation.evaluationModal.assignmentGradeLabel")))
                .append($('<span>').addClass('assignment-grade-data').text($('#assignmentGrade option:selected').text()));
              $(this._activeAssignment).find('.assignment-done').after(gradeElement).after(evaluationDateElement);
              this._toggleMaterialAssessmentView(false);
            }
          }, this));
      }
    }
  });

  $(document).on('click', '.archive-button', function (event) {
    var card = $(event.target).closest('.evaluation-card');
    $(document).evaluationModal('confirmStudentArchive', card, $.proxy(function(archived) {
      if (archived) {
        $(document).trigger("discardCard", {workspaceUserEntityId: $(card).attr('data-workspace-user-entity-id')});
      }
    }, this));
  });
  
  $(document).on('click', '.assignment-title-wrapper', function (event) {
    var assignmentContent = $(event.target).closest('.assignment-wrapper').find('.assignment-content');
    $(document).evaluationModal('toggleAssignment', assignmentContent);
  });

  $(document).on('click', '.assignment-evaluate-button', function (event) {
    var assignment = $(event.target).closest('.assignment-wrapper');
    $(document).evaluationModal('setActiveAssignment', assignment);
    var userEntityId = $('#evaluationStudentContainer').attr('data-user-entity-id');
    var workspaceMaterialId = $(assignment).find('.assignment-content').attr('data-workspace-material-id');
    $('.eval-modal-assignment-title').text($(assignment).find('.assignment-title').text())
    $(document).evaluationModal('loadMaterialAssessment', userEntityId, workspaceMaterialId, $(assignment).attr('data-evaluated'));
  });

  $(document).on('afterHtmlMaterialRender', function (event, data) {
    var replyState = $(data.pageElement).attr('data-reply-state');
    if (replyState != '') {
      $(data.pageElement).muikkuMaterialPage('checkExercises', true);
    }
  });
  
}).call(this);