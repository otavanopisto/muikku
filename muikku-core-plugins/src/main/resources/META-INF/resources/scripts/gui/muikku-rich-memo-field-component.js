(function() {
  'use strict';

  $.widget("custom.muikkuRichMemoField", {
    options : {
      ckeditor: {
        entities: false,
        entities_latin: false,
        entities_greek: false,
        toolbar: [
          { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
          { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'Undo', 'Redo' ] },
          { name: 'links', items: [ 'Link' ] },
          { name: 'insert', items: [ 'Image', 'Table', 'Smiley', 'SpecialChar' ] },
          { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
          { name: 'styles', items: [ 'Format' ] },
          { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
          { name: 'tools', items: [ 'Maximize' ] }
        ],
        externalPlugins : {
          'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.1/plugin.min.js',
          'autogrow' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/autogrow/4.5.8/plugin.js'
        },
        extraPlugins : 'change,autogrow'
      }
    },
    _create : function() {
      if (this.options.ckeditor.externalPlugins) {
        $.each(this.options.ckeditor.externalPlugins, function (name, path) {
          CKEDITOR.plugins.addExternal(name, path);
        });
      }
      
      delete this.options.ckeditor.externalPlugins;
      
      this._editor = CKEDITOR.replace(this.element[0], this.options.ckeditor);
      this._editor.on('contentChange', $.proxy(this._onContentChange, this));
    },
    
    _onContentChange: function (event, data) {
      $(this.element)
        .val(this._editor.getData())
        .trigger("change");
    },
    
    _destroy: function () {
      this._editor.destroy();
    }
  });

}).call(this);