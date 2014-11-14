(function() {
  'use strict';

  $.widget("custom.muikkuFileField", {
    _create : function() {
      this._fieldName = this.element.attr("name");
      this._multiple = this.element.attr("multiple") == 'multiple';
      this._fileIndex = 0;
      
      this._uploaderContainer = $('<div>')
        .addClass('muikku-file-input-field-file-uploader-container')
        .insertAfter(this.element);
      
      this._uploader = $('<input>').attr({
        'type' : 'file',
        'name' : 'file'
      }).appendTo(this._uploaderContainer).fileupload({
        url : CONTEXTPATH + '/tempFileUploadServlet',
        autoUpload : true,
        add : $.proxy(this._onFileUploadAdd, this),
        done : $.proxy(this._onFileUploadDone, this),
        always: $.proxy(this._onFileUploadAlways, this),
        progress : $.proxy(this._onFileUploadProgress, this)
      });
      
      $('<span>')
        .html(getLocaleText('plugin.workspace.fileField.fieldHint'))
        .appendTo(this._uploaderContainer);
      
      this._fileCount = $('<input>').attr({
        'type' : 'hidden',
        'name' : this._fieldName + '-file-count',
        'value': '0'
      }).insertAfter(this.element);
      
      var fileCount = this.element.data('file-count')||0;
      for (var i = 0; i < fileCount; i++) {
        var fileElement = this._createFileElement(i);
        var fileId = this.element.data('file-' + i + '.file-id');
        var fileName = this.element.data('file-' + i + '.filename');
        
        this._updateFileMeta(i, fileId, fileName, this.element.data('file-' + i + '.content-type'));
        this._updateFileLabel(i, fileName);
        this._updateFileProgress(i, 100);
        
        $('<input>').attr({
          type : 'hidden',
          name : this._fieldName + '.' + i + '-original-file-id',
          value : fileId
        }).appendTo(fileElement);
      }
      
      this.element.closest('form').submit($.proxy(this._onFormSubmit, this));

      this.element
        .attr("disabled", "disabled")
        .hide();
    },
    
    files: function () {
      return $.map(this._uploaderContainer.find('.muikku-file-input-field-file'), $.proxy(function (fileElement) {
        var fileIndex = $(fileElement).data('file-index');
        var fieldPrefix = this._fieldName + '.' + fileIndex;
        
        return {
          contentType: $(fileElement).find('input[name="' + fieldPrefix + '-content-type"]').val(),
          name: $(fileElement).find('input[name="' + fieldPrefix + '-filename"]').val(),
          id: $(fileElement).find('input[name="' + fieldPrefix + '-file-id"]').val()
        };
      }, this));
    },

    hide: function () {
      this._uploaderContainer.hide();
    },
    
    show: function () {
      this._uploaderContainer.show();
    },
    
    _findFileElementByIndex: function (index) {
      return this._uploaderContainer.find('.muikku-file-input-field-file[data-file-index="' + index + '"]');
    },
    
    _createFileElement: function (index) {
      return $('<div>')
        .addClass('muikku-file-input-field-file')
        .attr('data-file-index', index)
        .append($('<div>')
          .addClass('muikku-file-input-field-file-progress')
          .progressbar({
            value: 0
          })
        )
        .append($('<label>')
          .addClass('muikku-file-input-field-file-label')
        )
        .append($('<a>')
          .attr({
            'href': 'javascript:void(null)'
          })
          .html(getLocaleText('plugin.workspace.fileField.removeLink'))
          .click($.proxy(this._onFileRemoveClick, this))
          .addClass('muikku-file-input-field-file-remove')
        )
        .append($('<a>')
          .hide()
          .attr({
            'href': 'javascript:void(null)'
          })
          .html(getLocaleText('plugin.workspace.fileField.restoreLink'))
          .click($.proxy(this._onFileRestoreClick, this))
          .addClass('muikku-file-input-field-file-restore')
        )
        .appendTo(this._uploaderContainer);
    },
    
    _updateFileMeta: function (fileIndex, fileId, fileName, contentType) {
      var fileElement = this._findFileElementByIndex(fileIndex);
      var fieldPrefix = this._fieldName + '.' + fileIndex;
      
      var fileIdElement = this._uploaderContainer.find('input[name="' + fieldPrefix + '-file-id"]');
      if (fileIdElement.length == 0) {
        $('<input>').attr({
          type : 'hidden',
          name : fieldPrefix + '-content-type',
          value : contentType
        }).appendTo(fileElement);
  
        $('<input>').attr({
          type : 'hidden',
          name : fieldPrefix + '-filename',
          value : fileName
        }).appendTo(fileElement);
  
        $('<input>').attr({
          type : 'hidden',
          name : fieldPrefix + '-file-id',
          value : fileId
        }).appendTo(fileElement);

        this._fileCount.val(parseInt(this._fileCount.val()) + 1);
      } else {
        fileElement.find('input[name="' + fieldPrefix + '-content-type"]').val(contentType);
        fileElement.find('input[name="' + fieldPrefix + '-filename"]').val(fileName);
        fileElement.find('input[name="' + fieldPrefix + '-file-id"]').val(fileId);
      }
    },
    
    _updateFileProgress: function (index, progress) {
      this._findFileElementByIndex(index).find('.muikku-file-input-field-file-progress').progressbar("value", progress);
    },
    
    _updateFileLabel: function (index, text) {
      this._findFileElementByIndex(index).find('.muikku-file-input-field-file-label').text(text);
    },

    _onFileUploadAdd : function(e, data) {
      this.element.closest('form').find('input[type="submit"]').attr('disabled', 'disabled');
      
      data.context = this._findFileElementByIndex(this._fileIndex);
      
      if (data.context.length == 0) {
        data.context = this._createFileElement(this._fileIndex);
      }
      
      $(this.element).trigger('uploadStart');
      
      data.submit();
    },
    
    _onFileRemoveClick: function (event) {
      var file = $(event.target).closest('.muikku-file-input-field-file');
      file.addClass('muikku-file-input-field-file-removed');
      file.find('.muikku-file-input-field-file-remove').hide();
      file.find('.muikku-file-input-field-file-restore').show();
    },
    
    _onFileRestoreClick: function (event) {
      var file = $(event.target).closest('.muikku-file-input-field-file');
      file.removeClass('muikku-file-input-field-file-removed');
      file.find('.muikku-file-input-field-file-restore').hide();
      file.find('.muikku-file-input-field-file-remove').show();
    },

    _onFileUploadDone : function(e, data) {
      var fileId = data._response.result.fileId;
      var fileName = data.files[0].name;
      var contentType = data.files[0].type;
      this._updateFileMeta(this._fileIndex, fileId, fileName, contentType);
      this._updateFileLabel(this._fileIndex, fileName);
      
      if (this._multiple) {
        this._fileIndex++;
      }
      
      $(this.element).trigger('uploadDone', {
        id: fileId,
        name: fileName,
        contentType: contentType
      });
    },
    
    _onFileUploadAlways: function () {
      this.element.closest('form').find('input[type="submit"]').removeAttr('disabled');
    },

    _onFileUploadProgress : function(e, data) {
      var progress = parseInt(data.loaded / data.total * 100, 10);
      this._updateFileProgress(data.context.data('file-index'), progress);
    },
    
    _onFormSubmit: function (event) {
      this._uploader.remove();
      this.element.closest('form').find('.muikku-file-input-field-file-removed').each($.proxy(function (index, fileElement) {
        var fileIndex = $(fileElement).data('file-index');
        var fieldPrefix = this._fieldName + '.' + fileIndex;
        $(fileElement).find('input[name="' + fieldPrefix + '-file-id"]').val('');
      }, this));
    },
    
    _destroy : function() {

    }
  });

}).call(this);