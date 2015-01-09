/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben, Otavan opisto. All rights reserved.
 */

( function() {
  CKEDITOR.plugins.add( 'muikku-connectfield', {
    requires: 'muikku-fields',
    onLoad: function() {
    },
    init: function( editor ) {
      editor.ui.addButton('muikku-connectfield', {
        label: editor.lang['muikku-connectfield'].toolbarMenu,
        command: 'createMuikkuConnectField'
      });
      editor.addCommand('createMuikkuConnectField', {
        exec: function (editor) {
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
              if (type == 'application/vnd.muikku.field.connect') {
                var fakeElement = editor.createFakeParserElement(element, 'muikku-connect-field', 'object');
                fakeElement.attributes['src'] = path + 'gfx/muikku-placeholder-connectfield.gif'; 
                fakeElement.attributes['title'] = editor.lang['muikku-connectfield'].uiElement;
                return fakeElement;
              }
            }
          }
        }, 5);
      }
    }
  });
})();