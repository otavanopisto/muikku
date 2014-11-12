(function() {
  'use strict';
  
  $.widget("custom.coOpsCK", {
    options : {
      readOnly: false
    },
    
    _create : function() {
      if (this.options.externalPlugins) {
        $.each(this.options.externalPlugins, function (name, path) {
          CKEDITOR.plugins.addExternal(name, path);
        });
      }
      
      this._editor = CKEDITOR.replace(this.element[0],$.extend({ 
        extraPlugins: this.options.extraPlugins,
        readOnly: true,
        contentsCss: ['//cdnjs.cloudflare.com/ajax/libs/ckeditor/4.3.2/contents.css', this.options.contentCss ],
        coops: {
          serverUrl: this.options.serverUrl,
          readOnly: this.options.readOnly
        },
        toolbar: this.options.toolbar
      }, this.options.editorOptions||{}));

      this._editor.on("CoOPS:SessionStart", $.proxy(this._onEditorSessionStart, this));
      this._editor.on("CoOPS:ContentDirty", $.proxy(this._onEditorContentDirty, this));
      this._editor.on("CoOPS:PatchSent", $.proxy(this._onEditorPatchSent, this));
      this._editor.on("CoOPS:PatchAccepted", $.proxy(this._onEditorPatchAccepted, this));
      this._editor.on("CoOPS:ConnectionLost", $.proxy(this._onEditorConnectionLost, this));
      this._editor.on("CoOPS:Reconnect", $.proxy(this._onEditorReconnect, this));
      this._editor.on("CoOPS:CollaboratorJoined", $.proxy(this._onEditorCollaboratorJoined, this));
      this._editor.on("CoOPS:CollaboratorLeft", $.proxy(this._onEditorCollaboratorLeft, this));
      this._editor.on("CoOPS:Error", $.proxy(this._onEditorError, this));
      this._editor.on("CoOPS:PatchReceived", $.proxy(this._onEditorPatchReceived, this));
    },
    
    changeProperty: function (property, oldValue, value) {
      this._editor.fire("propertiesChange", {
        properties : [{
          property: property,
          oldValue: oldValue,
          currentValue: value
        }]
      });
    },
    
    _onEditorSessionStart: function (event) {
      $(this.element).trigger('statusChange', {
        status: 'loaded'
      });
    },
    
    _onEditorContentDirty: function (event) {
      $(this.element).trigger('statusChange', {
        status: 'unsaved'
      });
    },

    _onEditorPatchSent: function (event) {
      $(this.element).trigger('statusChange', {
        status: 'saving'
      });
    },

    _onEditorPatchAccepted: function (event) {
      $(this.element).trigger('statusChange', {
        status: 'saved'
      });
    },

    _onEditorConnectionLost: function (event) {
      $(this.element).trigger('connectionLost');
    },

    _onEditorReconnect: function (event) {
      $(this.element).trigger('reconnect');
    },

    _onEditorCollaboratorJoined: function (event) {
      $(this.element).trigger('collaboratorJoined', {
        sessionId: event.data.sessionId,
        displayName: event.data.displayName||'Anonymous',
        email: event.data.email||(event.data.sessionId + '@no.invalid')
      });
    },

    _onEditorCollaboratorLeft: function (event) {
      $(this.element).trigger('collaboratorLeft', {
        sessionId: event.data.sessionId
      });
    },
    
    _onEditorError: function (event) {
      $(this.element).trigger('error', {
        severity: event.data.severity,
        message: event.data.message
      });
    },
    
    _onEditorPatchReceived: function (event) {
      $(this.element).trigger('patchReceived', {
        properties: event.data.properties||{}
      });
    }
  });
  
}).call(this);