(function() {
  'use strict'
  
  /* global CKEDITOR */

  CKEDITOR.plugins.add('muikku-checkbox', {
    requires: 'muikku-fields',
    icons: 'muikku-checkbox',
    init: function(editor) {
      editor.addCommand('muikku-checkbox', new CKEDITOR.dialogCommand('muikkuCheckboxDialog'));
      editor.ui.addButton('muikku-checkbox', {
        label: 'Tuuppaa ruksiboksi',
        command: 'muikku-checkbox',
        toolbar: 'muikku-fields'
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
              if (element.attributes.type == 'application/vnd.muikku.field.checklist') {
                var fakeElement = editor.createFakeParserElement(element, 'muikku-checkbox-field', 'object');
                fakeElement.attributes['src'] = path + 'icons/muikku-checkbox-editor.jpg'; 
                fakeElement.attributes['title'] = 'Ruksiboksisysteemijuttula';
                return fakeElement;
              }
            }
          }
        }, 5);
      }
    }
  });
  
  // Properties

  CKEDITOR.dialog.add('muikkuCheckboxDialog', function(editor) {
    return {
      title: 'Ruksiboksiominaisuudet [lokalisoi]',
      minWidth: 400,
      minHeight: 200,
      contents: [
        {
          id: 'tab-basic',
          elements: [
            {
              type: 'text',
              id: 'blah',
              label: 'Blah',
            }
          ]
        }
      ],
      onOk: function() {
        var object = new CKEDITOR.dom.element('object');
        object.setAttribute('type', 'application/vnd.muikku.field.checklist');
        var paramType = new CKEDITOR.dom.element('param');
        paramType.setAttribute('name', 'type');
        paramType.setAttribute('value', 'application/json');
        var paramContent = new CKEDITOR.dom.element('param');
        paramContent.setAttribute('name', 'content');
        paramContent.setAttribute('value', '{"name":"param4","options":[{"name":"1","points":null,"text":"Vauhkoehto 1"},{"name":"2","points":null,"text":"Vauhkoehto 2"},{"name":"3","points":null,"text":"Vauhkoehto 3"}]}');
        object.append(paramType);
        object.append(paramContent);
        
        var fakeElement = editor.createFakeElement(object, 'muikku-checkbox-field', 'object');
        fakeElement.setAttribute('src', this.path + 'icons/muikku-checkbox-editor.jpg'); 
        fakeElement.setAttribute('title', 'Ruksiboksisysteemijuttula');
        editor.insertElement(fakeElement);
      }
    };
  });
  
}).call(this);