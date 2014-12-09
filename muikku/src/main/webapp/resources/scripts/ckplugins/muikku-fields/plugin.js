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
    }
  } );
} )();