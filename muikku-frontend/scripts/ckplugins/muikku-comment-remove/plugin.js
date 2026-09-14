CKEDITOR.plugins.add('muikku-comment-remove', {
  hidpi: true,
  icons: 'muikku-comment-remove',
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
    var lang = editor.lang['muikku-comment-remove'];
    editor.addCommand('muikku-remove', {
      readOnly: true,
      exec: function(editor) {
        editor.removeStyle(new CKEDITOR.style({
          element: 'mark',
          alwaysRemoveElement: true,
          ignoreReadonly: true
        }));
        if (editor.readOnly) {
          editor.fire('saveSnapshot');
          editor.fire('change');
        }
      }
    });
    if (editor.contextMenu) {
      editor.addMenuGroup('muikkuCommentRemoveGroup');
      editor.addMenuItem('muikkuRemoveItem', {
        label: lang.remove,
        icon: this.path + 'icons/muikku-delete.png',
        command: 'muikku-remove',
        group: 'muikkuCommentRemoveGroup'
      });
      editor.contextMenu.addListener(function(element) {
        return _this.findMarkInSelection(editor) ? { muikkuRemoveItem: CKEDITOR.TRISTATE_OFF } : null;
      });
    }
  }
});
