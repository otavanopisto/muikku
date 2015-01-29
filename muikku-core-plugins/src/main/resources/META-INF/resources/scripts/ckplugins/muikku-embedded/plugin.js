/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben, Otavan opisto. All rights reserved.
 */

(function() {
  CKEDITOR.plugins.add('muikku-embedded', {
    init : function(editor) {
      editor.addFeature({
        name : 'muikkuembeddedfeature',
        allowedContent : 'iframe[src,title,seamless,border,frameborder,width,data-type,data-workspace-material-id,data-material-id,data-material-type];',
        requiredContent : 'iframe[src,data-type,data-workspace-material-id,data-material-id,data-material-type];'
      });
    }
  });
})();