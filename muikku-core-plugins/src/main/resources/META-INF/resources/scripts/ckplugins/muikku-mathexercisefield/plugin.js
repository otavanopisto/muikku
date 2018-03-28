(function() {
  
  function isMuikkuMathExerciseField(element) {
    var attributes = element.attributes;
    return (attributes.type == 'application/vnd.muikku.field.mathexercise');
  }

  function createFakeParserElement( editor, realElement ) {
    var fake = editor.createFakeParserElement(realElement, 'muikku-mathexercise-field', 'muikkumathexercisefield', true);
    fake.attributes.src = CKEDITOR.plugins.getPath('muikku-mathexercisefield') + 'gfx/muikku-placeholder-mathexercise.gif';
    fake.attributes.title = editor.lang['muikku-mathexercisefield'].uiElement;
    return fake;
  }

  function createFakeElement( editor, realElement ) {
    var fake = editor.createFakeElement(realElement, 'muikku-mathexercise-field', 'muikkumathexercisefield', true);
    fake.setAttribute('src', CKEDITOR.plugins.getPath('muikku-mathexercisefield') + 'gfx/muikku-placeholder-mathexercise.gif');
    fake.setAttribute('title', editor.lang['muikku-mathexercisefield'].uiElement);
    return fake;
  }

  CKEDITOR.plugins.add('muikku-mathexercisefield', {
    requires: 'dialog,muikku-fields',
    lang: 'fi,en',
    icons: 'muikku-mathexercisefield',
    hidpi: true,
    onLoad: function() {
    },
    init: function (editor) {
      editor.addCommand('muikkumathexercisefield', new CKEDITOR.dialogCommand('muikkumathexercisefield', {
      }));
      
      editor.ui.addButton && editor.ui.addButton('muikku-mathexercisefield', {
        label: editor.lang['muikku-mathexercisefield'].propertiesMenu,
        command: 'muikkumathexercisefield',
        toolbar: 'insert,20'
      });
      
      if (editor.addMenuItems) {
        editor.addMenuItems({
          muikku: {
            label: editor.lang.flash.properties,
            command: 'muikkumathexercisefield',
            group: 'muikku'
          }
        });
      }
      editor.on('doubleclick', function(evt) {
        var element = evt.data.element;

        if (element.is('img') && element.data( 'cke-real-element-type' ) == 'muikkumathexercisefield') {
          evt.data.dialog = 'muikkumathexercisefield';
        }
      });
//      if (editor.contextMenu) {
//        editor.addMenuGroup('muikkuMemoFieldGroup');
//        editor.addMenuItem('muikkuMemoFieldItem', {
//          label: editor.lang['muikku-memofield'].propertiesMenu,
//          command: 'muikkumemofield',
//          group: 'muikkuMemoFieldGroup'
//        });
//        editor.contextMenu.addListener( function( element, selection ) {
//          if ( element && element.is( 'img' ) && !element.isReadOnly() && element.data( 'cke-real-element-type' ) == 'muikkumemofield' )
//            return { muikkuMemoFieldItem: CKEDITOR.TRISTATE_OFF };
//        } );
//      }
    },

    afterInit: function(editor) {
      var dataProcessor = editor.dataProcessor,
        dataFilter = dataProcessor && dataProcessor.dataFilter;

      if (dataFilter) {
        dataFilter.addRules( {
          elements: {
            'cke:object': function( element ) {
              if (isMuikkuMathExerciseField(element)) {
                return createFakeParserElement( editor, element );
              }
            }
          }
        }, 5);
      }
    }
  } );

  CKEDITOR.dialog.add('muikkumathexercisefield', function (editor) {
    return {
      title : editor.lang['muikku-mathexercisefield'].propertiesDialogTitle,
      minWidth : 420,
      minHeight : 310,
      onShow : function() {
        var contentJson = editor.getMuikkuFieldDefinition(editor.getSelection().getStartElement());
        this.setupContent(contentJson);
      },
      onOk : function(event) {
        var oldJson = editor.getMuikkuFieldDefinition(editor.getSelection().getStartElement());
        var name;
        if (oldJson.name) {
          name = oldJson.name;
        } else {
          name = editor.createRandomMuikkuFieldName();
        }

//        var newJson = {
//          'name': name,
//          'columns': this.getContentElement('info', 'cols').getValue(),
//          'rows': this.getContentElement('info', 'rows').getValue(),
//          'example': this.getContentElement('info', 'example').getValue(),
//          'richedit': this.getContentElement('info', 'richedit').getValue()
//        };
//        
        var newJson = {
          'name': name
        };
        
        var object = new CKEDITOR.dom.element('object');
        object.setAttribute('type', 'application/vnd.muikku.field.mathexercise');
        var paramType = new CKEDITOR.dom.element('cke:param');
        paramType.setAttribute('name', 'type');
        paramType.setAttribute('value', 'application/json');
        var paramContent = new CKEDITOR.dom.element('cke:param');
        paramContent.setAttribute('name', 'content');
        paramContent.setAttribute('value', JSON.stringify(newJson));
        object.append(paramType);
        object.append(paramContent);
        var fakeElement = createFakeElement(editor, object);
        editor.insertElement(fakeElement);
      },
      onHide : function() {
      },
      contents : [ {
        id : 'info',
        label : editor.lang.common.generalTab,
        elements : [
          {
            id: 'cols',
            type: 'text',
            label: editor.lang['muikku-memofield'].propertiesDialogCols,
            setup: function(json) {
              this.setValue(json.columns);
            }
          },
          {
            id: 'rows',
            type: 'text',
            label: editor.lang['muikku-memofield'].propertiesDialogRows,
            setup: function(json) {
              this.setValue(json.rows);
            }
          },
          {
            id: 'example',
            type: 'textarea',
            label: editor.lang['muikku-memofield'].propertiesDialogExample,
            setup: function(json) {
              this.setValue(json.example);
            }
          },
          {
            id: 'richedit',
            type: 'checkbox',
            label: editor.lang['muikku-memofield'].propertiesDialogRichEdit,
            setup: function(json) {
              this.setValue(json.richedit);
            }
          }
        ]
      } ]
    };
  });

})();
