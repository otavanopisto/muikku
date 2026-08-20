CKEDITOR.plugins.add('muikku-comment', {
  hidpi: true,
  icons: 'muikku-comment',
  lang: 'fi,en',
  findMarkInSelection: function(editor) {
    var selection = editor.getSelection();
    if (!selection) {
      return null;
    }
    var ranges = selection.getRanges();
    for (var i = 0; i < ranges.length; i++) {
      var range = ranges[i];
      var walker = new CKEDITOR.dom.walker(range);
      walker.evaluator = function(node) {
        return node.type === CKEDITOR.NODE_ELEMENT && node.getName() === 'mark' && node.hasAttribute('data-type');
      };
      var mark = walker.next();
      if (mark) {
        return mark;
      }
      var start = range.startContainer;
      if (start.type === CKEDITOR.NODE_TEXT) {
        start = start.getParent();
      }
      mark = start.getAscendant(function(element) {
        return element.type === CKEDITOR.NODE_ELEMENT && element.getName() === 'mark' && element.hasAttribute('data-type');
      }, true);
      if (mark) {
        return mark;
      }
    }
    return null;
  },
  init: function(editor) {
    var _this = this;
    var lang = editor.lang['muikku-comment'];
    editor.addCommand('muikku-comment', new CKEDITOR.dialogCommand('muikkuCommentDialog', {
      readOnly: true
    }));
    editor.addCommand('muikku-remove', {
      readOnly: true,
      exec: function(editor) {
        editor.removeStyle(new CKEDITOR.style({
          element: 'mark',
          alwaysRemoveElement: true,
          ignoreReadonly: true
        }));
      }
    });
    editor.addCommand('muikku-highlight', {
      readOnly: true,
      exec: function(editor) {
        var mark = _this.findMarkInSelection(editor);
        if (mark) {
          var selection = editor.getSelection();
          var text = selection && selection.getSelectedText();
          if (!text || text.length === 0) {
            selection.selectElement(mark);
          }
        }
        editor.removeStyle(new CKEDITOR.style({
          element: 'mark',
          alwaysRemoveElement: true,
          ignoreReadonly: true
        }));
        editor.applyStyle(new CKEDITOR.style({
          element: 'mark',
          attributes: {
            'data-type': 'highlight'
          }
        }));
      }
    });
    CKEDITOR.dialog.add('muikkuCommentDialog', function(editor) {
      var lang = editor.lang['muikku-comment'];
      return {
        title: lang.commentDialogTitle,
        minWidth: 400,
        minHeight: 200,
        contents: [{
          id: 'tab-basic',
          label: lang.commentDialogTabTitle,
          elements: [{
            type: 'textarea',
            id: 'text',
            class: 'max-size',
            label: lang.commentDialogTextLabel,
            setup: function(editor) {
              var mark = _this.findMarkInSelection(editor);
              var text = mark ? mark.getAttribute('data-text') : '';
              this.setValue(text || '');
              if (mark) {
                var selection = editor.getSelection();
                var text = selection && selection.getSelectedText();
                if (!text || text.length === 0) {
                  selection.selectElement(mark);
                }
              }
            },
            commit: function(editor) {
              editor.removeStyle(new CKEDITOR.style({
                element: 'mark',
                alwaysRemoveElement: true
              }));
              var value = this.getValue();
              editor.applyStyle(new CKEDITOR.style({
                element: 'mark',
                attributes: {
                  'data-type': 'comment',
                  'data-text': value
                }
              }));
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
    if (editor.contextMenu) {
      editor.addMenuGroup('muikkuCommentGroup');
      editor.addMenuItem('muikkuCommentItem', {
        label: lang.addComment,
        icon: this.path + 'icons/muikku-comment.png',
        command: 'muikku-comment',
        group: 'muikkuCommentGroup'
      });
      editor.addMenuItem('muikkuHighlightItem', {
        label: lang.addHighlight,
        icon: this.path + 'icons/muikku-highlight.png',
        command: 'muikku-highlight',
        group: 'muikkuCommentGroup'
      });
      editor.addMenuItem('muikkuRemoveItem', {
        label: lang.remove,
        icon: this.path + 'icons/muikku-delete.png',
        command: 'muikku-remove',
        group: 'muikkuCommentGroup'
      });
      editor.contextMenu.addListener(function(element) {
        var mark = _this.findMarkInSelection(editor);
        var text = editor.getSelection().getSelectedText();
        var widget = editor.widgets.getByElement(element);
        if (mark) {
          return { muikkuCommentItem: CKEDITOR.TRISTATE_OFF, muikkuHighlightItem: CKEDITOR.TRISTATE_OFF, muikkuRemoveItem: CKEDITOR.TRISTATE_OFF};
        }
        else if (text || (widget && widget.name === 'image')) {
          return { muikkuCommentItem: CKEDITOR.TRISTATE_OFF, muikkuHighlightItem: CKEDITOR.TRISTATE_OFF};
        }
        else {
          return null;
        }
      });
    }
  }
});
