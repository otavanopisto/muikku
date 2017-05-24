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
        mathJaxLib: '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_HTMLorMML',
        toolbar: [
          { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
          { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'Undo', 'Redo' ] },
          { name: 'links', items: [ 'Link' ] },
          { name: 'insert', items: [ 'Image', 'Table', 'Muikku-mathjax', 'Smiley', 'SpecialChar' ] },
          { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
          { name: 'styles', items: [ 'Format' ] },
          { name: 'insert', items : [ 'Muikku-mathjax' ] },
          { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
          { name: 'tools', items: [ 'Maximize' ] }
        ],
        contentsCss : CONTEXTPATH +  '/css/flex/custom-ckeditor-contentcss_reading.css',
        extraPlugins : {
          'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.8/',
          'widget': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/4.5.8/',
          'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
          'draft' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.3/plugin.min.js',
          'lineutils': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/4.5.8/',
          'muikku-mathjax': CONTEXTPATH + '/scripts/ckplugins/muikku-mathjax/'
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
      this.element.on("workspaceSupplementationRequestSaved", $.proxy(this._onWorkspaceSupplementationRequestSaved, this));
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
              
              this._evaluationModal
                .find('.eval-modal-evaluate-workspace-content')
                .css({
                  'overflow-y': 'hidden'
                })
                .append($('<div>')
                  .addClass('workspace-evaluation-form-overlay'))
                .append($('<div>')
                  .addClass('workspace-evaluation-form-activate-button')
                  .text(getLocaleText("plugin.evaluation.evaluationModal.workspaceEvaluationForm.overlayButtonLabel"))
                );
              
              // Material's loading animation start
              
              this.element.trigger("loadStart", $('.eval-modal-assignments-content'));
              
              // Workspace assessment editor

              var workspaceLiteralEditor = this._evaluationModal.find("#workspaceEvaluateFormLiteralEvaluation")[0]; 
              CKEDITOR.replace(workspaceLiteralEditor, $.extend({}, this.options.ckeditor, {
                manualDraftStart: true,
                draftKey: ['workspace-evaluation-draft', workspaceEntityId, $(requestCard).attr('data-user-entity-id')].join('-'),
                on: {
                  instanceReady: $.proxy(this._onLiteralEvaluationEditorReady, this)
                }
              }));
              var workspaceDateEditor = $(this._evaluationModal).find('#workspaceEvaluationDate'); 
              $(workspaceDateEditor)
                .css({'z-index': 999, 'position': 'relative'})
                .attr('type', 'text')
                .datepicker();
              
              // Enabled workspace grade if assessment is marked graded
              
              $('#workspaceGradedButton').click($.proxy(function(event) {
                $('#workspaceGrade').prop('disabled', false);
                $('#workspaceGrade').closest('.evaluation-modal-evaluate-form-row').removeAttr('disabled');
              }, this));
              
              // Disable workspace grade if assessment is marked incomplete
              
              $('#workspaceIncompleteButton').click($.proxy(function(event) {
                $('#workspaceGrade').prop('disabled', true);
                $('#workspaceGrade').closest('.evaluation-modal-evaluate-form-row').attr('disabled', 'disabled');
              }, this));
              
              // Delete workspace assessment (or supplementation request)
              
              if ($(this._requestCard).attr('data-evaluated')) {
                $('#workspaceDeleteButton').show();
              }
              $('#workspaceDeleteButton').click($.proxy(function(event) {
                this._confirmAssessmentDeletion($.proxy(function () {
                  this._deleteEvaluationData();
                }, this));
              }, this));
              
              // Save workspace assessment (or supplementation request) 
              
              $('#workspaceSaveButton').click($.proxy(function(event) {
                CKEDITOR.instances.workspaceEvaluateFormLiteralEvaluation.discardDraft();
                var gradingValue = $('input[name=workspaceGrading]:checked').val();
                if (gradingValue == 'GRADED') {
                  this._saveWorkspaceAssessment();
                }
                else {
                  this._saveWorkspaceSupplementationRequest();
                }
              }, this));
              
              // Cancel workspace assessment
              
              $('#workspaceCancelButton').click($.proxy(function(event) {
                this.close();
              }, this));
              
              // Activate workspace assessment
              
              $('.workspace-evaluation-form-activate-button').click($.proxy(function(event) {
                $('.workspace-evaluation-form-activate-button, .workspace-evaluation-form-overlay').animate({
                  opacity: 0
                }, {
                  duration: 300,
                  complete: function (){
                    this.remove();
                    $('.eval-modal-evaluate-workspace-content').removeAttr('style');
                    CKEDITOR.instances.workspaceEvaluateFormLiteralEvaluation.startDrafting();
                  }
                });
              }, this));
              
              // Assignment assessment editor

              var assignmentDateEditor = $(this._evaluationModal).find('#assignmentEvaluationDate'); 
              $(assignmentDateEditor)
                .css({'z-index': 999, 'position': 'relative'})
                .attr('type', 'text')
                .datepicker();

              // Enabled assignment grade if assessment is marked graded
              
              $('#assignmentGradedButton').click($.proxy(function(event) {
                $('#assignmentGrade').prop('disabled', false);
                $('#assignmentGrade').closest('.evaluation-modal-evaluate-form-row').removeAttr('disabled');
              }, this));
              
              // Disable assignment grade if assessment is marked incomplete
              
              $('#assignmentIncompleteButton').click($.proxy(function(event) {
                $('#assignmentGrade').prop('disabled', true);
                $('#assignmentGrade').closest('.evaluation-modal-evaluate-form-row').attr('disabled', 'disabled');
              }, this));
              
              $('#assignmentSaveButton').click($.proxy(function(event) {
                CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.discardDraft();
                this._saveMaterialAssessment();
              }, this));
              
              $('#assignmentCancelButton').click($.proxy(function(event) {
                this.toggleAssignment(this._activeAssignment, false, false);
                this.toggleMaterialAssessmentView(false);
              }, this));
              
              $('.eval-modal-assignment-close').click($.proxy(function(event) {
                this.toggleMaterialAssessmentView(false);
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
      for (var name in CKEDITOR.instances) {
        CKEDITOR.instances[name].destroy(true);
      }
      this._evaluationModal.remove();
    },

    setGradingScales: function(gradingScales) {
      this._gradingScales = gradingScales;
    },
    
    _onLiteralEvaluationEditorReady: function() {
      this.element.trigger("dialogReady");
    },
    
    _loadJournalEntries: function() {
      var userEntityId = $(this._requestCard).attr('data-user-entity-id');
      var workspaceEntityId = $(this._requestCard).attr('data-workspace-entity-id');
      
      mApi().workspace.workspaces.journal.read(workspaceEntityId, {
        userEntityId: userEntityId,
        firstResult: 0, 
        maxResults: 512 
      }).callback($.proxy(function (err, journalEntries) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            renderDustTemplate('/evaluation/evaluation-journal-entries.dust', { 
              journalEntries: journalEntries
            }, $.proxy(function(text) {
              this.element.find('.eval-modal-journal-entries-content').append(text);
            }, this));
          }
        }, this));
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
    
    toggleAssignment: function(assignment, open, scrollToView) {
      if (!this._isLoaded(assignment)) {
        this._loadAssignment(assignment, $.proxy(function() {
          this._setAssignmentOpen(assignment, open, scrollToView);
        }, this));
      }
      else {
        this._setAssignmentOpen(assignment, open, scrollToView);
      }
    },
    
    _setAssignmentOpen: function(assignment, open, scrollToView) {
      var isOpen = this._isOpen(assignment);
      var shouldBeOpen = open == undefined ? !isOpen : open;
      if (isOpen != shouldBeOpen) {
        var assignmentContent = $(assignment).find('.assignment-content');
        if (shouldBeOpen) {
          $(assignmentContent).attr('data-open', true);
          $(assignmentContent).show();
          if ($(assignment).find('.assignment-literal-evaluation').text() != '') {
            $(assignment).find('.assignment-literal-evaluation-wrapper').show();
          }
        }
        else {
          $(assignmentContent).attr('data-open', false);
          $(assignmentContent).hide();
          $(assignment).find('.assignment-literal-evaluation-wrapper').hide();
        }
      }
      if (scrollToView) {
        var container = $('.eval-modal-materials-content');
        container.animate({
          scrollTop: assignment.offset().top - container.offset().top + container.scrollTop()
        }, 500);
      }
    },
    
    _isLoaded: function(assignment) {
      return $(assignment).find('.assignment-content').attr('data-loaded') == 'true';
    },

    _isOpen: function(assignment) {
      return $(assignment).find('.assignment-content').attr('data-open') == 'true';
    },
    
    _loadAssignment: function(assignment, callback) {
      if (!this._isLoaded(assignment)) {
        var assignmentContent = $(assignment).find('.assignment-content');
        var workspaceEntityId = $(this._requestCard).attr('data-workspace-entity-id');
        var workspaceMaterialId = $(assignmentContent).attr('data-workspace-material-id');
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
            var materialId = $(assignmentContent).attr('data-material-id');
            mApi().materials.html
              .read(materialId)
              .callback($.proxy(function (err, htmlMaterial) {
                $(assignmentContent)
                  .attr('data-material-type', 'html')
                  .attr('data-material-title', htmlMaterial.title)
                  .attr('data-material-content', htmlMaterial.html)
                  .attr('data-view-restricted', htmlMaterial.viewRestrict)
                  .attr('data-loaded', true);
                $(document).muikkuMaterialLoader('loadMaterial', $(assignmentContent), fieldAnswers);
                if (callback) {
                  callback();
                }
              }, this));
          }, this));
      }
      else {
        if (callback) {
          callback();
        }
      }
    },
    
    _onDialogReady: function() {
      if ($(this._requestCard).attr('data-evaluated') == 'true') {
        var userEntityId = $(this._requestCard).attr('data-user-entity-id');
        var workspaceEntityId = $(this._requestCard).attr('data-workspace-entity-id');
        if ($(this._requestCard).attr('data-graded') == 'true') {
          this._loadWorkspaceAssessment(workspaceEntityId, userEntityId);
        }
        else {
          this._loadWorkspaceSupplementationRequest(workspaceEntityId, userEntityId);
        }
      }
      else {
        $('#workspaceEvaluationDate').datepicker('setDate', new Date());
        $('#workspaceAssessor').val(MUIKKU_LOGGED_USER);
        $('#workspaceGradedButton').prop('checked', true);
        $('#workspaceGrade').prop('disabled', false);
        $('#workspaceGrade').prop('selectedIndex', 0);
      }
      this._loadMaterials();
      this._loadJournalEntries();
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
          grade: assignment.grade,
          literalEvaluation: assignment.literalEvaluation
        }, $.proxy(function (html) {
          var material = $(html).appendTo('.eval-modal-assignments-content');
          // Toggle material open/close
          $(material).find('.assignment-title-wrapper').on('click', $.proxy(function(event) {
            var assignment = $(event.target).closest('.assignment-wrapper');
            $(document).evaluationModal('toggleAssignment', assignment, !this._isOpen(assignment), false);
          }, this));
          // Evaluate material
          $(material).find('.assignment-evaluate-button').on('click', $.proxy(function (event) {
            var oldAssignment = this._activeAssignment;
            var newAssignment = $(event.target).closest('.assignment-wrapper');
            if (!oldAssignment || newAssignment[0] !== oldAssignment[0]) {
              if (oldAssignment) {
                oldAssignment.removeClass('active');
                this.toggleAssignment(oldAssignment, false, false);
              }
              $(document).evaluationModal('activeAssignment', newAssignment);
              var userEntityId = $(this._requestCard).attr('data-user-entity-id');
              var workspaceEntityId = $(this._requestCard).attr('data-workspace-entity-id');
              var workspaceMaterialId = $(newAssignment).find('.assignment-content').attr('data-workspace-material-id');
              $('.eval-modal-assignment-title').text($(newAssignment).find('.assignment-title').text())
              // Remove old assignment editor
              if (CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation) {
                CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.destroy(true);
              }
              // Create new assignment editor
              var assignmentLiteralEditor = $('#assignmentEvaluateFormLiteralEvaluation')[0]; 
              CKEDITOR.replace(assignmentLiteralEditor, $.extend({}, this.options.ckeditor, {
                manualDraftStart: true,
                draftKey: ['material-evaluation-draft', workspaceMaterialId, userEntityId].join('-'),
                on: {
                  instanceReady: $.proxy(function() {
                    this.loadMaterialAssessment(workspaceEntityId, userEntityId, workspaceMaterialId, $(newAssignment).attr('data-evaluated') == 'true', $(newAssignment).attr('data-graded') == 'true');
                  }, this)
                }
              }));
            }
            else {
              this.toggleMaterialAssessmentView(true);
            }
            this.toggleAssignment(newAssignment, true, true);
          }, this));
        }, this));
      }, this));
      // Material's loading animation end
      this.element.trigger("loadEnd", $('.eval-modal-assignments-content'));
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
            graded: true,
            passing: assessment.passing,
            evaluationDate: moment(assessment.assessmentDate).toDate()});
        }
        this.close();
      }, this));
    },

    _onWorkspaceSupplementationRequestSaved: function(event, data) {
      if (this._discardOnSave === true) {
        this.element.trigger("discardCard", {workspaceUserEntityId: $(this._requestCard).attr('data-workspace-user-entity-id')});          
      }
      else {
        this.element.trigger("cardStateChange", {
          card: $(this._requestCard),
          evaluated: true,
          graded: false,
          passing: false,
          evaluationDate: moment(data.supplementationRequest.requestDate).toDate()});
      }
      this.close();
    },
    
    activeAssignment: function(val) {
      if (val) {
        this._activeAssignment = val;
      }
      else {
        return this._activeAssignment;
      }
    },
    
    loadMaterialAssessment: function(workspaceEntityId, userEntityId, workspaceMaterialId, evaluated, graded) {
      $('#assignmentWorkspaceMaterialId').val(workspaceMaterialId);
      $('#assignmentUserEntityId').val(userEntityId);
      if (evaluated) {
        if (graded) {
          mApi().evaluation.workspace.user.workspacematerial.assessment
            .read(workspaceEntityId, userEntityId, workspaceMaterialId)
            .callback($.proxy(function (err, assessment) {
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', err);
              }
              else {
                // Verbal assessment
                CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.setData(assessment.verbalAssessment);
                // Date
                $('#assignmentEvaluationDate').datepicker('setDate', moment(assessment.assessmentDate).toDate());
                // Assessor
                $('#assignmentAssessor').val(assessment.assessorIdentifier);
                // Grading
                $('#assignmentGradedButton').prop('checked', true);
                // Grade
                $('#assignmentGrade').prop('disabled', false);
                $('#assignmentGrade').closest('.evaluation-modal-evaluate-form-row').removeAttr('disabled', 'disabled');
                // Grade (with filtered scale fallback)
                var gradeValue = assessment.gradingScaleIdentifier + '@' + assessment.gradeIdentifier;
                var gradeExists = $("#assignmentGrade option[value='" + gradeValue + "']").length !== 0;
                if (!gradeExists) {
                  $('#assignmentGrade').append('<option value="' + gradeValue + '"></option>');
                }
                $('#assignmentGrade').val(gradeValue);
                // Show material evaluation view
                this.toggleMaterialAssessmentView(true, $.proxy(function() {
                  CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.startDrafting();
                }, this));
              }
            }, this));
        }
        else {
          mApi().evaluation.workspace.user.workspacematerial.supplementationrequest
            .read(workspaceEntityId, userEntityId, workspaceMaterialId)
            .callback($.proxy(function (err, supplementationRequest) {
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', err);
              }
              else {
                // Verbal assessment
                CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.setData(supplementationRequest.requestText);
                // Date
                $('#assignmentEvaluationDate').datepicker('setDate', moment(supplementationRequest.requestDate).toDate());
                // Assessor
                $('#assignmentAssessor option[data-user-entity-id="' + supplementationRequest.userEntityId + '"]').attr('selected','selected');
                // Grading
                $('#assignmentIncompleteButton').prop('checked', true);
                // Grade
                $('#assignmentGrade').prop('disabled', true);
                $('#assignmentGrade').closest('.evaluation-modal-evaluate-form-row').attr('disabled', 'disabled');
                // Show material evaluation view
                this.toggleMaterialAssessmentView(true, $.proxy(function() {
                  CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.startDrafting();
                }, this));
              }
            }, this));
        }
      }
      else {
        $('#assignmentEvaluationDate').datepicker('setDate', new Date());
        $('#assignmentAssessor').val(MUIKKU_LOGGED_USER);
        $('#assignmentGradedButton').prop('checked', true);
        $('#assignmentGrade').prop('disabled', false);
        $('#assignmentGrade').closest('.evaluation-modal-evaluate-form-row').removeAttr('disabled');
        $('#assignmentGrade').prop('selectedIndex', 0);
        this.toggleMaterialAssessmentView(true, $.proxy(function() {
          CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.startDrafting();
        }, this));
      }
    },
    
    toggleMaterialAssessmentView: function(show, callback) {
      
      // View width check so we know how modal is rendered
      if ($(document).width() > 1023) {
        var slidePosition = 50;
        var boxShadow = "-5px 0 30px rgba(0,0,0,0.25)";
      } else {
        var slidePosition = 2;
        var boxShadow = "-5px 0 30px rgba(0,0,0,1)";
      }
      
      if (show) {
        this._activeAssignment.addClass('active');
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
          if (callback) {
            callback();
          }
        });
      }
      else {
        this._activeAssignment.removeClass('active');
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
          if (callback) {
            callback();
          }
        });
      }
    },
    
    _disableModalScrolling: function() {
      $('.eval-modal').addClass('no-scroll');
    },
    
    _enableModalScrolling: function() {
      $('.eval-modal').removeClass('no-scroll');
    },
    
    _loadWorkspaceAssessment: function(workspaceEntityId, userEntityId) {
      mApi().evaluation.workspace.user.assessment
        .read(workspaceEntityId, userEntityId)
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
            // Grading
            $('#workspaceGradedButton').prop('checked', true);
            // Grade
            $('#workspaceGrade').prop('disabled', false);
            $('#workspaceGrade').closest('.evaluation-modal-evaluate-form-row').removeAttr('disabled');
            // Grade (with filtered scale fallback)
            var gradeValue = assessment.gradingScaleIdentifier + '@' + assessment.gradeIdentifier;
            var gradeExists = $("#workspaceGrade option[value='" + gradeValue + "']").length !== 0;
            if (!gradeExists) {
              $('#workspaceGrade').append('<option value="' + gradeValue + '"></option>');
            }
            $('#workspaceGrade').val(gradeValue);
            // Remove assessment button
            $('.button-delete').show();
          }
        }, this));
    },
    
    _loadWorkspaceSupplementationRequest: function(workspaceEntityId, userEntityId) {
      mApi().evaluation.workspace.user.supplementationrequest
        .read(workspaceEntityId, userEntityId)
        .callback($.proxy(function (err, supplementationRequest) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            // Verbal assessment
            CKEDITOR.instances.workspaceEvaluateFormLiteralEvaluation.setData(supplementationRequest.requestText);
            // Date
            $('#workspaceEvaluationDate').datepicker('setDate', moment(supplementationRequest.requestDate).toDate());
            // Assessor
            $('#workspaceAssessor option[data-user-entity-id="' + supplementationRequest.userEntityId + '"]').attr('selected','selected');
            // Grading
            $('#workspaceIncompleteButton').prop('checked', true);
            // Grade
            $('#workspaceGrade').prop('disabled', true);
            $('#workspaceGrade').closest('.evaluation-modal-evaluate-form-row').attr('disabled', 'disabled');
            // Remove supplementation request button
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
                    workspaceUserEntity.active = false;
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
    
    _deleteEvaluationData: function() {
      var userEntityId = $(this._requestCard).attr('data-user-entity-id');
      var workspaceEntityId = $(this._requestCard).attr('data-workspace-entity-id');
      mApi().evaluation.workspace.user.evaluationdata
        .del(workspaceEntityId, userEntityId)
        .callback($.proxy(function (err) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            $('.button-delete').hide();
            this.element.trigger("cardStateChange", {card: $(this._requestCard), evaluated: false, graded: false});
            $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.notifications.workspaceEvaluation.deleteSuccessful"));
            this.close();
          }
        }, this));
    },

    _saveWorkspaceAssessment: function() {
      var userEntityId = $(this._requestCard).attr('data-user-entity-id');
      var workspaceEntityId = $(this._requestCard).attr('data-workspace-entity-id');
      var scaleAndGrade = $('#workspaceGrade').val().split('@');
      mApi().evaluation.workspace.user.assessment
        .create(workspaceEntityId, userEntityId, {
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
    },
    
    _saveWorkspaceSupplementationRequest: function() {
      var userEntityId = $(this._requestCard).attr('data-user-entity-id');
      var workspaceEntityId = $(this._requestCard).attr('data-workspace-entity-id');
      mApi().evaluation.workspace.user.supplementationrequest
        .create(workspaceEntityId, userEntityId, {
          userEntityId: $('#workspaceAssessor option:selected').attr('data-user-entity-id'),
          studentEntityId: userEntityId,
          workspaceEntityId: workspaceEntityId,
          requestDate: $('#workspaceEvaluationDate').datepicker('getDate').getTime(),
          requestText: CKEDITOR.instances.workspaceEvaluateFormLiteralEvaluation.getData()
        })
        .callback($.proxy(function (err, supplementationRequest) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.notifications.workspaceEvaluation.saveSuccessful"));
            this.element.trigger("workspaceSupplementationRequestSaved", {
              supplementationRequest: supplementationRequest
            });
          }
        }, this));
    },

    _saveMaterialAssessment: function() {
      if (this._savingMaterialAssessment) {
        return;
      }
      this._savingMaterialAssessment = true;
      var userEntityId = $(this._requestCard).attr('data-user-entity-id');
      var workspaceEntityId = $(this._requestCard).attr('data-workspace-entity-id');
      var workspaceMaterialId = $('#assignmentWorkspaceMaterialId').val();
      var gradingValue = $('input[name=assignmentGrading]:checked').val();
      if (gradingValue == 'GRADED') {
        
        // Save an assignment evaluation
        
        var scaleAndGrade = $('#assignmentGrade').val().split('@');
        mApi().evaluation.workspace.user.workspacematerial.assessment
          .create(workspaceEntityId, userEntityId, workspaceMaterialId, {
            assessorIdentifier: $('#assignmentAssessor').val(),
            gradingScaleIdentifier: scaleAndGrade[0],
            gradeIdentifier: scaleAndGrade[1],
            verbalAssessment: CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.getData(),
            assessmentDate: $('#assignmentEvaluationDate').datepicker('getDate').getTime()
          })
          .callback($.proxy(function (err, assessment) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
              this._savingMaterialAssessment = undefined;
            }
            else {
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.notifications.assignmentEvaluation.saveSuccessful"));
              
              // Mark assignment as evaluated and graded
              
              $(this._activeAssignment).attr('data-evaluated', true);
              $(this._activeAssignment).attr('data-graded', true);
              
              // Show evaluation date and grade
              
              $(this._activeAssignment).find('.assignment-literal-evaluation').html(CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.getData());
              $(this._activeAssignment).find('.assignment-evaluated-data').text(formatDate($('#assignmentEvaluationDate').datepicker('getDate')));
              $(this._activeAssignment).find('.assignment-evaluated').show();
              $(this._activeAssignment).find('.assignment-grade-data').text($('#assignmentGrade option:selected').text());
              $(this._activeAssignment).find('.assignment-grade').show();
              $(this._activeAssignment).find('.assignment-grade-label').show();
              $(this._activeAssignment).find('.assignment-grade').removeClass('evaluated-incomplete');
              
              // Close assignment content
              
              this.toggleAssignment(this.activeAssignment(), false, false);
              
              // Close assignment editor
              
              this.toggleMaterialAssessmentView(false);
              
              // Set verbal assessment to assignment content
              
              $(this._activeAssignment).find('.assignment-literal-evaluation').html(assessment.verbalAssessment);
              
              // Notify saving is done
              
              this._savingMaterialAssessment = undefined;
            }
          }, this));
      }
      else {

        // Save an assignment supplementation request
        
        mApi().evaluation.workspace.user.workspacematerial.supplementationrequest
          .create(workspaceEntityId, userEntityId, workspaceMaterialId, {
            userEntityId: $('#assignmentAssessor option:selected').attr('data-user-entity-id'),
            studentEntityId: userEntityId,
            workspaceMaterialId: workspaceMaterialId,
            requestDate: $('#assignmentEvaluationDate').datepicker('getDate').getTime(),
            requestText: CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.getData()
          })
          .callback($.proxy(function (err, supplementationRequest) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.notifications.assignmentEvaluation.saveSuccessful"));

              // Mark assignment as evaluated but not graded
              
              $(this._activeAssignment).attr('data-evaluated', true);
              $(this._activeAssignment).attr('data-graded', false);

              // Show evaluation date but hide grade
              
              $(this._activeAssignment).find('.assignment-literal-evaluation').html(CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.getData());
              $(this._activeAssignment).find('.assignment-evaluated-data').text(formatDate($('#assignmentEvaluationDate').datepicker('getDate')));
              $(this._activeAssignment).find('.assignment-evaluated').show();
              $(this._activeAssignment).find('.assignment-grade-data').text(getLocaleText("plugin.evaluation.evaluationModal.assignmentEvaluatedIncompleteLabel"));
              $(this._activeAssignment).find('.assignment-grade-label').hide();
              $(this._activeAssignment).find('.assignment-grade').show();
              $(this._activeAssignment).find('.assignment-grade').addClass('evaluated-incomplete');
              
              // Close assignment content
              
              this.toggleAssignment(this.activeAssignment(), false, false);
              
              // Close assignment editor
              
              this.toggleMaterialAssessmentView(false);
              
              // Set verbal assessment to assignment content
              
              var assignmentContent = $(this._activeAssignment).find('.assignment-content');
              $(this._activeAssignment).find('.assignment-literal-evaluation').html(supplementationRequest.requestText);
              
              // Notify saving is done
              
              this._savingMaterialAssessment = undefined;
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