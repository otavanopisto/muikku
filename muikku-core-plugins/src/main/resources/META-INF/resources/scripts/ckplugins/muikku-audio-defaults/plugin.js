/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben, Otavan opisto. All rights reserved.
 */
(function() {
  'use strict';

  CKEDITOR.plugins.add('muikku-audio-defaults', {
  });

  CKEDITOR.on( 'dialogDefinition', function( ev ) {
    var editor = ev.editor;
    var dialogName = ev.data.name;
    var dialogDefinition = ev.data.definition;
    
    if (dialogName == 'audio') {
      try {
        if (dialogDefinition.contents && dialogDefinition.contents.length) {
          var contents = dialogDefinition.contents[0];
          if (contents.elements && contents.elements.length > 1) {
            contents.elements[2].children[0]["default"] = 'false';
            contents.elements[2].children[1]["default"] = 'false';
          }
        }
      } catch (e) {
        // if anything goes wrong, we just ignore it
      }
    }
  });

}).call(this);
