(function() {
  'use strict';
  
  $.widget("custom.evaluationModal", {
    options: {
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
    
    open: function(requestCard) {
      
      this._requestCard = requestCard;      
      
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
              workspaceEntityId: $(requestCard).attr('data-workspace-entity-id'),
              userEntityId: $(requestCard).attr('data-user-entity-id')
            }, $.proxy(function (html) {
              
              // Modal UI
              
              this._evaluationModal.append(html);
              
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
                .css({'z-index': 9999, 'position': 'relative'})
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
          this.element.trigger("materialsLoaded", {
            assignments: evaluableAssignments.concat(exerciseAssignments)
          });
        }
      }, this));
    },
    
    _toggleAssignment: function(assignment) {
      if ($(assignment).attr('data-loaded') == 'true') {
        if ($(assignment).attr('data-open') == 'true') {
          $(assignment).attr('data-open', false);
          $(assignment).find('.page-content, .clear').hide();
        }
        else {
          $(assignment).attr('data-open', true);
          $(assignment).find('.page-content, .clear').show();
        }
      }
      else {
        var userEntityId = $(this._requestCard).attr('data-user-entity-id');
        var workspaceEntityId = $(this._requestCard).attr('data-workspace-entity-id');
        var materialId = $(assignment).attr('data-material-id');
        var workspaceMaterialId = $(assignment).attr('data-workspace-material-id');
        // Answers
        mApi().workspace.workspaces.materials.compositeMaterialReplies
          .read(workspaceEntityId, workspaceMaterialId, {
            userEntityId: userEntityId
          })
          .callback($.proxy(function(err, replies) {
            var fieldAnswers = {};
            for (var i = 0, l = replies.answers.length; i < l; i++) {
              var answer = replies.answers[i];
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
          }, this));
      }
    },
    
    _onDialogReady: function() {
      if ($(this._requestCard).attr('data-evaluated')) {
        this._loadAssessment($(this._requestCard).attr('data-workspace-entity-id'), $(this._requestCard).attr('data-user-entity-id'));
      }
      else {
        $('#evaluationDate').datepicker('setDate', new Date());
        $('.button-delete').hide();
      }
      this._loadMaterials();
    },
    
    _onMaterialsLoaded: function(event, data) {
      $.each(data.assignments, $.proxy(function(index, assignment) {
        var assignmentTitle = $('<div>')
          .addClass('assignment-header')
          .text(assignment.title); 
        
        var assignment = $('<div>')
          .addClass('assignment')
          .attr('data-workspace-material-id', assignment.id)
          .attr('data-material-id', assignment.materialId)
          .attr('data-path', assignment.path)
          .attr('data-open', false)
          .attr('data-loaded', false)
            .append(assignmentTitle)
          .appendTo($('.eval-modal-assignment-content'));
        
        $(assignmentTitle).click($.proxy(function(event) {
          this._toggleAssignment(assignment);
        }, this));
      }, this));
    },
    
    _loadAssessment: function(workspaceEntityId, userEntityId) {
      mApi().evaluation.workspace.student.assessment
      .read(workspaceEntityId, userEntityId)
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
      var workspaceEntityId = $('#workspaceEntityId').val();
      var userEntityId = $('#userEntityId').val();
      mApi().evaluation.workspaces.students.assessment
        .del(workspaceEntityId, userEntityId)
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
      var workspaceEntityId = $('#workspaceEntityId').val();
      var userEntityId = $('#userEntityId').val();
      if ($(this._requestCard).attr('data-evaluated')) {
        mApi().evaluation.workspace.student.assessment
          .read(workspaceEntityId, userEntityId)
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
              mApi().evaluation.workspace.student.assessment
                .update(workspaceEntityId, userEntityId, assessment)
                .callback($.proxy(function (err, assessment) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  }
                  else {
                    $(this._requestCard).attr('data-evaluated', true);
                    $('.button-delete').show();
                  }
                }, this));
            }
          }, this));
      }
      else {
        var scaleAndGrade = $('#grade').val().split('@');
        mApi().evaluation.workspace.student.assessment
          .create(workspaceEntityId, userEntityId, {
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
              $(this._requestCard).attr('data-evaluated', true);
              $('.button-delete').show();
            }
          }, this));
      }
    }
  });
  
}).call(this);
