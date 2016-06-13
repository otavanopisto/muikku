/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben, Otavan
 *          opisto. All rights reserved.
 */

(function() {
  function isMuikkuTextField(element) {
    var attributes = element.attributes;

    return (attributes.type == 'application/vnd.muikku.field.text');
  }

  function isEmpty(obj) {
    for ( var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }

    return true;
  }

  function createFakeParserElement(editor, realElement) {
    var fake = editor.createFakeParserElement(realElement, 'muikku-text-field', 'muikkutextfield', true);
    fake.attributes.src = CKEDITOR.plugins.getPath('muikku-textfield') + 'gfx/muikku-placeholder-textfield.gif';
    fake.attributes.title = editor.lang['muikku-textfield'].uiElement;
    return fake;
  }

  function createFakeElement(editor, realElement) {
    var fake = editor.createFakeElement(realElement, 'muikku-text-field', 'muikkutextfield', true);
    fake.setAttribute('src', CKEDITOR.plugins.getPath('muikku-textfield') + 'gfx/muikku-placeholder-textfield.gif');
    fake.setAttribute('title', editor.lang['muikku-textfield'].uiElement);
    return fake;
  }

  CKEDITOR.plugins.add('muikku-textfield', {
    requires : 'dialog,muikku-fields',
    icons : 'muikkutextfield',
    hidpi: true,
    lang : 'fi,en',
    onLoad : function() {
    },
    init : function(editor) {
      editor.addCommand('muikkutextfield', new CKEDITOR.dialogCommand('muikkutextfield', {}));
      editor.ui.addButton && editor.ui.addButton('MuikkuTextField', {
        label : editor.lang['muikku-textfield'].propertiesMenu,
        command : 'muikkutextfield',
        toolbar : 'insert,20'
      });
      if (editor.addMenuItems) {
        editor.addMenuItems({
          muikku : {
            label : editor.lang.flash.properties,
            command : 'muikkutextfield',
            group : 'muikku'
          }
        });
      }
      editor.on('doubleclick', function(evt) {
        var element = evt.data.element;
        if (element.is('img') && element.data('cke-real-element-type') == 'muikkutextfield') {
          evt.data.dialog = 'muikkutextfield';
        }
      });
      if (editor.contextMenu) {
        editor.addMenuGroup('muikkuTextFieldGroup');
        editor.addMenuItem('muikkuTextFieldItem', {
          label : editor.lang['muikku-textfield'].propertiesMenu,
          command : 'muikkutextfield',
          group : 'muikkuTextFieldGroup'
        });
        editor.contextMenu.addListener(function(element, selection) {
          if (element && element.is('img') && !element.isReadOnly() && element.data('cke-real-element-type') == 'muikkutextfield') {
            return {
              muikkuTextFieldItem : CKEDITOR.TRISTATE_OFF
            };
          }
        });
      }
    },

    afterInit : function(editor) {
      var dataProcessor = editor.dataProcessor, dataFilter = dataProcessor && dataProcessor.dataFilter;
      if (dataFilter) {
        dataFilter.addRules({
          elements : {
            'cke:object' : function(element) {
              if (isMuikkuTextField(element)) {
                return createFakeParserElement(editor, element);
              }
            }
          }
        }, 5);
      }
    }
  });

  var answersElement = function(dialog, elementDefinition, htmlList) {
    CKEDITOR.ui.dialog.uiElement.call(this, dialog, elementDefinition, htmlList, 'div');
  };

  answersElement.prototype = new CKEDITOR.ui.dialog.uiElement;
  CKEDITOR.tools.extend(answersElement.prototype,
    {
      clear : function() {
        var element = this.getElement();
        while (element.getFirst()) {
          element.getFirst().remove();
        }
      },
      setupContainers : function(label) {
        var uiElement = this.getElement();
        if (this.label) {
          var titleContainer = uiElement
              .findOne('.textfield-title-container');
          if (titleContainer === null) {
            titleContainer = new CKEDITOR.dom.element('div');
            titleContainer.addClass('textfield-title-container');
            uiElement.append(titleContainer);

            var optionLabel = new CKEDITOR.dom.element('label');
            optionLabel.setText(this.label);
            titleContainer.append(optionLabel);

            var _this = this;
            var addLink = new CKEDITOR.dom.element('a');
            addLink.addClass('icon-add');
            addLink.on('click', function() {
              _this.addAnswer('', false);
            });
            titleContainer.append(addLink);
            var addLinkTooltip = new CKEDITOR.dom.element('span');
            addLinkTooltip.setText(this.addOptionLink);
            addLink.append(addLinkTooltip);

            var correctLabel = new CKEDITOR.dom.element('label');
            correctLabel.addClass('icon-checkmark');
            titleContainer.append(correctLabel);
            var correctTooltip = new CKEDITOR.dom.element('span');
            correctTooltip.setText(this.correctTooltip);
            correctLabel.append(correctTooltip);
          }
        }
        // Options container
        var optionsContainer = uiElement.findOne('.textfield-elements-container');
        if (optionsContainer == null) {
          optionsContainer = new CKEDITOR.dom.element('div');
          optionsContainer.addClass('textfield-elements-container');
          uiElement.append(optionsContainer);
        }
      },
      addAnswer : function(text, correct) {
        var optionsContainer = this.getElement().findOne('.textfield-elements-container');
        var optionContainer = new CKEDITOR.dom.element('div');
        optionContainer.addClass('textfield-element-container');

        var sortHandle = new CKEDITOR.dom.element('span');
        sortHandle.addClass('sort-handle');
        sortHandle.addClass('icon-move');
        $(optionsContainer.$).sortable({
          handle: '.sort-handle',
          axis: 'y',
          stop: function(event, ui) {
          }
        });
        optionContainer.append(sortHandle);

        var optionTextField = new CKEDITOR.dom.element('input');
        optionTextField.setAttribute('name', 'text');
        optionTextField.setAttribute('type', 'text');
        optionTextField.setAttribute('value', text);
        optionContainer.append(optionTextField);

        var optionCorrectField = new CKEDITOR.dom.element('input');
        optionCorrectField.setAttribute('name', 'correct');
        optionCorrectField.setAttribute('type', 'checkbox');
        optionCorrectField.$.checked = correct;
        optionContainer.append(optionCorrectField);
        optionsContainer.append(optionContainer);

        var deleteLink = new CKEDITOR.dom.element('a');
        var _this = this;
        deleteLink.addClass('icon-delete');
        deleteLink.on('click', (function() {
          var _optionContainer = optionContainer;
          return (function() {
            _optionContainer.remove();
          });
        }()));
        var deleteTooltip = new CKEDITOR.dom.element('span');
        deleteTooltip.setText(this.deleteOptionLink);
        deleteLink.append(deleteTooltip);
        optionContainer.append(deleteLink);
      },
      removeAnswer : function(answerIndex) {
        var nodes = this.getElement().find('.textfield-element-container');
        nodes.getItem(answerIndex).remove();
      },
      getAnswers : function() {
        var rightAnswers = [];
        var answersUiElement = this.getElement();
        var answers = answersUiElement.find('.textfield-element-container');
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
      },
      getAnswersCount : function() {
        return this.getElement().find('.textfield-element-container').count();
      }
    });

  CKEDITOR.dialog.addUIElement('muikkuTextFieldRightAnswers', {
    build : function(dialog, elementDefinition, output) {
      return new answersElement(dialog, elementDefinition, output);
    },
  });

  CKEDITOR.dialog.add(
    'muikkutextfield',
    function(editor) {
      return {
        title : editor.lang['muikku-textfield'].propertiesDialogTitle,
        minWidth : 420,
        minHeight : 310,
        onShow : function() {
          var contentJson = editor.getMuikkuFieldDefinition(editor.getSelection().getStartElement());
          this.setupContent(contentJson);
        },
        onOk : function(event) {
          var oldJson = editor.getMuikkuFieldDefinition(editor
              .getSelection().getStartElement());
          var name;
          if (oldJson.name) {
            name = oldJson.name;
          } else {
            name = editor.createRandomMuikkuFieldName();
          }

          var answersElement = this.getContentElement('info', 'answers');
          rightAnswers = answersElement.getAnswers();
          for (var i = 0, l = rightAnswers.length; i < l; i++) {
            // TODO: controls for case sensitive / normalize whitespace
            rightAnswers[i].caseSensitive = false;
            rightAnswers[i].normalizeWhitespace = true;
          }

          var newJson = {
            'name' : name,
            'rightAnswers' : rightAnswers,
            'columns' : this.getContentElement('info', 'width').getValue(),
            'autogrow': this.getContentElement('info', 'autogrow').getValue(),
            'hint' : this.getContentElement('info', 'hint').getValue()
          };

          var object = new CKEDITOR.dom.element('object');
          object
              .setAttribute('type', 'application/vnd.muikku.field.text');
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
              id : 'width',
              type : 'text',
              label : editor.lang['muikku-textfield'].propertiesDialogWidth,
              setup : function(json) {
                if (!json) {
                  return;
                }
                this.setValue(json.columns);
              }
            },
            {
              id: 'autogrow',
              type: 'checkbox',
              label: editor.lang['muikku-textfield'].propertiesDialogAutoGrow,
              setup: function(json) {
                this.setValue(json.autogrow === false ? false : true);
              }
            },
            {
              id : 'hint',
              type : 'text',
              label : editor.lang['muikku-textfield'].propertiesDialogHint,
              setup : function(json) {
                if (!json) {
                  return;
                }
                this.setValue(json.hint);
              }
            },
            {
              id : 'answers',
              type : 'muikkuTextFieldRightAnswers',
              label : editor.lang['muikku-textfield'].propertiesDialogRightAnswers,
              addOptionLink : editor.lang['muikku-textfield'].propertiesDialogAddOptionLink,
              deleteOptionLink : editor.lang['muikku-textfield'].propertiesDialogDeleteOptionLink,
              correctTooltip : editor.lang['muikku-textfield'].propertiesDialogCorrectTooltip,
              setup : function(json) {
                this.clear();
                this.setupContainers();
                if (isEmpty(json)) {
                  return;
                }
                for (var i = 0; i < json.rightAnswers.length; i++) {
                  var text = json.rightAnswers[i].text;
                  var correct = json.rightAnswers[i].correct;
                  this.addAnswer(text, correct);
                }
              }
            }]
        }]
      };
    });

})();
