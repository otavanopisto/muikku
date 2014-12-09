/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben, Otavan opisto. All rights reserved.
 */

( function() {
  function isMuikkuTextField( element ) {
    var attributes = element.attributes;

    return (attributes.type == 'application/vnd.muikku.field.text');
  }

  function createFakeElement( editor, realElement ) {
    var fake = editor.createFakeParserElement( realElement, 'muikku-text-field', 'muikkutextfield', true );
    fake.attributes.src = "//placehold.it/150x20";
    return fake;
  }

  CKEDITOR.plugins.add( 'muikku-textfield', {
    requires: 'dialog,muikku-fields',
    onLoad: function() {
    },
    init: function( editor ) {
      editor.addCommand('muikkutextfield', new CKEDITOR.dialogCommand('muikkutextfield', {
      }));
      editor.ui.addButton && editor.ui.addButton('MuikkuTextField', {
        label: "Muikku text field properties",
        command: 'muikkutextfield',
        toolbar: 'insert,20'
      });
      CKEDITOR.dialog.add('muikkutextfield', this.path + 'dialogs/muikkutextfield.js');
      if (editor.addMenuItems) {
        editor.addMenuItems( {
          muikku: {
            label: editor.lang.flash.properties,
            command: 'muikkutextfield',
            group: 'muikku'
          }
        } );
      }
      editor.on('doubleclick', function(evt) {
        var element = evt.data.element;

        if (element.is( 'img' ) && element.data( 'cke-real-element-type' ) == 'muikkutextfield')
          evt.data.dialog = 'muikkutextfield';
      } );
      if (editor.contextMenu) {
        editor.contextMenu.addListener( function( element, selection ) {
          if ( element && element.is( 'img' ) && !element.isReadOnly() && element.data( 'cke-real-element-type' ) == 'muikkutextfield' )
            return { flash: CKEDITOR.TRISTATE_OFF };
        } );
      }
    },

    afterInit: function(editor) {
      var dataProcessor = editor.dataProcessor,
        dataFilter = dataProcessor && dataProcessor.dataFilter;

      if (dataFilter) {
        dataFilter.addRules( {
          elements: {
            'cke:object': function( element ) {
              if (isMuikkuTextField(element)) {
                return createFakeElement( editor, element );
              }
            }
          }
        }, 5);
      }
    }
  } );
} )();