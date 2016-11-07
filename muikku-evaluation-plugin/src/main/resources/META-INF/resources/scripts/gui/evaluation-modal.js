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
    },
    
    open: function(requestCard, discardOnSave) {
      
      this._requestCard = requestCard;
      this._discardOnSave = discardOnSave;
      this._assignmentSaved = false;
      
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
              studentName: $(requestCard).find('.evaluation-request-student').text(),
              studyProgrammeName: $(requestCard).find('.evaluation-request-study-programme').text(),
              courseName: $(requestCard).find('.workspace-name').text(),
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
      if (this._discardOnSave && this._assignmentSaved) {
        $(this._requestCard).remove();
      }
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
    
    _toggleAssignment: function(assignment) {
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
            for (var i = 0, l = replies.length; i < l; i++) {
              var answer = replies[i];
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
        var assignmentWrapper = $('<div>')
          .addClass('assignment-wrapper')
          .addClass(assignment.evaluable ? 'assignment' : 'exercise')
          .appendTo($('.eval-modal-assignment-content'));
        
        var assignmentTitleWrapper = $('<div>')
          .addClass('assignment-title-wrapper')
          .appendTo(assignmentWrapper);
        
        var assignmentTitle = $('<div>')
          .addClass('assignment-title')
          .text(assignment.title)
          .appendTo(assignmentTitleWrapper);
        
        var assignmentDone = $('<div>');
        if (assignment.submitted) {
          $(assignmentDone)
            .addClass('assignment-done')
            .append($('<span>')
              .addClass('assignment-done-label')
              .text(getLocaleText("plugin.evaluation.evaluationModal.assignmentDoneLabel")))
            .append($('<span>')
              .addClass('assignment-done-data')
              .text(formatDateTime(new Date(moment(assignment.submitted)))))
            .appendTo(assignmentTitleWrapper);
        } else {
          $(assignmentDone)
            .addClass('assignment-done')
            .append($('<span>')
              .addClass('assignment-notdone-label')
              .text(getLocaleText("plugin.evaluation.evaluationModal.assignmentNotDoneLabel")))
            .appendTo(assignmentTitleWrapper);
        }
        
        var assignmentEvaluationButton = $('<div>')
          .addClass('assignment-evaluate-button icon-evaluate')
          .attr('title', getLocaleText("plugin.evaluation.evaluationModal.evaluateAssignmentButtonTitle"))
          .appendTo(assignmentWrapper);
        $(assignmentEvaluationButton).click($.proxy(function(event) {
          var userEntityId = $(this._requestCard).attr('data-user-entity-id');
          var workspaceMaterialId = $(assignmentEvaluationButton).closest('.assignment').find('.assignment-content').attr('data-workspace-material-id'); 
          this._loadMaterialEvaluation(userEntityId, workspaceMaterialId);
        }, this));
        
        var assignmentContent = $('<div>')
          .addClass('assignment-content')
          .attr('data-workspace-material-id', assignment.workspaceMaterialId)
          .attr('data-material-id', assignment.materialId)
          .attr('data-path', assignment.path)
          .attr('data-open', false)
          .attr('data-loaded', false)
          .appendTo(assignmentWrapper);
        $(assignmentTitleWrapper).click($.proxy(function(event) {
          this._toggleAssignment(assignmentContent);
        }, this));
      }, this));
      
      // Material's loading animation end
      this.element.trigger("loadEnd", $('.eval-modal-assignment-content'));
    },
    
    _loadMaterialEvaluation: function(userEntityId, workspaceMaterialId) {
      mApi().evaluation.user.workspacematerial.assessment
        .read(userEntityId, workspaceMaterialId)
        .callback($.proxy(function (err, assessment) {
//          if (err) {
//            $('.notification-queue').notificationQueue('notification', 'error', err);
//          }
//          else {
//            // Verbal assessment
//            CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.setData(assessment.verbalAssessment);
//            // Date
//            $('#assignmentEvaluationDate').datepicker('setDate', new Date(moment(assessment.assessmentDate)));
//            // Assessor
//            $('#assignmentAssessor').val(assessment.assessorIdentifier);
//            // Grade
//            $('#assignmentGrade').val(assessment.gradingScaleIdentifier + '@' + assessment.gradeIdentifier);
//            // Remove assessment button
//            $('.button-delete').show();
//            // Show material evaluation view
            this._disableModalScrolling();
            $('.eval-modal-assignment-evaluate-container')
              .show()
              .animate({
                left: "50%"
              }, 200, "swing", function() {
                $.proxy(this._enableModalScrolling(), this);
              });
            
            $('.eval-modal-assignment-close').click($.proxy(function(event) {
              this._closeMaterialEvaluation();
            }, this));
            
//          }
        }, this));
    },
    
    _closeMaterialEvaluation: function (event) {
      this._disableModalScrolling();
      $('.eval-modal-assignment-evaluate-container')
        .animate({
          left: "100%"
        }, 200, "swing", function() {
          $(this).hide();
          $.proxy(this._enableModalScrolling(), this);
        });
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
            $('#workspaceEvaluationDate').datepicker('setDate', new Date(moment(assessment.assessmentDate)));
            // Assessor
            $('#workspaceAssessor').val(assessment.assessorIdentifier);
            // Grade
            $('#workspaceGrade').val(assessment.gradingScaleIdentifier + '@' + assessment.gradeIdentifier);
            // Remove assessment button
            $('.button-delete').show();
          }
        }, this));
    },
    
    _confirmAssessmentDeletion: function(callback) {
      var studentName = $(this._requestCard).find('.evaluation-request-student').text();
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
            $(this._requestCard).removeAttr('data-evaluated');
            $(this._requestCard).removeClass('evaluated-incomplete evaluated-passed');
            $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.notifications.deleteSuccessful"));
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
                    $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.notifications.updateSuccessful"));
                    this._assignmentSaved = true; 
                    if (assessment.passing) {
                      $(this._requestCard).removeClass('evaluated-incomplete').addClass('evaluated-passed');
                    }
                    else {
                      $(this._requestCard).removeClass('evaluated-passed').addClass('evaluated-incomplete');
                    }
                    $(this._requestCard).attr('data-evaluated', true);
                    this.close();
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
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.notifications.saveSuccessful"));
              this._assignmentSaved = true;
              if (assessment.passing) {
                $(this._requestCard).removeClass('evaluated-incomplete').addClass('evaluated-passed');
              }
              else {
                $(this._requestCard).removeClass('evaluated-passed').addClass('evaluated-incomplete');
              }
              $(this._requestCard).attr('data-evaluated', true);
              this.close();
            }
          }, this));
      }
    },
  });

  $(document).on('afterHtmlMaterialRender', function (event, data) {
    var replyState = $(data.pageElement).attr('data-reply-state');
    if (replyState != '') {
      $(data.pageElement).muikkuMaterialPage('checkExercises', true);
    }
  });
  
}).call(this);