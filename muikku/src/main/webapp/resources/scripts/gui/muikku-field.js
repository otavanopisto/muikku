(function() {
  'use strict';

  $(document).on('workspace:field-answer-error', function (event, data) {
    try {
      var message = $.parseJSON(data);
      $('.notification-queue').notificationQueue('notification', 'error', message.error);
    } catch (e) {
      $('.notification-queue').notificationQueue('notification', 'error', 'Internal error occurred');
    }
  });
  
  $.widget("custom.muikkuMaterialPage", {
    options: {
      states: [{
        'assignment-type': 'EXERCISE',
        'state': 'UNANSWERED',
        'button-class': 'muikku-check-exercises',
        'button-text': "plugin.workspace.materialsLoader.sendExerciseButton",
        'button-check-text': "plugin.workspace.materialsLoader.checkExerciseButton",
        'button-disabled': false,
        'success-state': 'SUBMITTED',
        'fields-read-only': false
      }, {
        'assignment-type': 'EXERCISE',
        'state': 'ANSWERED',
        'button-class': 'muikku-check-exercises',
        'button-text': "plugin.workspace.materialsLoader.sendExerciseButton",
        'button-check-text': "plugin.workspace.materialsLoader.checkExerciseButton",
        'button-disabled': false,
        'success-state': 'SUBMITTED',
        'fields-read-only': false
      }, {
        'assignment-type': 'EXERCISE',
        'state': 'SUBMITTED',
        'check-answers': true,
        'button-class': 'muikku-check-exercises',
        'button-text': "plugin.workspace.materialsLoader.exerciseSentButton",
        'button-check-text': "plugin.workspace.materialsLoader.exerciseCheckedButton",
        'button-disabled': false,
        'success-state': 'SUBMITTED',
        'fields-read-only': false,
        'show-answers-button-visible': true
      }, {
        'assignment-type': 'EVALUATED',
        'state': 'UNANSWERED',
        'button-class': 'muikku-submit-assignment',
        'button-text': "plugin.workspace.materialsLoader.submitAssignmentButton",
        'success-text': "plugin.workspace.materialsLoader.assignmentSubmitted",
        'button-disabled': false,
        'success-state': 'SUBMITTED',
        'fields-read-only': false
      }, {
        'assignment-type': 'EVALUATED',
        'state': 'ANSWERED',
        'button-class': 'muikku-submit-assignment',
        'button-text': "plugin.workspace.materialsLoader.submitAssignmentButton",
        'success-text': "plugin.workspace.materialsLoader.assignmentSubmitted",
        'button-disabled': false,
        'success-state': 'SUBMITTED',
        'fields-read-only': false
      }, {
        'assignment-type': 'EVALUATED',
        'state': 'SUBMITTED',
        'button-class': 'muikku-withdraw-assignment',
        'button-text': "plugin.workspace.materialsLoader.withdrawAssignmentButton",
        'success-text': "plugin.workspace.materialsLoader.assignmentWithdrawn",
        'button-disabled': false,
        'success-state': 'WITHDRAWN',
        'fields-read-only': true
      }, {
        'assignment-type': 'EVALUATED',
        'state': 'WITHDRAWN',
        'button-class': 'muikku-update-assignment',
        'button-text': "plugin.workspace.materialsLoader.updateAssignmentButton",
        'success-text': "plugin.workspace.materialsLoader.assignmentUpdated",
        'button-disabled': false,
        'success-state': 'SUBMITTED',
        'fields-read-only': false
      }, {
        'assignment-type': 'EVALUATED',
        'state': 'EVALUATED',
        'button-class': 'muikku-evaluated-assignment',
        'button-text': "plugin.workspace.materialsLoader.evaluatedAssignmentButton",
        'button-disabled': true,
        'success-text': "",
        'success-state': '',
        'fields-read-only': true
      }]
    },
    
    _create : function() {
      var assignmentType = this.assignmentType();      
      if (assignmentType) {
        var buttonWrapper = $('<div>')
          .addClass('muikku-save-page-wrapper')
          .appendTo(this.element);
        
        $('<button>')
          .addClass('muikku-assignment-button')
          .appendTo(buttonWrapper)
          .click($.proxy(this._onAssignmentButtonClick, this));

        $('<button>')
          .addClass('muikku-show-correct-answers-button')
          .appendTo(buttonWrapper)
          .text(getLocaleText('plugin.workspace.materialsLoader.showAnswers'))
          .click($.proxy(this._onShowAnswersButtonClick, this));
        
        $("<div>")
          .addClass("correct-answers-count-container")
          .appendTo(buttonWrapper);

        this._applyState(assignmentType, this.workspaceMaterialState());
        
        this.element.on('change', '.muikku-field', $.proxy(this._onFieldChange, this));
      }
    },
    
    _checkableExercise: function () {
      var assignmentType = this.assignmentType();
      
      if (assignmentType == 'EXERCISE') {
        var fields = this.element.find('.muikku-field');
        
        for (var i = 0, l = fields.length; i < l; i++) {
          if ($(fields[0]).muikkuField('canCheckAnswer')) {
            return true;
          }
          
          if ($(fields[0]).muikkuField('hasExamples')) {
            return true;
          }
        }
      } 
      
      return false;
    },
    
    _getStateOptions: function (assignmentType, state) {
      var result = null;
      
      $.each(this.options.states, function (index, value) {
        if ((value['state'] == state) && (value['assignment-type'] == assignmentType)) {
          result = value;
        }
      });
      
      if (!result) {
        console.error("Could not find state for " + assignmentType + ' / ' + state);
      }
      
      return result;
    },
    
    workspaceMaterialState: function (val) {
      if (val !== undefined) {
        this.element.attr('data-workspace-material-state', val);
      } else {
        return this.element.attr('data-workspace-material-state')||'UNANSWERED';
      }
    },
    
    assignmentType: function () {
      return this.element.attr('data-workspace-material-assigment-type');
    },
    
    correctAnswers: function() {
      return this.element.attr('data-correct-answers');
    },
    
    workspaceMaterialId: function () {
      return $(this.element).attr('data-workspace-material-id');  
    },
    
    workspaceEntityId: function () {
      return this.options.workspaceEntityId;
    },
    
    autosave: function () {
      if (this.assignmentType() == 'EXERCISE') {
        this._saveWorkspaceMaterialReply('ANSWERED', $.proxy(function (reply) {
          this.element.find('.muikku-field').removeClass('muikku-field-correct-answer muikku-field-incorrect-answer');
          this._applyState('EXERCISE', 'ANSWERED');
        }, this));
      }
    },
    
    _applyState: function (assignmentType, state) {
      var stateOptions = this._getStateOptions(assignmentType, state);
      var removeClasses = $.map(this.options.states, function (value) {
        return value['button-class'];
      });
      
      var text = stateOptions['button-check-text'] && this._checkableExercise() ? stateOptions['button-check-text'] : stateOptions['button-text'];
      this.element.find('.muikku-assignment-button')
        .removeClass(removeClasses.join(' '))
        .addClass(stateOptions['button-class'])
        .text(getLocaleText(text))
        .prop('disabled', stateOptions['button-disabled']);
      
      var showAnswersButton = stateOptions['show-answers-button-visible'] && this.correctAnswers() == 'ON_REQUEST' && this._hasDisplayableAnswers();
      if (showAnswersButton) {
        this.element.find('.muikku-show-correct-answers-button').show();
      } else {
        this.element.find('.muikku-show-correct-answers-button').hide();
      }
      
      this.workspaceMaterialState(state);
      this.element.find('.muikku-field').muikkuField('readonly', stateOptions['fields-read-only']);
      
      if (stateOptions['check-answers']) {
        this._checkExercises();
      }
    },
    
    _hasDisplayableAnswers: function() {
      return true;
    },
    
    _createWorkspaceMaterialReply: function (state, callback) {
      mApi().workspace.workspaces.materials.replies
        .create(this.workspaceEntityId(), this.workspaceMaterialId(), {
          state: state
        }) 
        .callback($.proxy(function (err, reply) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.workspace.materials.answerSavingFailed', err));
          } else {
            if ($.isFunction(callback)) {
              callback(reply);
            }
          }
        }, this));
    },
    
    _updateWorkspaceMaterialReply: function (id, state, callback) {
      mApi().workspace.workspaces.materials.replies
        .update(this.workspaceEntityId(), this.workspaceMaterialId(), id, {
          state: state
        }) 
        .callback($.proxy(function (err, reply) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.workspace.materials.answerSavingFailed', err));
          } else {
            if ($.isFunction(callback)) {
              callback();
            }
          }
        }, this));
    },
    
    _findWorkspaceMaterialReply: function (callback) {
      mApi().workspace.workspaces.materials.replies
        .read(this.workspaceEntityId(), this.workspaceMaterialId(), {
          userEntityId: MUIKKU_LOGGED_USER_ID
        }) 
        .callback($.proxy(function (err, replies) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.workspace.materials.answerSavingFailed', err));
          } else {
            if ($.isFunction(callback)) {
              callback(replies.length ? replies[0] : null);
            }
          }
        }, this));
    },
    
    _saveWorkspaceMaterialReply: function (state, callback) {
      this._findWorkspaceMaterialReply($.proxy(function (reply) {
        if (reply) {
          this._updateWorkspaceMaterialReply(reply.id, state, function () {
            if ($.isFunction(callback)) {
              callback(reply);
            }
          });
        } else {
          this._createWorkspaceMaterialReply(state, function (createdReply) {
            if ($.isFunction(callback)) {
              callback(createdReply);
            }
          });
        }
      }, this));
      
    },
    
    _checkExercises: function (requestAnswers) {
      var correctAnswersDisplay = this.correctAnswers();
      this.element.find('.muikku-field-examples').remove();
      var correctAnswersCountContainer = this.element.find('.correct-answers-count-container');
      correctAnswersCountContainer.empty();
      
      var fields = this.element.find('.muikku-field');
      var correctAnswerCount = 0;
      var wrongAnswerCount = 0;

      $(fields).each(function (index, field) {
        $(field).removeClass('muikku-field-correct-answer muikku-field-incorrect-answer');
        if ($(field).muikkuField('canCheckAnswer')) {
          var correctAnswer = $(field).muikkuField('isCorrectAnswer');
          if (correctAnswer) {
            correctAnswerCount++;
          } else  {
            wrongAnswerCount++;
          }
          $(field).addClass(correctAnswer ? 'muikku-field-correct-answer' : 'muikku-field-incorrect-answer');
          // TODO classes are not examples but correct answers?
          if (!correctAnswer && (correctAnswersDisplay == 'ALWAYS' || (correctAnswersDisplay == 'ON_REQUEST' && requestAnswers))) {
            var correctAnswers = $(field).muikkuField('getCorrectAnswers');
            if (correctAnswers.length > 0) {
              var exampleDetails = $('<span>')
                .addClass('muikku-field-examples')
                .attr('data-for-field', $(field).attr('name'))
                .fadeIn(500);
              exampleDetails.append( 
                $('<span>')
                  .addClass('muikku-field-examples-title')
                  .text(getLocaleText('plugin.workspace.assigment.checkAnswers.correctSummary.title'))
              );
              $.each(correctAnswers, function (index, example) {
                exampleDetails.append(
                  $('<span>') 
                    .addClass('muikku-field-example')
                    .text(example)    
                );
              });
              $(field).after(exampleDetails);
            }
          }
        }
        else {
          if (correctAnswersDisplay == 'ALWAYS' || (correctAnswersDisplay == 'ON_REQUEST' && requestAnswers)) {
            if ($(field).muikkuField('hasExamples')) {
              var exampleDetails = $('<span>')
                .addClass('muikku-field-examples')
                .attr('data-for-field', $(field).attr('name'));
              exampleDetails.append( 
                $('<span>')
                  .addClass('muikku-field-examples-title')
                  .text(getLocaleText('plugin.workspace.assigment.checkAnswers.detailsSummary.title'))
              );
              $.each($(field).muikkuField('getExamples'), function (index, example) {
                exampleDetails.append(
                  $('<span>') 
                    .addClass('muikku-field-example')
                    .text(example)    
                );
              });
              $(field).after(exampleDetails);
            }
          }
        }
      });
      
      if ((correctAnswerCount + wrongAnswerCount) > 0) {
        correctAnswersCountContainer.append(
          $('<span>')
            .addClass('correct-answers-count-label')
            .text(getLocaleText('plugin.workspace.materialsLoader.correctAnswersCountLabel'))
        );
        correctAnswersCountContainer.append(
            $('<span>')
              .addClass('correct-answers-count-data')
              .text(correctAnswerCount + ' / ' + (correctAnswerCount + wrongAnswerCount))
          );
      }
    },
    
    _onAssignmentButtonClick: function (event) {
      var assignmentType = this.assignmentType();
      var stateOptions = this._getStateOptions(assignmentType, this.workspaceMaterialState());
      
      this._saveWorkspaceMaterialReply(stateOptions['success-state'], $.proxy(function (reply) {
        this._applyState(assignmentType, stateOptions['success-state']);
        
        if (stateOptions['success-text']) {
          $('.notification-queue').notificationQueue('notification', 'success', getLocaleText(stateOptions['success-text']));
        }
      }, this));
    },
    
    _onShowAnswersButtonClick: function (event) {
      this._checkExercises(true);
    },
    
    _onFieldChange: function (event, data) {
      this.autosave(); 
    }
    
  });

  $.widget("custom.muikkuField", {
    options : {
      answer: function (val) {
        if (val !== undefined) {
          $(this.element).val(val);
        } else {
          return $(this.element).val();
        }
      },
      canCheckAnswer: function () {
        return false;
      },
      isCorrectAnswer: function () {
        return false;
      },
      hasDisplayableAnswers: function () {
        return false;
      },
      getCorrectAnswers: function () {
        return [];
      },
      hasExamples: function () {
        return false;
      },
      getExamples: function () {
        return [];
      },
      isReadonly: function () {
        return $(this.element).attr('readonly') == 'readonly';
      },
      setReadonly: function (readonly) {
        if (readonly) {
          $(this.element).attr('readonly', 'readonly')
        } else {
          $(this.element).removeAttr('readonly');
        } 
      },
      readonly: false,
      saveTimeout: 300
    },
    _create : function() {
      this._saveTimeoutId = null;
      
      $(this.element).addClass('muikku-field');
      $(this.element).on("change", $.proxy(this._onChange, this));
      $(this.element).on("keyup", $.proxy(this._onKeyUp, this));
      
      $(document).on('workspace:field-answer-saved', $.proxy(this._onFieldAnswerSaved, this));
      
      this.readonly(this.options.readonly);
    },
    answer: function (val) {
      return this.options.answer.call(this, val)||'';
    },
    hasExamples: function () {
      return this.options.hasExamples.call(this);
    },
    getExamples: function () {
      return this.options.getExamples.call(this);
    },
    canCheckAnswer: function() {
      return this.options.canCheckAnswer.call(this)||false;
    },
    isCorrectAnswer: function() {
      return this.options.isCorrectAnswer.call(this)||false;
    },
    getCorrectAnswers: function () {
      return this.options.getCorrectAnswers.call(this)||false;
    },
    hasDisplayableAnswers: function () {
      return this.options.hasDisplayableAnswers.call(this)||false;
    },
    fieldName: function () {
      return this.options.fieldName;
    },
    materialId: function () {
      return this.options.materialId;
    },
    embedId: function () {
      return this.options.embedId||'';
    },
    meta: function () {
      return this.options.meta;
    },
    
    readonly: function (readonly) {
      if (readonly === undefined) {
        return this.options.isReadonly.call(this);
      } else {
        this.options.setReadonly.call(this, readonly);
      }
    },
    
    _saveField: function () {
      if (!this.readonly()) {
        $(this.element)
          .removeClass('muikku-field-unsaved')
          .addClass('muikku-field-saving');
        
        var page = $(this.element).closest('.workspace-materials-view-page');
        var workspaceEntityId = page.muikkuMaterialPage('workspaceEntityId'); 
        var workspaceMaterialId =  page.muikkuMaterialPage('workspaceMaterialId'); 
        
        $(document).muikkuWebSocket("sendMessage", 'workspace:field-answer-save', JSON.stringify({
          'answer': this.answer(),
          'embedId': this.embedId(),
          'materialId': this.materialId(),
          'fieldName':this.fieldName(),
          'workspaceEntityId': workspaceEntityId,
          'workspaceMaterialId': workspaceMaterialId
        }));
      }
    },
    
    _onChange: function (event) {
      $(this.element)
        .removeClass('muikku-field-saved muikku-field-saving')
        .addClass('muikku-field-unsaved');
    
      if (this._saveTimeoutId) {
        clearTimeout(this._saveTimeoutId);
        this._saveTimeoutId = null;
      }
      
      this._saveTimeoutId = setTimeout($.proxy(this._saveField, this), this.options.saveTimeout);
    },
    
    _onKeyUp: function (event) {
      $(this.element)
        .removeClass('muikku-field-saved muikku-field-saving')
        .addClass('muikku-field-unsaved');
      
      if (this._saveTimeoutId) {
        clearTimeout(this._saveTimeoutId);
        this._saveTimeoutId = null;
      }
      
      this._saveTimeoutId = setTimeout($.proxy(this._saveField, this), this.options.saveTimeout);
    },
    
    _onFieldAnswerSaved: function (event, data) {
      var message = $.parseJSON(data);

      // TODO: Shouldn't this be workspaceMaterialId insteadOf materialId?
      if ((message.embedId == this.embedId()) && (message.materialId == this.materialId()) && (message.fieldName == this.fieldName())) {
        if (message.originTicket == $(document).muikkuWebSocket("ticket")) {
          $(this.element)
            .removeClass('muikku-field-unsaved muikku-field-saving')
            .addClass('muikku-field-saved');
        } else {
          $(this.element)
            .removeClass('muikku-field-unsaved muikku-field-saving')
            .addClass('muikku-field-saved');
          this.answer(message.answer);
        }
      }
    }
    
  });
}).call(this);
