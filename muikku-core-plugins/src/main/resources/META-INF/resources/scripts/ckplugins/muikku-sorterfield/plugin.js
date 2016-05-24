(function() {
  'use strict'
  
  /* global CKEDITOR */

  CKEDITOR.plugins.add('muikku-sorterfield', {
    requires: 'dialog,muikku-fields',
    icons: 'muikku-sorterfield',
    hidpi: true,
    lang: 'fi,en',
    init: function(editor) {
      editor.addCommand('muikku-sorterfield-properties', new CKEDITOR.dialogCommand('muikkuSorterFieldDialog'));
      editor.ui.addButton('muikku-sorterfield', {
        label: editor.lang['muikku-sorterfield'].toolbarMenu,
        command: 'muikku-sorterfield-properties'
      });
      
      // Double-click support

      editor.on('doubleclick', function(evt) {
        var element = evt.data.element;
        if (element.is('img') && element.hasClass('muikku-sorter-field'))
          evt.data.dialog = 'muikkuSorterFieldDialog';
      });

      // Context menu support
      
      if (editor.contextMenu) {
        editor.addMenuGroup('muikkuSorterFieldGroup');
        editor.addMenuItem('muikkuSorterFieldItem', {
          label: editor.lang['muikku-sorterfield'].propertiesMenu,
          command: 'muikku-sorterfield-properties',
          group: 'muikkuSorterFieldGroup'
        });
        editor.contextMenu.addListener(function(element) {
          var sorterField = editor.restoreRealElement(element);
          if (sorterField !== null) {
            if (sorterField.getAttribute('type') === 'application/vnd.muikku.field.sorter') {
              return {muikkuSorterFieldItem: CKEDITOR.TRISTATE_OFF};
            }
          }
        });
      }
      
      // Item fields

      var itemsElement = function(dialog, elementDefinition, htmlList) {
        CKEDITOR.ui.dialog.uiElement.call(this, dialog, elementDefinition, htmlList, 'div');
      };
      itemsElement.prototype = new CKEDITOR.ui.dialog.uiElement;
      CKEDITOR.tools.extend(itemsElement.prototype, {
        setupContainers: function() {
          var uiElement = this.getElement();
          if (this.label) {
            var titleContainer = uiElement.findOne('.sorter-title-container');
            if (titleContainer === null) {
              titleContainer = new CKEDITOR.dom.element('div');
              titleContainer.addClass('sorter-title-container');
              uiElement.append(titleContainer);
              
              var itemLabel = new CKEDITOR.dom.element('label');
              itemLabel.setText(this.label);
              titleContainer.append(itemLabel);
              
              var _this = this;
              var addLink = new CKEDITOR.dom.element('a');
              addLink.addClass('icon-add');
              addLink.on('click', function() {
                _this.addItem(_this.getUniqueItemId());
              });
              titleContainer.append(addLink);
              var addLinkTooltip = new CKEDITOR.dom.element('span');
              addLinkTooltip.setText(editor.lang['muikku-sorterfield'].propertiesDialogAddItemLink);
              addLink.append(addLinkTooltip);
            }
          }
          // Items container
          var itemsContainer = uiElement.findOne('.sorter-items-container');
          if (itemsContainer == null) {
            itemsContainer = new CKEDITOR.dom.element('div');
            itemsContainer.addClass('sorter-items-container');
            uiElement.append(itemsContainer);
          }
        },
        getUniqueItemId: function() {
          var id = '';
          while (id == '' || this.getElement().findOne('.sorter-item-container[data-item-id="' + id + '"]') != null) {
            id = Math.random().toString(36).substr(2, 5);
          }
          return id;
        },
        clear: function() {
          var items = this.getElement().find('.sorter-item-container');
          for (var i = 0; i < items.count(); i++) {
            items.getItem(i).remove();
          }
        },
        addItem: function(id) {
          var itemsContainer = this.getElement().findOne('.sorter-items-container');
          var itemContainer = new CKEDITOR.dom.element('div');
          itemContainer.addClass('sorter-item-container');
          var sortHandle = new CKEDITOR.dom.element('span');
          sortHandle.addClass('sort-handle');
          sortHandle.addClass('icon-move');
          itemContainer.setAttribute('data-item-id', id);
          var itemTextField = new CKEDITOR.dom.element('input');
          itemTextField.setAttribute('name', 'itemText');
          itemTextField.setAttribute('type', 'text');
          itemsContainer.append(itemContainer);
          itemContainer.append(sortHandle);
          itemContainer.append(itemTextField);
          // Deletion
          var deleteLink = new CKEDITOR.dom.element('a');
          var _this = this;
          deleteLink.addClass('icon-delete');
          deleteLink.on('click', function() {
            // WUT?!
          });
          var deleteTooltip = new CKEDITOR.dom.element('span');
          deleteTooltip.setText(editor.lang['muikku-sorterfield'].propertiesDialogDeleteItemLink);
          deleteLink.append(deleteTooltip);
          itemContainer.append(deleteLink);
          // Sorting
          $(itemsContainer.$).sortable({
            handle: '.sort-handle',
            axis: 'y'
          });
          return itemContainer;
        }
      });

      CKEDITOR.dialog.addUIElement('muikkuSorterFieldItems', {
        build : function(dialog, elementDefinition, output) {
          return new itemsElement(dialog, elementDefinition, output);
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
              if (type == 'application/vnd.muikku.field.sorter') {
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
                var fakeElement = editor.createFakeParserElement(element, 'muikku-sorter-field', 'object');
                fakeElement.attributes['src'] = path + 'gfx/muikku-placeholder-sorterfield.gif'; 
                fakeElement.attributes['title'] = editor.lang['muikku-sorterfield'].uiElement;
                return fakeElement;
              }
            }
          }
        }, 5);
      }
    }
  });
  
  // Properties
  
  CKEDITOR.dialog.add('muikkuSorterFieldDialog', function(editor) {
    return {
      title: editor.lang['muikku-sorterfield'].propertiesDialogTitle,
      minWidth: 420,
      minHeight: 200,
      contents: [
        {
          id: 'tab-basic',
          elements: [
            {
              id: 'items',
              type: 'muikkuSorterFieldItems',
              label: editor.lang['muikku-sorterfield'].propertiesDialogItems,
              setup: function(json) {
                this.setupContainers();
                this.clear();
                if (json.items && json.items.length > 0) {
                  for (var i = 0; i < json.items.length; i++) {
                    var itemContainer = this.addItem(json.items[i].id);
                    itemContainer.findOne('input[name="itemText"]').setValue(json.items[i].name);
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
        var contentJson = editor.getMuikkuFieldDefinition(editor.getSelection().getStartElement());
        if (!contentJson.name) {
          contentJson.name = editor.createRandomMuikkuFieldName();
        }
        contentJson.items = [];
        var itemsElement = this.getContentElement('tab-basic', 'items');
        var itemsUiElement = itemsElement.getElement();
        var items = itemsUiElement.find('.sorter-item-container');
        for (var i = 0; i < items.count(); i++) {
          var item = items.getItem(i);
          var id = item.getAttribute('data-item-id');
          var name = item.findOne('input[name="itemText"]').getValue();
          contentJson.items.push({
            'id' : id,
            'name' : name
          });
        }
        
        // Object representation
        
        var object = new CKEDITOR.dom.element('cke:object');
        object.setAttribute('type', 'application/vnd.muikku.field.sorter');
        var paramType = new CKEDITOR.dom.element('cke:param');
        paramType.setAttribute('name', 'type');
        paramType.setAttribute('value', 'application/json');
        var paramContent = new CKEDITOR.dom.element('cke:param');
        paramContent.setAttribute('name', 'content');
        paramContent.setAttribute('value', JSON.stringify(contentJson));
        object.append(paramType);
        object.append(paramContent);
        
        // CKEditor UI representation
        
        var fakeElement = editor.createFakeElement(object, 'muikku-sorter-field', 'object');
        fakeElement.setAttribute('src', CKEDITOR.plugins.getPath('muikku-sorterfield') + 'gfx/muikku-placeholder-sorterfield.gif'); 
        fakeElement.setAttribute('title', editor.lang['muikku-sorterfield'].uiElement);
        editor.insertElement(fakeElement);
      }
    };
  });
  
}).call(this);