/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben, Otavan
 *          opisto. All rights reserved.
 */

(function() {
  
  function isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }

  function createFakeParserElement(editor, realElement) {
    var fake = editor.createFakeParserElement(realElement, 'muikku-sorter-field', 'muikkusorterfield', true);
    fake.attributes.src = CKEDITOR.plugins.getPath('muikku-sorterfield') + 'gfx/muikku-placeholder-sorterfield.gif';
    fake.attributes.title = editor.lang['muikku-sorterfield'].uiElement;
    return fake;
  }

  function createFakeElement(editor, realElement) {
    var fake = editor.createFakeElement(realElement, 'muikku-sorter-field', 'muikkusorterfield', true);
    fake.setAttribute('src', CKEDITOR.plugins.getPath('muikku-sorterfield') + 'gfx/muikku-placeholder-sorterfield.gif');
    fake.setAttribute('title', editor.lang['muikku-sorterfield'].uiElement);
    return fake;
  }

  var sorterFieldElement = function(dialog, elementDefinition, htmlList) {
    CKEDITOR.ui.dialog.uiElement.call(this, dialog, elementDefinition, htmlList, 'div');
  };

  sorterFieldElement.prototype = new CKEDITOR.ui.dialog.uiElement;
  CKEDITOR.tools.extend(sorterFieldElement.prototype, {
    buildUi: function(editor) {
      this._lang = editor.lang['muikku-sorterfield'];
      var uiElement = this.getElement();
      
      // Clear previous UI
      
      while (uiElement.getFirst()) {
        uiElement.getFirst().remove();
      }
      
      // Title container
      
      var titleContainer = new CKEDITOR.dom.element('div');
      titleContainer.addClass('sorter-title-container');
      uiElement.append(titleContainer);
      
      var titleLabel = new CKEDITOR.dom.element('label');
      titleLabel.setText(this._lang.propertiesDialogItemTitle);
      titleContainer.append(titleLabel);
      
      var titleFieldContainer = new CKEDITOR.dom.element('div');
      titleFieldContainer.addClass('title-field-container');
      titleContainer.append(titleFieldContainer);
      
      var titleField = new CKEDITOR.dom.element('input');
      titleField.setAttribute('type', 'text');
      titleField.setAttribute('name', 'title');
      titleFieldContainer.append(titleField);
      
      var itemsContainer = new CKEDITOR.dom.element('div');
      itemsContainer.addClass('sorter-items-container');
      uiElement.append(itemsContainer);

      var itemField = new CKEDITOR.dom.element('input');
      itemField.addClass('sorter-item-name');
      itemField.setAttribute('type', 'text');
      itemField.setAttribute('placeholder', this._lang.propertiesDialogNewItem);
      itemsContainer.append(itemField);
      itemField.on('keydown', CKEDITOR.tools.bind(function(evt) {
        var field = evt.sender;
        if (evt.data.getKeystroke() == 13) {
          evt.data.preventDefault();
          evt.data.stopPropagation();
          evt.stop();
          if (field.getValue() !== '') {
            this.addItem(this.generateItemId(), field.getValue());
            field.setValue('');
          }
          return false;
        }
      }, this));
    },
    getTitle: function() {
      return this.getElement().findOne('input[name="title"]').getValue();
    },
    getItems: function() {
      var result = [];
      var items = this.getElement().find('.sorter-item');
      for (var i = 0; i < items.count(); i++) {
        var item = items.getItem(i);
        result.push({
          'id' : item.getAttribute('data-item-id'),
          'name': item.getText()
        });
      }
      return result;
    },
    addItem: function(id, name) {
      var itemContainer = new CKEDITOR.dom.element('div');
      itemContainer.addClass('sorter-item-container');
      
      var item = new CKEDITOR.dom.element('div');
      item.addClass('sorter-item');
      item.setAttribute('data-item-id', id);
      item.setText(name);
      itemContainer.append(item);
      
      var deleteItemLink = new CKEDITOR.dom.element('a');
      deleteItemLink.addClass('icon-delete');
      itemContainer.append(deleteItemLink);
      deleteItemLink.on('click', CKEDITOR.tools.bind(function(evt) {
        evt.sender.getParent().remove();
      }, this));
      
      var itemsContainer = this.getElement().findOne('.sorter-items-container');
      itemsContainer.append(itemContainer);
    },
    generateItemId: function() {
      var id = '';
      while (id == '' || this.getElement().findOne('.sorter-item[data-item-id="' + id + '"]') != null) {
        id = Math.random().toString(36).substr(2, 5);
      }
      return id;
    }
  });

  CKEDITOR.dialog.addUIElement('muikkuSorterFieldElement', {
    build : function(dialog, elementDefinition, output) {
      return new sorterFieldElement(dialog, elementDefinition, output);
    }
  });

  CKEDITOR.dialog.add('muikkusorterfield', function(editor) {
    return {
      title : editor.lang['muikku-sorterfield'].propertiesDialogTitle,
      minWidth : 780,
      minHeight : 480,
      rezisable: 1,
      onShow : function() {
        var contentJson = editor.getMuikkuFieldDefinition(editor.getSelection().getStartElement());
        this.setupContent(contentJson);
        this._.element.on('keydown', function(evt) {
          if (evt.data.getKeystroke() == 13) {
            evt.data.preventDefault();
            evt.data.stopPropagation();
            evt.stop();
            return false;
          }
        }, this, null, 0);
      },
      onOk : function(event) {
        var oldJson = editor.getMuikkuFieldDefinition(editor.getSelection().getStartElement());
        var name = oldJson.name ? oldJson.name : editor.createRandomMuikkuFieldName();
        var newJson = {
          'name': name,
          'title': this.getContentElement('info', 'sorter').getTitle(),
          'items': this.getContentElement('info', 'sorter').getItems()
        };
        var object = new CKEDITOR.dom.element('object');
        object.setAttribute('type', 'application/vnd.muikku.field.sorter');
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
      contents : [{
        id : 'info',
        elements : [{
          id : 'sorter',
          type : 'muikkuSorterFieldElement',
          setup : function(json) {
            this.buildUi(editor);
            if (isEmpty(json)) {
              return;
            }
            
            var titleField = this.getElement().findOne('input[name="title"]');
            titleField.setValue(json.title);
            
            var items = json.items;
            for (var i = 0; i < items.length; i++) {
              this.addItem(items[i].id, items[i].name);
            }
          }
        }]
      }]
    };
  });
  
  CKEDITOR.plugins.add('muikku-sorterfield', {
    requires : 'muikku-fields',
    icons : 'muikku-sorterfield',
    hidpi : true,
    lang : 'fi,en',
    onLoad : function() {
    },
    init : function(editor) {
      editor.ui.addButton('muikku-sorterfield', {
        label : editor.lang['muikku-sorterfield'].toolbarMenu,
        command : 'createMuikkuSorterField'
      });
      editor.addCommand('createMuikkuSorterField', new CKEDITOR.dialogCommand('muikkusorterfield', {}));
      editor.on('doubleclick', function(evt) {
        var element = evt.data.element;
        if (element.is('img') && element.data('cke-real-element-type') == 'muikkusorterfield') {
          evt.data.dialog = 'muikkusorterfield';
        }
      });
      if (editor.contextMenu) {
        editor.addMenuGroup('muikkuSorterFieldGroup');
        editor.addMenuItem('muikkuSorterFieldItem', {
          label : editor.lang['muikku-sorterfield'].propertiesMenu,
          command : 'createMuikkuSorterField',
          group : 'muikkuSorterFieldGroup'
        });
        editor.contextMenu.addListener(function(element, selection) {
          if (element && element.is('img') && !element.isReadOnly() && element.data('cke-real-element-type') == 'muikkusorterfield') {
            return { muikkuSorterFieldItem : CKEDITOR.TRISTATE_OFF };
          }
        });
      }
    },
    afterInit : function(editor) {
      var path = this.path;
      var dataProcessor = editor.dataProcessor;
      var dataFilter = dataProcessor && dataProcessor.dataFilter;
      if (dataFilter) {
        dataFilter.addRules({
          elements : {
            'cke:object' : function(element) {
              var type = element.attributes.type;
              if (type == 'application/vnd.muikku.field.sorter') {
                return createFakeParserElement(editor, element)
              }
            }
          }
        }, 5);
      }
    }
  });

})();
