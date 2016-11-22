(function() {
  'use strict';
  
  
  function recolorCheckboxFields(elem) {
    $(elem).find(".muikku-field-correct-answer-override").removeClass("muikku-field-correct-answer-override");
    
    if ($(elem).next(".muikku-field-examples").length === 0) {
      return;
    }
    
    var labels = $(elem).find("label[for]");
    var answers = [];
    for (var i=0; i<labels.length; i++) {
      var label = labels[i];

      var id = $(label).attr('for');
      var answer = $(label).html();
      answers.push({id: id, answer: answer});
    } 
    
    var correctAnswers = [];
    $(elem).next(".muikku-field-examples").find(".muikku-field-example").each(function() {
      correctAnswers.push($(this).html());
    });
    
    for (var i=0; i < answers.length; i++) {
      var answer = answers[i];
      var inputElem = document.getElementById(answer.id);
      if (inputElem.type === "checkbox") {
        if ((inputElem.checked && correctAnswers.indexOf(answer.answer) >= 0) ||
            (!inputElem.checked && correctAnswers.indexOf(answer.answer) === -1)) {
          $(inputElem).addClass("muikku-field-correct-answer-override");
        }
      } else if (inputElem.type === "radio") {
        if (correctAnswers.indexOf(answer.answer) >= 0) {
          $(inputElem).addClass("muikku-field-correct-answer-override");
        }
      }
    }
  }

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
        'state': 'FAILED',
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
        'state': 'PASSED',
        'button-class': 'muikku-evaluated-assignment',
        'button-text': "plugin.workspace.materialsLoader.evaluatedAssignmentButton",
        'button-disabled': true,
        'success-text': "",
        'success-state': '',
        'fields-read-only': true
      }]
    },
    
    _create : function() {
      $('<div>')
        .addClass('page-content')
        .appendTo(this.element);
      
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
          .insertAfter(buttonWrapper);
        
        this.element.on('fieldAnswerSaved', '.muikku-field', $.proxy(this._onFieldAnswerSaved, this));
      }
    },
    
    applyState: function (readonly) {
      this._applyState(this.assignmentType(), this.workspaceMaterialState(), readonly);
    },
    
    content: function (content) {
      if (content !== undefined) {
        this.element.find('.page-content')
          .empty();
        
        content.children()
          .appendTo(this.element.find('.page-content'));
      } else {
        return this.element.find('.page-content');
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
      return this.element.attr('data-assignment-type');
    },
    
    correctAnswers: function() {
      return this.element.attr('data-correct-answers')||'ALWAYS';
    },
    
    workspaceMaterialId: function () {
      return $(this.element).attr('data-workspace-material-id');  
    },
    
    workspaceEntityId: function () {
      return this.options.workspaceEntityId;
    },

    _applyState: function (assignmentType, state, readonly) {
      if (!assignmentType) {
        return;
      }
      
      var stateOptions = this._getStateOptions(assignmentType, state);
      var removeClasses = $.map(this.options.states, function (value) {
        return value['button-class'];
      });
      
      if (assignmentType == 'EXERCISE') {
        this.element.find('.muikku-field-examples').remove();
        this.element.find('.muikku-field-correct-answer').removeClass('muikku-field-correct-answer');
        this.element.find('.muikku-field-incorrect-answer').removeClass('muikku-field-incorrect-answer');
        this.element.find('.muikku-field-semi-correct-answer').removeClass('muikku-field-semi-correct-answer');
        this.element.find('.correct-answers-count-container').empty();
      }
      
      var text = stateOptions['button-check-text'] && this._checkableExercise() ? stateOptions['button-check-text'] : stateOptions['button-text'];
      this.element.find('.muikku-assignment-button')
        .removeClass(removeClasses.join(' '))
        .addClass(stateOptions['button-class'])
        .text(getLocaleText(text))
        .prop('disabled', stateOptions['button-disabled']);
      
      var showAnswersButton = stateOptions['show-answers-button-visible'] && this.correctAnswers() == 'ON_REQUEST' && this._hasDisplayableAnswers();
      if (showAnswersButton) {
        
        this.element.find('.muikku-hide-correct-answers-button, .muikku-show-correct-answers-button')  
          .removeClass("muikku-hide-correct-answers-button")
          .addClass("muikku-show-correct-answers-button")
          .text(getLocaleText('plugin.workspace.materialsLoader.showAnswers'));
        
        this.element.find('.muikku-show-correct-answers-button').show();
      } else {
        this.element.find('.muikku-hide-correct-answers-button, .muikku-show-correct-answers-button').hide();
      }
      
      this.workspaceMaterialState(state);
      this.element.find('.muikku-field').muikkuField('readonly', readonly || stateOptions['fields-read-only']);
      
      var fileField = this.element.find('.muikku-file-field');
      fileField.attr('data-readonly', "" + stateOptions['fields-read-only']);
      
      if (stateOptions['check-answers']) {
        this.checkExercises();
      }
      
      var tocItem = $('.workspace-materials-toc-item[data-workspace-material-id="' + $(this.element).attr('data-workspace-material-id') + '"]');
      if (tocItem) {
        switch ($(this.element).attr('data-workspace-material-state')) {
          case "SUBMITTED":
            if ($(this.element).attr("data-assignment-type") == "EVALUATED") {
              $(tocItem).find('.assignment').append($('<span>')
                  .addClass('submitted')
                  .attr("title", getLocaleText('plugin.workspace.materials.assignmentDoneTooltip'))
              );
            } else {
              $(tocItem).find('.exercise').append($('<span>')
                  .addClass('submitted')
                  .attr("title", getLocaleText('plugin.workspace.materials.exerciseDoneTooltip'))
              );
            }
            break;
          case "WITHDRAWN":
            $(tocItem).find('.assignment').children('span').remove();
            break;
          case "PASSED":
            $(tocItem).find('.assignment').append($('<span>')
                .addClass('evaluated-passed')
                .attr("title", getLocaleText('plugin.workspace.materials.assignmentPassedTooltip'))
            );
            break;
          case "FAILED":
            $(tocItem).find('.assignment').append($('<span>')
                .addClass('evaluated-failed')
                .attr("title", getLocaleText('plugin.workspace.materials.assignmentFailedTooltip'))
            );
            break;
        }
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
      this._waitFieldsSaved($.proxy(function() {
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
      }, this));
    },
    
    _waitFieldsSaved: function (callback) {
      if (this.element.find('.muikku-field-unsaved,.muikku-field-saving').length === 0) {
        callback();
      } else {
        if (this._savedWaitTimeout) {
          clearTimeout(this._savedWaitTimeout);
        }
        
        this._savedWaitTimeout = setTimeout($.proxy(function () {
          this._waitFieldsSaved(callback);
        }, this), 10);
      }
    },    
    
    checkExercises: function (requestAnswers) {
      var correctAnswersDisplay = this.correctAnswers();

      this.element.find('.correct-answers-count-container').empty();
      
      var fields = this.element.find('.muikku-field');
      var correctAnswerCount = 0;
      var wrongAnswerCount = 0;

      this.element.find('.muikku-field-examples').remove();
      this.element.find('.muikku-field-correct-answer').removeClass('muikku-field-correct-answer');
      this.element.find('.muikku-field-incorrect-answer').removeClass('muikku-field-incorrect-answer');
      this.element.find('.muikku-field-semi-correct-answer').removeClass('muikku-field-semi-correct-answer');

      $(fields).each(function (index, field) {
        $(field).find(".muikku-field-correct-answer-override").removeClass("muikku-field-correct-answer-override");
        if ($(field).muikkuField('canCheckAnswer')) {
          if ($(field).muikkuField('checksOwnAnswer')) {
            var answerCounts = $(field).muikkuField('checkAnswer', (correctAnswersDisplay == 'ALWAYS' || (correctAnswersDisplay == 'ON_REQUEST' && requestAnswers)));
            correctAnswerCount += answerCounts.correctAnswers;
            wrongAnswerCount += answerCounts.wrongAnswers;
          }
          else {
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
                  .attr('data-for-field', $(field).attr('name'));
                exampleDetails.append( 
                  $('<span>')
                    .addClass('muikku-field-examples-title')
                    .text(getLocaleText('plugin.workspace.assigment.checkAnswers.correctSummary.title'))
                );
                $.each(correctAnswers, function (index, example) {
                  exampleDetails.append(
                    $('<span>') 
                      .addClass('muikku-field-example')
                      .html(example.replace(/\n/g, '<br/>'))    
                  );
                });
                $(field).after(exampleDetails);
                
                recolorCheckboxFields(field);
              }
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
                    .html(example.replace(/\n/g, '<br/>'))    
                );
              });
              $(field).after(exampleDetails);
            }
          }
        }
      });
      
      if ((correctAnswerCount + wrongAnswerCount) > 0) {
        this.element.find('.correct-answers-count-container').append(
          $('<span>')
            .addClass('correct-answers-count-label')
            .text(getLocaleText('plugin.workspace.materialsLoader.correctAnswersCountLabel'))
        );
        this.element.find('.correct-answers-count-container').append(
            $('<span>')
              .addClass('correct-answers-count-data')
              .text(correctAnswerCount + ' / ' + (correctAnswerCount + wrongAnswerCount))
          );
      }
    },
    
    _onAssignmentButtonClick: function (event) {
      var assignmentType = this.assignmentType();
      var stateOptions = this._getStateOptions(assignmentType, this.workspaceMaterialState());
      
      $(this.element).trigger('beforeAssignmentSubmit', {state: this.workspaceMaterialState()});

      this._saveWorkspaceMaterialReply(stateOptions['success-state'], $.proxy(function (reply) {
        this._applyState(assignmentType, stateOptions['success-state']);
        
        if (stateOptions['success-text']) {
          $('.notification-queue').notificationQueue('notification', 'success', getLocaleText(stateOptions['success-text']));
        }
      }, this));
    },
    
    _onShowAnswersButtonClick: function (event) {
      var target = (event.target) ? event.target : event.srcElement;  
      if ($(target).hasClass("muikku-show-correct-answers-button")) {
        this.checkExercises(true);  
        $(target)
          .removeClass("muikku-show-correct-answers-button")
          .addClass("muikku-hide-correct-answers-button")
          .text(getLocaleText('plugin.workspace.materialsLoader.hideAnswers'));
      } else {
        $(target)
          .addClass("muikku-show-correct-answers-button")
          .removeClass("muikku-hide-correct-answers-button")
          .text(getLocaleText('plugin.workspace.materialsLoader.showAnswers'));
        this.checkExercises(false); 
      }
      
    },
    
    _onFieldAnswerSaved: function (event, data) {
      if (this.assignmentType() == 'EXERCISE') {
        this._saveWorkspaceMaterialReply('ANSWERED', $.proxy(function (reply) {
          this._applyState('EXERCISE', 'ANSWERED');
        }, this));
      }
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
      checksOwnAnswer: function() {
        return false;
      },
      checkAnswer: function(showCorrectAnswers) {
        return {
          'correctAnswers': 0,
          'wrongAnswers': 0
        }
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
        return $(this.element).attr('disabled') == 'disabled';
      },
      setReadonly: function (readonly) {
        if (readonly) {
          $(this.element).attr('disabled', 'disabled')
        } else {
          $(this.element).removeAttr('disabled');
        } 
      },
      readonly: false,
      saveTimeout: 300,
      saveFailedTimeout: 5000,
      trackChange: true,
      trackKeyUp: true
    },
    _create : function() {
      this._saveTimeoutId = null;
      this._saveFailedTimeoutId = null;
      
      $(this.element).addClass('muikku-field');
      if (this.trackChange()) {
        $(this.element).on("change", $.proxy(this._onChange, this));
        $(this.element).on("paste", $.proxy(this._onPaste, this));
      }
      if (this.trackKeyUp()) {
        $(this.element).on("keyup", $.proxy(this._onKeyUp, this));
        $(this.element).on("paste", $.proxy(this._onPaste, this));
      }
      
      $(document).on('workspace:field-answer-saved', $.proxy(this._onFieldAnswerSaved, this));
      
      this.readonly(this.options.readonly);
    },
    trackChange: function() {
      return this.options.trackChange;
    },
    trackKeyUp: function() {
      return this.options.trackKeyUp;
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
    checksOwnAnswer: function() {
      return this.options.checksOwnAnswer.call(this)||false;
    },
    checkAnswer: function(showCorrectAnswers) {
      return this.options.checkAnswer.call(this, showCorrectAnswers)||{'correctAnswers':0,'wrongAnswers':0};
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
    _checkStatusMessage: function () {
      var saveStateLabel = this.element.prev('.muikku-field-save-state-label');
      if (saveStateLabel.length <= 0) {
        $(this.element)
        .before($('<span>')
          .addClass('muikku-field-save-state-label')
          .css({
            display:'none'
          })
        );
      }
    },
    _saveField: function () {
      if (!this.readonly()) {
        this._checkStatusMessage();
        
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
          'workspaceMaterialId': workspaceMaterialId,
          'userEntityId': MUIKKU_LOGGED_USER_ID
        }));
        
        if (this._saveFailedTimeoutId == null) {
          this._saveFailedTimeoutId = setTimeout($.proxy(this._saveFailed, this), this.options.saveFailedTimeout);
        }
        
        $(this.element).on('muikku-field-progress', $.proxy(function(e){
          if (this._saveFailedTimeoutId != null) {
            clearTimeout(this._saveFailedTimeoutId);
            this._saveFailedTimeoutId = setTimeout($.proxy(this._saveFailed, this), this.options.saveFailedTimeout);
          }
        }, this));
        
      }
    },
    _saveFailed: function() {
      $(document).connectionLostNotifier("notifyConnectionLost");
    },
    _propagateChange: function () {
      $(this.element)
        .removeClass('muikku-field-saved muikku-field-saving')
        .addClass('muikku-field-unsaved'); 
      
      if (this._saveTimeoutId) {
        clearTimeout(this._saveTimeoutId);
        this._saveTimeoutId = null;
      }
      
      var _this = this;
      this._saveTimeoutId = setTimeout(function() {
        _this._saveField();
      }, this.options.saveTimeout);
    },
    
    _onChange: function (event) {
      this._propagateChange();
    },

    _onPaste: function (event) {
      this._propagateChange();
    },
    
    _onKeyUp: function (event) {
      // Arrow keys, PgUp, PgDn, Home, End, Ctrl, Shift, Alt  
      if ((event.keyCode < 33 || event.keyCode > 40) && (event.keyCode < 16 || event.keyCode > 20)) {
        this._propagateChange();
      }
    },
    
    _onFieldAnswerSaved: function (event, data) {
      var message = $.parseJSON(data);
      
      if (this._saveFailedTimeoutId != null) {
          clearTimeout(this._saveFailedTimeoutId);
      }
      this._saveFailedTimeoutId = null;

      $(document).connectionLostNotifier("notifyReconnected");

      // TODO: Shouldn't this be workspaceMaterialId insteadOf materialId?
      if ((message.embedId == this.embedId()) && (message.materialId == this.materialId()) && (message.fieldName == this.fieldName())) {

        if (message.originTicket == $(document).muikkuWebSocket("ticket")) {
          $(this.element)
            .removeClass('muikku-field-unsaved muikku-field-saving')
            .addClass('muikku-field-saved');
          
          $(this.element)
            .prev('.muikku-field-save-state-label')
            .text(getLocaleText('plugin.workspace.materials.answerSavedLabel'))
            .finish()
            .fadeIn(10)
            .delay(1000)
            .fadeOut(300, function() {
              $(this).remove();
            });

        } else {
          $(this.element)
            .removeClass('muikku-field-unsaved muikku-field-saving')
            .addClass('muikku-field-saved');
          
          $(this.element)
          .prev('.muikku-field-save-state-label')
          .text(getLocaleText('plugin.workspace.materials.answerSavedLabel'))
          .finish()
          .fadeIn(10)
          .delay(1000)
          .fadeOut(300, function() {
            $(this).remove();
          });
          
          $(this.element)
            .find('.muikku-field-saving-label')
            .text(getLocaleText('plugin.workspace.materials.answerSavedLabel'));
          
          this.answer(message.answer);
        }
        $(this.element).trigger('fieldAnswerSaved');
      }
    }
    
  });
}).call(this);
