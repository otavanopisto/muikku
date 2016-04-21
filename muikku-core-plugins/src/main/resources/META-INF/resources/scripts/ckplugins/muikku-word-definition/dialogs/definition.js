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
          
          var selectionNode = editor.getSelection().getCommonAncestor();
          while (selectionNode.type != CKEDITOR.NODE_ELEMENT) {
            selectionNode = selectionNode.getParent();
            if ((selectionNode == null) || ("body" == selectionNode.getName())) {
              selectionNode = null;
              break;
            }
          }
          
          if (selectionNode) {
            while ("mark" == selectionNode.getName()) {
              selectionNode = selectionNode.getParent();
              if ((selectionNode == null) || ("body" == selectionNode.getName())) {
                selectionNode = null;
                break;
              }
            }
          }
      
          if (selectionNode) {
            var mark = null;
            if ("mark" == selectionNode.getName()) {
              mark = selectionNode;
            }

            if (mark) {
              text = mark.getAttribute('data-muikku-word-definition');
            }
           
            if (text) {
              editor.getSelection().selectElement(mark);
            }
          }
          
          this.setValue(text);
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