(function() {
  'use strict'
  
  /* global CKEDITOR */

  CKEDITOR.plugins.add('muikku-selection', {
    requires: 'dialog,muikku-fields',
    icons: 'muikku-selection',
    lang: 'fi,en',
    init: function(editor) {
      editor.addCommand('muikku-selection-properties', new CKEDITOR.dialogCommand('muikkuSelectionDialog'));
      editor.ui.addButton('muikku-selection', {
        label: editor.lang['muikku-selection'].toolbarMenu,
        command: 'muikku-selection-properties',
        toolbar: 'muikku-fields'
      });
      
      // Double-click support

      editor.on('doubleclick', function(evt) {
        var element = evt.data.element;
        if (element.is('img') && element.hasClass('muikku-selection-field'))
          evt.data.dialog = 'muikkuSelectionDialog';
      });

      // Context menu support
      
      if (editor.contextMenu) {
        editor.addMenuGroup('muikkuSelectionGroup');
        editor.addMenuItem('muikkuSelectionItem', {
          label: editor.lang['muikku-selection'].propertiesMenu,
          command: 'muikku-selection-properties',
          group: 'muikkuSelectionGroup'
        });
        editor.contextMenu.addListener(function(element) {
          var selectionField = editor.restoreRealElement(element);
          var selectionType = selectionField.getAttribute('type');
          if (selectionType == 'application/vnd.muikku.field.select' || selectionType == 'application/vnd.muikku.field.checklist') {
            return {muikkuSelectionItem: CKEDITOR.TRISTATE_OFF};
          }
        });
      }
      
      // Option fields

      var optionsElement = function(dialog, elementDefinition, htmlList) {
        CKEDITOR.ui.dialog.uiElement.call(this, dialog, elementDefinition, htmlList, 'div');
      };
      optionsElement.prototype = new CKEDITOR.ui.dialog.uiElement;
      CKEDITOR.tools.extend(optionsElement.prototype, {
        setup: function() {
          if (this.label) {
            var optionsContainer = this.getElement();
            var labelElement = optionsContainer.findOne('.options-element-label');
            if (labelElement === null) {
              labelElement = new CKEDITOR.dom.element('label');
              labelElement.addClass('options-element-label');
              optionsContainer.append(labelElement, true);
            }
            labelElement.setText(this.label);
          }
        },
        clear: function() {
          var element = this.getElement();
          var options = element.find('.selection-option-container');
          for (var i = 0; i < options.count(); i++) {
            options.getItem(i).remove();
          }
        },
        addOption: function() {
          var optionsContainer = this.getElement();
          var optionContainer = new CKEDITOR.dom.element('div');
          optionContainer.addClass('selection-option-container');
          var optionNameField = new CKEDITOR.dom.element('input');
          optionNameField.setAttribute('name', 'optionName');
          optionNameField.setAttribute('type', 'hidden');
          var optionTextField = new CKEDITOR.dom.element('input');
          optionTextField.setAttribute('name', 'optionText');
          optionTextField.setAttribute('type', 'text');
          var optionCorrectField = new CKEDITOR.dom.element('input');
          optionCorrectField.setAttribute('name', 'optionCorrect');
          optionCorrectField.setAttribute('type', 'checkbox');
          optionsContainer.append(optionContainer);
          optionContainer.append(optionNameField);
          optionContainer.append(optionTextField);
          optionContainer.append(optionCorrectField);
          return optionContainer;
        }
      });
      CKEDITOR.dialog.addUIElement('muikkuSelectionOptions', {
        build : function(dialog, elementDefinition, output) {
          return new optionsElement(dialog, elementDefinition, output);
        },
      });
    },
    afterInit: function(editor) {
      var path = this.path;
      var dataProcessor = editor.dataProcessor;
      var dataFilter = dataProcessor && dataProcessor.dataFilter;
      if (dataFilter) {
        dataFilter.addRules({
          elements: {
            'cke:object': function(element) {
              var type = element.attributes.type; 
              if (type == 'application/vnd.muikku.field.select' || type == 'application/vnd.muikku.field.checklist') {
                var fakeElement = editor.createFakeParserElement(element, 'muikku-selection-field', 'object');
                fakeElement.attributes['src'] = path + 'icons/muikku-selection-editor.jpg'; 
                fakeElement.attributes['title'] = editor.lang['muikku-selection'].uiElement;
                return fakeElement;
              }
            }
          }
        }, 5);
      }
    }
  });
  
  // Properties
  
  CKEDITOR.dialog.add('muikkuSelectionDialog', function(editor) {
    return {
      title: editor.lang['muikku-selection'].propertiesDialogTitle,
      minWidth: 400,
      minHeight: 200,
      contents: [
        {
          id: 'tab-basic',
          elements: [
            {
              id: 'fieldType',
              type: 'select',
              label: editor.lang['muikku-selection'].propertiesDialogType,
              items: [
                [editor.lang['muikku-selection'].propertiesDialogTypeDropdown, 'dropdown'],
                [editor.lang['muikku-selection'].propertiesDialogTypeList, 'list'],
                [editor.lang['muikku-selection'].propertiesDialogTypeRadioHor, 'radio-horizontal'],
                [editor.lang['muikku-selection'].propertiesDialogTypeRadioVer, 'radio-vertical'],
                [editor.lang['muikku-selection'].propertiesDialogTypeCheckboxHor, 'checkbox-horizontal'],
                [editor.lang['muikku-selection'].propertiesDialogTypeCheckboxVer, 'checkbox-vertical']
              ],
              setup: function(json) {
                var type = json.listType;
                // TODO refactor DNM to produce proper data
                if (!type && json.name) {
                  type = 'checkbox-vertical';
                }
                else if (!type) {
                  type = 'dropdown';
                }
                else if (type == 'radio') {
                  type = 'radio-vertical';
                }
                else if (type == 'radio_horz') {
                  type = 'radio-horizontal';
                }
                this.setValue(type);
              }
            },
            {
              id: 'options',
              type: 'muikkuSelectionOptions',
              label: editor.lang['muikku-selection'].propertiesDialogOptions,
              setup: function(json) {
                this.clear();
                if (json.options) {
                  for (var i = 0; i < json.options.length; i++) {
                    var optionContainer = this.addOption();
                    optionContainer.findOne('input[name="optionName"]').setValue(json.options[i].name);
                    optionContainer.findOne('input[name="optionText"]').setValue(json.options[i].text);
                    optionContainer.findOne('input[name="optionCorrect"]').$.checked = json.options[i].correct == true;
                  }
                }
              }
            }
          ]
        }
      ],
      onShow: function() {
        var contentJson = editor.getMuikkuFieldDefinition(editor.getSelection().getStartElement());
        this.setupContent(contentJson);
      },
      onOk: function() {
        
        var fieldType = this.getContentElement('tab-basic', 'fieldType').getValue();
        var isMultiselectField = fieldType == 'checkbox-horizontal' || fieldType == 'checkbox-vertical';

        // JSON representation
        
        var contentJson = editor.getMuikkuFieldDefinition(editor.getSelection().getStartElement());
        if (!contentJson.name) {
          contentJson.name = editor.createRandomMuikkuFieldName();
        }
        contentJson.listType = fieldType;
        contentJson.options = [];
        var optionsElement = this.getContentElement('tab-basic', 'options');
        var optionsUiElement = optionsElement.getElement();
        var options = optionsUiElement.find('.selection-option-container');
        for (var i = 0; i < options.count(); i++) {
          var option = options.getItem(i);
          var name = option.findOne('input[name="optionName"]').getValue();
          var text = option.findOne('input[name="optionText"]').getValue();
          var correct = option.findOne('input[name="optionCorrect"]').$.checked;
          contentJson.options.push({
            'name' : name,
            'text' : text,
            'correct' : correct
          });
        }
        
        // Object representation
        
        var object = new CKEDITOR.dom.element('cke:object');
        // TODO checklist -> multiselect refactoring
        object.setAttribute('type', isMultiselectField ? 'application/vnd.muikku.field.checklist' : 'application/vnd.muikku.field.select');
        var paramType = new CKEDITOR.dom.element('cke:param');
        paramType.setAttribute('name', 'type');
        paramType.setAttribute('value', 'application/json');
        var paramContent = new CKEDITOR.dom.element('cke:param');
        paramContent.setAttribute('name', 'content');
        paramContent.setAttribute('value', JSON.stringify(contentJson));
        object.append(paramType);
        object.append(paramContent);
        
        // TODO Default representation

        // CKEditor UI representation
        
        var fakeElement = editor.createFakeElement(object, 'muikku-selection-field', 'object');
        fakeElement.setAttribute('src', CKEDITOR.plugins.getPath('muikku-selection') + 'icons/muikku-selection-editor.jpg'); 
        fakeElement.setAttribute('title', editor.lang['muikku-selection'].uiElement);
        editor.insertElement(fakeElement);
      }
    };
  });
  
}).call(this);