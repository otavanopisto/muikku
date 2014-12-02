(function() {
  'use strict'
  
  /* global CKEDITOR */

  CKEDITOR.plugins.add( 'muikku-textfield', {
    icons: 'muikkutextfield',
    init: function(editor) {
      editor.addCommand('muikkuTextField', {
        'exec': function(editor) {
          editor.insertHtml('<input type="text" name="muikkuInput" value="">');
        }
      });
      
      editor.ui.addButton('MuikkuTextField', {
        label: 'Muikku Text Input Field',
        command: 'muikkuTextField',
        toolbar: 'insert'
      });
    }
  });
}).call(this);