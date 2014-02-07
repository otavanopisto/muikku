(function() {
  'use strict';

  $.widget("custom.muikkuFileField", {
    _create : function() {
      this._fieldName = this.element.attr("name");
      this._multiple = this.element.attr("multiple") == 'multiple';
      this._fileIndex = 0;
      
      this._uploader = $('<input>').attr({
        'type' : 'file',
        'name' : 'file'
      }).insertAfter(this.element).fileupload({
        url : CONTEXTPATH + '/tempFileUploadServlet',
        autoUpload : true,
        add : $.proxy(this._onFileUploadAdd, this),
        done : $.proxy(this._onFileUploadDone, this),
        progress : $.proxy(this._onFileUploadProgress, this)
      });
      
      this._fileCount = $('<input>').attr({
        'type' : 'hidden',
        'name' : this._fieldName + '-file-count',
        'value': '0'
      }).insertAfter(this.element);

      this.element.hide();
    },

    _onFileUploadAdd : function(e, data) {
      if (!this._multiple) {
        var existingFile = this.element.parent().find('.muikku-file-input-field-file');
        data.context = existingFile.length == 1 ? existingFile : null;
      }
      
      if (!data.context) {
        data.context = $('<div>')
          .addClass('muikku-file-input-field-file')
          .append($('<div>')
            .addClass('muikku-file-input-field-file-progress')
            .progressbar({
              value: 0
            })
          )
          .appendTo(this.element.parent());
      }
      
      data.submit();
    },

    _onFileUploadDone : function(e, data) {
      var fieldPrefix = this._fieldName + '.' + this._fileIndex;
      var fileId = data._response.result.fileId;
      var fileName = data.files[0].name;
      var contentType = data.files[0].type;
      
      var fileIdElement = this.element.parent().find('input[name="' + fieldPrefix + '-file-id"]');
      if (fileIdElement.length == 0) {
        $('<input>').attr({
          type : 'hidden',
          name : fieldPrefix + '-content-type',
          value : contentType
        }).appendTo(data.context);
  
        $('<input>').attr({
          type : 'hidden',
          name : fieldPrefix + '-filename',
          value : fileName
        }).appendTo(data.context);
  
        $('<input>').attr({
          type : 'hidden',
          name : fieldPrefix + '-file-id',
          value : data._response.result.fileId
        }).appendTo(data.context);
        
        this._fileCount.val(parseInt(this._fileCount.val()) + 1);
        if (this._multiple) {
          this._fileIndex++;
        }
      } else {
        data.context.find('input[name="' + fieldPrefix + '-content-type"]').val(contentType);
        data.context.find('input[name="' + fieldPrefix + '-filename"]').val(fileName);
        data.context.find('input[name="' + fieldPrefix + '-file-id"]').val(fileId);
      }
    },

    _onFileUploadProgress : function(e, data) {
      var progress = parseInt(data.loaded / data.total * 100, 10);
      data.context.find('.muikku-file-input-field-file-progress').progressbar("value", progress);
    },

    _destroy : function() {

    }
  });

  $(document).ready(function() {
    $(".muikku-file-input-field").muikkuFileField();
  });
}).call(this);