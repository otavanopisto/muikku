(function() {
  /* global CKEDITOR, CoOpsSessionEvents: true */
    
  CoOpsSessionEvents = CKEDITOR.tools.createClass({
    $: function(editor) {
      this._editor = editor;
      this._editor.on("CoOPS:SessionStart", this._onSessionStart, this);
      this._editor.on("CoOPS:BeforeSessionStart", this._onBeforeSessionStart, this);
      this._initialSessionEvents = null;
    },
    proto : {
      
      _onBeforeSessionStart: function (event) {
        this._initialSessionEvents = event.data.joinData.extensions.sessionEvents;
      },
      
      _onSessionStart: function (event) {
        if (this._initialSessionEvents) {
          this._handleSessionEvents(this._initialSessionEvents);
          this._initialSessionEvents = null;
        }
        
        this._editor.on("CoOPS:PatchReceived", this._onPatchReceived, this, null, 9999);
      },

      _onPatchReceived: function (event) {
        var data = event.data;
        var sessionId = event.data.sessionId;
        
        if (data.extensions && data.extensions.sessionEvents) {
          this._handleSessionEvents(data.extensions.sessionEvents);
        }
      },
      
      _handleSessionEvents: function (sessionEvents) {
        for (var i = 0, l = sessionEvents.length; i < l; i++) {
          var sessionEvent = sessionEvents[i];
          switch (sessionEvent.status) {
            case 'OPEN':
              this._editor.fire("CoOPS:CollaboratorJoined", {
                displayName: sessionEvent.displayName,
                email: sessionEvent.email,
                sessionId: sessionEvent.sessionId
              });
            break;
            case 'CLOSE':
              this._editor.fire("CoOPS:CollaboratorLeft", {
                displayName: sessionEvent.displayName,
                email: sessionEvent.email,
                sessionId: sessionEvent.sessionId
              });
            break;
          }
        }
      }
    }
  });
  
  CKEDITOR.plugins.add( 'coops-sessionevents', {
    requires: ['coops'],
    init: function( editor ) {
      editor.on('CoOPS:BeforeJoin', function(event) {
        /*jshint es5:false, nonew: false */
        new CoOpsSessionEvents(event.editor);
        /*jshint nonew: true */
      });
    }
  });

}).call(this);