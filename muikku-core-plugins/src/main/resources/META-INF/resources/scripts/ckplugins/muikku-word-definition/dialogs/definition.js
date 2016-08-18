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
          while (ranges.length > 0) {
            var range = ranges.pop();
            if (range) {
              try {
                var tempDiv = new CKEDITOR.dom.element('div');
                range.cloneContents().clone( 1, 1 ).appendTo(tempDiv);
                
                var marks = tempDiv.getElementsByTag('mark');
                for (var i = 0, l = marks.count(); i < l; i++) {
                  var mark = marks.getItem(i);
                  text = mark.getAttribute('data-muikku-word-definition');
                  if (text) {
                    break;
                  }
                }
              } catch (e) {
                
              }
            }
            
            if (text) {
              break;
            }
          }
          
          if (!text) {
            var ancestor = editor.getSelection().getCommonAncestor();
            if (ancestor) {
              var mark = ancestor.getAscendant('mark');
              if (mark) {
                text = mark.getAttribute('data-muikku-word-definition');
                if (text) {
                  editor.getSelection().selectElement(mark);
                }
              }
            }
          }

          this.setValue(text||'');
        },
        commit: function(editor) {
          var removeStyle = new CKEDITOR.style({ 
            element: 'mark',
            alwaysRemoveElement: true
          });
          
          removeStyle.remove(editor);
          
          var applyStyle = new CKEDITOR.style({ 
            element: 'mark',
            attributes: { 
              'data-muikku-word-definition': this.getValue() 
            }
          });
          
          applyStyle.apply(editor);
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