(function() {
  'use strict';

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