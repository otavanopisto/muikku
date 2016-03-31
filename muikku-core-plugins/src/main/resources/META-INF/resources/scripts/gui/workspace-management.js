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
      var loader = $('<div>')
        .addClass('loading')
        .appendTo(this.element);
      
      async.parallel([this._createWorkspaceTypesLoad(), this._createWorkspaceLoad(), this._createWorkspaceDetailsLoad()], $.proxy(function (err, results) {
        loader.remove();
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var workspaceTypes = results[0];
          var workspace = results[1];
          var details = results[2];
          
          this.element.find('*[name="workspaceName"]').val(workspace.name);
          this.element.find('.external-view-url').attr('href', details.externalViewUrl);
          this.element.find('*[name="published"][value="' + (workspace.published ? 'true' : 'false') + '"]').prop('checked', 'checked');
          this.element.find('*[name="workspaceNameExtension"]').val(workspace.nameExtension);
          this.element.find('*[name="beginDate"]').val(details.beginDate);
          this.element.find('*[name="endDate"]').val(details.endDate);
          this.element.find('.workspace-description').val(workspace.description);
          
          $.each(workspaceTypes, $.proxy(function (index, workspaceType) {
            var option = $('<option>')
              .attr('value', workspaceType.identifier)
              .text(workspaceType.name)
              .appendTo(this.element.find('.workspace-type'));
            
            if (workspaceType.identifier == details.typeId) {
              option.prop('selected', 'selected');
            }
          }, this));
          
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
          
          this.element.on('click', '.save', $.proxy(this._onSaveClick, this));
        }
      }, this));
    },
    
    _createWorkspaceTypesLoad: function () {
      return $.proxy(function (callback) {
        mApi().workspace.workspaceTypes
          .read()
          .callback(function (err, workspaceTypes) {
            callback(err, workspaceTypes);
          })
      }, this); 
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
    },
    
    _createWorkspaceUpdate: function () {
      return $.proxy(function (callback) {
        mApi().workspace.workspaces
          .read(this.options.workspaceEntityId)
          .callback($.proxy(function (getErr, workspace) {
            if (getErr) {
              callback(getErr);
            } else {
              var name = this.element.find('*[name="workspaceName"]').val();
              var nameExtension = this.element.find('*[name="workspaceNameExtension"]').val();
              var description = CKEDITOR.instances['workspace-description'].getData();
              var published = this.element.find('*[name="published"]:checked').val() == 'true';

              mApi().workspace.workspaces
                .update(this.options.workspaceEntityId, $.extend(workspace, {
                  name: name,
                  nameExtension: nameExtension,
                  description: description,
                  published: published
                }))
                .callback(function (err, updatedWorkspace) {
                  callback(err, updatedWorkspace);
                })
            }
          }, this))
      }, this); 
    },
    
    _createWorkspaceDetailsUpdate: function () {
      return $.proxy(function (callback) {
        mApi().workspace.workspaces.details
          .read(this.options.workspaceEntityId)
          .callback($.proxy(function (getErr, details) {
            if (getErr) {
              callback(getErr);
            } else {
              var beginDate = this.element.find('*[name="beginDate"]').datepicker('getDate');
              var endDate = this.element.find('*[name="endDate"]').datepicker('getDate');
              var typeId = this.element.find('.workspace-type').val();
      
              mApi().workspace.workspaces.details
                .update(this.options.workspaceEntityId, $.extend(details, {
                  beginDate: beginDate != null ? beginDate.getTime() : null,
                  endDate: endDate != null ? endDate.getTime() : null,
                  typeId: typeId != null ? typeId : null
                }))
                .callback(function (err, updatedDetails) {
                  callback(err, updatedDetails);
                })
            }
          }, this))
      }, this); 
    },
    
    _onSaveClick: function (event) {      
      var loader = $('<div>')
        .addClass('loading')
        .appendTo(this.element);

      async.series([this._createWorkspaceUpdate(), this._createWorkspaceDetailsUpdate()], function (err, results) {
        loader.remove();
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
      });
    }
  });
  
  $(document).ready(function () {
    $(document.body).workspaceManagement({
      workspaceEntityId: $('.workspace-entity-id').val()
    });
  });
  
  
}).call(this);
