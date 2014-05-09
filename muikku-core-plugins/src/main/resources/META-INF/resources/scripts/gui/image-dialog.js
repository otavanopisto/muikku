(function() {
  'use strict';

  function flipAndRotateImage(data, degrees, flip, callback) {
    $('<img>')
      .css('visibility', 'hidden')
      .attr('src', data)
      .load(function () {
        try {
          var tmpCanvas = $('<canvas>')
            .attr({
              'width': $(this).width(),
              'height': $(this).height()
            }).get(0);

          var image = $(this).get(0);
          var tmpContext = tmpCanvas.getContext('2d');
          tmpContext.drawImage(image, 0, 0);

          if (degrees != 0) {
            tmpContext.save();
            tmpContext.translate(tmpCanvas.width >> 1, tmpCanvas.height >> 1);
            tmpContext.rotate(degrees * Math.PI / 180);
            tmpContext.drawImage(tmpCanvas, -image.width >> 1,-image.width >> 1);
            tmpContext.restore();
          }

          if (flip) {
            tmpContext.save();
            if (flip == 'VERTICAL') {
              tmpContext.translate(0, tmpCanvas.height);
              tmpContext.scale(1, -1);
            } else if (flip == 'HORIZONTAL') {
              tmpContext.translate(tmpCanvas.width, 0);
              tmpContext.scale(-1, 1);
            }
            tmpContext.drawImage(tmpCanvas, 0, 0);
            tmpContext.restore();
          };

          callback(tmpCanvas.toDataURL('image/png'));
        } catch (e) {
          callback(data);
        } finally {
          $(this).remove();
        }
      }).appendTo($(document.body));
  };

  $.widget("custom.imageDialog", {
    options : {
      okButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      uploadHintText: 'Change image by clicking here or by dragging image file into this box',
      imageWidth: 192,
      imageHeight: 128
    },
    _create : function() {
      if (!window.FileReader) {
        alert('Your browser does not support FileReader');
      }

      $('<div>')
        .addClass('image-dialog-upload-field-container')
        .append(
          $('<input>')
            .change($.proxy(this._onUploadFieldChange, this))
            .addClass('image-dialog-upload-field')
            .attr({
              'type': 'file',
              'accept': 'image/*'
            })
        )
        .append(
          $('<span>')
            .addClass('image-dialog-upload-field-hint')
            .text(this.options.uploadHintText)
        )
        .appendTo(this.element);

      $('<div>')
        .addClass('image-dialog-preview-container')
        .append($('<canvas>').addClass('image-dialog-preview'))
        .appendTo(this.element);

      $('<div>')
        .addClass('image-dialog-image-container')
        .append(
          $('<img>')
            .load($.proxy(this._onImageLoad, this))
            .addClass('image-dialog-image')
         )
         .append(
           $('<div>')
           .addClass('image-dialog-zoom')
         )
        .appendTo(this.element);

      this._jCropApi = null;

      this.element.dialog({
        modal: true,
        width: 660,
        buttons: [{
          'text': this.options.okButtonText,
          'click': function(event) {
            $(this).dialog("close");
            var contentType = 'image/png';
            var imageData = $(this).find('.image-dialog-preview').get(0).toDataURL(contentType);
            $(this).trigger(jQuery.Event("imageDialog.okClick"), {
              contentType: contentType,
              imageData: imageData
            });
          }
        }, {
          'text': this.options.cancelButtonText,
          'click': function(event) {
            $(this).dialog("close");
          }
        }]
      });
    },

    _onImageLoad: function (event) {
      var imageElement = $(event.target);

      if (this._jCropApi) {
        this._jCropApi.destroy();
      }

      var originalWidth = $(imageElement).width();
      var originalHeight = $(imageElement).height();
      var xRatio = originalWidth / this.element.find('.image-dialog-image-container').width();
      var yRatio = originalHeight / this.element.find('.image-dialog-image-container').height();
      var ratio = xRatio > yRatio ? xRatio : yRatio;
      var newWidth = originalWidth / ratio;
      var newHeight = originalHeight / ratio;

      var _this = this;
      $(imageElement)
        .attr({
          'width': newWidth,
          'height': newHeight,
          'data-ratio': ratio
        })
        .Jcrop({
          setSelect: [0, 0, this.options.imageWidth, this.options.imageHeight],
          minSize: [1, 1],
          onChange: $.proxy(this._onCropChange, this),
          onSelect: $.proxy(this._onCropChange, this),
          allowSelect: true,
          allowMove: true,
          allowResize: true
        }, function () {
          _this._jCropApi = this;
          _this.element.find('.image-dialog-image-container').removeClass('image-dialog-image-loading');
        });

        this.element.find('.image-dialog-zoom').html((1.0/ratio).toFixed(2) + "x");
    },

    _onUploadFieldChange: function (event) {
      var files = event.target.files;
      if (files.length == 1) {
        var file = files[0];
        if (file.type.match('image.*')) {
          this.element.find('.image-dialog-image-container').addClass('image-dialog-image-loading');
          setTimeout($.proxy(function () {
            var reader = new FileReader();
            reader.onload = $.proxy(this._onFileReaderLoad, this);
            reader.readAsDataURL(files[0]);
          }, this), 0);
        }
      };
    },

    _onFileReaderLoad: function (event) {
      var fileReader = event.target;
      var src = fileReader.result;
      var rotate = 0;
      var data = null;
      var flip = null;

      if (window.EXIF && window.atob) {
        try {
          var dataIndex = src.indexOf('base64,');
          var dataStr = src.substring(dataIndex + 7);
          data = atob(dataStr);
          var exifdata = EXIF.readFromBinaryFile(new BinaryFile(data));
          switch (EXIF.getTag({exifdata: exifdata}, "Orientation")) {
            case 2:
              flip = 'HORIZONTAL';
            break;
            case 3:
              rotate = 180;
            break;
            case 4:
              flip = 'VERTICAL';
            break;
            case 5:
              rotate = 90;
              flip = 'HORIZONTAL';
            break;
            case 6:
              rotate = 90;
            break;
            case 7:
              rotate = -90;
              flip = 'HORIZONTAL';
            break;
            case 8:
              rotate = -90;
            break;
          }

        } catch (e) {
        }
      }

      this.element.find('.image-dialog-image')
        .removeAttr('width')
        .removeAttr('height');

      if (data && ((rotate != 0) || flip)) {
        flipAndRotateImage(src, rotate, flip, $.proxy(function (dataUrl) {
          this.element.find('.image-dialog-image').attr('src', dataUrl);
        }, this));
      } else {
        this.element.find('.image-dialog-image').attr('src', src);
      }
    },

    _onCropChange: function(coords) {
      if (coords.w > 0 && coords.h > 0) {
        var previewCanvas = this.element.find('.image-dialog-preview');
        var maxWidth = this.element.find('.image-dialog-preview-container').width();
        var maxHeight = this.element.find('.image-dialog-preview-container').height();
        var canvasWidth;
        var canvasHeight;
        if (coords.w > coords.h) {
        	canvasWidth = maxWidth;
        	canvasHeight = maxWidth * (coords.h / coords.w);
        } else {
        	canvasHeight = maxHeight;
        	canvasWidth = maxWidth * (coords.w / coords.h);
        }
        var ratio = this.element.find('.image-dialog-image').data('ratio');

        previewCanvas.attr({
          width: canvasWidth,
          height: canvasHeight
        });

        var previewContext = previewCanvas.get(0).getContext('2d');
        previewContext.drawImage(this.element.find('.image-dialog-image').get(0),
                                 coords.x * ratio,
                                 coords.y * ratio,
                                 coords.w * ratio,
                                 coords.h * ratio,
                                 0,
                                 0,
                                 canvasWidth,
                                 canvasHeight);
      }
    },

    _destroy : function() {
    }
  });

}).call(this);
