(function() {
  'use strict'
  
  /* global CKEDITOR */

  CKEDITOR.plugins.add('muikku-audiofield', {
    requires: 'muikku-fields',
    icons: 'muikku-audiofield',
    hidpi: true,
    lang: 'fi,en',
    init: function(editor) {
      editor.ui.addButton('muikku-audiofield', {
        label: editor.lang['muikku-audiofield'].toolbarMenu,
        command: 'createMuikkuAudioField'
      });
      editor.addCommand('createMuikkuAudioField', {
        exec: function (editor) {

          // JSON representation
          
          var contentJson = {};
          contentJson.name = editor.createRandomMuikkuFieldName();
          
          // Object representation
          
          var object = new CKEDITOR.dom.element('cke:object');
          object.setAttribute('type', 'application/vnd.muikku.field.audio');
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
          input.setAttribute('accept', 'audio/*');
          input.setAttribute('capture', 'microphone');
          
          object.append(input);

          // CKEditor UI representation
          
          var fakeElement = editor.createFakeElement(object, 'muikku-audio-field', 'object');
          fakeElement.setAttribute('src', CKEDITOR.plugins.getPath('muikku-audiofield') + 'gfx/muikku-placeholder-audio.gif'); 
          fakeElement.setAttribute('title', editor.lang['muikku-audiofield'].uiElement);
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
              if (type == 'application/vnd.muikku.field.audio') {
                var fakeElement = editor.createFakeParserElement(element, 'muikku-audio-field', 'object');
                fakeElement.attributes['src'] = path + 'gfx/muikku-placeholder-audio.gif'; 
                fakeElement.attributes['title'] = editor.lang['muikku-audiofield'].uiElement;
                return fakeElement;
              }
            }
          }
        }, 5);
      }
    }
  });
  
}).call(this);