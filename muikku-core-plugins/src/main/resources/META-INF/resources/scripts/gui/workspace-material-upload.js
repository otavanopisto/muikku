(function() {

  $.widget("custom.workspaceMaterialUpload", {
    options: {
      
    },
    
    _create: function () {
      this._fileField = $(this.element).find('input[type="file"]')
        .muikkuFileField()
        .on("uploadDone", $.proxy(this._onUploadDone, this));
    },
    
    reset: function () {
      if (this._uploadSelect) {
        this._uploadSelect.remove();
        this._uploadSelect = null;
      }
      
      this._fileField.muikkuFileField('reset');
      this._fileField.muikkuFileField('show');
    },
    
    _onUploadDone: function (event, data) {
      this._fileField.muikkuFileField('hide');
      
      renderDustTemplate('workspace/materials-management-upload-select.dust', { fileName: data.name }, $.proxy(function (text) {
        this._uploadSelect = $(text).appendTo(this.element);
        
        $(this.element).find('.materials-management-upload-select-upload').click($.proxy(function () {
          $.proxy(this._uploadFile, this)(data);
        }, this));

        $(this.element).find('.materials-management-upload-select-convert').click($.proxy(function () {
          $.proxy(this._convertFile, this)(data);
        }, this));
        
        $(this.element).find('.materials-management-upload-select-discard').click($.proxy(function () {
          $.proxy(this._discardFile, this)(data);
        }, this));
        
      }, this));
    },
    
    _uploadFile: function (file) {
      mApi().materials.binary.create({
        title: file.name,
        contentType: file.contentType,
        fileId: file.id
      })
      .callback($.proxy(function (materialErr, materialResult) {
        if (materialErr) {
          $('.notification-queue').notificationQueue('notification', 'error', materialErr);
          return;
        }
        
        // TODO These are against widget ideology but it would be a nightmare to keep them up-to-date in material management 
        var workspaceEntityId = $('.workspaceEntityId').val();
        var parentFolder = $(this.element).prevAll('.folder').first();
        var parentId = parentFolder ? $(parentFolder).data('workspace-material-id') : $('.workspaceRootFolderId').val();
        var nextMaterial = $(this.element).next('.workspace-materials-view-page');
        var nextSiblingId = $(nextMaterial) && !$(nextMaterial).hasClass('folder') ? $(nextMaterial).data('workspace-material-id') : undefined;
        
        mApi().workspace.workspaces.materials.create(workspaceEntityId, {
          materialId: materialResult.id,
          parentId: parentId,
          nextSiblingId: nextSiblingId
        })
        .callback($.proxy(function (workspaceMaterialErr, workspaceMaterialResult) {
          if (workspaceMaterialErr) {
            $('.notification-queue').notificationQueue('notification', 'error', workspaceMaterialErr);
            return;
          }
          else {
            $(this.element).trigger('fileUploaded', {
              'title': materialResult.title,
              'parentId': workspaceMaterialResult.parentId,
              'materialId': materialResult.id,
              'workspaceMaterialId': workspaceMaterialResult.id,
              'nextSiblingId': nextSiblingId
            });
          } 
        }, this));

      }, this));
    },
    
    _convertFile: function (file) {
      
    },
    
    _discardFile: function (file) {
      $(this.element).trigger('fileDiscarded', {
        fileId: file.id
      });
    },
    
    _destroy : function() {
      
    }
  });
    
}).call(this);