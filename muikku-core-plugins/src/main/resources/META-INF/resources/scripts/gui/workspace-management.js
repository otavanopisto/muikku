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
      
      async.parallel([this._createWorkspaceTypesLoad(), this._createWorkspaceLoad(), this._createWorkspaceDetailsLoad(), this._createWorkspaceMaterialProducersLoad()], $.proxy(function (err, results) {
        loader.remove();
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var workspaceTypes = results[0];
          var workspace = results[1];
          var details = results[2];
          var producers = results[3];
          
          $.each(producers, $.proxy(function (index, producer) {
            this._addMaterialProducerElement(producer.id, 'EXISTING', producer.name);
          }, this));
          
          this.element.find('*[name="workspaceName"]').val(workspace.name);
          this.element.find('.external-view-url').attr('href', details.externalViewUrl);
          this.element.find('*[name="published"][value="' + (workspace.published ? 'true' : 'false') + '"]').prop('checked', 'checked');
          this.element.find('*[name="access"][value="' + workspace.access + '"]').prop('checked', 'checked');
          this.element.find('*[name="workspaceNameExtension"]').val(workspace.nameExtension);
          this.element.find('*[name="beginDate"]').val(details.beginDate);
          this.element.find('*[name="endDate"]').val(details.endDate);
          this.element.find('.workspace-description').val(workspace.description);
          this.element.find('.default-material-license').val(workspace.materialDefaultLicense);
          
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
          
          this.element.on('keydown', '.workspace-material-producer-add', $.proxy(this._onMaterialProducerKeyDown, this));
          this.element.on('click', '.workspace-material-producer-remove', $.proxy(this._onMaterialProducerRemoveClick, this));
                    
          this.element.find('.ckeditor-field').each($.proxy(function (index, ckField) {
            CKEDITOR.replace(ckField, this.options.ckeditor);
          }, this));
          
          this.element.find('.default-material-license').licenseSelector({
            locale: getLocale() == 'fi' ? 'fi' : 'en',
            types: {
              'ogl': false
            }
          });

          this.element.on('click', '.save', $.proxy(this._onSaveClick, this));
        }
      }, this));
    },
    
    _addMaterialProducerElement: function (id, status, name) {
      $('<span>')
        .attr({
          'data-id': id,
          'data-status': status,
          'data-name': name
        })
        .addClass('workspace-material-producer')
        .text(name)
        .appendTo(this.element.find('.workspace-material-producers'))
        .append($('<a>')
            .addClass('workspace-material-producer-remove')
            .attr('href', 'javascript:void(null)'));
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
    
    _createWorkspaceMaterialProducersLoad: function () {
      return $.proxy(function (callback) {
        mApi().workspace.workspaces.materialProducers
          .read(this.options.workspaceEntityId)
          .callback(function (err, materialProducers) {
            callback(err, materialProducers);
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
              var access = this.element.find('*[name="access"]:checked').val();
              var materialDefaultLicense = this.element.find('.default-material-license').val();
              
              mApi().workspace.workspaces
                .update(this.options.workspaceEntityId, $.extend(workspace, {
                  name: name,
                  nameExtension: nameExtension,
                  description: description,
                  published: published,
                  access: access,
                  materialDefaultLicense: materialDefaultLicense
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
    
    _createCreateWorkspaceMaterialProducer: function (name) {
      return $.proxy(function (callback) {
        mApi().workspace.workspaces.materialProducers
          .create(this.options.workspaceEntityId, {
            name: name
          })
          .callback(function (err, materialProducer) {
            callback(err, materialProducer);
          })
      }, this); 
    },
    
    _createDeleteWorkspaceMaterialProducer: function (id) {
      return $.proxy(function (callback) {
        mApi().workspace.workspaces.materialProducers
          .del(this.options.workspaceEntityId, id)
          .callback(function (err) {
            callback(err);
          })
      }, this); 
    },

    _onMaterialProducerKeyDown: function (event) {
      if (((event.keyCode ? event.keyCode : event.which) == 13)) {
        event.preventDefault();
        var input = this.element.find('.workspace-material-producer-add');
        this._addMaterialProducerElement('', 'NEW', input.val());
        input.val('');
      }
    },
    
    _onMaterialProducerRemoveClick: function (event) {
      var producer = $(event.target)
        .closest('.workspace-material-producer');
      
      if (producer.attr('data-status') == 'NEW') {
        producer.remove();
      } else {
        producer
          .attr('data-status', 'REMOVED')
          .hide();
      }
    },
    
    _onSaveClick: function (event) {      
      var loader = $('<div>')
        .addClass('loading')
        .appendTo(this.element);
      
      var operations = [this._createWorkspaceUpdate(), this._createWorkspaceDetailsUpdate()];

      this.element.find('.workspace-material-producer').each($.proxy(function (index, producer) {
        var id = $(producer).attr('data-id');
        var status = $(producer).attr('data-status');
        var name = $(producer).attr('data-name');
        
        switch (status) {
          case 'NEW':
            operations.push(this._createCreateWorkspaceMaterialProducer(name));
          break;
          case 'REMOVED':
            operations.push(this._createDeleteWorkspaceMaterialProducer(id));
          break;
        }        
      }, this));
      
      async.series(operations, function (err, results) {
        loader.remove();
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          window.location.reload(true);
        }
      });
    }
  });
  
  $(document).ready(function () {
    webshim.polyfill('forms');
    
    $(document.body).workspaceManagement({
      workspaceEntityId: $('.workspace-entity-id').val()
    });
  });
  
  
}).call(this);
