/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben, Otavan opisto. All rights reserved.
 */

( function() {
  CKEDITOR.plugins.add( 'muikku-fields', {
    requires: 'fakeobjects',
    onLoad: function() {
    },
    init: function( editor ) {
      editor.addFeature({
        name: 'muikkufieldsfeature',
        allowedContent: 'object[type];param[name,value];',
        requiredContent: 'object'
      });
      CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
        createRandomMuikkuFieldName: function(editorElement) {
          var nameLength = 24;
          var idCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          var result = 'muikku-field-';
          for (var i=0; i<nameLength; i++) {
            result = result + idCharacters[Math.floor(Math.random() * idCharacters.length)];
          }
          return result;
        },
        getMuikkuFieldDefinition: function(editorElement) {
          var content = '{}';
          if (editorElement) {
            var realElement = editor.restoreRealElement(editorElement);
            if (realElement) {
              var children = realElement.getElementsByTag('cke:param');
              for (var i = 0; i < children.count(); i++) {
                var child = children.getItem(i);
                if (child.getAttribute('name') == 'content') {
                  content = child.getAttribute('value');
                  break;
                }
              }
            }
          }
          return JSON.parse(content);
        }
      });
      // ensure field name uniqueness when pasting (dirty hacks, anyone?)
      editor.on('paste', function (evt) {
        evt.data.dataValue = evt.data.dataValue.replace(/muikku-field-[a-zA-Z0-9]{24}/, editor.createRandomMuikkuFieldName());
      });    
    }
  });
})();