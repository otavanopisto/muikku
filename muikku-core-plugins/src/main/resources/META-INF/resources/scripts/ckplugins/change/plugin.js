/*
 * change - CKEditor plugin for detecting content changes.
 * 
 * Licensed under GNU Lesser General Public License Version 3 or later (the "LGPL")
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Antti Leppä / Foyt
 * antti.leppa@foyt.fi
 * 
 * Fires a contentChange event when editor content changes. 
 */
(function() {
  
  /* global CKEDITOR, ActiveXObject, ChangeObserver:true, PropertyHandler: true  */
  /* global  MutationChangeObserver: true, DOMSubtreeModifiedChangeObserver: true, PollingChangeObserver:true */
  /* global TitlePropertyHandler:true , LangDirPropertyHandler:true, LangCodePropertyHandler:true, CharsetPropertyHandler:true */
  /* global DocTypePropertyHandler:true, TextColorPropertyHandler:true, BackgroundColorPropertyHandler:true */
  /* global BackgroundImagePropertyHandler:true, BackgroundAttachmentPropertyHandler:true, PageMarginPropertyHandler:true, MetaPropertyHandler:true */
  
  /**
   * Base class for change obserers.
   * 
   * @class
   */
  ChangeObserver = CKEDITOR.tools.createClass({
    /**
     * Creates a ChangeObserver class instance.
     * 
     * @constructor
     * @param {CKEDITOR.editor}
     *          editor object observer observes.
     */
    $ : function(editor, propertyHandlers) {
      this._editor = editor;
      this._oldContent = '';
      this._oldProperties = {};
      this._paused = false;
      this._propertyHandlers = propertyHandlers;
    },
    proto : /** @lends ChangeObserver.prototype */
    {
      /**
       * Returns editor observer observes
       * 
       * @returns {CKEDITOR.editor} editor that observer observes
       */
      getEditor : function() {
        return this._editor;
      },
      /**
       * Checks whether editor content has changed and fires a contentChange event if it has.
       * 
       * Event contains oldContent and currentContent properties that contain content before and after the change.
       */
      checkChange : function() {
        if ((!this._paused) && (!this.getEditor().readOnly)) {

          var currentContent = this._getEditorContent();
          var changedProperties = [];
          
          for (var i = 0, l = this._propertyHandlers.length; i < l; i++) {
            var propertyName = this._propertyHandlers[i].getName();
            var propertyValue = this._propertyHandlers[i].getValue(this._editor);
            
            if (this._oldProperties[propertyName] !== propertyValue) {
              changedProperties.push({
                property: propertyName,
                oldValue: this._oldProperties[propertyName],
                currentValue: propertyValue
              });
              
              this._oldProperties[propertyName] = propertyValue;
            }
          }
          
          if (changedProperties.length > 0) {
            this._editor.fire("propertiesChange", {
              properties : changedProperties
            });
          }

          if (this._oldContent !== currentContent) {
            this._oldContent = currentContent;
            this._editor.fire("contentChange", {
              oldContent : this._oldContent,
              currentContent : currentContent,
            });
          }
        }
      },
      /**
       * Stops observer
       */
      disconnect : function() {
      },
      /**
       * Starts observer
       */
      start : function() {
      },
      /**
       * Resets observer state. This means that observer assumes that content has not changed.
       */
      reset : function(content) {
        this._oldContent = content || this._getEditorContent();
        this._oldProperties = this._getPropertyValues();
      },
      /**
       * Pauses observer.
       * 
       * Fires a changeObserverPause event
       */
      pause : function() {
        if (this._editor.fire("changeObserverPause")) {
          this._paused = true;
        }
      },
      /**
       * Resumes observer
       * 
       * Fires a changeObserverResume event
       */
      resume : function() {
        if (this._editor.fire("changeObserverResume")) {
          this._paused = false;
          this.checkChange();
        }
      },
      _getEditorContent : function() {
        // TODO: Why editor.getSnapshot() keeps returning 'true'???
        // TODO: Data should be configurable
        return this.getEditor().getData();
      },
      _getPropertyValues: function () {
        var result = {};
        
        for (var i = 0, l = this._propertyHandlers.length; i < l; i++) {
          var propertyName = this._propertyHandlers[i].getName();
          var propertyValue = this._propertyHandlers[i].getValue(this._editor);
          result[propertyName] = propertyValue;
        }
        
        return result;
      }
    }
  });

  /**
   * Change observer that uses MutationObserver for change detection.
   * 
   * @class
   * @extends ChangeObserver
   */
  MutationChangeObserver = CKEDITOR.tools.createClass({
    base : ChangeObserver,
    /**
     * Creates a MutationChangeObserver class instance.
     * 
     * @constructor
     * @param {CKEDITOR.editor}
     *          editor object observer observes.
     */
    $ : function(editor, propertyHandlers) {
      this.base(editor, propertyHandlers);

      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

      var _this = this;
      this._observer = new MutationObserver(function(mutations) {
        CKEDITOR.tools.setTimeout(function() {
          this.checkChange();
        }, 0, _this);
      });
    },
    proto : /** @lends MutationChangeObserver.prototype */
    {
      /**
       * Starts observer
       */
      start : function() {
        var editorDocument = this._editor.document.$;

        this._observer.observe(editorDocument, {
          attributes : true,
          childList : true,
          characterData : true,
          subtree : true
        });
      },
      /**
       * Stops observer
       */
      disconnect : function() {
        this._observer.disconnect();
        this._observer = undefined;
      }
    }
  });

  /**
   * Change observer that uses DOMSubtreeModified event for change detection.
   * 
   * @class
   * @extends ChangeObserver
   */
  DOMSubtreeModifiedChangeObserver = CKEDITOR.tools.createClass({
    base : ChangeObserver,
    /**
     * Creates a DOMSubtreeModifiedChangeObserver class instance.
     * 
     * @constructor
     * @param {CKEDITOR.editor}
     *          editor object observer observes.
     */
    $ : function(editor, propertyHandlers) {
      this.base(editor, propertyHandlers);

      var _this = this;
      this._domSubtreeModifiedListener = function(event) {
        _this._onDOMSubtreeModified(event);
      };
    },
    proto : /** @lends DOMSubtreeModifiedChangeObserver.prototype */
    {
      /**
       * Starts observer
       */
      start : function() {
        this._editor.document.on("DOMSubtreeModified", this._domSubtreeModifiedListener);
      },
      /**
       * Stops observer
       */
      disconnect : function() {
        this._editor.document.removeListener("DOMSubtreeModified", this._domSubtreeModifiedListener);
      },
      _onDOMSubtreeModified : function(event) {
        CKEDITOR.tools.setTimeout(function() {
          this.checkChange();
        }, 0, this);
      }
    }
  });

  /**
   * Change observer that uses polling for change detection.
   * 
   * @class
   * @extends ChangeObserver
   */
  PollingChangeObserver = CKEDITOR.tools.createClass({
    base : ChangeObserver,
    /**
     * Creates a PollingChangeObserver class instance.
     * 
     * @constructor
     * @param {CKEDITOR.editor}
     *          editor object observer observes.
     */
    $ : function(editor, propertyHandlers) {
      this.base(editor, propertyHandlers);
      this._timer = null;
    },
    proto : /** @lends PollingChangeObserver.prototype */
    {
      /**
       * Starts observer
       */
      start : function() {
        this._poll();
      },
      /**
       * Stops observer
       */
      disconnect : function() {
        if (this._timer) {
          clearTimeout(this._timer);
        }

        this._timer = null;
      },
      _poll : function(event) {
        this.checkChange();
        this._timer = CKEDITOR.tools.setTimeout(this._poll, 333, this);
      }
    }
  });

  /**
   * Base class for all property handlers
   * 
   * @class
   */
  PropertyHandler = CKEDITOR.tools.createClass({
    /**
     * @constructor
     */
    $ : function() {
    },
    proto : {
      /**
       * Returns property value
       * 
       * @param editor
       *          CKEditor instance
       * @returns property value
       */
      getValue : function(editor) {
        throw new Error('not implemented');
      },
      /**
       * Sets new property value
       * 
       * @param editor
       *          CKEditor instance
       * @param value
       *          new value
       */
      setValue : function(editor, value) {
        throw new Error('not implemented');
      },
      /**
       * Returns name of the property handler. This name should be unique because it's used to identify property handler.
       * 
       * @returns name of the property handler.
       */
      getName : function() {
        throw new Error('not implemented');
      }
    }
  });

  TitlePropertyHandler = CKEDITOR.tools.createClass({
    base : PropertyHandler,
    $ : function() {
    },
    proto : {
      getValue : function(editor) {
        return editor.document.getElementsByTag('title').getItem(0).data('cke-title');
      },
      setValue : function(editor, value) {
        editor.document.getElementsByTag('title').getItem(0).data('cke-title', value);
      },
      getName : function() {
        return 'title';
      }
    }
  });

  LangDirPropertyHandler = CKEDITOR.tools.createClass({
    base : PropertyHandler,
    $ : function() {
    },
    proto : {
      getValue : function(editor) {
        return editor.document.getBody().getDirection();
      },
      setValue : function(editor, value) {
        var body = editor.document.getBody();
        if (value) {
          body.setAttribute('dir', value);
        } else {
          body.removeAttribute('dir');
        }
        body.removeStyle('direction');
      },
      getName : function() {
        return 'langDir';
      }
    }
  });

  LangCodePropertyHandler = CKEDITOR.tools.createClass({
    base : PropertyHandler,
    $ : function() {
    },
    proto : {
      getValue : function(editor) {
        var documentElement = editor.document.getDocumentElement();
        var lang = documentElement.getAttribute('xml:lang');
        if (lang) {
          return lang;
        }
        lang = documentElement.getAttribute('lang');
        if (lang) {
          return lang;
        }
        return null;
      },
      setValue : function(editor, value) {
        var documentElement = editor.document.getDocumentElement();
        if (value) {
          documentElement.setAttributes({
            'xml:lang' : value,
            lang : value
          });
        } else {
          documentElement.removeAttributes({
            'xml:lang' : 1,
            lang : 1
          });
        }
      },
      getName : function() {
        return 'langCode';
      }
    }
  });

  CharsetPropertyHandler = CKEDITOR.tools.createClass({
    base : PropertyHandler,
    $ : function() {
    },
    proto : {
      getValue : function(editor) {
        var metas = editor.document.getHead().getElementsByTag('meta');
        for ( var i = 0, l = metas.count(); i < l; i++) {
          var meta = metas.getItem(i);
          if (meta.getAttribute('http-equiv') === "content-type") {
            var content = meta.getAttribute("content");
            if (content.match(/charset=[^=]+$/)) {
              return content.substring(content.indexOf('=') + 1);
            }
            return null;
          }
        }
      },
      setValue : function(editor, value) {
        var content = value ? "text/html; charset=" + value : null;
        var meta;
        
        var metas = editor.document.getHead().getElementsByTag('meta');
        for ( var i = 0, l = metas.count(); i < l; i++) {
          meta = metas.getItem(i);
          if (meta.getAttribute('http-equiv') === "content-type") {
            if (content) {
              meta.setAttribute("content", content);
            } else {
              meta.remove();
            }

            break;
          }
        }

        if (content) {
          meta = new CKEDITOR.dom.element('meta', editor.document);
          meta.setAttribute('http-equiv', 'content-type');
          meta.setAttribute('content', content);
          editor.document.getHead().append(meta);
        }
      },
      getName : function() {
        return 'charset';
      }
    }
  });

  DocTypePropertyHandler = CKEDITOR.tools.createClass({
    base : PropertyHandler,
    $ : function() {
    },
    proto : {
      getValue : function(editor) {
        return editor.docType;
      },
      setValue : function(editor, value) {
        editor.docType = value;
      },
      getName : function() {
        return 'docType';
      }
    }
  });

  TextColorPropertyHandler = CKEDITOR.tools.createClass({
    base : PropertyHandler,
    $ : function() {
    },
    proto : {
      getValue : function(editor) {
        return editor.document.getBody().getComputedStyle('color');
      },
      setValue : function(editor, value) {
        var body = editor.document.getBody();
        body.removeAttribute('text');
        if (value) {
          body.setStyle('color', value);
        } else {
          body.removeStyle('color');
        }
      },
      getName : function() {
        return 'textColor';
      }
    }
  });

  BackgroundColorPropertyHandler = CKEDITOR.tools.createClass({
    base : PropertyHandler,
    $ : function() {
    },
    proto : {
      getValue : function(editor) {
        return editor.document.getBody().getComputedStyle('background-color');
      },
      setValue : function(editor, value) {
        var body = editor.document.getBody();
        body.removeAttribute('bgcolor');
        if (value) {
          body.setStyle('background-color', value);
        } else {
          body.removeStyle('background-color');
        }
      },
      getName : function() {
        return 'backgroundColor';
      }
    }
  });

  BackgroundImagePropertyHandler = CKEDITOR.tools.createClass({
    base : PropertyHandler,
    $ : function() {
    },
    proto : {
      getValue : function(editor) {
        return editor.document.getBody().getComputedStyle('background-image');
      },
      setValue : function(editor, value) {
        var body = editor.document.getBody();
        body.removeAttribute('bgcolor');
        if (value) {
          body.setStyle('background-image', value);
        } else {
          body.removeStyle('background-image');
        }
      },
      getName : function() {
        return 'backgroundImage';
      }
    }
  });

  BackgroundAttachmentPropertyHandler = CKEDITOR.tools.createClass({
    base : PropertyHandler,
    $ : function() {
    },
    proto : {
      getValue : function(editor) {
        return editor.document.getBody().getComputedStyle('background-attachment');
      },
      setValue : function(editor, value) {
        var body = editor.document.getBody();
        if (value) {
          body.setStyle('background-attachment', value);
        } else {
          body.removeStyle('background-attachment');
        }
      },
      getName : function() {
        return 'backgroundAttachment';
      }
    }
  });

  PageMarginPropertyHandler = CKEDITOR.tools.createClass({
    base : PropertyHandler,
    $ : function(name, property) {
      this._name = name;
      this._property = property;
    },
    proto : {
      getValue : function(editor) {
        var body = editor.document.getBody();
        return body.getStyle('margin-' + this._property) || body.getAttribute('margin' + this._property);
      },
      setValue : function(editor, value) {
        var body = editor.document.getBody();
        body.removeAttribute('margin' + this._property);
        if (value) {
          body.setStyle('margin-' + this._property, value);
        } else {
          body.removeStyle('margin-' + this._property);
        }
      },
      getName : function() {
        return this._name;
      }
    }
  });

  MetaPropertyHandler = CKEDITOR.tools.createClass({
    base : PropertyHandler,
    $ : function(name, property) {
      this._name = name;
      this._property = property;
    },
    proto : {
      getValue : function(editor) {
        var metas = editor.document.getHead().getElementsByTag('meta');
        for ( var i = 0, l = metas.count(); i < l; i++) {
          var meta = metas.getItem(i);
          if (meta.getAttribute('name') === this._property) {
            return meta.getAttribute("content");
          }
        }
      },
      setValue : function(editor, value) {
        var metas = editor.document.getHead().getElementsByTag('meta');
        var meta;
        
        for ( var i = 0, l = metas.count(); i < l; i++) {
          meta = metas.getItem(i);
          if (meta.getAttribute('name') === this._property) {
            meta.setAttribute("content", value);
            return;
          }
        }

        if (value) {
          meta = new CKEDITOR.dom.element('meta', editor.document);
          meta.setAttribute('name', this._property);
          meta.setAttribute('content', value);
          editor.document.getHead().append(meta);
        }
      },
      getName : function() {
        return this._name;
      }
    }
  });

  CKEDITOR.plugins.add('change', {
    requires : [],
    init : function(editor) {
      CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
        /**
         * Returns change observer
         * 
         * @returns {ChangeObserver} change observer
         */
        getChangeObserver : function() {
          return this._changeObserver;
        }
      });
      
      // TODO: This should be configurable
      
      var propertyHandlers = editor.config.fullPage ? [
        new TitlePropertyHandler(),
        new LangDirPropertyHandler(),
        new LangCodePropertyHandler(),
        new CharsetPropertyHandler(),
        new DocTypePropertyHandler(),
        new TextColorPropertyHandler(),
        new BackgroundColorPropertyHandler(),
        new BackgroundImagePropertyHandler(),
        new BackgroundAttachmentPropertyHandler(),
        new PageMarginPropertyHandler('pageMarginLeft', 'left'),
        new PageMarginPropertyHandler('pageMarginTop', 'top'),
        new PageMarginPropertyHandler('pageMarginRight', 'right'),
        new PageMarginPropertyHandler('pageMarginBottom', 'bottom'),
        new MetaPropertyHandler("metaKeywords", "keywords"),
        new MetaPropertyHandler("metaDescription", "description"),
        new MetaPropertyHandler("metaAuthor", "author"),
        new MetaPropertyHandler("metaCopyright", "copyright")
      ] : [];

      var changeObserver = null;
      if ((typeof (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver) === 'function')) {
        // Modern browsers support mutation observer
        changeObserver = new MutationChangeObserver(editor, propertyHandlers);
      }

      if (!changeObserver) {
        if ((CKEDITOR.env.ie && CKEDITOR.env.version === 9)) {
          // IE 9 support DOMSubtreeModified
          changeObserver = new DOMSubtreeModifiedChangeObserver(editor, propertyHandlers);
        } else {
          // Otherwise we fallback to polling
          changeObserver = new PollingChangeObserver(editor, propertyHandlers);
        }
      }

      editor._changeObserver = changeObserver;
      
      editor.on('instanceReady', function() {
        this.getChangeObserver().start();
      });

      editor.on('beforePaste', function(event) {
        this.getChangeObserver().pause();
      });

      editor.on('paste', function(event) {
        this.getChangeObserver().resume();
      }, editor, null, 99999);
    }
  });
  
}).call(this);