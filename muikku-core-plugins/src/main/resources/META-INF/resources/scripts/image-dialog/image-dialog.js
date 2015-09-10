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
      /** The text shown inside the upload box/drop target. */
      uploadHintText: 'Change image by clicking here or by dragging image file into this box',
      /** Images with either width or height larger than this will be
       * shrunk to fit.
       */
      imageMaxSize: 512,
      /** Images with either width or height smaller than this will be
       * enlarged to fit.
       *
       * WARNING: if you use this with 'free' aspect ratio, remember to
       * set the cropMinDimensions properly! Otherwise the user can
       * crop very narrow strips that will be resized to large images.
       */
      imageMinSize: 0,
      /** The minimum crop dimensions, as a 2-element array.
       */
      cropMinDimensions: [1, 1],
      /** Entries for the aspect ratio chooser. If there's only one entry,
       * the chooser is not shown.
       */
      aspectRatios: [
          {'text': "1:1",
           'ratio': 1},
          {'text': "3:2",
           'ratio': 1.5},
          {'text': "2:3",
           'ratio': 0.75},
          {'text': "1:&radic;2",
           'ratio': 0.707107},
          {'text': "&radic;2:1",
           'ratio': 1.707107},
          {'text': "Free",
           'ratio': "free"}
      ],
      /** The contents of the image (as a "data:" URL) will be inserted
       * into this form field after the user clicks OK. Can be a selector,
       * a DOM element or a jQuery object.
       */
      formField: null
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
                        $.map(this.options.aspectRatios, function(aspectRatio) {
                            return $('<option>')
                            .val(aspectRatio.ratio === "free"
                                 ? Number.NaN
                                 : aspectRatio.ratio)
                            .html(aspectRatio.text);
                        })
                    )
                    .on('change', $.proxy(this._onAspectChange, this))
            )
            .appendTo(this.element);

      if (this.options.aspectRatios.length === 1) {
          this.element.find('.image-dialog-aspect').hide();
      }

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

      var _this = this;
      this.element.dialog({
        modal: true,
        width: 660,
        buttons: [{
          'text': this.options.okButtonText,
          'click': function(event) {
            $(this).dialog().remove();
            var contentType = 'image/png';
            var imageData = $(this).find('.image-dialog-preview').get(0).toDataURL(contentType);
            if (_this.options.formField !== null) {
                $(_this.options.formField).val(imageData);
            }
            $(this).trigger(jQuery.Event("imageDialog.okClick"), {
              contentType: contentType,
              imageData: imageData
            });
          }
        }, {
          'text': this.options.cancelButtonText,
          'click': function(event) {
            $(this).dialog().remove();
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
              0,
              0,
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
            0,
            0,
            originalWidth,
            originalHeight);

      cropInitialSize = (0.9*cropInitialSize*scaleFactor)/ratio;

      var jCropOptions = {
          minSize: this.options.cropMinDimensions,
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
        .css('width', newWidth|0)
        .css('height', newHeight|0)
        .attr('width', newWidth|0)
        .attr('height', newHeight|0)
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

    _calculateScaleFactor: function(width,
                                    height,
                                    minWidth,
                                    minHeight,
                                    maxWidth,
                                    maxHeight) {
        var scaleFactors = [];

        if (width < minWidth) {
            scaleFactors.push(minWidth/width);
        }
        if (height < minHeight) {
            scaleFactors.push(minHeight/height);
        }
        if (width > maxWidth) {
            scaleFactors.push(maxWidth/width);
        }
        if (height > maxHeight) {
            scaleFactors.push(maxHeight/height);
        }

        if (scaleFactors.length === 0) {
            return 1;
        } else {
            scaleFactors.sort();
            return scaleFactors[0];
        }
    },

    _onCropChange: function(coords) {
      if (coords.w > 0 && coords.h > 0) {
        var fullImage = this.element.find('.image-dialog-image');
        var previewCanvas = this.element.find('.image-dialog-preview');
        var maxWidth = this.element.find('.image-dialog-preview-container').width();
        var maxHeight = this.element.find('.image-dialog-preview-container').height();
        var ratio = fullImage.data('ratio');

        var canvasWidth = coords.w * ratio;
        var canvasHeight = coords.h * ratio;
        if (this.options.imageMinSize > 0
            || canvasWidth > maxWidth
            || canvasHeight > maxHeight) {
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
                this.options.imageMinSize,
                this.options.imageMinSize,
                this.options.imageMaxSize,
                this.options.imageMaxSize);

        finalWidth *= scaleFactor;
        finalHeight *= scaleFactor;

        finalWidth = finalWidth | 0;
        finalHeight = finalHeight | 0;

        previewCanvas.attr({
          width: finalWidth,
          height: finalHeight
        });
        previewCanvas.css({
          width: canvasWidth + "px",
          height: canvasHeight + "px"
        });

        this._refreshPreviewInfo();

        var left = (coords.x * ratio) | 0;
        var top = (coords.y * ratio) | 0;
        var right = (coords.x2 * ratio) | 0;
        var bottom = (coords.y2 * ratio) | 0;
        var fullWidth = fullImage.get(0).naturalWidth;
        var fullHeight = fullImage.get(0).naturalHeight;

        left = left < 0 ? 0 : left;
        right = fullWidth < right ? fullWidth : right;
        top  = top < 0 ? 0 : top;
        bottom = fullHeight < bottom ? fullHeight : bottom;

        var previewContext = previewCanvas.get(0).getContext('2d');
        previewContext.drawImage(this.element.find('.image-dialog-image').get(0),
                                 left,
                                 top,
                                 right - left,
                                 bottom - top,
                                 0,
                                 0,
                                 finalWidth,
                                 finalHeight);
      }
    },

    _onAspectChange: function(event) {
        if (this._jCropApi !== null) {
            this._jCropApi.destroy();
        }
        this._refresh(this.element.find('.image-dialog-image'));
    },

    _destroy : function() {
    }
  });

}).call(this);
