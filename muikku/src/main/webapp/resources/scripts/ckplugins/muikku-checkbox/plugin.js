(function() {
  'use strict'
  
  /* global CKEDITOR */

  CKEDITOR.plugins.add('muikku-checkbox', {
    requires: 'muikku-fields',
    icons: 'muikku-checkbox',
    init: function(editor) {
      editor.addCommand('insertCheckbox', {
        exec: function(editor) {
          editor.insertHtml('<div style="border:1px solid rgb(0,0,0);background-color:yellow;">Olen ruma ruksiboksirepresentaatio</div>');
        }
      });
      editor.ui.addButton('muikku-checkbox', {
        label: 'Tuuppaa ruksiboksi',
        command: 'insertCheckbox',
        toolbar: 'muikku-fields'
      });
      editor.addFeature({
        name: 'muikku-checkbox',
        allowedContent: 'object[type];param[name,value]',
        requiredContent: 'object'
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
}).call(this);