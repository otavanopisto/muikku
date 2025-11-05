(function() {
  'use strict';

  CKEDITOR.plugins.add('muikku-image-target', {
  });

  CKEDITOR.on( 'dialogDefinition', function( ev ) {
    var editor = ev.editor;
    var dialogName = ev.data.name;
    var dialogDefinition = ev.data.definition;
  
    if (dialogName == 'link') {
      // Forces the "target" tab to be always visible 
      var targetTab = dialogDefinition.getContents('target');
      targetTab.requiredContent = 'a';
    }
    
  });

}).call(this);
