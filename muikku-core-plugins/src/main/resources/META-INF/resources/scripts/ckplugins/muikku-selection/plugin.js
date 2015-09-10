(function() {
  'use strict'
  
  /* global CKEDITOR */

  CKEDITOR.plugins.add('muikku-selection', {
    requires: 'dialog,muikku-fields',
    icons: 'muikku-selection',
    hidpi: true,
    lang: 'fi,en',
    init: function(editor) {
      editor.addCommand('muikku-selection-properties', new CKEDITOR.dialogCommand('muikkuSelectionDialog'));
      editor.ui.addButton('muikku-selection', {
        label: editor.lang['muikku-selection'].toolbarMenu,
        command: 'muikku-selection-properties'
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
          if (selectionField !== null) {
              var selectionType = selectionField.getAttribute('type');
              if (selectionType === 'application/vnd.muikku.field.select' || selectionType === 'application/vnd.muikku.field.multiselect') {
                return {muikkuSelectionItem: CKEDITOR.TRISTATE_OFF};
              }
          }
        });
      }
      
      // Option fields

      var optionsElement = function(dialog, elementDefinition, htmlList) {
        CKEDITOR.ui.dialog.uiElement.call(this, dialog, elementDefinition, htmlList, 'div');
      };
      optionsElement.prototype = new CKEDITOR.ui.dialog.uiElement;
      CKEDITOR.tools.extend(optionsElement.prototype, {
        optionNames: [],
        setupContainers: function() {
          // Title label container
          var uiElement = this.getElement();
          if (this.label) {
            var titleContainer = uiElement.findOne('.selection-title-container');
            if (titleContainer === null) {
              titleContainer = new CKEDITOR.dom.element('div');
              titleContainer.addClass('selection-title-container');
              uiElement.append(titleContainer);
              
              var optionLabel = new CKEDITOR.dom.element('label');
              optionLabel.setText(this.label);
              titleContainer.append(optionLabel);
              
              var _this = this;
              var addLink = new CKEDITOR.dom.element('a');
              addLink.addClass('icon-add');
              addLink.on('click', function() {
                _this.addOption();
              });
              titleContainer.append(addLink);
              var addLinkTooltip = new CKEDITOR.dom.element('span');
              addLinkTooltip.setText(editor.lang['muikku-selection'].propertiesDialogAddOptionLink);
              addLink.append(addLinkTooltip);
              
              var correctLabel = new CKEDITOR.dom.element('label');
              correctLabel.addClass('icon-checkmark');
              titleContainer.append(correctLabel);
              var correctTooltip = new CKEDITOR.dom.element('span');
              correctTooltip.setText(editor.lang['muikku-selection'].propertiesDialogCorrectTooltip);
              correctLabel.append(correctTooltip);
            }
          }
          // Options container
          var optionsContainer = uiElement.findOne('.selection-options-container');
          if (optionsContainer == null) {
            optionsContainer = new CKEDITOR.dom.element('div');
            optionsContainer.addClass('selection-options-container');
            uiElement.append(optionsContainer);
          }
        },
        getUniqueOptionName: function() {
          var i = 1;
          while (this.optionNames.indexOf(i.toString()) > -1)
            i++;
          this.optionNames.push(i.toString());
          return i.toString();
        },
        clear: function() {
          this.optionNames = [];
          var element = this.getElement();
          var options = element.find('.selection-option-container');
          for (var i = 0; i < options.count(); i++) {
            options.getItem(i).remove();
          }
        },
        getOptionCount: function() {
          return this.getElement().find('.selection-option-container').count();
        },
        addOption: function(optionName) {
          var optionsContainer = this.getElement().findOne('.selection-options-container');
          var optionContainer = new CKEDITOR.dom.element('div');
          optionContainer.addClass('selection-option-container');
          var sortHandle = new CKEDITOR.dom.element('span');
          sortHandle.addClass('sort-handle');
          sortHandle.addClass('icon-move');
          var optionNameField = new CKEDITOR.dom.element('input');
          optionNameField.setAttribute('name', 'optionName');
          optionNameField.setAttribute('type', 'hidden');
          if (optionName)
            this.optionNames.push(optionName);
          optionNameField.setValue(optionName ? optionName : this.getUniqueOptionName());
          var optionTextField = new CKEDITOR.dom.element('input');
          optionTextField.setAttribute('name', 'optionText');
          optionTextField.setAttribute('type', 'text');
          var optionCorrectField = new CKEDITOR.dom.element('input');
          optionCorrectField.setAttribute('name', 'optionCorrect');
          optionCorrectField.setAttribute('type', 'checkbox');
          optionsContainer.append(optionContainer);
          optionContainer.append(sortHandle);
          optionContainer.append(optionNameField);
          optionContainer.append(optionTextField);
          optionContainer.append(optionCorrectField);
          // Deletion
          var deleteLink = new CKEDITOR.dom.element('a');
          var _this = this;
          deleteLink.addClass('icon-delete');
          deleteLink.on('click', function() {
            // TODO how do you find a parent with class name in CKEditor?!
            var option = this.getParent(); 
            var name = option.findOne('input[name="optionName"]').getValue();
            var index = _this.optionNames.indexOf(name);
            _this.optionNames.splice(index, 1); 
            optionContainer.remove();
          });
          var deleteTooltip = new CKEDITOR.dom.element('span');
          deleteTooltip.setText(editor.lang['muikku-selection'].propertiesDialogDeleteOptionLink);
          deleteLink.append(deleteTooltip);
          optionContainer.append(deleteLink);
          // Sorting
          $(optionsContainer.$).sortable({
            handle: '.sort-handle',
            axis: 'y'
          });
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
              if (type == 'application/vnd.muikku.field.select' || type == 'application/vnd.muikku.field.multiselect') {
                // Content JSON
                var content = {};
                for (var i = 0; i < element.children.length; i++) {
                  if (element.children[i].name == 'cke:param') {
                    if (element.children[i].attributes.name == 'content') {
                      content = element.children[i].attributes.value; 
                      break;
                    }
                  }
                }
                var contentJson = JSON.parse(content);
                // Placeholder image based on content JSON
                var fakeElementImage = '';
                switch (contentJson.listType) {
                case 'dropdown':
                  fakeElementImage = 'muikku-placeholder-dropdown.gif';
                  break;
                case 'list':
                  fakeElementImage = 'muikku-placeholder-list.gif';
                  break;
                case 'radio-horizontal':
                case 'radio-vertical':
                  fakeElementImage = 'muikku-placeholder-radio.gif';
                  break;
                case 'checkbox-horizontal':
                case 'checkbox-vertical':
                  fakeElementImage = 'muikku-placeholder-checkbox.gif';
                  break;
                }
                // Fake element
                var fakeElement = editor.createFakeParserElement(element, 'muikku-selection-field', 'object');
                fakeElement.attributes['src'] = path + 'gfx/' + fakeElementImage; 
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
      minWidth: 420,
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
                this.setValue(json.listType ? json.listType : 'dropdown');
              }
            },
            {
              id: 'options',
              type: 'muikkuSelectionOptions',
              label: editor.lang['muikku-selection'].propertiesDialogOptions,
              setup: function(json) {
                this.setupContainers();
                this.clear();
                if (json.options && json.options.length > 0) {
                  for (var i = 0; i < json.options.length; i++) {
                    var optionIndex = json.options[i].name;
                    var optionContainer = this.addOption(json.options[i].name);
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
        object.setAttribute('type', isMultiselectField ? 'application/vnd.muikku.field.multiselect' : 'application/vnd.muikku.field.select');
        var paramType = new CKEDITOR.dom.element('cke:param');
        paramType.setAttribute('name', 'type');
        paramType.setAttribute('value', 'application/json');
        var paramContent = new CKEDITOR.dom.element('cke:param');
        paramContent.setAttribute('name', 'content');
        paramContent.setAttribute('value', JSON.stringify(contentJson));
        object.append(paramType);
        object.append(paramContent);
        
        // Default UI representation
        
        var fakeElementImage = '';
        switch (fieldType) {
        case 'dropdown':
        case 'list':
          var select = new CKEDITOR.dom.element('select');
          select.setAttribute('name', contentJson.name);
          if (fieldType == 'list') {
            select.setAttribute('size', contentJson.options.length);
          }
          for (var i = 0; i < contentJson.options.length; i++) {
            var option = new CKEDITOR.dom.element('option');
            option.setAttribute('value', contentJson.options[i].name);
            option.setText(contentJson.options[i].text);
          }
          object.append(select);
          fakeElementImage = 'muikku-placeholder-' + fieldType + '.gif';
          break;
        case 'radio-horizontal':
        case 'radio-vertical':
          for (var i = 0; i < contentJson.options.length; i++) {
            var input = new CKEDITOR.dom.element('input');
            input.setAttribute('name', contentJson.name);
            input.setAttribute('type', 'radio');
            input.setAttribute('value', contentJson.options[i].name);
            var label = new CKEDITOR.dom.element('label');
            label.setText(contentJson.options[i].text);
            object.append(input);
            object.append(label);
            if (fieldType == 'radio-vertical') {
              object.append(new CKEDITOR.dom.element('br'));
            }
          }
          fakeElementImage = 'muikku-placeholder-radio.gif';
          break;
        case 'checkbox-horizontal':
        case 'checkbox-vertical':
          for (var i = 0; i < contentJson.options.length; i++) {
            var input = new CKEDITOR.dom.element('input');
            input.setAttribute('name', contentJson.name);
            input.setAttribute('type', 'checkbox');
            input.setAttribute('value', contentJson.options[i].name);
            var label = new CKEDITOR.dom.element('label');
            label.setText(contentJson.options[i].text);
            object.append(input);
            object.append(label);
            if (fieldType == 'checkbox-vertical') {
              object.append(new CKEDITOR.dom.element('br'));
            }
          }
          fakeElementImage = 'muikku-placeholder-checkbox.gif';
          break;
        }

        // CKEditor UI representation
        
        var fakeElement = editor.createFakeElement(object, 'muikku-selection-field', 'object');
        fakeElement.setAttribute('src', CKEDITOR.plugins.getPath('muikku-selection') + 'gfx/' + fakeElementImage); 
        fakeElement.setAttribute('title', editor.lang['muikku-selection'].uiElement);
        editor.insertElement(fakeElement);
      }
    };
  });
  
}).call(this);