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
              $('.eval-modal-assignment-evaluate-container').hide();
              
              // Material's loading animation start
              
              this.element.trigger("loadStart", $('.eval-modal-assignment-content'));
              
              // CKEditor
              
              var verbalAssessmentEditor = this._evaluationModal.find("#evaluateFormLiteralEvaluation")[0];
              CKEDITOR.replace(verbalAssessmentEditor, $.extend(this.options.ckeditor, {
                on: {
                  instanceReady: $.proxy(this._onLiteralEvaluationEditorReady, this)
                }
              }));

              // Date picker
              
              var dateEditor = $(this._evaluationModal).find('input[name="evaluationDate"]'); 
              $(dateEditor)
                .css({'z-index': 999, 'position': 'relative'})
                .attr('type', 'text')
                .datepicker();
              
              // Remove assessment button
              
              $('.button-delete').click($.proxy(function(event) {
                this._confirmAssessmentDeletion($.proxy(function () {
                  this._deleteAssessment();
                }, this));
              }, this));
              
              // Save assessment button
              
              $('.button-evaluate-passing').click($.proxy(function(event) {
                this._saveAssessment();
              }, this));
              
              // Cancel and close buttons
              
              $('.eval-modal-close, .button-cancel').click($.proxy(function (event) {
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
      var workspaceEntityId = $(this._requestCard).attr('data-workspace-entity-id');
      var loads = $.map(["EVALUATED", "EXERCISE"], $.proxy(function (assignmentType) {
        return $.proxy(function (callback) {
          mApi().workspace.workspaces.materials
            .read(workspaceEntityId, { assignmentType : assignmentType})
            .callback(callback)
        }, this);
      }, this));
      
      async.parallel(loads, $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          var evaluableAssignments = results[0]||[];
          var exerciseAssignments = results[1]||[];
          var assignments = evaluableAssignments.concat(exerciseAssignments);
          var workspaceEntityId = $(this._requestCard).attr('data-workspace-entity-id');
          var userEntityId = $(this._requestCard).attr('data-user-entity-id');
          var batchCalls = $.map(assignments, $.proxy(function (assignment) {
            return mApi().workspace.workspaces.materials.compositeMaterialReplies.read(workspaceEntityId, assignment.id, {
              userEntityId: userEntityId
            });
          }, this));

          mApi().batch(batchCalls).callback($.proxy(function (err, results) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              for (var i = 0; i < assignments.length; i++) {
                this.options.assignmentAnswers[assignments[i].materialId] = results[i].answers;
                assignments[i] = $.extend({}, assignments[i], {
                  assignmentState: results[i].state,
                  assignmentDate: results[i].lastModified
                }); 
              }
              this.element.trigger("materialsLoaded", {
                assignments: assignments
              });
            }
          }, this));
        }
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
        var materialId = $(assignment).attr('data-material-id');
        var fieldAnswers = {};
        var userAnswers = this.options.assignmentAnswers[materialId]
        for (var i = 0, l = userAnswers.length; i < l; i++) {
          var answer = userAnswers[i];
          var answerKey = [answer.materialId, answer.embedId, answer.fieldName].join('.');
          fieldAnswers[answerKey] = answer.value;
        }
        // Material html
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
      }
    },
    
    _onDialogReady: function() {
      if ($(this._requestCard).attr('data-evaluated')) {
        this._loadAssessment($(this._requestCard).attr('data-workspace-user-entity-id'));
      }
      else {
        $('#evaluationDate').datepicker('setDate', new Date());
        $('.button-delete').hide();
      }
      this._loadMaterials();
    },
    
    _onMaterialsLoaded: function(event, data) {
      $.each(data.assignments, $.proxy(function(index, assignment) {
        var assignmentWrapper = $('<div>')
          .addClass('assignment-wrapper')
          .addClass(assignment.assignmentType == 'EVALUATED' ? 'assignment' : 'exercise')
          .appendTo($('.eval-modal-assignment-content'));
        
        var assignmentTitleWrapper = $('<div>')
          .addClass('assignment-title-wrapper')
          .appendTo(assignmentWrapper);
        
        var assignmentTitle = $('<div>')
          .addClass('assignment-title')
          .text(assignment.title)
          .appendTo(assignmentTitleWrapper);
        
        // TODO: Localization
        var assignmentDone = $('<div>');
        if (assignment.assignmentState == 'SUBMITTED') {
          $(assignmentDone)
            .addClass('assignment-done')
            .append($('<span>')
              .addClass('assignment-done-label')
              .text('Tehty'))
            .append($('<span>')
              .addClass('assignment-done-data')
              .text(formatDateTime(new Date(moment(assignment.assignmentDate)))))
            .appendTo(assignmentTitleWrapper);
        } else {
          $(assignmentDone)
            .addClass('assignment-done')
            .append($('<span>')
              .addClass('assignment-notdone-label')
              .text('Ei tehty'))
            .appendTo(assignmentTitleWrapper);
        }
        
        // TODO: Localization
        var assignmentEvaluationButton = $('<div>')
          .addClass('assignment-evaluate-button icon-evaluate')
          .attr('title', 'Arvioi tehtävä')
          .appendTo(assignmentWrapper);
        var assignmentContent = $('<div>')
          .addClass('assignment-content')
          .attr('data-workspace-material-id', assignment.id)
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
    
    _loadAssessment: function(workspaceUserEntityId) {
      mApi().evaluation.workspaceuser.assessment
        .read(workspaceUserEntityId)
        .callback($.proxy(function (err, assessment) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            // Verbal assessment
            CKEDITOR.instances.evaluateFormLiteralEvaluation.setData(assessment.verbalAssessment);
            // Date
            $('#evaluationDate').datepicker('setDate', new Date(moment(assessment.assessmentDate)));
            // Assessor
            $('#assessor').val(assessment.assessorIdentifier);
            // Grade
            $('#grade').val(assessment.gradingScaleIdentifier + '@' + assessment.gradeIdentifier);
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
      var workspaceUserEntityId = $('#workspaceUserEntityId').val();
      mApi().evaluation.workspaceuser.assessment
        .del(workspaceUserEntityId)
        .callback($.proxy(function (err) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          $(this._requestCard).removeAttr('data-evaluated');
          $('.button-delete').hide();
          // TODO reset form?
        }, this));
    },
    
    _saveAssessment: function() {
      var workspaceUserEntityId = $('#workspaceUserEntityId').val();
      if ($(this._requestCard).attr('data-evaluated')) {
        mApi().evaluation.workspaceuser.assessment
          .read(workspaceUserEntityId)
          .callback($.proxy(function (err, assessment) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              var scaleAndGrade = $('#grade').val().split('@');
              assessment.verbalAssessment = CKEDITOR.instances.evaluateFormLiteralEvaluation.getData();
              assessment.assessmentDate = $('#evaluationDate').datepicker('getDate').getTime();
              assessment.assessorIdentifier = $('#assessor').val();
              assessment.gradingScaleIdentifier = scaleAndGrade[0];
              assessment.gradeIdentifier = scaleAndGrade[1];
              mApi().evaluation.workspaceuser.assessment
                .update(workspaceUserEntityId, assessment)
                .callback($.proxy(function (err, assessment) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  }
                  else {
                    $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.workspaceEvaluationDialog.evaluation.updateSuccessful"));
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
        var scaleAndGrade = $('#grade').val().split('@');
        mApi().evaluation.workspaceuser.assessment
          .create(workspaceUserEntityId, {
            assessorIdentifier: $('#assessor').val(),
            gradingScaleIdentifier: scaleAndGrade[0],
            gradeIdentifier: scaleAndGrade[1],
            verbalAssessment: CKEDITOR.instances.evaluateFormLiteralEvaluation.getData(),
            assessmentDate: $('#evaluationDate').datepicker('getDate').getTime()
          })
          .callback($.proxy(function (err, assessment) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.workspaceEvaluationDialog.evaluation.updateSuccessful"));
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
    }
  });

  $(document).on('afterHtmlMaterialRender', function (event, data) {
    var replyState = $(data.pageElement).attr('data-reply-state');
    if (replyState != '') {
      $(data.pageElement).muikkuMaterialPage('checkExercises', true);
    }
  });
  
}).call(this);