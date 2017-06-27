(function() {
  'use strict';

  $.widget("custom.muikkuRichMemoField", {
    options : {
      ckeditor: {
        entities: false,
        entities_latin: false,
        entities_greek: false,
        autoGrow_onStartup: true,
        mathJaxLib: '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_HTMLorMML',
        toolbar: [
          { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
          { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'Undo', 'Redo' ] },
          { name: 'links', items: [ 'Link' ] },
          { name: 'insert', items: [ 'Image', 'Table', 'Muikku-mathjax', 'Smiley', 'SpecialChar' ] },
          { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
          { name: 'styles', items: [ 'Format' ] },
          { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
          { name: 'tools', items: [ 'Maximize' ] }
        ],
        contentsCss : CONTEXTPATH +  '/css/flex/custom-ckeditor-contentcss_reading.css',
        externalPlugins : {
          'widget': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/4.5.8/',
          'lineutils': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/4.5.8/',
          'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
          'autogrow' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/autogrow/4.5.8/plugin.js',
          'muikku-mathjax': CONTEXTPATH + '/scripts/ckplugins/muikku-mathjax/'
        },
        extraPlugins : 'change,autogrow,muikku-mathjax'
      }
    },
    _create : function() {
      this._readonly = false;
      if (this.options.ckeditor.externalPlugins) {
        $.each(this.options.ckeditor.externalPlugins, function (name, path) {
          CKEDITOR.plugins.addExternal(name, path);
        });
      }
      
      delete this.options.ckeditor.externalPlugins;

      this._editor = CKEDITOR.replace(this.element[0], this.options.ckeditor);
      this._editor.on('contentChange', $.proxy(this._onContentChange, this));
      this._editor.on('instanceReady', $.proxy(this._onInstanceReady, this));
      
      // #3120 memo word counter (ui)
      this._wordCountContainer = $('<div class="word-count-container">')
        .append($('<span class="word-count-title">').text(getLocaleText('plugin.workspace.memoField.wordCount')))
        .append('<span class="word-count">'); 
      $(this.element[0]).after(this._wordCountContainer);
    },

    setReadOnly: function (readonly) {
      this._readonly = readonly;
      if (this._editor.container) {
        this._editor.setReadOnly(readonly);
        if (this._readonly){
          $(this._editor.container.$).attr('data-readonly', 'readonly');
        } else {
          $(this._editor.container.$).removeAttr('data-readonly');
        }
        
      }
    },
    
    // #3120 memo word counter (functionality)
    _countWords: function() {
      var text = $(this._editor.getData()).text();
      $(this._wordCountContainer).find('.word-count').text(text === '' ? 0 : text.split(/\s+/).length);
    },

    _onInstanceReady: function (event, data) {
      this.setReadOnly(this._readonly);
      this._countWords();
    },
    
    _onContentChange: function (event, data) {
      $(this.element)
        .val(this._editor.getData())
        .trigger("change");
      this._countWords();
    },
    
    _destroy: function () {
      this._editor.destroy();
    }
  });

}).call(this);