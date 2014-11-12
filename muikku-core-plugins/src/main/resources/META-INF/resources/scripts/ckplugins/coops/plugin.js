(function() {
  /* global CKEDITOR, CoOps:true */
  
  var PROTOCOL_VERSION = '1.0.0';
  
  CoOps = CKEDITOR.tools.createClass({
    $: function(editor) {
      this._editor = editor;
      this._savedContent = null;
      this._rnrTimeout = null;
      
      if (this._editor.config.coops.readOnly !== true) {
        this._editor.on('contentChange', this._onContentChange, this);
        this._editor.on('propertiesChange', this._onPropertiesChange, this);
      }
      
      this._editor.on('CoOPS:SessionStart', this._onSessionStart, this);
      this._editor.on('CoOPS:ContentPatch', this._onContentPatch, this);
      this._editor.on('CoOPS:ContentRevert', this._onContentRevert, this);
      this._editor.on('CoOPS:PatchSent', this._onPatchSent, this);
      this._editor.on('CoOPS:PatchAccepted', this._onPatchAccepted, this);
      this._editor.on('CoOPS:PatchMerged', this._onPatchMerged, this);
      this._editor.on('CoOPS:PatchRejected', this._onPatchRejected, this);
      this._editor.on('CoOPS:ContentReverted', this._onContentReverted, this);
      this._editor.on('CoOPS:PatchApplied', this._onPatchApplied, this);
      this._editor.on("CoOPS:Joined", this._onJoined, this);
      this._editor.on("CoOPS:ConnectionLost", this._onConnectionLost, this);
      this._editor.on("CoOPS:Reconnect", this._onReconnect, this);
    },
    proto : {
      getEditor: function () {
        return this._editor;
      },
      
      isLocallyChanged: function () {
        return this.getUnsavedContent() !== this._savedContent;
      },
      
      getUnsavedContent: function () {
        return this._editor.getData().replace(/\n/g,"");
      },
      
      getSavedContent: function () {
        return this._savedContent;
      },
      
      setSavedContent: function (savedContent) {
        this._savedContent = savedContent;
      },
      
      log: function (message) {
        if (this._editor.config.coops.log) {
          this._editor.config.coops.log(message);
        } else if (window.console) {
          console.log(message);
        }
      },
      
      _resetAndResume: function (timeout) {
        if (this._rnrTimeout) {
          clearTimeout(this._rnrTimeout);
          this._rnrTimeout = null;
        }
        
        this._rnrTimeout = CKEDITOR.tools.setTimeout(function() {
          var unsavedContent = this.getUnsavedContent();
          this._editor.getChangeObserver().reset(unsavedContent);
          this._editor.getChangeObserver().resume();
          
          if (this.isLocallyChanged()) {
            this._editor.fire("CoOPS:ContentDirty", {
              unsavedContent: unsavedContent,
              savedContent: this.getSavedContent()
            });
          }
          
          this._rnrTimeout = null;
        }, timeout||0, this);
      },
      
      _onContentChange: function (event) {
        if (this.isLocallyChanged()) {
          this._editor.fire("CoOPS:ContentDirty", {
            unsavedContent: this.getUnsavedContent(),
            savedContent: this.getSavedContent()
          });
        }
      },
      
      _onSessionStart: function (event) {
        this.setSavedContent(this.getUnsavedContent());
      },
      
      _onContentPatch: function (event) {
        this._editor.getChangeObserver().pause();
      },
      
      _onContentRevert: function (event) {
        this._editor.getChangeObserver().pause();
      },
      
      _onPropertiesChange: function (event) {
        this._editor.getChangeObserver().pause();
      },
      
      _onPatchSent: function (event) {
        this._editor.getChangeObserver().pause();
      },
      
      _onPatchAccepted: function (event) {
        if (event.data.content !== undefined) {
          this.setSavedContent(event.data.content);
        }
        this._resetAndResume(100);
      },
      
      _onPatchMerged: function (event) {
        this.setSavedContent(event.data.patched);
        this._resetAndResume();
      },
      
      _onPatchRejected: function (event) {
        this._resetAndResume(1000);
      },
      
      _onContentReverted: function (event) {
        this.setSavedContent(event.data.content);
        this._resetAndResume();
      },
      
      _onPatchApplied: function (event) {
        this.setSavedContent(event.data.content);
      },
      
      _onJoined: function (event) {
        var content = event.data.content;
        
        this._editor.getChangeObserver().pause();
        this._editor.getSelection().removeAllRanges();
        
        var connected = false;
        var beforeStartEvent = {
          joinData: event.data,
          isConnected: function () {
            return connected;
          },
          markConnected: function () {
            connected = true;
          }
        };

        this._editor.fire("CoOPS:BeforeSessionStart", beforeStartEvent);

        if (beforeStartEvent.isConnected()) {
          this._editor.setData(content, function () {
            if (this.config.coops.readOnly !== true) {
              this.getChangeObserver().reset(content);
              this.getChangeObserver().resume();
              this.setReadOnly(false);
            }
              
            this.fire("CoOPS:SessionStart");
          });
        } else {
          this._editor.fire("CoOPS:Error", {
            severity: "CRITICAL",
            message: "Could not connect to CoOPS Server"
          });
        }
      },
      
      _onConnectionLost: function (event) {
        this._editor.setReadOnly(true);
      },
      
      _onReconnect: function (event) {
        if (this._editor.config.coops.readOnly !== true) {
          this._editor.setReadOnly(false);
        }
      }
    }
  });
  
  CKEDITOR.plugins.add( 'coops', {
    requires: ['change'],
    onLoad : function() {
      CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
        getCoOps: function () {
          return this._coOps;
        }
      });
    },
    init: function( editor ) {  
      editor.on( 'instanceReady', function(event) {
        this._coOps = new CoOps(this);

        var algorithms = new Array();
        var connectors = new Array();
        
        var beforeJoinEvent = {
          addAlgorithm: function (algorithm) {
            algorithms.push(algorithm);
          },
          addConnector: function (connector) {
            connectors.push(connector);
          }
        };
        
        this.fire("CoOPS:BeforeJoin", beforeJoinEvent);

        var algorithmNames = new Array();
        
        for (var i = 0, l = algorithms.length; i < l; i++) {
          algorithmNames.push(algorithms[i].getName());
        }
        
        this.fire("CoOPS:Join", {
          protocolVersion: PROTOCOL_VERSION,
          algorithms: algorithmNames
        });
      });
  
    }
  });
  
}).call(this);