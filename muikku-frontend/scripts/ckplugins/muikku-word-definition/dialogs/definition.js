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
        type: 'textarea',
        id: 'text',
        class: 'max-size',
        label: lang.definitionDialogTextLabel,
        setup: function(editor) {
          var text = null;
          var ancestor = editor.getSelection().getCommonAncestor();
          if (ancestor) {
            var mark = ancestor.getAscendant('mark', true);
            if (mark) {
              text = mark.getAttribute('data-muikku-word-definition');
              if (text) {
                editor.getSelection().selectElement(mark);
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

          var value = this.getValue();
          if(value != ""){
            var applyStyle = new CKEDITOR.style({
              element: 'mark',
              attributes: {
                'data-muikku-word-definition': value
              }
         	 });

            applyStyle.apply(editor);
          }
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