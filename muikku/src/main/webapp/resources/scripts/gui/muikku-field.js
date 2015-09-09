(function() {
  'use strict';
  
  $.widget("custom.muikkuMaterialPage", {
    options: {
      states: [{
        'assignment-type': 'EXERCISE',
        'state': '',
        'button-class': 'muikku-check-exercises',
        'button-text': "plugin.workspace.materialsLoader.checkExerciseButton",
        'success-state': 'SUBMITTED',
        'fields-read-only': false
      }, {
        'assignment-type': 'EXERCISE',
        'state': 'SUBMITTED',
        'button-class': 'muikku-check-exercises',
        'button-text': "plugin.workspace.materialsLoader.checkExerciseButton",
        'success-state': 'SUBMITTED',
        'fields-read-only': false
      }, {
        'assignment-type': 'EVALUATED',
        'state': '',
        'button-class': 'muikku-submit-assignment',
        'button-text': "plugin.workspace.materialsLoader.submitAssignmentButton",
        'success-text': "plugin.workspace.materialsLoader.assignmentSubmitted",
        'success-state': 'SUBMITTED',
        'fields-read-only': false
      }, {
        'assignment-type': 'EVALUATED',
        'state': 'SUBMITTED',
        'button-class': 'muikku-withdraw-assignment',
        'button-text': "plugin.workspace.materialsLoader.withdrawAssignmentButton",
        'success-text': "plugin.workspace.materialsLoader.assignmentWithdrawn",
        'success-state': 'WITHDRAWN',
        'fields-read-only': true
      }, {
        'assignment-type': 'EVALUATED',
        'state': 'WITHDRAWN',
        'button-class': 'muikku-update-assignment',
        'button-text': "plugin.workspace.materialsLoader.updateAssignmentButton",
        'success-text': "plugin.workspace.materialsLoader.assignmentUpdated",
        'success-state': 'SUBMITTED',
        'fields-read-only': false
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

        this._applyState(assignmentType, this.workspaceMaterialState());
      }
    },
    
    _getStateOptions: function (assignmentType, state) {
      var result = null;
      
      $.each(this.options.states, function (index, value) {
        if ((value['state'] == state) && (value['assignment-type'] == assignmentType)) {
          result = value;
        }
      });
      
      return result;
    },
    
    workspaceMaterialState: function (val) {
      if (val !== undefined) {
        this.element.attr('data-workspace-material-state', val);
      } else {
        return this.element.attr('data-workspace-material-state')||'';
      }
    },
    
    assignmentType: function () {
      return this.element.attr('data-workspace-material-assigment-type');
    },
    
    workspaceMaterialId: function () {
      return $(this.element).attr('data-workspace-material-id');  
    },
    
    workspaceEntityId: function () {
      return this.options.workspaceEntityId;
    },
    
    _applyState: function (assignmentType, state) {
      var stateOptions = this._getStateOptions(assignmentType, state);
      var removeClasses = $.map(this.options.states, function (value) {
        return value['button-class'];
      });
      
      this.element.find('.muikku-assignment-button')
        .removeClass(removeClasses.join(' '))
        .text(getLocaleText(stateOptions['button-text']));
      
      this.workspaceMaterialState(state);
      this.element.find('.muikku-field').muikkuField('readonly', stateOptions['fields-read-only']);
    },
    
    _createWorkspcaeMaterialReply: function (state, callback) {
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
          this._createWorkspcaeMaterialReply(state, function (createdReply) {
            if ($.isFunction(callback)) {
              callback(createdReply);
            }
          });
        }
      }, this));
      
    },
    
    _checkExercises: function () {
      this.element.find('.muikku-field-examples').remove();
      this.element.find('.muikku-field').removeClass('muikku-field-correct-answer muikku-field-incorrect-answer');
      this.element.find('.muikku-field').each(function (index, field) {
        if ($(field).muikkuField('canCheckAnswer')) {
          $(field).addClass($(field).muikkuField('isCorrectAnswer') ? 'muikku-field-correct-answer' : 'muikku-field-incorrect-answer');
        } else {
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
      });
    },
    
    _onAssignmentButtonClick: function (event) {
      var assignmentType = this.assignmentType();
      var stateOptions = this._getStateOptions(assignmentType, this.workspaceMaterialState());
      
      this._saveWorkspaceMaterialReply(stateOptions['success-state'], $.proxy(function (reply) {
        this._applyState(assignmentType, stateOptions['success-state']);
        
        if (assignmentType == 'EXERCISE') {
          this._checkExercises();
        }
        
        if (stateOptions['success-text']) {
          $('.notification-queue').notificationQueue('notification', 'success', getLocaleText(stateOptions['success-text']));
        }
      }, this));
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
      $(document).on('workspace:field-answer-error', $.proxy(this._onFieldAnswerSaveError, this));
      
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
      $(this.element)
        .removeClass('muikku-field-unsaved')
        .addClass('muikku-field-saving');
      
      // TODO: THESE VALUES CAN NOT BE RETRIEVED LIKE THIS!!!!
      var workspaceEntityId = $('.workspaceEntityId').val(); 
      var workspaceMaterialId = $(this.element).closest('.workspace-materials-view-page').data('workspace-material-id');
      
      mSocket().sendMessage('workspace:field-answer-save', JSON.stringify({
        'answer': this.answer(),
        'embedId': this.embedId(),
        'materialId': this.materialId(),
        'fieldName':this.fieldName(),
        'workspaceEntityId': workspaceEntityId,
        'workspaceMaterialId': workspaceMaterialId
      }));
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
      
      if ((message.embedId == this.embedId()) && (message.materialId == this.materialId()) && (message.fieldName == this.fieldName())) {
        if (message.originTicket == mSocket().getTicket()) {
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
    },
    
    _onFieldAnswerSaveError: function(event, data) {
      var message = $.parseJSON(data);
      $('.notification-queue').notificationQueue('notification', 'error', message.error);
    }
    
  });
}).call(this);