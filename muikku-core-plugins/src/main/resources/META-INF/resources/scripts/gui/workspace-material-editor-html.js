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
        ).append($("<span>").append(this.options.name));
    },
    
    _destroy : function() {
      
    }
  });
  
  $.widget("custom.workspaceMaterialEditorHtml", {
    options: {
    },
    _create: function () {
      if (!this.options.materialId) {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.workspace.htmlMaterialEditor.couldNotFindMaterialId"));
        return;
      }
      
      this._titleInputWrapper = $('<div>')
        .addClass('workspace-material-html-editor-title-wrapper')
        .appendTo(this.element);
      
      this._titleInput = $('<input>')
        .addClass('workspace-material-html-editor-title')
        .attr('type', 'text')
        .data('old-value', this.options.materialTitle||'')
        .val(this.options.materialTitle||'')
        .appendTo(this._titleInputWrapper);
      
      this._status = $('<div>')
        .addClass('workspace-material-html-editor-status')
        .append('<span>')
        .appendTo(this.element);
      
      this._collaborators = $('<div>')
        .addClass("material-editor-collaborator-wrapper")
        .appendTo(this.element)
        .collaborators();

      this._editorContainer = $('<div>')
        .addClass('workspace-material-html-editor')
        .appendTo(this.element);
      
      this._editor = $(this._editorContainer).coOpsCK({
        externalPlugins : {
          'widget': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/4.5.8/',
          'lineutils': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/4.5.8/',
          'mathjax': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/mathjax/4.5.8/',
          'autogrow' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/autogrow/4.5.8/plugin.js',
          'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.8/plugin.js',
          'notificationaggregator' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notificationaggregator/4.5.8/plugin.js',
          'filetools' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/filetools/4.5.8/plugin.js',
          'uploadwidget' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadwidget/4.5.8/plugin.js',
          'uploadimage' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadimage/4.5.8/plugin.js',
          'image2' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/image2/4.5.8/plugin.js',
          'oembed' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/oembed/1.17/',
          'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.1/plugin.min.js',
          'coops' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/coops/0.1.1/plugin.min.js',
          'coops-connector' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/coops-connector/0.1.1/plugin.min.js',
          'coops-dmp' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/coops-dmp/0.1.1/plugin.min.js',
          'coops-sessionevents' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/coops-sessionevents/0.1.1/plugin.min.js',
          'audio': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/audio/1.0.0/',
          'muikku-fields': CONTEXTPATH + '/scripts/ckplugins/muikku-fields/',
          'muikku-selection': CONTEXTPATH + '/scripts/ckplugins/muikku-selection/',
          'muikku-textfield': CONTEXTPATH + '/scripts/ckplugins/muikku-textfield/',
          'muikku-memofield': CONTEXTPATH + '/scripts/ckplugins/muikku-memofield/',
          'muikku-filefield': CONTEXTPATH + '/scripts/ckplugins/muikku-filefield/',
          'muikku-connectfield': CONTEXTPATH + '/scripts/ckplugins/muikku-connectfield/',
          'muikku-embedded': CONTEXTPATH + '/scripts/ckplugins/muikku-embedded/',
          'muikku-image-details': CONTEXTPATH + '/scripts/ckplugins/muikku-image-details/',
          'muikku-word-definition': CONTEXTPATH + '/scripts/ckplugins/muikku-word-definition/',
          'muikku-audio-defaults': CONTEXTPATH + '/scripts/ckplugins/muikku-audio-defaults/'
        },
        extraPlugins : [
                       'oembed',
                       'coops',
                       'coops-connector', 
                       'coops-dmp',
                       'coops-sessionevents', 
                       'audio',
                       'image2',
                       'muikku-textfield', 
                       'muikku-memofield', 
                       'muikku-filefield', 
                       'muikku-selection',
                       'muikku-connectfield',
                       'muikku-embedded',
                       'muikku-image-details',
                       'muikku-word-definition',
                       'muikku-audio-defaults',
                       'mathjax',
                       'autogrow',
                       'uploadimage'],
        serverUrl : CONTEXTPATH + '/rest/coops/' + this.options.materialId + '',
        editorOptions: {
          uploadUrl: '/materialAttachmentUploadServlet' + this.options.materialPath,
          autoGrowOnStartup : true,
          autoGrow_maxHeight: $( window ).height() - $('span.cke_top').height() - 240,
          autoGrow_minHeight: 400, 
          allowedContent: true, // disable content filtering to preserve all formatting of imported documents; fix for #263
          entities: false,
          entities_latin: false,
          entities_greek: false,
          skin : 'moono',
          height : 500,
          language: getLocale(),
          stylesSet : 'workspace-material-styles:' + CONTEXTPATH + '/scripts/ckplugins/styles/workspace-material-styles.js',
          contentsCss : CONTEXTPATH +  '/css/custom-ckeditor-contentcss.css',
          format_tags : 'p;h3;h4',
          baseHref: this.options.materialPath + '/', 
          mathJaxLib: '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
          toolbar: [
            { name: 'document', items : [ 'Source' ] },
            { name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
            { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
            { name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
            '/',
            { name: 'styles', items : [ 'Styles','Format' ] },
            { name: 'insert', items : [ 'Image','Audio','oembed','Mathjax','Table','Iframe','SpecialChar', 'CreateDiv' ] },
            { name: 'links', items : [ 'Link','Unlink','Anchor' ] },
            { name: 'colors', items : [ 'TextColor','BGColor' ] },
            '/',
            { name: 'forms', items : ['MuikkuTextField', 'muikku-selection', 'MuikkuMemoField', 'muikku-filefield', 'muikku-connectfield']},
            { name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },          
            { name: 'tools', items : [ 'Maximize', 'ShowBlocks','-','About'] }
          ],
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
        $('.notification-queue').notificationQueue('notification', 'loading', getLocaleText("plugin.workspace.htmlMaterialEditor.connectionLost")).addClass('connection-lost-notification');
      });
      
      this._editor.on("reconnect", function (event, data) {
        $('.connection-lost-notification').hide();
      });
      
      this._editor.on("collaboratorJoined", $.proxy(this._onCollaboratorJoined, this));
      this._editor.on("collaboratorLeft", $.proxy(this._onCollaboratorLeft, this));
      this._editor.on("patchReceived", $.proxy(this._onPatchReceived, this));
      this._titleInput.change($.proxy(this._onTitleChange, this));
    },
    
    title: function () {
      return $(this._titleInput).val();
    },
    
    _onStatusChange: function (event, data) {
      // TODO: Localize
      $(this._status).removeClass('icon-saved icon-saving icon-unsaved icon-loaded icon-loading');
      $(this._status).addClass('icon-' + data.status);
      $(this._status).find('span').html(data.status);
      
      if (data.status == 'saved') {
        $(document).trigger("htmlMaterialRevisionChanged", {
          materialId: this.options.materialId,
          revisionNumber: data.revisionNumber
        });
      }
    },
    
    _onCollaboratorJoined: function (event, data) {
      $(this._collaborators).collaborators("addCollaborator", data.sessionId, data.displayName, data.email);
    },
    
    _onCollaboratorLeft: function (event, data) {
      $(this._collaborators).collaborators("removeCollaborator", data.sessionId);
    },
    
    _onTitleChange: function (event, data) {
      var oldValue = $(this._titleInput).data('old-value');
      var value = $(this._titleInput).val();
      if (value) {
        $(this._titleInput).data('old-value', value);
        $(this._editorContainer).coOpsCK("changeProperty", 'title', oldValue, value);
      }
    },
    
    _onPatchReceived: function (event, data) {
      $.each(data.properties, $.proxy(function(key, value) {
        if (key === 'title') {
          $(this._titleInput)
            .data('old-value', value)
            .val(value);
        }
      }, this));
    },
    
    _destroy : function() {
      this._editor.coOpsCK('destroy').remove();
      this._titleInput.off().remove();
      this._status.off().remove();
      this._collaborators.off().remove();
      this._editorContainer.off().remove();
    }
  });
  
}).call(this);
