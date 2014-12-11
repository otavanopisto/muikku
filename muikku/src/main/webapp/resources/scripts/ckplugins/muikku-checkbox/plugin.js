(function() {
  'use strict'
  
  
  
  /* global CKEDITOR */

  CKEDITOR.plugins.add('muikku-checkbox', {
    requires: 'dialog,muikku-fields',
    icons: 'muikku-checkbox',
    init: function(editor) {
      editor.addCommand('muikku-checkbox-properties', new CKEDITOR.dialogCommand('muikkuCheckboxDialog'));
      editor.ui.addButton('muikku-checkbox', {
        label: 'Checkbox [localize]',
        command: 'muikku-checkbox-properties',
        toolbar: 'muikku-fields'
      });

      // Context menu support
      
      if (editor.contextMenu) {
        editor.addMenuGroup('muikkuCheckboxGroup');
        editor.addMenuItem('muikkuCheckboxItem', {
          label: 'Checkbox properties [localize]',
          //icon: this.path + 'icons/abbr.png',
          command: 'muikku-checkbox-properties',
          group: 'muikkuCheckboxGroup'
        });
        editor.contextMenu.addListener(function(element) {
          var checkboxField = editor.restoreRealElement(element);
          if (checkboxField.getAttribute('type') == 'application/vnd.muikku.field.checklist') {
            return {muikkuCheckboxItem: CKEDITOR.TRISTATE_OFF};
          }
        });
      }
      
      // Checkbox fields

      var optionsElement = function(dialog, elementDefinition, htmlList) {
        CKEDITOR.ui.dialog.uiElement.call(this, dialog, elementDefinition, htmlList, 'div');
      };
      optionsElement.prototype = new CKEDITOR.ui.dialog.uiElement;
      CKEDITOR.tools.extend(optionsElement.prototype, {
        clear: function() {
          var element = this.getElement();
          while (element.getFirst()) {
            element.getFirst().remove();
          }
        },
        addOption: function() {
          var optionsContainer = this.getElement();
          var optionContainer = new CKEDITOR.dom.element('div');
          optionContainer.addClass('checkbox-option-container');
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
      CKEDITOR.dialog.addUIElement('muikkuCheckboxOptions', {
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
              if (element.attributes.type == 'application/vnd.muikku.field.checklist') {
                var fakeElement = editor.createFakeParserElement(element, 'muikku-checkbox-field', 'object');
                fakeElement.attributes['src'] = path + 'icons/muikku-checkbox-editor.jpg'; 
                fakeElement.attributes['title'] = 'Ruksiboksisysteemijuttula';
                return fakeElement;
              }
            }
          }
        }, 5);
      }
    }
  });
  
  // Properties
  
  CKEDITOR.dialog.add('muikkuCheckboxDialog', function(editor) {
    return {
      title: 'Checkbox Properties [localize]',
      minWidth: 400,
      minHeight: 200,
      contents: [
        {
          id: 'tab-basic',
          elements: [
            {
              id: 'orientation',
              type: 'select',
              label: 'Orientation [localize]',
              items: [
                ['Vertical [localize]', 'vertical'],
                ['Horizontal [localize]', 'horizontal']
              ],
              setup: function(json) {
                this.setValue(json.orientation == 'horizontal' ? 'horizontal' : 'vertical');
              }
            },
            {
              id: 'options',
              type: 'muikkuCheckboxOptions',
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
        
        // JSON representation
        
        var contentJson = editor.getMuikkuFieldDefinition(editor.getSelection().getStartElement());
        if (!contentJson.name) {
          contentJson.name = editor.createRandomMuikkuFieldName();
        }
        contentJson.orientation = this.getContentElement('tab-basic', 'orientation').getValue();
        contentJson.options = [];
        var optionsElement = this.getContentElement('tab-basic', 'options');
        var optionsUiElement = optionsElement.getElement();
        var options = optionsUiElement.find('.checkbox-option-container');
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
        object.setAttribute('type', 'application/vnd.muikku.field.checklist');
        var paramType = new CKEDITOR.dom.element('cke:param');
        paramType.setAttribute('name', 'type');
        paramType.setAttribute('value', 'application/json');
        var paramContent = new CKEDITOR.dom.element('cke:param');
        paramContent.setAttribute('name', 'content');
        paramContent.setAttribute('value', JSON.stringify(contentJson));
        object.append(paramType);
        object.append(paramContent);

        // CKEditor UI representation
        
        var fakeElement = editor.createFakeElement(object, 'muikku-checkbox-field', 'object');
        fakeElement.setAttribute('src', CKEDITOR.plugins.getPath('muikku-checkbox') + 'icons/muikku-checkbox-editor.jpg'); 
        fakeElement.setAttribute('title', 'Ruksiboksisysteemijuttula');
        editor.insertElement(fakeElement);
      }
    };
  });
  
}).call(this);