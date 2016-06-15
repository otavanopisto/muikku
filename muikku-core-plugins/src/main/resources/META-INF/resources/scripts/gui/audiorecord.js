(function() {
  'use strict';
  
  // TODO: Force https
  // TODO: Localize
  // TODO: Feature to limit clip length
  
  $.widget("custom.audioRecord", {
    
    options: {
      bufferSize: 0,
      numberOfAudioChannels: 1,
      sampleRate: 44100, 
      leftChannel: false,
      disableLogs: false
    },
    
    _create : function() {
      this.element.addClass('audio-record');
      
      $('<div>')
        .addClass('clips')
        .appendTo(this.element);
      
      $('<div>')
        .addClass('controls')
        .appendTo(this.element);
      
      if (Modernizr.getusermedia) {
        this._setupWebRTC();
      } else {
        this._setupCapture();
      }    
      
      this.element.on('click', '.remove-clip', $.proxy(this._onRemoveClipClick, this));
    },
    
    files: function () {
      
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
        .addClass('start-record')
        .attr({
          'href': 'javascript:void(null)'
        })
        .text('Record').appendTo(this.element.find('.controls'));
      
      $('<a>')
        .addClass('stop-record')
        .attr({
          'href': 'javascript:void(null)'
        })
        .hide()
        .text('Stop').appendTo(this.element.find('.controls'));
      
      this.element.on('click', '.start-record', $.proxy(this._onStartClick, this));
      this.element.on('click', '.stop-record', $.proxy(this._onStopClick, this));  
    },
    
    _setupCapture: function () {
      this.element.addClass('capture');
      
      $('<label>')
        .text('Liitä äänitiedosto klikkaamalla alla olevaa kenttää')
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
    
    _addClip: function (data) {
      if (!data.wav && !data.flac) {
        $('.notification-queue').notificationQueue('notification', 'error', 'Could not add clip, no data found');
        return;
      }
      
      var tasks = {};
      
      if (!data.wav) {
        tasks.wav = $.proxy(function (callback) {
          this._decodeAudioBlob(data.flac.blob, data.flac.name, "audio/wav", callback);
        }, this);
      };
      
      if (!data.flac) {
        tasks.flac = $.proxy(function (callback) {
          this._encodeAudioBlob(data.wav.blob, data.wav.name, "audio/flac", callback);
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
              
              console.log(data);
              
              var clip = $('<div>')
                .addClass('clip')
                .attr({
                  'data-id': null
                })
                .appendTo(this.element.find('.clips'));
              
              var audio = $('<audio>')
                .attr({
                  'controls': 'controls'
                })
                .appendTo(clip);

              $('<source>').attr({
                'src': data.wav.url,
                'type': data.wav.type
              }).appendTo(audio);
              
              $('<source>').attr({
                'src': data.flac.url,
                'type': data.flac.type
              }).appendTo(audio);
              
              $('<a>')
                .attr({
                  'href': 'javascript:void(null)'
                })
                .addClass('remove-clip')
                .text('Remove')
                .appendTo(clip); 
      
              this.element.trigger("change");
            }
          }, this));
        }
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
    
    _encodeAudioBlob: function (blob, name, type, callback) {
      var fileReader = new FileReader();
      
      fileReader.addEventListener('loadend', $.proxy(function() {
        this._encodeAudioArrayBuffer(new Uint8Array(fileReader.result), name, type, callback)
      }, this));
      
      fileReader.addEventListener('error', $.proxy(function(err) {
        $('.notification-queue').notificationQueue('notification', 'error', err|'Unknown error occurred while encoding audio');
      }, this));
      
      fileReader.readAsArrayBuffer(blob);
    },

    _encodeAudioArrayBuffer: function (arrayBuffer, name, type, callback) {
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
            var progress = vals[0] / vals[1] * 100;
            
            this.element.find('progress')
              .attr({
                'max': '100',
                'value': progress
              });
            
            this.element.find('.progress-label')
              .text(progress);
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
    
    _decodeAudioBlob: function (blob, name, type, callback) {
      var fileReader = new FileReader();
      
      fileReader.addEventListener('loadend', $.proxy(function() {
        this._decodeAudioArrayBuffer(new Uint8Array(fileReader.result), name, type, callback)
      }, this));
      
      fileReader.addEventListener('error', $.proxy(function(err) {
        $('.notification-queue').notificationQueue('notification', 'error', err|'Unknown error occurred while encoding audio');
      }, this));
      
      fileReader.readAsArrayBuffer(blob);
    },

    _decodeAudioArrayBuffer: function (arrayBuffer, name, type, callback) {
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
            var progress = vals[0] / vals[1] * 100;
            
            this.element.find('progress')
              .attr({
                'max': '100',
                'value': progress
              });
            
            this.element.find('.progress-label')
              .text(progress);
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
      this._startRecording();
    },
      
    _onStopClick: function (event) {
      this._stopRecording();
    },
      
    _onRemoveClipClick: function (event) {
      this._removeClip($(event.target).closest('.clip'));
    },
    
    _onFileChange: function () {
      var file = this.element.find(".controls input[type='file']")[0]
        .files[0];
      
      var type = this._normalizeMimeType(file.type);
      var name = file.name;
      
      if (type == 'audio/wav') {
        this._addClip({
          wav: {
            name: name,
            type: type,
            blob: file
          }
        });
      } else if (type == 'audio/flac') {
        this._addClip({
          flac: {
            name: name,
            type: type,
            blob: file
          }
        });
      } else {
        $('.notification-queue').notificationQueue('notification', 'error', 'Unsupported file type ' + type);
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
      $('<progress>')
        .attr({
          'max': 0,
          'value': 100
        })
        .appendTo(this.element.find('.controls'));
      
      $('<label>')
        .addClass('progress-label')
        .text('')
        .appendTo(this.element.find('.controls'));
      
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
      
      if (type == 'audio/wav') {
        this._addClip({
          wav: {
            name: name,
            type: type,
            blob: blob
          }
        });
      } else if (type == 'audio/flac') {
        this._addClip({
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