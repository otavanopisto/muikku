CKEDITOR.dialog.add('muikkuWordDefinitionDialog', function (editor) {
  var lang = editor.lang['muikku-word-definition'];
  
  return {
    title: lang.definitionDialogTitle,
    minWidth: 400,
    minHeight: 200,
    contents: [{
      id: 'tab-basic',
      label: lang.definitionDialogTabTitle,
      elements: [{
        type: 'text',
        id: 'text',
        label: lang.definitionDialogTextLabel,
        setup: function(editor) {
          var text = null;
          var ranges = editor.getSelection().getRanges();
          
          for (var i = 0, l = ranges.length; i < l; i++) {
            var range = ranges[i];
            var iterator = range.createIterator();
            var p = null;
            
            while ((p = iterator.getNextParagraph()) != null) {
              var def = p.findOne('span[data-muikku-word-definition]');
              if (def) {
                text = def.getAttribute('data-muikku-word-definition');
              }
              
              if (text) {
                break;
              }
            }
            
            if (text) {
              break;
            }
          }
          
          this.setValue(text);
        },
        commit: function(editor) {
          var style = new CKEDITOR.style({ 
            element: 'span', 
            attributes: { 
              'data-muikku-word-definition': this.getValue() 
            }
          });
          
          style.apply(editor);
        }
      }]
    }],
    
    onShow: function() {
      this.setupContent(editor);
    },
    
    onOk: function() {
      this.commitContent(editor);
    }
  }
});