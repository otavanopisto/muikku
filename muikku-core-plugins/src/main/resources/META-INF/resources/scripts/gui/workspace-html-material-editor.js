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
  
  $(document).ready(function() {
    var fileId = $('.html-editor-html-material-id').val();
    if (!fileId) {
      $('.notification-queue').notificationQueue('notification', 'error', "Could not find fileId");
      return;
    }

    // TODO: Editor Locale
    // TODO: Localization
      
    var editor = $('.html-editor-ckcontainer').append('<div>').coOpsCK({
      externalPlugins : {
        'change' : CONTEXTPATH + '/scripts/ckplugins/change/',
        'coops' : CONTEXTPATH + '/scripts/ckplugins/coops/',
        'coops-connector' : CONTEXTPATH + '/scripts/ckplugins/coops-connector/',
        'coops-dmp' : CONTEXTPATH + '/scripts/ckplugins/coops-dmp/',
        'coops-cursors' : CONTEXTPATH + '/scripts/ckplugins/coops-cursors/',
        'coops-sessionevents' : CONTEXTPATH + '/scripts/ckplugins/coops-sessionevents/'
      },
      extraPlugins : 'coops,coops-connector,coops-dmp,coops-cursors,coops-sessionevents',
      serverUrl : CONTEXTPATH + '/rest/coops/' + fileId + '',
      editorOptions : {
        autoGrowOnStartup : true,
        skin : 'moono',
        height : 500
      }
    });
    
    editor.on('statusChange', function (event, data) {
      $('.html-editor-status').html($('.html-editor-status').data(data.status));
    });
    
    editor.on("error", function(event, data) {
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
    
    editor.on("connectionLost", function (event, data) {
      $('.notification-queue').notificationQueue('notification', 'loading', 'Connection lost, reconnecting...').addClass('connection-lost-notification');
    });
    
    editor.on("reconnect", function (event, data) {
      $('.connection-lost-notification').hide();
    });
    
    editor.on("collaboratorJoined", function(event, data) {
      $('.collaborators').collaborators("addCollaborator", data.sessionId, data.displayName, data.email);
    });
    
    editor.on("collaboratorLeft", function(event, data) {
      $('.collaborators').collaborators("removeCollaborator", data.sessionId);
    });

    editor.on("patchReceived", function(event, data) {
      $.each(data.properties, function(key, value) {
        if (key === 'title') {
          $('.html-editor-title-container input').val(value);
        }
      });
    });
    
    $('.html-editor-title-container input').change(function(event) {
      var oldValue = $(this).parent().data('old-value');
      var value = $(this).val();
      if (value) {
        $(this).parent().data('old-value', value);
        $(editor).coOpsCK("changeProperty", 'title', oldValue, value);
      }
    });
    
    $('.collaborators').collaborators();
  });
  
}).call(this);