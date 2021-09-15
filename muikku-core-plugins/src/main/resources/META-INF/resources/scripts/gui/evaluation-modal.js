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
        mathJaxLib: '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_HTMLorMML',
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
        contentsCss : CONTEXTPATH +  '/css/deprecated/flex/custom-ckeditor-contentcss_reading.css',
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

      // Render modal

      renderDustTemplate("evaluation/evaluation-modal-view.dust", {
        userEntityId: $(requestCard).attr('data-user-entity-id'), 
        studentName: $(requestCard).find('.evaluation-card-student').text(),
        studyProgrammeName: $(requestCard).find('.evaluation-card-study-programme').text(),
        courseName: $(requestCard).attr('data-workspace-name'),
        gradingScales: this._gradingScales||{},
        workspaceUserEntityId: $(requestCard).attr('data-workspace-user-entity-id')
      }, $.proxy(function (html) {

        // Modal UI

        this._evaluationModal.append(html);

        // Material's loading animation start

        this.element.trigger("loadStart", $('.eval-modal-assignments-content'));

        // Load dialog content

        this._loadMaterials();
        this._loadJournalEntries();
        this._setupEventsContainer();
        this._setupWorkspaceGradeEditor();
        this._setupWorkspaceSupplementationEditor();
        this._setupAssignmentEditor();

        // Discard modal button (top right)  

        $('.eval-modal-close').click($.proxy(function (event) {
          this.close();
        }, this));
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
    
    // Prepares workspace billing dropdown
    
    _setupWorkspaceBilling: function(raisedGrade, assessmentIdentifier) {
      // If billing hasn't been configured at all, skip everything
      if (!$('#billingRow').length) {
        return;
      }
      // Let's assume our billing row is available
      $('#billingRow').show();
      var workspaceEntityId = $(this._requestCard).attr('data-workspace-entity-id');
      // Get the base billing price for the workspace being evaluated
      mApi().worklist.basePrice.read({
        'workspaceEntityId': workspaceEntityId})
      .callback($.proxy(function(err, basePrice) {
        // If the base billing price cannot be resolved, just disable billing altogether
        if (err || basePrice <= 0) {
          $('#billingRow').remove();
        }
        else {
          // Remove any options our billing dropdown might have had previously
          $('#workspaceGradeBilling option').remove();
          // If giving a raised grade, the price is half of the base price
          if (raisedGrade) {
            basePrice = basePrice / 2;
          }
          // Full billing -> available for course evaluations and raised grades
          $('#workspaceGradeBilling').append($('<option>', {
            value: basePrice,
            text: getLocaleText("plugin.evaluation.evaluationModal.workspaceEvaluationForm.billingOptionFull") + ' (' + basePrice.toFixed(2) + ' €)'
          }));
          // Half billing -> only available for course evaluations
          if (!raisedGrade) {
            var halfPrice = basePrice / 2;
            $('#workspaceGradeBilling').append($('<option>', {
              value: halfPrice,
              text: getLocaleText("plugin.evaluation.evaluationModal.workspaceEvaluationForm.billingOptionHalf") + ' (' + halfPrice.toFixed(2) + ' €)'
            }));
          }
          // No billing -> available for course evaluations and raised grades
          $('#workspaceGradeBilling').append($('<option>', {
            value: 0,
            text: getLocaleText("plugin.evaluation.evaluationModal.workspaceEvaluationForm.billingOptionNone") + ' (0,00 €)'
          }));
          
          // Load existing billed price when editing an existing evaluation
          
          if (assessmentIdentifier) {
            // Let's assume the billing dropdown will be enabled
            $('#workspaceGradeBilling').prop('disabled', false);
            // Ask the server for the billed price of the given evaluation
            mApi().worklist.billedPrice.read({
              'workspaceEntityId': workspaceEntityId,
              'assessmentIdentifier': assessmentIdentifier})
            .callback($.proxy(function (err, billedPrice) {
              // Only act if server returned us previous billing information
              if (!err && billedPrice) {
                // See which billing option we should set selected
                var optionToSelect = $("#workspaceGradeBilling option[value='" + billedPrice.price + "']");
                // If the price from server is not in our options...
                if (!optionToSelect.length) {
                  // ...then add a custom option with the current price
                  $('#workspaceGradeBilling').append($('<option>', {
                    value: billedPrice.price,
                    text: getLocaleText("plugin.evaluation.evaluationModal.workspaceEvaluationForm.billingOptionCustom") + ' (' + billedPrice.price.toFixed(2) + ' €)'
                  }));
                }
                // Select our price now that we're guaranteed to have it as an option
                $('#workspaceGradeBilling').val(billedPrice.price);
                // Disable the billing dropdown if the server says price is not editable
                $('#workspaceGradeBilling').prop('disabled', !billedPrice.editable);
              }
              else {
                $('#billingRow').hide();
              }
            }, this));
          }
        }
      }, this));
    },
    
    _setupWorkspaceGradeEditor: function() {
      var workspaceUserEntityId = $(this._requestCard).attr('data-workspace-user-entity-id');
      CKEDITOR.replace($('#workspaceGradeText')[0], $.extend({}, this.options.ckeditor, {
        manualDraftStart: true,
        draftKey: 'workspace-grade-draft-' + workspaceUserEntityId
      }));
      
      $('#workspaceGradeCancel,.eval-modal-grade-close').on('click', $.proxy(function(event) {
        this._toggleWorkspaceGradeEditor(false);
      }, this));
      
      $('#workspaceGradeSave').on('click', $.proxy(function(event) {
        $('#workspaceGradeSave').attr('disabled', 'disabled');
        var successCallback = $.proxy(function(assessment) {
          $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.notifications.workspaceEvaluation.saveSuccessful"));
          this.element.trigger("workspaceAssessmentSaved", {
            assessment: assessment
          });
          $('#workspaceGradeEditor').attr('data-mode', '');

          // Update billing information if billing is enabled, shown, and editable
          
          if ($('#billingRow').length && !$('#billingRow').is(':hidden') && !$('#workspaceGradeBilling').is(':disabled')) {
            var workspaceEntityId = $(this._requestCard).attr('data-workspace-entity-id');
            mApi().worklist.billedPrice.update({
              'assessmentIdentifier': assessment.identifier,
              'price': $('#workspaceGradeBilling').val()}, {'workspaceEntityId': workspaceEntityId}
            );
          }

          this._setupEventsContainer(); // reload events
        }, this);
        
        CKEDITOR.instances.workspaceGradeText.discardDraft();
        var workspaceUserEntityId = $(this._requestCard).attr('data-workspace-user-entity-id');
        var scaleAndGrade = $('#workspaceGradeGrade').val().split('@');
        var mode = $('#workspaceGradeEditor').attr('data-mode');
        if (mode == 'new') {
          mApi().evaluation.workspaceuser.assessment.create(workspaceUserEntityId, {
            assessorIdentifier: MUIKKU_LOGGED_USER,
            gradingScaleIdentifier: scaleAndGrade[0],
            gradeIdentifier: scaleAndGrade[1],
            verbalAssessment: CKEDITOR.instances.workspaceGradeText.getData(),
            assessmentDate: $('#workspaceGradeDate').val()
          })
          .callback($.proxy(function (err, assessment) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              successCallback(assessment);
            }
            $('#workspaceGradeSave').removeAttr('disabled');
          }, this));
        }
        else if (mode == 'edit') {
          mApi().evaluation.workspaceuser.assessment.update(workspaceUserEntityId, {
            identifier: $('#workspaceGradeIdentifier').val(),
            assessorIdentifier: MUIKKU_LOGGED_USER,
            gradingScaleIdentifier: scaleAndGrade[0],
            gradeIdentifier: scaleAndGrade[1],
            verbalAssessment: CKEDITOR.instances.workspaceGradeText.getData(),
            assessmentDate: $('#workspaceGradeDate').val()
          })
          .callback($.proxy(function (err, assessment) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              successCallback(assessment);
            }
            $('#workspaceGradeSave').removeAttr('disabled');
          }, this));
        }
        else {
          this._toggleWorkspaceGradeEditor(false);
          $('#workspaceGradeSave').removeAttr('disabled');
        }
      }, this)); 
    },
    
    _setupWorkspaceSupplementationEditor: function() {
      
      // Workspace supplementation request editor initialization
      
      var workspaceUserEntityId = $(this._requestCard).attr('data-workspace-user-entity-id');
      CKEDITOR.replace($('#workspaceSupplementationText')[0], $.extend({}, this.options.ckeditor, {
        manualDraftStart: true,
        draftKey: 'workspace-supplementation-draft-' + workspaceUserEntityId
      }));
      
      // Close workspace supplementation request editor
      
      $('#workspaceSupplementationCancel,.eval-modal-supplementation-close').click($.proxy(function(event) {
        this._toggleWorkspaceSupplementationEditor(false);
      }, this));
      
      // Save workspace supplementation request
      
      $('#workspaceSupplementationSave').on('click', $.proxy(function(event) {
        $('#workspaceSupplementationSave').attr('disabled', 'disabled');        
        var successCallback = $.proxy(function(supplementationRequest) {
          CKEDITOR.instances.workspaceSupplementationText.discardDraft();
          this.element.trigger("workspaceSupplementationRequestSaved", {
            supplementationRequest: supplementationRequest
          });
          $('#workspaceSupplementationEditor').attr('data-mode', '');
          this._setupEventsContainer(); // reload events
          $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.evaluation.notifications.workspaceEvaluation.saveSuccessful"));
        }, this);
        
        var workspaceUserEntityId = $(this._requestCard).attr('data-workspace-user-entity-id');
        var mode = $('#workspaceSupplementationEditor').attr('data-mode');
        if (mode == 'new') {
          mApi().evaluation.workspaceuser.supplementationrequest.create(workspaceUserEntityId, {
            requestDate: $('#workspaceSupplementationDate').val(),
            requestText: CKEDITOR.instances.workspaceSupplementationText.getData()
          })
          .callback($.proxy(function (err, supplementationRequest) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              successCallback(supplementationRequest);
            }
            $('#workspaceSupplementationSave').removeAttr('disabled');        
          }, this));
        }
        else if (mode == 'edit') {
          mApi().evaluation.workspaceuser.supplementationrequest.update(workspaceUserEntityId, {
            id: $('#workspaceSupplementationIdentifier').val(),
            requestDate: $('#workspaceSupplementationDate').val(),
            requestText: CKEDITOR.instances.workspaceSupplementationText.getData()
          })
          .callback($.proxy(function (err, supplementationRequest) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              successCallback(supplementationRequest);
            }
            $('#workspaceSupplementationSave').removeAttr('disabled');        
          }, this));
        }
        else {
          this._toggleWorkspaceSupplementationEditor(false);
          $('#workspaceSupplementationSave').removeAttr('disabled');        
        }
      }, this)); 
    },
    
    _setupAssignmentEditor: function() {

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
        this._toggleMaterialAssessmentView(false);
      }, this));

      $('.eval-modal-assignment-close').click($.proxy(function(event) {
        this._toggleMaterialAssessmentView(false);
      }, this));
    },
    
    _setupEventsContainer: function() {
      this._loadEvents($.proxy(function() {
        $('.eval-modal-workspace-event-buttonset:not(:last)').hide();
        $('.button-edit-event').on('click', $.proxy(function(event) {
          var workspaceUserEntityId = $(this._requestCard).attr('data-workspace-user-entity-id');
          var eventElement = $(event.target).closest('.eval-modal-workspace-event'); 
          var eventType = $(eventElement).attr('data-type');
          if (eventType == 'EVALUATION_PASS' || eventType == 'EVALUATION_FAIL' || eventType == 'EVALUATION_IMPROVED') {
            var mode = $('#workspaceGradeEditor').attr('data-mode');
            if (mode != 'edit' || $('#workspaceGradeIdentifier').val() != $(eventElement).attr('data-identifier')) {
              $('#workspaceGradeEditor').attr('data-mode', 'edit');
              $('#workspaceGradeIdentifier').val($(eventElement).attr('data-identifier'));
              $('#workspaceGradeGrade').val($(eventElement).find('.eval-modal-workspace-event-grade').attr('data-identifier'));
              $('#workspaceGradeDate').val($(eventElement).find('.eval-modal-workspace-event-date').attr('data-date-raw'));
              CKEDITOR.instances.workspaceGradeText.setData($(eventElement).find('.eval-modal-workspace-event-content').html());
            }
            // Setup the billing dropdown for either evaluation or raised grade
            this._setupWorkspaceBilling(eventType == 'EVALUATION_IMPROVED', $('#workspaceGradeIdentifier').val());
            this._toggleWorkspaceGradeEditor(true, function() {
              CKEDITOR.instances.workspaceGradeText.startDrafting();
            });
          }
          else if (eventType == 'SUPPLEMENTATION_REQUEST') {
            var mode = $('#workspaceSupplementationEditor').attr('data-mode');
            if (mode != 'edit' || $('#workspaceSupplementationIdentifier').val() != $(eventElement).attr('data-identifier')) {
              $('#workspaceSupplementationEditor').attr('data-mode', 'edit');
              $('#workspaceSupplementationIdentifier').val($(eventElement).attr('data-identifier'));
              $('#workspaceSupplementationDate').val($(eventElement).find('.eval-modal-workspace-event-date').attr('data-date-raw'));
              CKEDITOR.instances.workspaceSupplementationText.setData($(eventElement).find('.eval-modal-workspace-event-content').html());
            }
            this._toggleWorkspaceSupplementationEditor(true, function() {
              CKEDITOR.instances.workspaceSupplementationText.startDrafting();
            });
          }
        }, this));
        $('.button-remove-event').on('click', $.proxy(function(event) {
          var workspaceUserEntityId = $(this._requestCard).attr('data-workspace-user-entity-id');
          var eventElement = $(event.target).closest('.eval-modal-workspace-event');
          var eventType = $(eventElement).attr('data-type');
          this._confirmAssessmentDeletion($.proxy(function () {
            var identifier = $(eventElement).attr('data-identifier');
            if (eventType == 'EVALUATION_PASS' || eventType == 'EVALUATION_FAIL' || eventType == 'EVALUATION_IMPROVED') {
              mApi().evaluation.workspaceuser.workspaceassessment
                .del(workspaceUserEntityId, identifier)
                .callback($.proxy(function (err, result) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  }
                  else {
                    this._setupEventsContainer(); // reload events
                  }
              }, this));
            }
            else if (eventType == 'SUPPLEMENTATION_REQUEST') {
              mApi().evaluation.workspaceuser.supplementationrequest
                .del(workspaceUserEntityId, identifier)
                .callback($.proxy(function (err, result) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  }
                  else {
                    this._setupEventsContainer(); // reload events
                  }
              }, this));
            }
          }, this));
        }, this));
        
        $('.eval-modal-workspace-event-header').on('click', function(event) {
          $(this).next('.eval-modal-workspace-event-content').stop().slideToggle(200);
          $(this).find('.eval-modal-workspace-event-arrow').toggle(); 
        });
        
        $('#workspaceGradeNew').on('click', $.proxy(function(event) {
          var mode = $('#workspaceGradeEditor').attr('data-mode');
          if (mode != 'new') {
            $('#workspaceGradeEditor').attr('data-mode', 'new');
            $('#workspaceGradeIdentifier').val('');
            $('#workspaceGradeDate').val(new Date().getTime());
            CKEDITOR.instances.workspaceGradeText.setData('');
          }
          // Setup the billing dropdown for either evaluation or raised grade
          this._setupWorkspaceBilling($('.graded').length > 0);
          this._toggleWorkspaceGradeEditor(true, function() {
            CKEDITOR.instances.workspaceGradeText.startDrafting();
          });
        }, this));
        
        $('#workspaceGradeNew').text($('.graded').length > 0
            ? getLocaleText('plugin.evaluation.evaluationModal.events.improvedGradeButton')
            : getLocaleText('plugin.evaluation.evaluationModal.events.gradeButton'));
        
        $('#workspaceSupplementationNew').on('click', $.proxy(function(event) {
          var mode = $('#workspaceSupplementationEditor').attr('data-mode');
          if (mode != 'new') {
            $('#workspaceSupplementationEditor').attr('data-mode', 'new');
            $('#workspaceSupplementationIdentifier').val('');
            $('#workspaceSupplementationDate').val(new Date().getTime());
            CKEDITOR.instances.workspaceSupplementationText.setData('');
          }
          this._toggleWorkspaceSupplementationEditor(true, function() {
            CKEDITOR.instances.workspaceSupplementationText.startDrafting();
          });
        }, this));
      }, this));
    },
    
    _loadEvents: function(callback) {
      var workspaceUserEntityId = $(this._requestCard).attr('data-workspace-user-entity-id');
      mApi().evaluation.workspaceuser.events
        .read(workspaceUserEntityId)
        .callback($.proxy(function (err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
          else {
            renderDustTemplate("evaluation/workspace-events.dust", {
              events: result
            }, $.proxy(function(html) {
              $('#workspaceEventsContainer').html(html);
              if (callback) {
                callback();
              }
            }, this));
          }
      }, this));
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

    _onMaterialsLoaded: function(event, data) {
      $.each(data.assignments, $.proxy(function(index, assignment) {
        renderDustTemplate("evaluation/evaluation-assignment-wrapper.dust", {
          materialType: assignment.evaluable ? 'assignment' : 'exercise',
          title: assignment.title,
          submitDate: assignment.submitted,
          workspaceMaterialId: assignment.workspaceMaterialId,
          materialId: assignment.materialId,
          path: assignment.path,
          resubmitted: !assignment.grade && assignment.submitted && assignment.evaluated && assignment.submitted > assignment.evaluated,
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
              this._toggleMaterialAssessmentView(true);
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
        this._toggleWorkspaceGradeEditor(false);
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
      this._toggleWorkspaceSupplementationEditor(false);
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
                this._toggleMaterialAssessmentView(true, $.proxy(function() {
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
                // Grading
                $('#assignmentIncompleteButton').prop('checked', true);
                // Grade
                $('#assignmentGrade').prop('disabled', true);
                $('#assignmentGrade').closest('.evaluation-modal-evaluate-form-row').attr('disabled', 'disabled');
                // Show material evaluation view
                this._toggleMaterialAssessmentView(true, $.proxy(function() {
                  CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.startDrafting();
                }, this));
              }
            }, this));
        }
      }
      else {
        $('#assignmentGradedButton').prop('checked', true);
        $('#assignmentGrade').prop('disabled', false);
        $('#assignmentGrade').closest('.evaluation-modal-evaluate-form-row').removeAttr('disabled');
        $('#assignmentGrade').prop('selectedIndex', 0);
        this._toggleMaterialAssessmentView(true, $.proxy(function() {
          CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.startDrafting();
        }, this));
      }
    },
    
    // --------------------------------------------------
    // Shows/hides workspace grade editor 
    // --------------------------------------------------
    
    _toggleWorkspaceGradeEditor: function(show, callback) {
      var slidePosition = $(document).width() > 1023 ? 50 : 2;
      var boxShadow = $(document).width() > 1023 ? '-5px 0 30px rgba(0,0,0,0.25)' : '-5px 0 30px rgba(0,0,0,1)';
      if (show) {
        this._disableModalScrolling();
        $('#workspaceGradeEditorContainer')
          .show()
          .css({
            width: 100 - slidePosition + "%",
          })
          .animate({
            left: slidePosition + "%"
        }, 300, 'swing', function() {
          $(this).css({
            'box-shadow' : boxShadow
          });
          if (callback) {
            callback();
          }
        });
      }
      else {
        this._enableModalScrolling();
        $('#workspaceGradeEditorContainer')
          .css({
            width: 100 - slidePosition + "%",
            'box-shadow' : 'none'
          })
          .animate({
            left: '100%'
        }, 250, 'swing', function() {
          $('#workspaceGradeEditorContainer').hide();
          if (callback) {
            callback();
          }
        });
      }
    },

    // --------------------------------------------------
    // Shows/hides workspace supplementation request editor 
    // --------------------------------------------------
    
    _toggleWorkspaceSupplementationEditor: function(show, callback) {
      var slidePosition = $(document).width() > 1023 ? 50 : 2;
      var boxShadow = $(document).width() > 1023 ? '-5px 0 30px rgba(0,0,0,0.25)' : '-5px 0 30px rgba(0,0,0,1)';
      if (show) {
        this._disableModalScrolling();
        $('#workspaceSupplementationEditorContainer')
          .show()
          .css({
            width: 100 - slidePosition + "%",
          })
          .animate({
            left: slidePosition + "%"
        }, 300, 'swing', function() {
          $(this).css({
            'box-shadow' : boxShadow
          });
          if (callback) {
            callback();
          }
        });
      }
      else {
        this._enableModalScrolling();
        $('#workspaceSupplementationEditorContainer')
          .css({
            width: 100 - slidePosition + "%",
            'box-shadow' : 'none'
          })
          .animate({
            left: '100%'
        }, 250, 'swing', function() {
          $('#workspaceSupplementationEditorContainer').hide();
          if (callback) {
            callback();
          }
        });
      }
    },
    
    // --------------------------------------------------
    // Shows/hides material assessment view 
    // --------------------------------------------------
    
    _toggleMaterialAssessmentView: function(show, callback) {
      
      // View width check so we know how modal is rendered
      
      if ($(document).width() > 1023) {
        var slidePosition = 50;
        var boxShadow = "-5px 0 30px rgba(0,0,0,0.25)";
      }
      else {
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

    confirmStudentArchive: function(card, callback) {
      var workspaceEntityId = $(card).attr('data-workspace-entity-id');
      var workspaceUserEntityId = $(card).attr('data-workspace-user-entity-id');
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
                .read(workspaceEntityId, workspaceUserEntityId)
                .callback($.proxy(function (err, workspaceUserEntity) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  }
                  else {
                    workspaceUserEntity.active = false;
                    mApi().workspace.workspaces.students
                      .update(workspaceEntityId, workspaceUserEntityId, workspaceUserEntity)
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
    
    confirmRequestArchive: function(card, callback) {
      var workspaceUserEntityId =$(card).attr('data-workspace-user-entity-id');
      var studentName = $(card).find('.evaluation-card-student').text();
      var workspaceName = $(card).attr('data-workspace-name');
      
      renderDustTemplate('evaluation/evaluation-archive-request-confirm.dust', {studentName: studentName, workspaceName: workspaceName}, $.proxy(function(text) {
        var dialog = $(text);
        $(text).dialog({
          modal : true,
          minHeight : 200,
          resizable : false,
          width : 560,
          dialogClass : "evaluation-archive-request-confirm-dialog",
          buttons : [ {
            'text' : dialog.attr('data-button-remove-text'),
            'class' : 'remove-button',
            'click' : function(event) {
            mApi().evaluation.workspaceuser.evaluationrequestarchive
              .update(workspaceUserEntityId)
              .callback($.proxy(function (err) {
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
      renderDustTemplate('evaluation/evaluation-archive-assessment-confirm.dust', { studentName: studentName }, $.proxy(function(text) {
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
    
    _saveMaterialAssessment: function() {
      if (this._savingMaterialAssessment) {
        return;
      }
      this._savingMaterialAssessment = true;
      var userEntityId = $(this._requestCard).attr('data-user-entity-id');
      var workspaceEntityId = $(this._requestCard).attr('data-workspace-entity-id');
      var workspaceMaterialId = $('#assignmentWorkspaceMaterialId').val();
      var gradingValue = $('input[name=assignmentGrading]:checked').val();
      var evaluationDate = new Date(); 
      if (gradingValue == 'GRADED') {
        
        // Save an assignment evaluation
        
        var scaleAndGrade = $('#assignmentGrade').val().split('@');
        mApi().evaluation.workspace.user.workspacematerial.assessment
          .create(workspaceEntityId, userEntityId, workspaceMaterialId, {
            assessorIdentifier: MUIKKU_LOGGED_USER,
            gradingScaleIdentifier: scaleAndGrade[0],
            gradeIdentifier: scaleAndGrade[1],
            verbalAssessment: CKEDITOR.instances.assignmentEvaluateFormLiteralEvaluation.getData(),
            assessmentDate: evaluationDate.getTime()
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
              $(this._activeAssignment).find('.assignment-evaluated-data').text(formatDate(evaluationDate));
              $(this._activeAssignment).find('.assignment-evaluated').show();
              $(this._activeAssignment).find('.assignment-grade-data').text($('#assignmentGrade option:selected').text());
              $(this._activeAssignment).find('.assignment-grade').show();
              $(this._activeAssignment).find('.assignment-grade-label').show();
              $(this._activeAssignment).find('.assignment-grade').removeClass('evaluated-incomplete');
              
              // Close assignment content
              
              this.toggleAssignment(this.activeAssignment(), false, false);
              
              // Close assignment editor
              
              this._toggleMaterialAssessmentView(false);
              
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
            userEntityId: MUIKKU_LOGGED_USER_ID,
            studentEntityId: userEntityId,
            workspaceMaterialId: workspaceMaterialId,
            requestDate: evaluationDate.getTime(),
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
              $(this._activeAssignment).find('.assignment-evaluated-data').text(formatDate(evaluationDate));
              $(this._activeAssignment).find('.assignment-evaluated').show();
              $(this._activeAssignment).find('.assignment-grade-data').text(getLocaleText("plugin.evaluation.evaluationModal.assignmentEvaluatedIncompleteLabel"));
              $(this._activeAssignment).find('.assignment-grade-label').hide();
              $(this._activeAssignment).find('.assignment-grade').show();
              $(this._activeAssignment).find('.assignment-grade').addClass('evaluated-incomplete');
              
              // Close assignment content
              
              this.toggleAssignment(this.activeAssignment(), false, false);
              
              // Close assignment editor
              
              this._toggleMaterialAssessmentView(false);
              
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