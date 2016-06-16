(function() {
  'use strict';
  
  $.widget("custom.audioRecord", {
    options: {
      bufferSize: 0,
      numberOfAudioChannels: 1,
      sampleRate: 44100, 
      leftChannel: false,
      disableLogs: false,
      maxClipLength: 60000 * 5,  
      uploadUrl: CONTEXTPATH + '/tempFileUploadServlet'
    },
    
    _create : function() {
      this.element.addClass('audio-record');
      this.element.attr('data-disabled-hint', getLocaleText('plugin.workspace.audioField.readonlyHint'));
      
      $('<div>')
        .addClass('clips')
        .appendTo(this.element);
      
      $('<div>')
        .addClass('controls flex-row flex-align-items-center')
        .appendTo(this.element);
      
      if (Modernizr.getusermedia) {
        this._setupWebRTC();
      } else {
        this._setupCapture();
      }    
      
      this.element.on('click', '.remove-clip', $.proxy(this._onRemoveClipClick, this));
    },
    
    readonly: function (readonly) {
      if (readonly === undefined) {
        return this.element.attr('data-readonly') == 'readonly';
      } else {
        if (readonly) {
          this.element.attr('data-readonly', 'readonly')
          this.element.find(".controls input[type='file']").attr('disabled', 'disabled');
        } else {
          this.element.removeAttr('data-readonly');
          this.element.find(".controls input[type='file']").removeAttr('disabled');
        }
      }
    },
    
    clips: function (clips) {
      if (clips === undefined) {
        return $.map(this.element.find('.clip'), function (clip) {
          return {
            id: $(clip).attr('data-id'),
            contentType: $(clip).attr('data-type'),
            name: $(clip).attr('data-name')
          };
        });
      } else {
        var tasks = $.map(clips, $.proxy(function (clip) {
          return $.proxy(function (callback) {
            var preparedClip = this._prepareClip();
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/rest/workspace/audioanswer/' + clip.id, true);
            xhr.responseType = 'blob';
            
            xhr.addEventListener('progress', $.proxy(function(evt){
              if (evt.lengthComputable) {
                this._setClipStatus(preparedClip, 'LOADING', evt.loaded, evt.total);
              } else {
                this._setClipStatus(preparedClip, 'LOADING', 0, 0);
              }
            }, this), false);
            
            xhr.onload = function (e) {
              if (this.status == 200) {
                callback(null, {
                  data: xhr.response,
                  preparedClip: preparedClip
                });
              } else {
                callback(e||'Unknown error occurred');
              }
            };
             
            xhr.send();
          }, this)
        }, this));
        
        async.parallel(tasks, $.proxy(function (err, results) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err); 
          } else {
            $.each(results, $.proxy(function (index, result) {
              var data = result.data;
              var preparedClip = result.preparedClip;
              var clip = clips[index];
              
              this._addClip(preparedClip, {
                flac: {
                  clipId: clip.id,
                  blob: data,
                  type: clip.contentType,
                  name: clip.name
                }
              });
                
            }, this));
          }
        }, this));
      }
    },
    
    _normalizeMimeType: function (type) {
      switch (type) {
        case 'audio/wav':
        case 'audio/x-wav':
          return 'audio/wav';
        case 'audio/ogg':
          return 'audio/ogg';
        break;
        case 'audio/mpeg':
        case 'audio/mp3':
        case 'audio/mpeg3':
        case 'audio/x-mpeg-3':
          return 'audio/mp3';
        break;
        case 'audio/flac':
          return 'audio/flac';
        break;
        default:
          return 'application/octet-stream';
        break;
      }
    },
    
    _setupWebRTC: function () {
      this.element.addClass('webrtc');

      $('<a>')
        .addClass('start-record icon-record')
        .attr({
          'href': 'javascript:void(null)'
        })
        .append($('<span>')
          .addClass('start-record-label')
          .text(getLocaleText('plugin.workspace.audioField.startLink')))
        .appendTo(this.element.find('.controls'));
      
      $('<a>')
        .addClass('stop-record icon-stop')
        .attr({
          'href': 'javascript:void(null)'
        })
        .hide()
        .append($('<span>')
          .addClass('stop-record-label')
          .text(getLocaleText('plugin.workspace.audioField.stopLink')))
        .appendTo(this.element.find('.controls'));
      
      $('<label>')
        .addClass('hint-text') 
        .text(getLocaleText('plugin.workspace.audioField.rtcHint'))
        .appendTo(this.element.find('.controls'));
      
      this.element.on('click', '.start-record', $.proxy(this._onStartClick, this));
      this.element.on('click', '.stop-record', $.proxy(this._onStopClick, this));  
    },
    
    _setupCapture: function () {
      this.element.addClass('capture');
      
      $('<label>')
        .addClass('hint-text')
        .text(getLocaleText('plugin.workspace.audioField.captureHint'))
        .appendTo(this.element.find('.controls'));
      
      $('<input>')
        .attr({
          'type': 'file',
          'accept': "audio/*",
          'capture': 'microphone'
        })
        .appendTo(this.element.find('.controls'));
      
      this.element.on("change", ".controls input[type='file']", $.proxy(this._onFileChange, this))
    },
    
    _captureUserMedia: function (mediaConstraints, successCallback, errorCallback) {
      if (navigator.getUserMedia) {
        navigator.getUserMedia(mediaConstraints, successCallback, errorCallback); 
      } else {
        $('.notification-queue').notificationQueue('notification', 'error', 'getUserMedia is not supported');
      }
    },
    
    _createReadAsDataURLTask: function (blob) {
      return $.proxy(function (callback) {
        this._readAsDataURL(blob, callback);
      }, this)
    },
    
    _loadBlob: function (url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = function(e) {
        if (this.status == 200) {
          callback(this.response);
        }
      };
      xhr.send();
    },
    
    _formatTime: function (ms) {
      var sec = ms / 1000;
      var min = Math.floor(sec / 60);
      return _.padStart(min, 2, '0') + ':' + _.padStart(Math.floor(sec - (min * 60)), 2, '0');
    },
    
    _setClipStatus: function (clip, status, progress, progressMax) {
      var label = $(clip).find('.progress-label');
      var showProgress = false;
      
      switch (status) {
        case 'RECORDING':
          showProgress = true;
          label.text(getLocaleText('plugin.workspace.audioField.statusRecording', this._formatTime(progress), this._formatTime(progressMax)));
        break;
        case 'PROCESSING':
          showProgress = true;
          label.text(getLocaleText('plugin.workspace.audioField.statusProcessing', progressMax ? Math.round(progress / progressMax * 100) : 0));
        break;
        case 'UPLOADING':
          showProgress = true;
          label.text(getLocaleText('plugin.workspace.audioField.statusUploading', progressMax ? Math.round(progress / progressMax * 100) : 0));
        break;
        case 'LOADING':
          showProgress = true;
          label.text(getLocaleText('plugin.workspace.audioField.statusLoading', progressMax ? Math.round(progress / progressMax * 100) : 0));
        break;
        case 'UPLOADED':
          $(clip).find('.remove-clip').show();
          $(clip).find('audio').show();
        break;
      }
      
      if (showProgress) {
        label.show();
        $(clip).find('progress')
          .show()
          .attr({
            'value': progress,
            'max': progressMax
          });
      } else {
        label.hide();
        $(clip).find('progress').hide();
      }
    },
    
    _prepareClip: function () {
      var clip = $('<div>')
        .addClass('clip flex-row flex-align-items-center')
        .appendTo(this.element.find('.clips'));
      
      var audio = $('<audio>')
        .hide()
        .attr({
          'controls': 'controls'
        })
        .appendTo(clip); 
      
      $('<progress>')
        .hide()
        .appendTo(clip);

      $('<label>')
        .hide()
        .addClass('progress-label')
        .appendTo(clip);
      
      $('<a>')
        .hide()
        .attr({
          'href': 'javascript:void(null)'
        })
        .addClass('remove-clip icon-remove-clip')
        .attr('title', getLocaleText('plugin.workspace.audioField.removeLink'))
        .appendTo(clip);

      return clip;
    },
    
    _addClip: function (clip, data) {
      if (!data.wav && !data.flac) {
        $('.notification-queue').notificationQueue('notification', 'error', 'Could not add clip, no data found');
        return;
      }
      
      var tasks = {};
      
      if (!data.wav) {
        tasks.wav = $.proxy(function (callback) {
          this._decodeAudioBlob(data.flac.blob, data.flac.name, "audio/wav", callback, $.proxy(function (progress) {
            this._setClipStatus(clip, 'PROCESSING', progress, 100);
          }, this));
        }, this);
      };
      
      if (!data.flac) {
        tasks.flac = $.proxy(function (callback) {
          this._encodeAudioBlob(data.wav.blob, data.wav.name, "audio/flac", callback, $.proxy(function (progress) {
            this._setClipStatus(clip, 'PROCESSING', progress, 100);
          }, this));
        }, this);
      };
      
      async.parallel(tasks, $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          if (results.flac) {
            data.flac = results.flac;
          } 
          
          if (results.wav) {
            data.wav = results.wav;
          } 
          
          async.parallel({
            flacUrl: this._createReadAsDataURLTask(data.flac.blob),
            wavUrl: this._createReadAsDataURLTask(data.wav.blob)
          }, $.proxy(function (err, urlResults) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              data.flac.url = urlResults.flacUrl;
              data.wav.url = urlResults.wavUrl;
              
              if (data.flac.clipId) {
                // Existing clips are just added as audio sources
                $(clip).attr({
                  'data-id': data.flac.clipId,
                  'data-name': data.flac.name,
                  'data-type': data.flac.type
                });
                
                var audio = $(clip).find('audio');
                
                $('<source>').attr({
                  'src': data.wav.url,
                  'type': data.wav.type
                }).appendTo(audio);
                
                $('<source>').attr({
                  'src': data.flac.url,
                  'type': data.flac.type
                }).appendTo(audio);
                
                this._setClipStatus(clip, 'UPLOADED');
                
              } else {
                // Newly added clips will instantly be uploaded into the server
                this._uploadClip(clip, data.flac, $.proxy(function (err, meta) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  } else {
                    $(clip).attr({
                      'data-id': meta.fileId,
                      'data-name': data.flac.name,
                      'data-type': data.flac.type
                    });
                    
                    var audio = $(clip).find('audio');
                    
                    $('<source>').attr({
                      'src': data.wav.url,
                      'type': data.wav.type
                    }).appendTo(audio);
                    
                    $('<source>').attr({
                      'src': data.flac.url,
                      'type': data.flac.type
                    }).appendTo(audio);
                    
                    this.element.trigger("change");
                  }
                }, this));
              }
            }
          }, this));
        }
      }, this));
    },
    
    _uploadClip: function (clip, flacClip, callback) {
      this._setClipStatus(clip, 'UPLOADING', 0, 100);

      var formData = new FormData();
      formData.append('file', flacClip.blob, flacClip.name);

      $.ajax({
        type: 'POST',
        url: this.options.uploadUrl,
        data: formData,
        processData: false,
        contentType: false,
        xhr: $.proxy(function() {
          var xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener('progress', $.proxy(function(evt){
            if (evt.lengthComputable) {
              this._setClipStatus(clip, 'UPLOADING', evt.loaded, evt.total);
            } else {
              this._setClipStatus(clip, 'UPLOADING', 0, 0);
            }
          }, this), false);
          
          return xhr;
        }, this)
      })
      .error(function (jqXHR, textStatus, errorThrown) {
        callback(textStatus ? jqXHR.responseText || jqXHR.statusText || textStatus : null);
      })
      .success($.proxy(function(data) {
        this._setClipStatus(clip, 'UPLOADED');
        callback(null, data);
      }, this));
    },
    
    _removeClip: function (clip) {
      $(clip).remove();
      this.element.trigger("change");
    },
    
    _blobToUrl: function (blob) {
      return (window.URL || window.webkitURL)
        .createObjectURL(blob);
    },
    
    _encodeAudioBlob: function (blob, name, type, callback, progress) {
      var fileReader = new FileReader();
      
      fileReader.addEventListener('loadend', $.proxy(function() {
        this._encodeAudioArrayBuffer(new Uint8Array(fileReader.result), name, type, callback, progress)
      }, this));
      
      fileReader.addEventListener('error', $.proxy(function(err) {
        $('.notification-queue').notificationQueue('notification', 'error', err|'Unknown error occurred while encoding audio');
      }, this));
      
      fileReader.readAsArrayBuffer(blob);
    },

    _encodeAudioArrayBuffer: function (arrayBuffer, name, type, callback, progress) {
      // TODO: Error handling
      
      if (type != 'audio/ogg' && type != 'audio/flac') {
        type = 'audio/ogg';
      }
      
      var encodedName = name.replace(/\.[^\.]+$/, type == 'audio/ogg' ? '.oga' : '.flac');
      var worker = new Worker('/scripts/audiorecord-worker/EmsWorkerProxy.js');
      
      var inData = {};
      inData[name] = arrayBuffer
      var outData = {};
      outData[encodedName] = {
        'MIME': type
      };
      
      var args = [ name, "--best" ];
      if (type == 'audio/ogg') {
        args.push("--ogg");
      }
      
      worker.onmessage = $.proxy(function(e) {
        if (e.data && e.data.reply === 'progress') {
          var vals = e.data.values;
          if (vals[1]) {
            if ((typeof progress) == 'function') {
              progress(vals[0] / vals[1] * 100);
            }
          } 
        } else if (e.data && e.data.reply === 'done') {
          var blob = e.data.values[encodedName].blob;
          callback(null, {
            name: encodedName, 
            type: blob.type, 
            blob: blob
          });
        }
      }, this);
      
      worker.postMessage({
        command: 'encode',
        args: args,
        outData: outData,
        fileData: inData
      });
    },
    
    _decodeAudioBlob: function (blob, name, type, callback, progress) {
      var fileReader = new FileReader();
      
      fileReader.addEventListener('loadend', $.proxy(function() {
        this._decodeAudioArrayBuffer(new Uint8Array(fileReader.result), name, type, callback, progress)
      }, this));
      
      fileReader.addEventListener('error', $.proxy(function(err) {
        $('.notification-queue').notificationQueue('notification', 'error', err|'Unknown error occurred while encoding audio');
      }, this));
      
      fileReader.readAsArrayBuffer(blob);
    },

    _decodeAudioArrayBuffer: function (arrayBuffer, name, type, callback, progress) {
      if (!type) {
        type = 'audio/wav';
      }
      
      var encodedName = name.replace(/\.[^\.]+$/, '.wav');
      var worker = new Worker('/scripts/audiorecord-worker/EmsWorkerProxy.js');
      
      var inData = {};
      inData[name] = arrayBuffer
      var outData = {};
      outData[encodedName] = {
        'MIME': type
      };
      
      var args = [ name, "-d" ];
      
      worker.onmessage = $.proxy(function(e) {
        if (e.data && e.data.reply === 'progress') {
          var vals = e.data.values;
          if (vals[1]) {
            if ((typeof progress) == 'function') {
              progress(vals[0] / vals[1] * 100);
            }
          } 
        } else if (e.data && e.data.reply === 'done') {
          var blob = e.data.values[encodedName].blob;
          callback(null, {
            name: encodedName, 
            type: blob.type, 
            blob: blob
          });
        }
      }, this);
      
      worker.postMessage({
        command: 'encode',
        args: args,
        outData: outData,
        fileData: inData
      });
    },
    
    _onStartClick: function (event) {
      if (!this.readonly()) {
        this._startRecording();
      }
    },
      
    _onStopClick: function (event) {
      if (!this.readonly()) {
        this._stopRecording();
      }
    },
      
    _onRemoveClipClick: function (event) {
      if (!this.readonly()) {
        this._removeClip($(event.target).closest('.clip'));
      }
    },
    
    _onFileChange: function () {
      if (this.readonly()) {
        return;
      }
      
      var file = this.element.find(".controls input[type='file']")[0]
        .files[0];
      
      var type = this._normalizeMimeType(file.type);
      var name = file.name;
      
      if (type == 'audio/wav') {
        this._addClip(this._prepareClip(), {
          wav: {
            name: name,
            type: type,
            blob: file
          }
        });
      } else if (type == 'audio/flac') {
        this._addClip(this._prepareClip(), {
          flac: {
            name: name,
            type: type,
            blob: file
          }
        });
      } else {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.workspace.audioField.unsupportedFileType', type, 'audio/wav, audio/flac'));
      }
    },
    
    _readAsDataURL: function (file, callback) {
      var fileReader = new FileReader();
      fileReader.addEventListener("load", function (event) {
        callback(null, fileReader.result);
      }, false);
      
      fileReader.addEventListener('error', $.proxy(function(err) {
        callback(err|'Unknown error occurred while reading data url');
      }, this));

      fileReader.readAsDataURL(file);
    },
    
    _startRecording: function () {
     this._captureUserMedia({audio: true}, $.proxy(this._onCaptureAudioStart, this), $.proxy(this._onCaptureAudioError, this));
    },
    
    _stopRecording: function () {
      this._recordRTC.stopRecording($.proxy(function(url) {
        var type = this._normalizeMimeType(this._recordRTC && this._recordRTC.blob && this._recordRTC.blob.type ? this._recordRTC.blob.type : 'application/octet-stream');

        var name = (new Date()).getTime()
        switch (type) {
          case 'audio/ogg':
            name += '.ogg';
          break;
          case 'audio/mpeg':
          case 'audio/mp3':
          case 'audio/mpeg3':
          case 'audio/x-mpeg-3':
            name += '.mp3';
          break;
          case 'audio/wav':
            name += '.wav';
          break;
          case 'audio/flac':
            name += '.flac';
          break;
          default:
            name += '.raw';
          break;
        }
        
        var audioStreamTracks = this._audioStream.getAudioTracks ? this._audioStream.getAudioTracks() : [];
        if (audioStreamTracks.length == 1) {
          audioStreamTracks[0].stop();
        } 
        
        this._onAudioCaptureEnd(name, this._recordRTC.blob, type);
      }, this));
    },
    
    _onCaptureAudioError: function (err) {
      $('.notification-queue').notificationQueue('notification', 'error', err|'Unknown error occurred while capturing audio');
    },
    
    _onCaptureAudioStart: function (audioStream) {
      this._recordClip = this._prepareClip();
      this._recordStartTime = (new Date()).getTime();
      this._setClipStatus(this._recordClip, 'RECORDING', 0, this.options.maxClipLength);

      this._recordIntervalId = setInterval($.proxy(function () {
        var clipLength = (new Date()).getTime() - this._recordStartTime;
        
        if (clipLength >= this.options.maxClipLength) {
         this._stopRecording();
        } else {
          this._setClipStatus(this._recordClip, 'RECORDING', clipLength, this.options.maxClipLength);
        }
      }, this), 200);
      
      this._audioStream = audioStream;
      
      this._recordRTC = RecordRTC(audioStream, {
        type: 'audio',
        mimeType: 'audio/wav',
        bufferSize: this.options.bufferSize,
        sampleRate: this.options.sampleRate,
        leftChannel: this.options.leftChannel,
        numberOfAudioChannels: this.options.numberOfAudioChannels,
        disableLogs: this.options.disableLogs,
        recorderType: StereoAudioRecorder
      });
      
      this._recordRTC.startRecording();
      
      this.element.find('.start-record').hide();
      this.element.find('.stop-record').show();
    },
    
    _onAudioCaptureEnd: function (name, blob, type) {
      this.element.find('.start-record').show();
      this.element.find('.stop-record').hide();
      
      this._recordStartTime = null;
      clearInterval(this._recordIntervalId);
      
      if (type == 'audio/wav') {
        this._addClip(this._recordClip, {
          wav: {
            name: name,
            type: type,
            blob: blob
          }
        });
      } else if (type == 'audio/flac') {
        this._addClip(this._recordClip, {
          flac: {
            name: name,
            type: type,
            blob: blob
          }
        });
      } else {
        $('.notification-queue').notificationQueue('notification', 'error', 'Unsupported file type ' + type);
      }
    }
  });
  
}).call(this);