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
      imageMaxSize: 200
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
              .addClass('image-dialog-info-container')
              .append(
                    $('<select>')
                    .addClass('image-dialog-aspect')
                    .append(
                        $('<option>')
                        .val('1.0')
                        .html('1:1'),
                        $('<option>')
                        .val('1.5')
                        .html('3:2'),
                        $('<option>')
                        .val('0.75')
                        .html('2:3'),
                        $('<option>')
                        .val('0.707107')
                        .html('1:&radic;2'),
                        $('<option>')
                        .val('1.707107')
                        .html('&radic;2:1'),
                        $('<option>')
                        .val('NaN')
                        .html('Free')
                    )
                    .on('change', $.proxy(this._onAspectChange, this))
            )
            .appendTo(this.element);

      $('<div>')
        .addClass('image-dialog-preview-container')
        .append($('<canvas>').addClass('image-dialog-preview'))
        .append($('<div>').addClass('image-dialog-preview-info'))
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

    _refresh: function (imageElement) {
      if (this._jCropApi) {
        this._jCropApi.destroy();
      }

      var originalWidth = imageElement.get(0).naturalWidth;
      var originalHeight = imageElement.get(0).naturalHeight;
      var container = this.element.find('.image-dialog-image-container');
      var invRatio = this._calculateScaleFactor(
              originalWidth,
              originalHeight,
              container.width(),
              container.height());
      var ratio = 1/invRatio;
      var newWidth = originalWidth / ratio;
      var newHeight = originalHeight / ratio;
      var aspect = +this.element.find('.image-dialog-aspect').val();
      var cropInitialSize = (this.options.imageMaxSize / aspect) | 0;
      if (isNaN(aspect)) {
          cropInitialSize = this.options.imageMaxSize;
      }

      var scaleFactor = this._calculateScaleFactor(
            cropInitialSize,
            cropInitialSize,
            originalWidth,
            originalHeight);

      cropInitialSize *= scaleFactor;

      var jCropOptions = {
          minSize: [1, 1],
          onChange: $.proxy(this._onCropChange, this),
          onSelect: $.proxy(this._onCropChange, this),
          allowSelect: true,
          allowMove: true,
          allowResize: true
        };

      if (isNaN(aspect)) {
          jCropOptions['setSelect'] =
                  [0, 0, cropInitialSize, cropInitialSize];
      } else {
          jCropOptions['setSelect'] =
                  [0, 0, cropInitialSize*aspect, cropInitialSize];
          jCropOptions['aspectRatio'] = aspect;
      }

      var _this = this;
      $(imageElement)
        .data('ratio', ratio)
        .attr('width', newWidth)
        .width(newWidth)
        .attr('height', newHeight)
        .height(newHeight)
        .Jcrop(jCropOptions, function () {
          _this._jCropApi = this;
          _this.element.find('.image-dialog-image-container').removeClass('image-dialog-image-loading');
          _this.element.find('.image-dialog-zoom').html((1.0/ratio).toFixed(2) + "x");
          _this._refreshPreviewInfo();
        });
    },

    _refreshPreviewInfo: function() {
        var width = +this.element.find('.image-dialog-preview').attr('width');
        var height = +this.element.find('.image-dialog-preview').attr('height');
        var cssWidthPx = this.element.find('.image-dialog-preview').css('width');
        var cssWidth = parseInt(cssWidthPx, 10);
        var zoom = cssWidth / width;

        this.element.find('.image-dialog-preview-info').html(
                width.toFixed(0) + "x" + height.toFixed(0) +
                " (" + zoom.toFixed(2) + "x)"
        );
    },

    _onImageLoad: function (event) {
      this._refresh($(event.target));
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

      if (data && ((rotate != 0) || flip)) {
        flipAndRotateImage(src, rotate, flip, $.proxy(function (dataUrl) {
          this.element.find('.image-dialog-image')
                   .attr('src', dataUrl);
        }, this));
      } else {
        this.element.find('.image-dialog-image')
                   .attr('src', src);
      }
    },

    _calculateScaleFactor: function(width, height, maxWidth, maxHeight) {
        var xScaleFactor = 1;
        var yScaleFactor = 1;

        if (width > maxWidth) {
            xScaleFactor = maxWidth/width;
        }
        if (height > maxHeight) {
            yScaleFactor = maxHeight/height;
        }

        return xScaleFactor < yScaleFactor
                          ? xScaleFactor
                          : yScaleFactor;
    },

    _onCropChange: function(coords) {
      if (coords.w > 0 && coords.h > 0) {
        var previewCanvas = this.element.find('.image-dialog-preview');
        var maxWidth = this.element.find('.image-dialog-preview-container').width();
        var maxHeight = this.element.find('.image-dialog-preview-container').height();
        var ratio = this.element.find('.image-dialog-image').data('ratio');

        var canvasWidth = coords.w * ratio;
        var canvasHeight = coords.h * ratio;
        if (canvasWidth > maxWidth || canvasHeight > maxHeight) {
            if (coords.w > coords.h) {
                canvasWidth = maxWidth;
                canvasHeight = maxWidth * (coords.h / coords.w);
            } else {
                canvasWidth = maxHeight * (coords.w / coords.h);
                canvasHeight = maxHeight;
            }
        }

        var finalWidth = coords.w * ratio;
        var finalHeight = coords.h * ratio;

        var scaleFactor = this._calculateScaleFactor(
                finalWidth,
                finalHeight,
                this.options.imageMaxSize,
                this.options.imageMaxSize);

        finalWidth *= scaleFactor;
        finalHeight *= scaleFactor;

        previewCanvas.attr({
          width: finalWidth,
          height: finalHeight
        });
        previewCanvas.css({
          width: canvasWidth + "px",
          height: canvasHeight + "px"
        });

        this._refreshPreviewInfo();

        var previewContext = previewCanvas.get(0).getContext('2d');
        previewContext.drawImage(this.element.find('.image-dialog-image').get(0),
                                 coords.x * ratio,
                                 coords.y * ratio,
                                 coords.w * ratio,
                                 coords.h * ratio,
                                 0,
                                 0,
                                 finalWidth,
                                 finalHeight);
      }
    },

    _onAspectChange: function(event) {
        this._jCropApi.destroy();
        this._refresh(this.element.find('.image-dialog-image'));
    },

    _destroy : function() {
    }
  });

}).call(this);
