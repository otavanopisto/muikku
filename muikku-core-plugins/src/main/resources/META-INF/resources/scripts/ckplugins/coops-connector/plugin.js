(function() {

  /* global CKEDITOR, ActiveXObject, MozWebSocket, DefaultIOHandler: true, DefaultConnector:true */
  
  DefaultIOHandler = CKEDITOR.tools.createClass({
    $: function(editor) {
      editor.on("CoOPS:BeforeSessionStart", function (event) {
        this._useMethodOverride = !!event.data.joinData.extensions['x-http-method-override'];
      }, this);
    },
    proto : {
      get: function (url, parameters, callback) {
        this._doGetRequest(url, parameters, function (status, responseText) {
          if ((status === 200) && (!responseText)) {
            // Request was probably aborted...
            return;
          }
          
          if (status !== 200) {
            callback(status, null, responseText);
          } else {
            callback(status, JSON.parse(responseText), null);
          }
        });
      },
      
      patch: function (url, object, callback) {
        this._doJsonPostRequest("PATCH", url, object, callback);
      },
      
      _doJsonPostRequest: function (method, url, object, callback) {
        var data = JSON.stringify(object);
        
        this._doPostRequest(method, url, data, 'application/json', function (status, responseText) {
          if ((status === 200) && (!responseText)) {
            // Request was probably aborted...
            return;
          }
          
          try {
            if (status !== 200) {
              callback(status, null, responseText);
            } else {
              var responseJson = JSON.parse(responseText);
              callback(status, responseJson, null);
            }
          } catch (e) {
            callback(status, null, e);
          }
        });
      },
  
      _processParameters: function (parameters) {
        var result = '';
        if ((parameters) && (parameters.length > 0)) {
          for (var i = 0, l = parameters.length; i < l; i++) {
            if (i > 0) {
              result += '&';
            }
            result += encodeURIComponent(parameters[i].name) + '=' + encodeURIComponent(parameters[i].value);
          }
        }
        
        return result;
      },
      
      _doGetRequest: function (url, parameters, callback) {
        var xhr = this._createXMLHttpRequest();
        var async = true;
        
        xhr.open("get", url + ((parameters.length > 0) ? '?' + this._processParameters(parameters) : ''), async);
        
        if (async) {
          xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
              callback(xhr.status, xhr.responseText);
            }
          };
        }
        
        xhr.send(null);
  
        if (!async) {
          callback(xhr.status, xhr.responseText);
        }
      },
          
      _doPostRequest: function (method, url, data, contentType, callback) {
        var xhr = this._createXMLHttpRequest();
        var async = true;
        if (this._useMethodOverride && (method !== 'POST')) {
          xhr.open("POST", url, async);
          xhr.setRequestHeader("x-http-method-override", method);
        } else {
          xhr.open(method, url, async);
        }
        
        xhr.setRequestHeader("Content-type", contentType);
        
        if (!CKEDITOR.env.webkit) {
          // WebKit refuses to send these headers as unsafe
          xhr.setRequestHeader("Content-length", data ? data.length : 0);
          xhr.setRequestHeader("Connection", "close");
        }
        
        if (async) {
          xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
              callback(xhr.status, xhr.responseText);
            }
          };
        }
        
        xhr.send(data);
        
        if (!async) {
          callback(xhr.status, xhr.responseText);
        }
      },
      
      _createXMLHttpRequest: function() {
        if ( !CKEDITOR.env.ie || location.protocol !== 'file:' ) {
          try { return new XMLHttpRequest(); } catch(e) {}
          try { return new ActiveXObject( 'Msxml2.XMLHTTP' ); } catch (e) {}
          try { return new ActiveXObject( 'Microsoft.XMLHTTP' ); } catch (e) {}
        }
        return null;
      }
    }
  });

  DefaultConnector = CKEDITOR.tools.createClass({
    $ : function(editor) {
      this._editor = editor;
      this._leavingPage = false;
      this._useWebSocket = false;
      this._patchData = {};
      this._ioHandler = editor.config.coops.restIOHandler||new DefaultIOHandler(editor);
      
      editor.on('CoOPS:Join', this._onCoOpsJoin, this);
      editor.on("CoOPS:BeforeSessionStart", this._onBeforeSessionStart, this, null, 9999);
    },
    proto : {
      getName: function () {
        return 'default-connector';
      },
      
      _onCoOpsJoin: function (event) {
        var protocolVersion = event.data.protocolVersion;
        var algorithms = event.data.algorithms;
        var editor = event.editor;
        
        this._fileJoin(algorithms, protocolVersion, CKEDITOR.tools.bind(function (status, responseJson, error) {
          if (error) {
            this._editor.fire("CoOPS:Error", {
              severity: "CRITICAL",
              message: "Failed to initiate collaboration session: " + error
            });
          } else {
            this._editor.fire("CoOPS:Joined", responseJson);
          }
        }, this));
      },

      _onBeforeSessionStart : function(event) {
        if (!event.data.isConnected()) {
          var joinData = event.data.joinData;
          
          this._revisionNumber = joinData.revisionNumber;
          this._sessionId = joinData.sessionId;
          this._useWebSocket = false;
          
          if (this._editor.config.coops.webSocket !== false) {
            if (joinData.extensions.webSocket) {
              var secure = window.location.protocol.indexOf('https') === 0;
              var webSocketUrl = secure ? joinData.extensions.webSocket.wss : joinData.extensions.webSocket.ws;
              if (webSocketUrl) {
                this._webSocket = this._openWebSocket(webSocketUrl);
                if (this._webSocket) {
                  this._webSocket.onmessage = CKEDITOR.tools.bind(this._onWebSocketMessage, this);
                  this._webSocket.onclose = CKEDITOR.tools.bind(this._onWebSocketClose, this);
                  switch (this._webSocket.readyState) {
                    case this._webSocket.CONNECTING:
                      this._webSocket.onopen = CKEDITOR.tools.bind(this._onWebSocketOpen, this);
                    break;
                    case this._webSocket.OPEN:
                      this._startListening();
                    break;
                    default:
                      this._editor.fire("CoOPS:Error", {
                        severity: "CRITICAL",
                        message: "WebSocket initialization failed."
                      });
                    break;
                  }
                  
                  this._useWebSocket = true;
                }
              }
            }
          }
          
          if (!this._useWebSocket) {
            this._startListening();
  
            if (this._editor.config.coops.restPolling !== 'manual') {
              this._startUpdatePolling();
            } else {
              this._editor.restCheckUpdates = CKEDITOR.tools.bind(function () {
                this._checkUpdates();
              }, this);
            }
          }
          
          window.onbeforeunload = CKEDITOR.tools.bind(this._onWindowBeforeUnload, this);
          this._editor.on("CoOPS:ConnectionLost", this._onConnectionLost, this);
          
          event.data.markConnected();
        }
      },
      
      _onContentPatch : function(event) {
        if (this._editor.config.coops.readOnly === true) {
          return;
        }
        
        if (this._patchData[this._revisionNumber + 1]) {
          this._editor.fire("CoOPS:PatchRejected", {
            reason: "already sending a patch"
          });
        } else {
          var patch = event.data.patch;
          this._patchData[this._revisionNumber + 1] = {
            content: event.data.newContent
          };
         
          this._sendPatch(patch, null, null);
        }
      },
      
      _onPropertiesChange: function (event) {
        if (this._editor.config.coops.readOnly === true) {
          return;
        }
        
        if (this._patchData[this._revisionNumber + 1]) {
          this._editor.fire("CoOPS:PatchRejected", {
            reason: "already sending a patch"
          });
        } else {
          var changedProperties = event.data.properties;
          var properties = {};
          
          for (var i = 0, l = changedProperties.length; i < l; i++) {
            properties[changedProperties[i].property] = changedProperties[i].currentValue;
          }
          
          this._patchData[this._revisionNumber + 1] = {
            properties: properties
          };
          
          this._sendPatch(null, properties, null);
        }
      },
      
      _onExtensionPatch: function (event) {
        if (this._editor.config.coops.readOnly === true) {
          return;
        }
        
        if (this._patchData[this._revisionNumber + 1]) {
          this._editor.fire("CoOPS:PatchRejected", {
            reason: "already sending a patch"
          });
        } else {
          this._patchData[this._revisionNumber + 1] = {
            extensions: event.data.extensions
          };
            
          this._sendPatch(null, null, event.data.extensions);
        }
      },
      
      _onContentRevert: function(event) {
        this._ioHandler.get(this._editor.config.coops.serverUrl, { }, CKEDITOR.tools.bind(function (status, responseJson, responseText) {
          switch (status) {
            case 200:
              // Content reverted

              var content = responseJson.content;
              this._revisionNumber = responseJson.revisionNumber;

              this._editor.fire("CoOPS:RevertedContentReceived", {
                content: content
              });
            break;
            default:
              this._editor.fire("CoOPS:Error", {
                severity: "SEVERE",
                message: "Failed to revert content"
              });
            break;
          }
          
        }, this));
      },
      
      _onWindowBeforeUnload: function (event) {
        this._leavingPage = true;
        if (this._webSocket) {
          this._webSocket.onclose = function () {};
          this._webSocket.close();
        }
      },
      
      _tryReconnect: function (attemptsLeft) {
        if (this._useWebSocket) {
          this._webSocket = this._openWebSocket(this._webSocket.url);
          
          CKEDITOR.tools.setTimeout(function () {
            if (this._webSocket.readyState === this._webSocket.OPEN) {
              this._webSocket.onmessage = CKEDITOR.tools.bind(this._onWebSocketMessage, this);
              this._webSocket.onclose = CKEDITOR.tools.bind(this._onWebSocketClose, this);
              this._editor.fire("CoOPS:Reconnect");
            } else {
              if (attemptsLeft <= 0) {
                this._editor.fire("CoOPS:Error", {
                  severity: "CRITICAL",
                  message: "Could not reconnect to server. Please try again later"
                });
              } else {
                this._tryReconnect(attemptsLeft - 1);
              }
            }
          }, this._editor.config.coops.reconnectTime||3000, this);
        } else {
          CKEDITOR.tools.setTimeout(function () {
            this._ioHandler.get(this._editor.config.coops.serverUrl + '/update', [{name: "sessionId", value: this._sessionId }, { name: "revisionNumber", value: this._revisionNumber }], CKEDITOR.tools.bind(function (status, responseJson, responseText) {
              if ((status === 200) || (status === 204)) {
                this._startUpdatePolling();
                this._editor.fire("CoOPS:Reconnect");
              } else {
                if (attemptsLeft <= 0) {
                  this._editor.fire("CoOPS:Error", {
                    severity: "CRITICAL",
                    message: "Could not reconnect to server. Please try again later"
                  });
                } else {
                  this._tryReconnect(attemptsLeft - 1);
                }
              }
            }, this));
          }, this._editor.config.coops.reconnectTime||3000, this);
        }
      },
      
      _onConnectionLost: function (event) {
        this._tryReconnect((this._editor.config.coops.maxReconnections||3) - 1);
      },
      
      _onWebSocketOpen: function (event) {
        this._startListening();
      },
      
      _onWebSocketClose: function (event) {
        if (!this._leavingPage) {
          this._editor.fire("CoOPS:ConnectionLost", {
            message: "Lost connection to server, trying to reconnect..."
          });
        }
      },
      
      _onWebSocketMessage: function (event) {
        var message = JSON.parse(event.data);
        if (message && message.type) {
          switch (message.type) {
            case 'update':
              if (message.data) {
                this._applyPatch(message.data);
              }
            break;
            case 'patchRejected':
              this._editor.fire("CoOPS:PatchRejected", {
                reason: message.data.message
              });
            break;
            case 'patchError':
              this._editor.fire("CoOPS:Error", {
                severity: "SEVERE",
                message: "Received a patch error: " + message.data.message
              });
            break;
            default:
              this._editor.fire("CoOPS:Error", {
                severity: "CRITICAL",
                message: "Unknown WebSocket message " + message.type + ' received'
              });
            break;
          }
        } else {
          this._editor.fire("CoOPS:Error", {
            severity: "WARNING",
            message: "Invalid WebSocket message received"
          });
        }
      },
      
      _openWebSocket: function (url) {
        if ((typeof window.WebSocket) !== 'undefined') {
          return new WebSocket(url);
        } else if ((typeof window.MozWebSocket) !== 'undefined') {
          return new MozWebSocket(url);
        }
        
        return null;
      },
      
      _startListening: function () {
        this._editor.on("CoOPS:ContentPatch", this._onContentPatch, this);
        this._editor.on("CoOPS:ContentRevert", this._onContentRevert, this);
        this._editor.on("propertiesChange", this._onPropertiesChange, this);
        this._editor.on("CoOPS:ExtensionPatch", this._onExtensionPatch, this);
      },

      _sendPatch: function (patch, properties, extensions) {
        if (this._useWebSocket) {
          this._webSocket.send(JSON.stringify({
            type: 'patch',
            data: { patch: patch, properties: properties, extensions: extensions, revisionNumber : this._revisionNumber, sessionId: this._sessionId }
          }));
        } else {
          this._ioHandler.patch(this._editor.config.coops.serverUrl, { patch: patch, properties: properties, extensions: extensions, revisionNumber : this._revisionNumber, sessionId: this._sessionId  }, CKEDITOR.tools.bind(function (status, responseJson, responseText) {
            switch (status) {
              case 204:
              break;
              case 409:
                this._editor.fire("CoOPS:PatchRejected", {
                  reason: "Patch rejected"
                });
              break;
              default:
                this._editor.fire("CoOPS:Error", {
                  severity: "SEVERE",
                  message: "Patching failed on unknown error"
                });
              break;
            }
            
          }, this));
        }
        
        this._editor.fire("CoOPS:PatchSent");
      },
      
      _fileJoin: function (algorithms, protocolVersion, callback) {
        var parameters = [];
        for (var i = 0, l = algorithms.length; i < l; i++) {
          parameters.push({
            name: 'algorithm',
            value: algorithms[i]
          });
        }
        
        parameters.push({
          name: 'protocolVersion',
          value: protocolVersion
        });
      
        var url = this._editor.config.coops.serverUrl + '/join';
  
        this._ioHandler.get(url, parameters, callback);
      },
      
      _startUpdatePolling: function () {
        this._pollUpdates();
      },
      
      _stopUpdatePolling: function () {
        if (this._timer) {
          clearTimeout(this._timer);
        }

        this._timer = null;
      },
      
      _checkUpdates: function (callback) {
        var url = this._editor.config.coops.serverUrl + '/update';
        this._ioHandler.get(url, [{name: "sessionId", value: this._sessionId }, { name: "revisionNumber", value: this._revisionNumber }], CKEDITOR.tools.bind(function (status, responseJson, responseText) {
          if (status === 0) {
            this._stopUpdatePolling();
            if (!this._leavingPage) {
              this._editor.fire("CoOPS:ConnectionLost", {
                message: "Lost connection to server, trying to reconnect..."
              });
            }
          } else {
            if (status === 200) {
              this._applyPatches(responseJson);
            } else if ((status !== 204) && (status !== 304)) {
              this._editor.fire("CoOPS:Error", {
                severity: "WARNING",
                message: "Failed to synchronize collaborator changes from the server"
              });
            }
            
            if (callback) {
              callback();
            }
          }
        }, this));
      },
      
      _pollUpdates : function() {
        this._checkUpdates(CKEDITOR.tools.bind(function () {
          this._timer = CKEDITOR.tools.setTimeout(this._pollUpdates, 500, this);
        }, this));
      },
      
      _applyPatches: function (patches) {
        var patch = patches.splice(0, 1)[0];
        this._applyPatch(patch, CKEDITOR.tools.bind(function () {
          if (patches.length > 0) {
            this._applyPatches(patches);
          }
        }, this));
      },
      
      _applyPatch: function (patch, callback) {
        if (this._sessionId !== patch.sessionId) {
          // Received a patch from other client
          this._revisionNumber = patch.revisionNumber;
          if (this._editor.fire("CoOPS:PatchReceived", {
            sessionId: patch.sessionId,
            patch : patch.patch,
            checksum: patch.checksum,
            revisionNumber: patch.revisionNumber,
            properties: patch.properties,
            extensions: patch.extensions,
          })) {
            if (callback) {
              callback();
            }
          }
        } else {
          // Our patch was accepted, yay!
          this._revisionNumber = patch.revisionNumber;
          var patchData = this._patchData[this._revisionNumber]||{};

          this._editor.fire("CoOPS:PatchAccepted", {
            revisionNumber: this._revisionNumber,
            content: patchData.content,
            properties: patchData.properties,
            extensions: patchData.extensions
          });
          
          delete this._patchData[this._revisionNumber];
          
          if (callback) {
            callback();
          }
        }
      }
    }
  });
  
  CKEDITOR.plugins.add('coops-connector', {
    requires : [ 'coops' ],
    init : function(editorInstance) {
      
      editorInstance.on('CoOPS:BeforeJoin', function(event) {
        event.data.addConnector(new DefaultConnector(event.editor));
      });

    }
  });
  
}).call(this);