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
    fake.attributes.title = editor.lang['muikku-textfield'].uiElement;
    return fake;
  }

  function createFakeElement( editor, realElement ) {
    var fake = editor.createFakeElement( realElement, 'muikku-text-field', 'muikkutextfield', true );
    fake.setAttribute('src', '//placehold.it/150x20');
    fake.setAttribute('title', editor.lang['muikku-textfield'].uiElement);
    return fake;
  }

  CKEDITOR.plugins.add( 'muikku-textfield', {
    requires: 'dialog,muikku-fields',
    icons: 'muikkutextfield',
    lang: 'fi,en',
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
        var element = evt.data.element;

        if (element.is( 'img' ) && element.data( 'cke-real-element-type' ) == 'muikkutextfield')
          evt.data.dialog = 'muikkutextfield';
      } );
      if (editor.contextMenu) {
        editor.addMenuGroup('muikkuTextFieldGroup');
        editor.addMenuItem('muikkuTextFieldItem', {
          label: editor.lang['muikku-textfield'].propertiesMenu,
          command: 'muikkutextfield',
          group: 'muikkuTextFieldGroup'
        });
        editor.contextMenu.addListener( function( element, selection ) {
          if ( element && element.is( 'img' ) && !element.isReadOnly() && element.data( 'cke-real-element-type' ) == 'muikkutextfield' )
            return { muikkuTextFieldItem: CKEDITOR.TRISTATE_OFF };
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

  var answersElement = function(dialog, elementDefinition, htmlList) {
    CKEDITOR.ui.dialog.uiElement.call(this, dialog, elementDefinition, htmlList, 'div');
  };

  answersElement.prototype = new CKEDITOR.ui.dialog.uiElement;
  CKEDITOR.tools.extend(answersElement.prototype, {
    clear: function() {
      var element = this.getElement();
      while (element.getFirst()) {
        element.getFirst().remove();
      }
    },
    onLoad: function() {
      this.setLabel(this.label);
    },
    setLabel: function(label) {
      var optionsContainer = this.getElement();
      var labelElement = optionsContainer.findOne('answers-element-label');
      if (labelElement === null) {
        labelElement = new CKEDITOR.dom.element('label');
        optionsContainer.append(labelElement, true);
      }

      labelElement.setText(label);
    },
    addAnswer: function(text, correct) {
      var optionsContainer = this.getElement();
      var optionContainer = new CKEDITOR.dom.element('div');
      optionContainer.addClass('answers-element-container');
      var optionTextField = new CKEDITOR.dom.element('input');
      optionTextField.setAttribute('name', 'text');
      optionTextField.setAttribute('type', 'text');
      optionTextField.setAttribute('value', text);
      var optionCorrectField = new CKEDITOR.dom.element('input');
      optionCorrectField.setAttribute('name', 'correct');
      optionCorrectField.setAttribute('type', 'checkbox');
      optionCorrectField.setAttribute('checked', correct);
      optionsContainer.append(optionContainer);
      optionContainer.append(optionTextField);
      optionContainer.append(optionCorrectField);
      return optionContainer;
    },
    removeAnswer: function(answerIndex) {
      var nodes = this.getElement().find('.answers-element-container');
      nodes.getItem(answerIndex).remove();
    },
    getAnswers: function() {
      var rightAnswers = [];
      var answersUiElement = this.getElement();
      var answers = answersUiElement.find('.answers-element-container');
      for (var i = 0; i < answers.count(); i++) {
        var answer = answers.getItem(i);
        var text = answer.findOne('input[name="text"]').getValue();
        var correct = answer.findOne('input[name="correct"]').$.checked;
        rightAnswers.push({
          'text' : text,
          'correct' : correct
        });
      }
      return rightAnswers;
    }
  });

  CKEDITOR.dialog.addUIElement('muikkuTextFieldRightAnswers', {
    build : function(dialog, elementDefinition, output) {
      return new answersElement(dialog, elementDefinition, output);
    },
  });

  CKEDITOR.dialog.add('muikkutextfield', function (editor) {
    return {
      title : editor.lang['muikku-textfield'].propertiesDialogTitle,
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
        
        var answersElement = this.getContentElement('info', 'answers');
        rightAnswers = answersElement.getAnswers();
        for (var i=0, l=rightAnswers.length; i<l; i++) {
          rightAnswers[i].points = rightAnswers[i].correct ? 1.0 : 0.0;
          rightAnswers[i].caseSensitive = false;
          rightAnswers[i].normalizeWhitespace = true;
          delete rightAnswers[i].correct;
        }

        var newJson = {
          'name': name,
          'rightAnswers': rightAnswers,
          'columns': this.getContentElement('info', 'width').getValue(),
          'hint': this.getContentElement('info', 'hint').getValue(),
          'help': this.getContentElement('info', 'help').getValue()
        };
        
        var object = new CKEDITOR.dom.element('object');
        object.setAttribute('type', 'application/vnd.muikku.field.text');
        var paramType = new CKEDITOR.dom.element('param');
        paramType.setAttribute('name', 'type');
        paramType.setAttribute('value', 'application/json');
        var paramContent = new CKEDITOR.dom.element('param');
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
            id: 'width',
            type: 'text',
            label: editor.lang['muikku-textfield'].propertiesDialogWidth,
            setup: function(json) {
              this.setValue(json.columns);
            }
          },
          {
            id: 'hint',
            type: 'text',
            label: editor.lang['muikku-textfield'].propertiesDialogHint,
            setup: function(json) {
              this.setValue(json.hint);
            }
          },
          {
            id: 'help',
            type: 'text',
            label: editor.lang['muikku-textfield'].propertiesDialogHelp,
            setup: function(json) {
              this.setValue(json.help);
            }
          },
          {
            id: 'answers',
            type: 'muikkuTextFieldRightAnswers',
            label: editor.lang['muikku-textfield'].propertiesDialogRightAnswers,
            setup: function(json) {
              this.clear();
              for (var i = 0; i < json.rightAnswers.length; i++) {
                var text = json.rightAnswers[i].text;
                var correct = json.rightAnswers[i].points > 0;
                this.addAnswer(text, correct);
              }
            }
          }
        ]
      } ]
    };
  });

} )();
