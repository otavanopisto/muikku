(function() {
  /* global CKEDITOR, CoOpsCursors: true */
    
  CoOpsCursors = CKEDITOR.tools.createClass({
    $: function(editor) {
      this._editor = editor;
      this._lastDispatched = null;
      this._lastSaved = null;
      this._colorIterator = 0;
      this._svgAnimateIterator = 0;
      this._colors = this._createCursorColors(64);
      this._clientSelections = {};
      this._editor.on("CoOPS:SessionStart", this._onSessionStart, this);
    },
    proto : {
      
      _onSessionStart: function () {
        this._editor.on("selectionChange", this._onSelectionChange, this);
        this._editor.on("CoOPS:PatchReceived", this._onPatchReceived, this, null, 9999);
        this._editor.on("CoOPS:PatchRejected", this._onPatchRejected, this, null, 9999);
        this._editor.on("CoOPS:PatchAccepted", this._onPatchAccepted, this, null, 9999);
        this._editor.on("CoOPS:PatchApplied", this._onPatchApplied, this, null, 9999);
        this._editor.on("CoOPS:PatchMerged", this._onPatchMerged, this, null, 9999);
        
        this._editor.document.on("mouseup", this._onDocumentMouseUp, this);
        this._editor.on("key", this._onEditorKey, this);
      },
      
      _onDocumentMouseUp: function (event) {
        this._checkSelection();
      },
      
      _onEditorKey: function (event) {
        this._checkSelection();
      },
      
      _onSelectionChange: function (event) {
        this._checkSelection();
        this._dispatchSelectionChanges(this._createDispatchableSelection(this._editor.getSelection()));
      },
      
      _onPatchRejected: function (event) {
        this._lastDispatched = null;
      },
      
      _onPatchAccepted: function (event) {
        if (event.data.extensions && event.data.extensions.ckcur) {
          this._lastSaved = this._lastDispatched;
        }
        
        CKEDITOR.tools.setTimeout(function() {
          this._checkSelection();
          this._dispatchSelectionChanges(this._createDispatchableSelection(this._editor.getSelection()));
        }, 2000, this);
      },
      
      _onPatchReceived: function (event) {
        var data = event.data;
        var sessionId = event.data.sessionId;

        var clientSelection = this._clientSelections[sessionId];
        if (!clientSelection) {
          clientSelection = this._clientSelections[sessionId] = {
            color: this._nextColor(),
            ranges: []
          };
        } else {
          clientSelection.ranges = [];
        }
        
        if (data.extensions && data.extensions.ckcur && data.extensions.ckcur.selections) {
          var selections = data.extensions.ckcur.selections;
          for (var i = 0, l = selections.length; i < l; i++) {
            var selection = selections[i];
            var startContainer = this._findNodeByXPath(selection.startContainer);
            var startOffset = selection.startOffset;
            var endOffset = selection.endOffset;
            
            try {
              var range = new CKEDITOR.dom.range( this._editor.document );
              range.setStart(startContainer, startOffset);
              
              if (selection.collapsed) {
                range.setEnd(startContainer, endOffset);
              } else {
                var endContainer = this._findNodeByXPath(selection.endContainer);
                range.setEnd(endContainer, endOffset);
              }
              
              clientSelection.ranges.push(range);
            } catch (e) {
              throw e;
            }
          }
        }
        
        this._drawClientSelections();
        this._checkSelection();
        this._dispatchSelectionChanges(this._createDispatchableSelection(this._editor.getSelection()));
      },
      
      _onPatchApplied: function (event) {
        this._drawClientSelections();
      },
      
      _onPatchMerged: function (event) {
        this._drawClientSelections();
      },
      
      _createDispatchableSelection: function (selection) {
        var result = null;
        if (selection) {
          var ranges = selection.getRanges();
          if (ranges.length > 0) {
            result = [];
            
            for ( var i = 0, l = ranges.length; i < l; i++) {
              var range = ranges[i];
              
              var startContainer = this._createXPath(range.startContainer);
              
              if (range.collapsed) {
                result.push({
                  collapsed: range.collapsed,
                  startContainer: startContainer,
                  startOffset: range.startOffset,
                  endOffset: range.endOffset
                });
              } else {
                var endContainer = this._createXPath(range.endContainer);
                result.push({
                  collapsed: range.collapsed,
                  startContainer: startContainer,
                  startOffset: range.startOffset,
                  endContainer: endContainer,
                  endOffset: range.endOffset
                });
              }
            }
          }
        }
        
        return result;
      },

      _dispatchSelectionChanges: function (dispatchable) {
        if (this._editor.readOnly || !dispatchable) {
          return;
        }
        
        if ((this._lastDispatched && this._dispatchablesEqual(this._lastDispatched, dispatchable)) || (this._lastSaved && this._dispatchablesEqual(this._lastSaved, dispatchable))) {
          return;
        }

        this._editor.fire('CoOPS:ExtensionPatch', {
          extensions : {
            ckcur : {
              selections : dispatchable
            }
          }
        });
        
        this._lastDispatched = dispatchable;
      },
      
      _dispatchablesEqual: function (d1, d2) {
        if (d1.length === d2.length) {
          for (var i = 0, l = d1.length; i < l; i++) {
            if ((d1[i].startOffset !== d2[i].startOffset)||
                (d1[i].endOffset !== d2[i].endOffset)||
                (d1[i].startContainer !== d2[i].startContainer)||
                (d1[i].collapsed !== d2[i].collapsed)||
                (d1[i].endContainer !== d2[i].endContainer)) {
              return false;
            }
          }
          
          return true;
        }

        return false;
      },
      
      _checkSelection: function () {
        this._editor.forceNextSelectionCheck();
        this._editor.selectionChange();
      },
      
      _cssColor: function (color, alpha) {
        if (alpha === 1) {
          return '#' + color[0].toString(16) + color[1].toString(16) + color[2].toString(16);
        } else {
          return 'rgba(' + color.join(',') + ',' + alpha + ')';
        }
      },

      _nextColor: function () {
        this._colorIterator = (this._colorIterator + 1) % this._colors.length;
        return this._colors[this._colorIterator];
      },
      
      _createCursorColors: function (step) {
        var colors = [];

        for ( var r = 255; r >= 0; r -= step) {
          for ( var g = 255; g >= 0; g -= step) {
            for ( var b = 255; b >= 0; b -= step) {
              r = Math.max(r, 0);
              g = Math.max(g, 0);
              b = Math.max(b, 0);

              if ((!(r === 0 && g === 0 && b === 0)) && (!(r === 255 && g === 255 && b === 255))) {
                colors.push([ r, g, b ]);
              }
            }
          }
        }

        colors.sort(function(a, b) {
          var ad = Math.abs(a[0] - a[1]) + Math.abs(a[1] - a[2]) + Math.abs(a[0] - a[2]);
          var bd = Math.abs(b[0] - b[1]) + Math.abs(b[1] - b[2]) + Math.abs(b[0] - b[2]);
          return bd - ad;
        });
        
        return colors;
      },
      
      _findNodeByXPath : function(xpath) {
        var document = this._editor.document.$;
        var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
        return new CKEDITOR.dom.node(result.iterateNext());
      },
      
      _createXPath: function(node) {
        if (node.type === CKEDITOR.NODE_DOCUMENT) {
          return "/";
        } else {
          var parent = node.getParent();
          if (!parent) {
            return "/node()[" + (node.getIndex(true) + 1) + "]";
          } else {
            return this._createXPath(parent) + "/node()[" + (node.getIndex(true) + 1) + "]";
          }
        }
        
        return null;
      },
      
      _createBoxes: function (range) {
        var selectionBoxes = [];
        try {
          var nativeRange = this._editor.document.$.createRange();
          if (range.collapsed) {
            if (range.startContainer.type === CKEDITOR.NODE_ELEMENT && (range.startOffset === range.endOffset) && (!range.startContainer.getChild(range.endOffset))) {
              var walkerRange = new CKEDITOR.dom.range(range.startContainer);
              walkerRange.selectNodeContents(range.startContainer);
              var walker = new CKEDITOR.dom.walker(walkerRange);
              walker.evaluator = function( node ) {
                return node.type === CKEDITOR.NODE_TEXT;
              };
              var lastTextNode = walker.lastForward();
              if (lastTextNode) {
                nativeRange.setStart(lastTextNode.$, lastTextNode.getLength());
                nativeRange.setEnd(lastTextNode.$, lastTextNode.getLength());
              } else {
                return [];
              }
              
            } else {
              nativeRange.setStart(range.startContainer.$, range.startOffset);
              nativeRange.setEnd(range.startContainer.$, range.endOffset);
            }
            
            var boundingBox = nativeRange.getBoundingClientRect();
            var scrollPosition = this._editor.window.getScrollPosition();
            selectionBoxes.push({
              top: Math.floor(boundingBox.top) + scrollPosition.y,
              left: Math.floor(boundingBox.left) + scrollPosition.x,
              width: 1,
              height: Math.ceil(boundingBox.height)
            });
          } else {
            var walker = new CKEDITOR.dom.walker(range);
            walker.evaluator = function( node ) {
              return node.type === CKEDITOR.NODE_TEXT;
            };
            
            var node;
            while ((node = walker.next())) {
              if (node.equals(range.startContainer)) {
                nativeRange.setStart(node.$, range.startOffset);
              } else {
                nativeRange.setStartBefore(node.$);
              }
            
              if (node.equals(range.endContainer)) {
                nativeRange.setEnd(node.$, range.endOffset);
              } else {
                nativeRange.setEndAfter(node.$);
              }
  
              var boundingBox = nativeRange.getBoundingClientRect();
              var scrollPosition = this._editor.window.getScrollPosition();
              if (boundingBox.height > 0 && boundingBox.width > 0) {
                selectionBoxes.push({
                  top: Math.floor(boundingBox.top) + scrollPosition.y,
                  left: Math.floor(boundingBox.left) + scrollPosition.x,
                  width: Math.ceil(boundingBox.width),
                  height: Math.ceil(boundingBox.height)
                });
              }
            }
          }
        } catch (e) {
          this._editor.getCoOps().log("Could not create selection boxes:" + e);
        }
        
        return selectionBoxes;
      },
      
      _svgRect: function(x, y, width, height, animate, color, alpha) {
        var result = '<rect x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" style="fill:' + this._cssColor(color, alpha) + '">';
        if (animate) {
          var id = String(this._svgAnimateIterator++);
          result += '<animate id="o' + id + '" attributeName="opacity" from="1" to="0" dur="0.5s" begin="0s;i' + id + '.end" />';
          result += '<animate id="i' + id + '" attributeName="opacity" from="0" to="1" dur="0.5s" begin="o' + id + '.end" />';
        }
        result += '</rect>';
        return result;
      },
      
      _drawClientSelections: function () {
        var clients = CKEDITOR.tools.objectKeys(this._clientSelections);
        var boxedSelections = [];
        
        for (var i = 0, l = clients.length; i < l; i++) {
          var clientSelection = this._clientSelections[clients[i]];
          for (j = clientSelection.ranges.length - 1; j >= 0; j--) {
            var range = clientSelection.ranges[j];
            if (!range.startContainer || !range.startContainer.$) {
              // Selection is no longer valid, so we drop it out
              clientSelection.ranges.splice(j, 1);
            } else {
              boxedSelections.push({
                color: clientSelection.color,
                boxes: this._createBoxes(clientSelection.ranges[j])
              });
            }
          }
        }
        
        var drawMode = (this._editor.config.coops.cursors||{}).drawMode;
        if (!drawMode) {
          drawMode = 'SVG';
        }
        
        switch (drawMode) {
          case 'SVG':
            var svgDimensions = this._boxedSelectionsDimensions(boxedSelections);
            var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='" + svgDimensions.width + "' height='" + svgDimensions.height + "'>";
            for (var i = 0, l = boxedSelections.length; i < l; i++) {
              var boxedSelection = boxedSelections[i];
              for (var j = 0, jl = boxedSelection.boxes.length; j < jl; j++) {
                var box = boxedSelection.boxes[j];
                if (box.width === 1) {
                  svg += this._svgRect(box.left, box.top, box.width, box.height, true, boxedSelection.color, 1);
                  svg += this._svgRect(box.left - 2, box.top - 5, 5, 5, true, boxedSelection.color, 1);
                } else {
                  svg += this._svgRect(box.left, box.top, box.width, box.height, false, boxedSelection.color, 0.5);
                }
              }
            }
            svg += '</svg>';
                      
            this._editor.document.getBody().setStyles({
              'background-image': 'url(data:image/svg+xml;base64,' + btoa(svg) + ')',
              'background-repeat': 'no-repeat',
              'background-position': 'top left'
            });
          break;
          case 'CANVAS':
            var canvasDimensions = this._boxedSelectionsDimensions(boxedSelections);
            if (!this._canvas) {
              this._canvas = document.createElement('canvas');
            }
            
            this._canvas.height = canvasDimensions.height;
            this._canvas.width = canvasDimensions.width;
            var ctx = this._canvas.getContext("2d");
            
            for (var i = 0, l = boxedSelections.length; i < l; i++) {
              var boxedSelection = boxedSelections[i];
              ctx.fillStyle = boxedSelection.color;
              for (var j = 0, jl = boxedSelection.boxes.length; j < jl; j++) {
                var box = boxedSelection.boxes[j];
                ctx.fillRect(box.left, box.top, box.width, box.height);
              }
            }
            
            this._editor.document.getBody().setStyles({
              'background-image': (canvasHeight > 0) && (canvasWidth > 0) ? 'url(' + this._canvas.toDataURL() + ')' : 'none',
              'background-repeat': 'no-repeat',
              'background-position': 'top left'
            });
          break;
        }
      },
      
      _boxedSelectionsDimensions: function (boxedSelections) {
        var height = 0;
        var width = 0;
        for (var i = 0, l = boxedSelections.length; i < l; i++) {
          var boxedSelection = boxedSelections[i];
          for (var j = 0, jl = boxedSelection.boxes.length; j < jl; j++) {
            var box = boxedSelection.boxes[j];
            height = Math.max(height, box.top + box.height);
            width = Math.max(width, box.left + box.width);
          }
        }
        
        return {
          width: width,
          height: height
        };
      },
      
      _drawBoxes: function (selectionBoxes) {
        var canvas = document.createElement('canvas');
        
        if (selectionBoxes.length > 0) {
          var canvasHeight = 0;
          var canvasWidth = 0;
          for (var i = 0, l = selectionBoxes.length; i < l; i++) {
            var selectionBox = selectionBoxes[i];
            canvasHeight = Math.max(canvasHeight, Math.ceil(selectionBox.top + selectionBox.height));
            canvasWidth = Math.max(canvasWidth, Math.ceil(selectionBox.left + selectionBox.width));
          }
          
          canvas.height = canvasHeight;
          canvas.width = canvasWidth;

          var ctx = canvas.getContext("2d");
     
          for (var j = 0, jl = selectionBoxes.length; j < jl; j++) {
            ctx.fillStyle = selectionBoxes[j].color;
            ctx.fillRect(Math.floor(selectionBoxes[j].left), Math.floor(selectionBoxes[j].top), Math.ceil(selectionBoxes[j].width), Math.ceil(selectionBoxes[j].height));
          }
        }
        
        this._editor.document.getBody().setStyles({
          'background-image': 'url(' + canvas.toDataURL() + ')',
          'background-repeat': 'no-repeat',
          'background-position': 'top left'
        });
      }
      
    }
  });
  
  CKEDITOR.plugins.add( 'coops-cursors', {
    requires: ['coops'],
    init: function( editor ) {
      editor.on('CoOPS:BeforeJoin', function(event) {
        /*jshint es5:false, nonew: false */
        new CoOpsCursors(event.editor);
        /*jshint nonew: true */
      });
    }
  });

}).call(this);