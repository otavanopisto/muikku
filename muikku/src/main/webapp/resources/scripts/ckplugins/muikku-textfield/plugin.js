/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben, Otavan opisto. All rights reserved.
 */

( function() {
  function isMuikkuTextField( element ) {
    var attributes = element.attributes;

    return (attributes.type == 'application/vnd.muikku.field.text');
  }

  function createFakeParserElement( editor, realElement ) {
    var fake = editor.createFakeParserElement( realElement, 'muikku-text-field', 'muikkutextfield', true );
    fake.attributes.src = "//placehold.it/150x20";
    return fake;
  }

  function createFakeElement( editor, realElement ) {
    var fake = editor.createFakeElement( realElement, 'muikku-text-field', 'muikkutextfield', true );
    fake.setAttribute('src', '//placehold.it/150x20');
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
        alert(editor.createRandomMuikkuFieldName());
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
                return createFakeParserElement( editor, element );
              }
            }
          }
        }, 5);
      }
    }
  } );

  CKEDITOR.dialog.add('muikkutextfield', function (editor) {
    return {
      title : "Muikku Text Field",
      minWidth : 420,
      minHeight : 310,
      onShow : function() {
        var fakeImage = this.getSelectedElement();
        if (fakeImage
            && fakeImage.data('cke-real-element-type')
            && fakeImage.data('cke-real-element-type') == 'muikkutextfield') {
          // TODO: Open on current view
        }
      },
      onOk : function(event) {
        var object = new CKEDITOR.dom.element('object');
        object.setAttribute('type', 'application/vnd.muikku.field.text');
        var paramType = new CKEDITOR.dom.element('param');
        paramType.setAttribute('name', 'type');
        paramType.setAttribute('value', 'application/json');
        var paramContent = new CKEDITOR.dom.element('param');
        paramContent.setAttribute('name', 'content');
        var rightAnswers = [];
        var formAnswers = this.getContentElement('info', 'answers').getValue().split('\n');
        for (var i=0, l=rightAnswersSource.length; i<l; i++) {
          var formAnswer = formAnswers[i];
          rightAnswers.push({
            // TODO
            'points': 1.0,
            'text': formAnswer,
            'caseSensitive': false,
            'normalizeWhitespace': true
          });
        }
        paramContent.setAttribute('value', JSON.stringify({
          'name': editor.createRandomMuikkuFieldName(),
          'rightAnswers': rightAnswers,
          'columns': this.getContentElement('info', 'width').getValue(),
          'hint': this.getContentElement('info', 'hint').getValue(),
          'help': this.getContentElement('info', 'help').getValue()
        }));
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
            id: 'width',
            type: 'text',
            label: 'Width'
          },
          {
            id: 'hint',
            type: 'text',
            label: 'Hint'
          },
          {
            id: 'help',
            type: 'text',
            label: 'Help'
          },
          {
            id: 'answers',
            type: 'textarea',
            label: 'Answers'
          }
        ]
      } ]
    };
  });

} )();