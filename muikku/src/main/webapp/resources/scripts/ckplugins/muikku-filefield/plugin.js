(function() {
  'use strict'
  
  /* global CKEDITOR */

  CKEDITOR.plugins.add('muikku-filefield', {
    requires: 'muikku-fields',
    icons: 'muikku-file-field',
    hidpi: true,
    lang: 'fi,en',
    init: function(editor) {
      editor.ui.addButton('muikku-filefield', {
        label: editor.lang['muikku-filefield'].toolbarMenu,
        command: 'createMuikkuFileField',
        toolbar: 'muikku-fields'
      });
      editor.addCommand('createMuikkuFileField', {
        exec: function (editor) {

          // JSON representation
          
          var contentJson = {};
          contentJson.name = editor.createRandomMuikkuFieldName();
          
          // Object representation
          
          var object = new CKEDITOR.dom.element('cke:object');
          object.setAttribute('type', 'application/vnd.muikku.field.file');
          var paramType = new CKEDITOR.dom.element('cke:param');
          paramType.setAttribute('name', 'type');
          paramType.setAttribute('value', 'application/json');
          var paramContent = new CKEDITOR.dom.element('cke:param');
          paramContent.setAttribute('name', 'content');
          paramContent.setAttribute('value', JSON.stringify(contentJson));
          object.append(paramType);
          object.append(paramContent);

          // Default UI representation
          
          var input = new CKEDITOR.dom.element('input');
          input.setAttribute('name', contentJson.name);
          input.setAttribute('type', 'file');
          object.append(input);

          // CKEditor UI representation
          
          var fakeElement = editor.createFakeElement(object, 'muikku-file-field', 'object');
          fakeElement.setAttribute('src', CKEDITOR.plugins.getPath('muikku-filefield') + 'gfx/muikku-placeholder-file.gif'); 
          fakeElement.setAttribute('title', editor.lang['muikku-filefield'].uiElement);
          editor.insertElement(fakeElement);
        }
      });
    },
    afterInit: function(editor) {
      var path = this.path;
      var dataProcessor = editor.dataProcessor;
      var dataFilter = dataProcessor && dataProcessor.dataFilter;
      if (dataFilter) {
        dataFilter.addRules({
          elements: {
            'cke:object': function(element) {
              var type = element.attributes.type; 
              if (type == 'application/vnd.muikku.field.file') {
                var fakeElement = editor.createFakeParserElement(element, 'muikku-file-field', 'object');
                fakeElement.attributes['src'] = path + 'gfx/muikku-placeholder-file.gif'; 
                fakeElement.attributes['title'] = editor.lang['muikku-filefield'].uiElement;
                return fakeElement;
              }
            }
          }
        }, 5);
      }
    }
  });
  
}).call(this);