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
    }
  });
})();