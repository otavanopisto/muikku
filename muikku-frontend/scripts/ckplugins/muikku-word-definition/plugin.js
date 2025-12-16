CKEDITOR.plugins.add('muikku-word-definition', {
    hidpi: true,
    icons: 'muikku-word-definition',
    lang: 'fi,en',
    init: function (editor) {
      var lang = editor.lang['muikku-word-definition'];
      
      editor.addCommand('muikku-word-definition', new CKEDITOR.dialogCommand('muikkuWordDefinitionDialog'), {
        allowedContent: 'p'
      });
      
      editor.ui.addButton('MuikkuWordDefinition', {
        label: lang.uiElement,
        command: 'muikku-word-definition',
        toolbar: 'insert'
      });
      
      CKEDITOR.dialog.add('muikkuWordDefinitionDialog', this.path + 'dialogs/definition.js');

      if (editor.contextMenu) {
        editor.addMenuGroup('muikkuWordDefinitionGroup');
        editor.addMenuItem('muikkuWordDefinitionItem', {
          label: lang.toolbarAdd,
          icon: this.path + 'icons/muikku-word-definition.png',
          command: 'muikku-word-definition',
          group: 'muikkuWordDefinitionGroup'
        });
          
        editor.contextMenu.addListener( function(element) {
          return { muikkuWordDefinitionItem: CKEDITOR.TRISTATE_OFF};
        });
      }
    }
});
