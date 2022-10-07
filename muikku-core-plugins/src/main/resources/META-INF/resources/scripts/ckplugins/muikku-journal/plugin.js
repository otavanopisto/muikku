(function() {
  'use strict'
  
  /* global CKEDITOR */

  CKEDITOR.plugins.add('muikku-journal', {
    requires: 'muikku-fields',
    icons: 'muikkujournalfield',
    hidpi: true,
    lang: 'fi,en',
    init: function(editor) {
      editor.ui.addButton('muikku-journal', {
        label: editor.lang['muikku-journal'].toolbarMenu,
        command: 'createMuikkuJournal',
        toolbar: 'insert,20'
      });
      editor.addCommand('createMuikkuJournal', {
        exec: function (editor) {

          // JSON representation
          
          var contentJson = {};
          contentJson.name = editor.createRandomMuikkuFieldName();
          
          // Object representation
          
          var object = new CKEDITOR.dom.element('cke:object');
          object.setAttribute('type', 'application/vnd.muikku.field.journal');
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
          
          var fakeElement = editor.createFakeElement(object, 'muikku-journal', 'object');
          fakeElement.setAttribute('src', CKEDITOR.plugins.getPath('muikku-journal') + 'gfx/muikku-placeholder-memofield.gif'); 
          fakeElement.setAttribute('title', editor.lang['muikku-journal'].uiElement);
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
              if (type == 'application/vnd.muikku.field.journal') {
                var fakeElement = editor.createFakeParserElement(element, 'muikku-journal', 'object');
                fakeElement.attributes['src'] = path + 'gfx/muikku-placeholder-journalfield.gif'; 
                fakeElement.attributes['title'] = editor.lang['muikku-journal'].uiElement;
                return fakeElement;
              }
            }
          }
        }, 5);
      }
    }
  });
  
}).call(this);