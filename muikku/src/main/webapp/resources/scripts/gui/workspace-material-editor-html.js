(function() {

  /* global CKEDITOR,CONTEXTPATH,hex_md5 */
  
  $.widget("custom.collaborators", {
    
    _create: function () {
    },
    
    addCollaborator: function (sessionId, name, email) {
      $(this.element).append(
        $('<div>').collaborator({
          sessionId: sessionId,
          name: name,
          email: email
        })
      );
    },
    
    removeCollaborator: function (sessionId) {
      $(this.element).find('#collaborator-' + sessionId).hide("blind", function () {
        $(this).remove();
      });
    },
    
    _destroy : function() {
      
    }
  });
  
  $.widget("custom.collaborator", {
    options: {
      gravatarDefault: 'retro',
      gravatarRating: 'g',
      gravatarSize: 32
    },
    _create: function () {
      $(this.element)
        .addClass('collaborator')
        .attr({
          id: 'collaborator-' + this.options.sessionId,
        })
        .append($('<img>')
          .attr({
            title: this.options.name,
            src: '//www.gravatar.com/avatar/' + hex_md5(this.options.email) +
              '?d=' + this.options.gravatarDefault +
              '&r=' + this.options.gravatarRating +
              "&s=" + this.options.gravatarSize
          })
        );
    },
    
    _destroy : function() {
      
    }
  });
  
  $.widget("custom.workspaceMaterialEditorHtml", {
    options: {
    },
    _create: function () {
      if (!this.options.materialId) {
        // TODO: Localization
        $('.notification-queue').notificationQueue('notification', 'error', "Could not find materialId");
        return;
      }
      
      this._titleInput = $('<input>')
        .attr({
          'type': 'text'
        }).appendTo(this.element);
      
      this._status = $('<div>')
        .appendTo(this.element);
      
      this._collaborators = $('<div>')
        .appendTo(this.element)
        .collaborators();

      this._editorContainer = $('<div>')
        .appendTo(this.element);
      
      // TODO: Editor Locale
      this._editor = $(this._editorContainer).coOpsCK({
        externalPlugins : {
          'change' : CONTEXTPATH + '/scripts/ckplugins/change/',
          'coops' : CONTEXTPATH + '/scripts/ckplugins/coops/',
          'coops-connector' : CONTEXTPATH + '/scripts/ckplugins/coops-connector/',
          'coops-dmp' : CONTEXTPATH + '/scripts/ckplugins/coops-dmp/',
          'coops-cursors' : CONTEXTPATH + '/scripts/ckplugins/coops-cursors/',
          'coops-sessionevents' : CONTEXTPATH + '/scripts/ckplugins/coops-sessionevents/'
        },
        extraPlugins : 'coops,coops-connector,coops-dmp,coops-cursors,coops-sessionevents',
        serverUrl : CONTEXTPATH + '/rest/coops/' + this.options.materialId + '',
        editorOptions : {
          autoGrowOnStartup : true,
          skin : 'moono',
          height : 500
        }
      });
      
      this._editor.on('statusChange', $.proxy(this._onStatusChange, this));
      
      this._editor.on("error", function(event, data) {
        $('.connection-lost-notification').hide();
        
        switch (data.severity) {
          case 'CRITICAL':
          case 'SEVERE':
            $('.notification-queue').notificationQueue('notification', 'error', data.message);
          break;
          case 'WARNING':
            $('.notification-queue').notificationQueue('notification', 'warn', data.message);
          break;
          default:
            $('.notification-queue').notificationQueue('notification', 'info', data.message);
          break;
        }
      });
      
      this._editor.on("connectionLost", function (event, data) {
        $('.notification-queue').notificationQueue('notification', 'loading', 'Connection lost, reconnecting...').addClass('connection-lost-notification');
      });
      
      this._editor.on("reconnect", function (event, data) {
        $('.connection-lost-notification').hide();
      });
      
      this._editor.on("collaboratorJoined", $.proxy(this._onCollaboratorJoined, this));
      this._editor.on("collaboratorLeft", $.proxy(this._onCollaboratorLeft, this));
      this._editor.on("patchReceived", $.proxy(this._onPatchReceived, this));
      this._titleInput.change($.proxy(this._onTitleChange, this));
    },
    
    _onStatusChange: function (event, data) {
      // TODO: Localize
      $(this._status).html(data.status);
    },
    
    _onCollaboratorJoined: function (event, data) {
      $(this._collaborators).collaborators("addCollaborator", data.sessionId, data.displayName, data.email);
    },
    
    _onCollaboratorLeft: function (event, data) {
      $(this._collaborators).collaborators("removeCollaborator", data.sessionId);
    },
    
    _onTitleChange: function (event, data) {
      var oldValue = $(this).parent().data('old-value');
      var value = $(this._titleInput).val();
      if (value) {
        $(this).parent().data('old-value', value);
        $(editor).coOpsCK("changeProperty", 'title', oldValue, value);
      }
    },
    
    _onPatchReceived: function (event, data) {
      $.each(data.properties, $.proxy(function(key, value) {
        if (key === 'title') {
          $(this._titleInput).val(value);
        }
      }, this));
    },
    
    _destroy : function() {
      
    }
  });
  
}).call(this);