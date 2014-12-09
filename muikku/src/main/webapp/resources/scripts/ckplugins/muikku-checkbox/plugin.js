(function() {
  'use strict'
  
  /* global CKEDITOR */

  CKEDITOR.plugins.add('muikku-checkbox', {
    icons: 'muikku-checkbox',
    init: function(editor) {
      var path = this.path;
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
      editor.filter.addTransformations([[{
        element: 'object',
        left: function(element) {
          return (element.attributes['type'] == 'application/vnd.muikku.field.checklist');
        },
        right: function(element,tools) {
          var fakeElement = editor.createFakeParserElement(element, 'muikku-checkbox-field', 'object');
          fakeElement.attributes['src'] = path + 'icons/muikku-checkbox-editor.jpg'; 
          fakeElement.attributes['title'] = 'Ruksiboksisysteemijuttula';
          element.replaceWith(fakeElement);
        }
      }]]);
    }
  });
}).call(this);