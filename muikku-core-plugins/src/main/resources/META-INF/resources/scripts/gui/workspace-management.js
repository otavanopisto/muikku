(function() {
  'use strict';
  
  $.widget("custom.workspaceManagement", {
    options: {
      workspaceEntityId: null,
      ckeditor: {
        height : '200px',
        entities: false,
        entities_latin: false,
        entities_greek: false,
        toolbar: [
          { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
          { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'Undo', 'Redo' ] },
          { name: 'links', items: [ 'Link' ] },
          { name: 'insert', items: [ 'Image', 'Table', 'Smiley', 'SpecialChar' ] },
          { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
          { name: 'styles', items: [ 'Format' ] },
          { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
          { name: 'tools', items: [ 'Maximize' ] }
        ]
      }
    },
    
    _create: function () {
      async.parallel([this._createWorkspaceLoad(), this._createWorkspaceDetailsLoad()], $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var workspace = results[0];
          var details = results[1];
          
          this.element.find('*[name="workspaceName"]').val(workspace.name);
          this.element.find('.external-view-url').attr('href', details.externalViewUrl);
          this.element.find('*[name="published"][value="' + (workspace.published ? 'true' : 'false') + '"]').prop('checked', 'checked');
          
          console.log(workspace);
          console.log(details);
          this.element.find('*[name="workspaceNameExtension"]').val(workspace.nameExtension);
          this.element.find('*[name="beginDate"]').val(details.beginDate);
          this.element.find('*[name="endDate"]').val(details.endDate);
          this.element.find('.workspace-description').val(workspace.description);
          
          this.element.find('.date-field').each(function (index, dateField) {
            var value = parseInt($(dateField).val());
            $(dateField).val('');
            
            $(dateField).datepicker({
              "dateFormat": getLocaleText('datePattern')
            });
            
            if (!isNaN(value)) {
              $(dateField).datepicker('setDate', new Date(value));
            }
          });
          
          this.element.find('.ckeditor-field').each($.proxy(function (index, ckField) {
            CKEDITOR.replace(ckField, this.options.ckeditor);
          }, this));
        }
      }, this));
    },
    
    _createWorkspaceLoad: function () {
      return $.proxy(function (callback) {
        mApi().workspace.workspaces
          .read(this.options.workspaceEntityId)
          .callback(function (err, workspace) {
            callback(err, workspace);
          })
      }, this); 
    },
    
    _createWorkspaceDetailsLoad: function () {
      return $.proxy(function (callback) {
        mApi().workspace.workspaces.details
          .read(this.options.workspaceEntityId)
          .callback(function (err, details) {
            callback(err, details);
          })
      }, this); 
    }
  });
  
  $(document).ready(function () {
    $(document.body).workspaceManagement({
      workspaceEntityId: $('.workspace-entity-id').val()
    });
  });
  
  
}).call(this);
