(function() {
  /* global CKEDITOR, diff_match_patch, Fmes, hex_md5, InternalPatch, DmpDifferenceAlgorithm:true */
    
  DmpDifferenceAlgorithm = CKEDITOR.tools.createClass({
    $: function(editor) {
      if ((typeof diff_match_patch) === 'undefined') {
        throw new Error('diff_match_patch is missing');
      }

      if ((typeof Fmes) === 'undefined') {
        throw new Error('Fmes is missing');
      }

      if ((typeof hex_md5) === 'undefined') {
        throw new Error('hex_md5 is missing');
      }
      
      this._editor = editor;
      
      this._pendingPatches = [];
      this._contentCooldownTime = 200;
      this._contentCoolingDown = false;

      editor.on("CoOPS:SessionStart", this._onSessionStart, this);
    },
    proto : {
      getName: function () {
        return "dmp";
      },
      
      _createChecksum: function (value) {
        return hex_md5(value);
      },
      
      _removeLineBreaks: function (data) {
        return (data||'').replace(/\n/g,"");
      },
      
      _onSessionStart: function (event) {
        this._diffMatchPatch = new diff_match_patch();
        this._fmes = new Fmes();
        
        this._editor.on("CoOPS:ContentDirty", this._onContentDirty, this);
        this._editor.on("CoOPS:PatchReceived", this._onPatchReceived, this);
        this._editor.on("CoOPS:RevertedContentReceived", this._onRevertedContentReceived, this);
      },
      
      _emitContentPatch: function (oldContent, newContent) {
        var diff = this._diffMatchPatch.diff_main(oldContent, newContent);
        this._diffMatchPatch.diff_cleanupEfficiency(diff);
        var patch = this._diffMatchPatch.patch_toText(this._diffMatchPatch.patch_make(oldContent, diff));

        this._editor.fire("CoOPS:ContentPatch", {
          patch: patch,
          oldContent: oldContent,
          newContent: newContent
        });
      },
    
      _onContentDirty: function (event) {
        this._emitContentPatch(event.data.savedContent, event.data.unsavedContent);
      },
      
      _applyChanges: function (newText) {
        // TODO: cross-browser support for document creation
        var text = this._editor.getCoOps().getUnsavedContent();

        if (!text) {
          // We do not have old content so we can just directly set new content as editor data
          this._editor.setData(newText);
        } else {
          try {
            // Read original and patched texts into html documents
            var document1 = document.implementation.createHTMLDocument('');
            var document2 = document.implementation.createHTMLDocument('');
            document1.documentElement.innerHTML = this._editor.dataProcessor.toHtml( text );
            document2.documentElement.innerHTML = this._editor.dataProcessor.toHtml( newText );
  
            // Create delta of two created documents
            var delta = this._fmes.diff(document1, document2);
            
            // And apply delta into a editor
            (new InternalPatch()).apply(this._editor.document.$, delta);
            this._editor._.data = this._editor.dataProcessor.toHtml(this._editor.document.getBody().$.innerHTML);
            
            if (this._editor.config.coops.mode === 'development') {
              var newTextChecksum = this._createChecksum(newText);
              var patchedText = this._editor.getCoOps().getUnsavedContent();
              var patchedDataChecksum = this._createChecksum(patchedText);
              if (newTextChecksum !== patchedDataChecksum) {
                this._editor.getCoOps().log(["Patching Failed", newText, patchedText]);
                throw new Error("Patching failed");
              }
            }
          } catch (e) {
            this._editor.getCoOps().log(["DiffXmlJs patching failed", newText]);
            this._editor.setData(newText);
          }
        }
      },
      
      _lockEditor: function () {
        var body = this._editor.document.getBody();
        if (!body.isReadOnly()) {
          body.data('cke-editable', 1);
        } else {
          body.data('was-readonly', 1);
        }
        
        this._editor.getChangeObserver().pause();
      },
      
      _unlockEditor: function () {
        var body = this._editor.document.getBody();
        if (body.data('was-readonly')) {
          body.data('was-readonly', false);
        } else {
          body.data('cke-editable', false);
        }
        
        this._editor.getChangeObserver().reset();
        this._editor.getChangeObserver().resume();
      },
      
      _isPatchApplied: function (patchResult) {
        for (var j = 0, jl = patchResult[1].length; j < jl; j++) {
          if (!patchResult[1][j]) {
            return false;
          }
        }
        
        return true;
      },
      
      _threeWayMerge: function (v0, v1, v2) {
        var mergePatches = this._diffMatchPatch.patch_make(v0, v2);
        return this._diffMatchPatch.patch_apply(mergePatches, v1);
      },
      
      _applyPatch: function (patch, patchChecksum, revisionNumber) {
        this._editor.document.$.normalize();
        var savedContent = this._editor.getCoOps().getSavedContent();
        
        var remoteDiff = this._diffMatchPatch.patch_fromText(patch);
        var removePatchResult = this._diffMatchPatch.patch_apply(remoteDiff, savedContent);
        
        if (this._isPatchApplied(removePatchResult)) {
          var remotePatchedText = this._removeLineBreaks(removePatchResult[0]);
          var remotePatchedChecksum = this._createChecksum(remotePatchedText);
          
          if (patchChecksum !== remotePatchedChecksum) {
            this._editor.getCoOps().log("Reverting document because checksum did not match");
            this._editor.getCoOps().log(["remotePatchedChecksum:", remotePatchedChecksum]);
            this._editor.getCoOps().log(["patchChecksum:", patchChecksum]);
            this._editor.getCoOps().log(["patch:", patch]);
            this._editor.getCoOps().log(["savedContent:", savedContent]);
            this._editor.getCoOps().log(["remotePatchedText:", remotePatchedText]);

            this._editor.fire("CoOPS:ContentRevert");
          } else {
            var unsavedContent = this._editor.getCoOps().getUnsavedContent();
            
            if (remotePatchedText === unsavedContent) {
              this._editor.getCoOps().log("Local version equals remotely patched version, no need to apply the patch");
              this._editor.fire("CoOPS:PatchApplied", {
                content: unsavedContent
              });
            } else {
              if (this._editor.getCoOps().isLocallyChanged()) {
                this._editor.getCoOps().log("Applying patch into dirty content, three way merge is required");

                var mergeResult = this._threeWayMerge(savedContent, unsavedContent, remotePatchedText);
                if (!this._isPatchApplied(mergeResult)) {
                  this._editor.getCoOps().log("Patch merging failed. Trying another way around");
                  mergeResult = this._threeWayMerge(savedContent, remotePatchedText, unsavedContent);
                }
                
                if (!this._isPatchApplied(mergeResult)) {
                  this._editor.getCoOps().log("Patch merging failed, reverting local changes");
                  this._applyChanges(remotePatchedText);
                  this._editor.fire("CoOPS:PatchApplied", {
                    content : remotePatchedText
                  });
                } else {
                  var mergedContent = this._removeLineBreaks(mergeResult[0]);
                  this._applyChanges(mergedContent);
                  this._editor.fire("CoOPS:PatchMerged", {
                    patched : remotePatchedText,
                    merged: mergedContent
                  });
                }
              } else {
                this._editor.getCoOps().log("Applying patch");
                this._applyChanges(remotePatchedText);
                this._editor.fire("CoOPS:PatchApplied", {
                  content : remotePatchedText
                });
              }
            }
          }
          
        } else {
          this._editor.getCoOps().log("Reverting document because could not apply the patch");
          this._editor.fire("CoOPS:ContentRevert");
        }
      },

      _applyNextPatch: function () {
        if (this._pendingPatches.length > 0) {
          // First we lock the editor, so we can do some magic without 
          // outside interference
          
          this._lockEditor();

          var pendingPatch = this._pendingPatches.shift();
          this._applyPatch(pendingPatch.patch, pendingPatch.patchChecksum, pendingPatch.revisionNumber);
          this._applyNextPatch();
        } else {
          this._unlockEditor();
        }
      },

      _onPatchReceived: function (event) {
        var patch = event.data.patch;
        var patchChecksum = event.data.checksum;
        var revisionNumber = event.data.revisionNumber;
        
        if (patch && patchChecksum) {
          this._pendingPatches.push({
            patch: patch,
            patchChecksum: patchChecksum,
            revisionNumber: revisionNumber
          });
        }

        this._applyNextPatch();
      },
      
      _onRevertedContentReceived: function (event) {
        var revertedContent = event.data.content;
        
        this._applyChanges(revertedContent);
        
        this._editor.fire("CoOPS:ContentReverted", {
          content : revertedContent
        });
      }
    }
  });
  
  CKEDITOR.plugins.add( 'coops-dmp', {
    requires: ['coops'],
    init: function( editor ) {
      editor.on('CoOPS:BeforeJoin', function(event) {
        event.data.addAlgorithm(new DmpDifferenceAlgorithm(event.editor));
      });
    }
  });

}).call(this);