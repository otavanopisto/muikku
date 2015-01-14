/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben, Otavan
 *          opisto. All rights reserved.
 */

(function() {

  function excelStyleLetterIndex(numericIndex) {   
    var result = "";
    var ALPHABET_SIZE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".length;
    
    do {
      var charIndex = numericIndex % ALPHABET_SIZE;
      numericIndex = (numericIndex / ALPHABET_SIZE) | 0;
      numericIndex -= 1;
      
      result = (String.fromCharCode(charIndex + "A".charCodeAt(0))) + result;
    } while (numericIndex > -1);
    
    return result;
  }

  function isEmpty(obj) {
    for ( var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }

    return true;
  }

  function createFakeParserElement(editor, realElement) {
    var fake = editor.createFakeParserElement(realElement,
        'muikku-connect-field', 'muikkuconnectfield', true);
    fake.attributes.src = CKEDITOR.plugins.getPath('muikku-connectfield')
        + 'gfx/muikku-placeholder-connectfield.gif';
    fake.attributes.title = editor.lang['muikku-textfield'].uiElement;
    return fake;
  }

  function createFakeElement(editor, realElement) {
    var fake = editor.createFakeElement(realElement, 'muikku-connect-field',
        'muikkuconnectfield', true);
    fake.setAttribute('src', CKEDITOR.plugins.getPath('muikku-connectfield')
        + 'gfx/muikku-placeholder-connectfield.gif');
    fake.setAttribute('title', editor.lang['muikku-textfield'].uiElement);
    return fake;
  }
  
  function generateConnections(numConnections) {
    var result = [];
    for (var i=0; i < numConnections; i++) {
      result.push({
        'field': '' + (i + 1),
        'counterpart': excelStyleLetterIndex(i)
      })
    }
    return result;
  }
  
  function lookup(fieldName, fieldValue, objects) {
    for (var i = 0; i < objects.length; i++) {
      if (objects[i][fieldName] === fieldValue) {
        return objects[i];
      }
    }
  }

  var pairsElement = function(dialog, elementDefinition, htmlList) {
    CKEDITOR.ui.dialog.uiElement.call(this, dialog, elementDefinition,
        htmlList, 'div');
  };

  pairsElement.prototype = new CKEDITOR.ui.dialog.uiElement;
  CKEDITOR.tools
      .extend(
          pairsElement.prototype,
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
                    .findOne('.connectfield-title-container');
                if (titleContainer === null) {
                  titleContainer = new CKEDITOR.dom.element('div');
                  titleContainer.addClass('connectfield-title-container');
                  uiElement.append(titleContainer);

                  var optionLabel = new CKEDITOR.dom.element('label');
                  optionLabel.setText(this.label);
                  titleContainer.append(optionLabel);

                  var _this = this;
                  var addLink = new CKEDITOR.dom.element('a');
                  addLink.addClass('icon-add');
                  addLink.on('click', function() {
                    _this.addPair('', '');
                  });
                  titleContainer.append(addLink);
                  var addLinkTooltip = new CKEDITOR.dom.element('span');
                  addLinkTooltip.setText(this.addPairsLink);
                  addLink.append(addLinkTooltip);
                }
              }
              // Options container
              var optionsContainer = uiElement
                  .findOne('.connectfield-elements-container');
              if (optionsContainer == null) {
                optionsContainer = new CKEDITOR.dom.element('div');
                optionsContainer.addClass('connectfield-elements-container');
                uiElement.append(optionsContainer);
              }
            },
            addPair : function(left, right) {
              var optionsContainer = this.getElement().findOne(
                  '.connectfield-elements-container');
              var optionContainer = new CKEDITOR.dom.element('div');
              optionContainer.addClass('connectfield-element-container');

              var optionLeftField = new CKEDITOR.dom.element('input');
              optionLeftField.setAttribute('name', 'left');
              optionLeftField.setAttribute('type', 'text');
              optionLeftField.setAttribute('value', left);
              optionContainer.append(optionLeftField);

              var optionRightField = new CKEDITOR.dom.element('input');
              optionRightField.setAttribute('name', 'right');
              optionRightField.setAttribute('type', 'text');
              optionRightField.setAttribute('value', right);
              optionContainer.append(optionRightField);

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
              deleteTooltip.setText(this.deletePairsLink);
              deleteLink.append(deleteTooltip);
              optionContainer.append(deleteLink);
              optionsContainer.append(optionContainer);
            },
            removePair : function(pairIndex) {
              var nodes = this.getElement()
                  .find('.connectfield-element-container');
              nodes.getItem(pairIndex).remove();
            },
            getPair : function(pairIndex) {
              var elem = this.getElement()
                             .find('.connectfield-element-container')
                             .getItem(pairIndex);
              return {
                'field': elem.findOne('input[name="left"]').getValue(),
                'counterpart': elem.findOne('input[name="right"]').getValue()
              };
            },
            getFields : function() {
              var result = [];
              for (var i=0, l=this.getPairsCount(); i<l; i++) {
                result.push({
                  'name' : "" + (i + 1),
                  'text' : this.getPair(i).field
                })
              }
              return result;
            },
            getCounterparts : function() {
              var result = [];
              for (var i=0, l=this.getPairsCount(); i<l; i++) {
                result.push({
                  'name' : excelStyleLetterIndex(i),
                  'text' : this.getPair(i).counterpart
                })
              }
              return result;
            },
            getPairsCount : function() {
              return this.getElement().find('.connectfield-element-container')
                  .count();
            }

          });

  CKEDITOR.dialog.addUIElement('muikkuConnectFieldPairs', {
    build : function(dialog, elementDefinition, output) {
      return new pairsElement(dialog, elementDefinition, output);
    },
  });

  CKEDITOR.dialog.add('muikkuconnectfield', function(editor) {
    return {
      title : editor.lang['muikku-connectfield'].propertiesDialogTitle,
      minWidth : 420,
      minHeight : 310,
      onShow : function() {
        var contentJson = editor.getMuikkuFieldDefinition(editor.getSelection()
            .getStartElement());
        this.setupContent(contentJson);
      },
      onOk : function(event) {
        var oldJson = editor.getMuikkuFieldDefinition(editor.getSelection()
            .getStartElement());
        var name;
        if (oldJson.name) {
          name = oldJson.name;
        } else {
          name = editor.createRandomMuikkuFieldName();
        }

        var fields = this.getContentElement('info', 'pairs').getFields();
        var counterparts = this.getContentElement('info', 'pairs').getCounterparts();

        var newJson = {
          'name' : name,
          'fields' : fields,
          'counterparts' : counterparts,
          'connections' : generateConnections(fields.length)
        };

        var object = new CKEDITOR.dom.element('object');
        object.setAttribute('type', 'application/vnd.muikku.field.connect');
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
        elements : [ {
          id : 'pairs',
          type : 'muikkuConnectFieldPairs',
          label : editor.lang['muikku-connectfield'].propertiesDialogPairsLabel,
          addPairsLink : editor.lang['muikku-connectfield'].propertiesDialogAddPairsLink,
          deletePairsLink : editor.lang['muikku-connectfield'].propertiesDialogDeletePairsLink,
          setup : function(json) {
            this.clear();
            this.setupContainers();
            if (isEmpty(json)) {
              return;
            }
            for (var i = 0; i < json.fields.length; i++) {
              var left = lookup('name', '' + (i + 1), json.fields).text;
              var rightName = lookup('field', '' + (i + 1), json.connections).counterpart;
              var right = lookup('name', rightName, json.counterparts).text;
              this.addPair(left, right);
            }
          }
        } ]
      } ]
    };
  });

  CKEDITOR.plugins.add('muikku-connectfield', {
    requires : 'muikku-fields',
    icons : 'muikku-connectfield',
    hidpi : true,
    lang : 'fi,en',
    onLoad : function() {
    },
    init : function(editor) {
      editor.ui.addButton('muikku-connectfield', {
        label : editor.lang['muikku-connectfield'].toolbarMenu,
        command : 'createMuikkuConnectField'
      });
      editor.addCommand('createMuikkuConnectField', new CKEDITOR.dialogCommand(
          'muikkuconnectfield', {}));
      editor.on('doubleclick', function(evt) {
        var element = evt.data.element;

        if (element.is('img')
            && element.data('cke-real-element-type') == 'muikkuconnectfield')
          evt.data.dialog = 'muikkuconnectfield';
      });
      if (editor.contextMenu) {
        editor.addMenuGroup('muikkuConnectFieldGroup');
        editor.addMenuItem('muikkuConnectFieldItem', {
          label : editor.lang['muikku-connectfield'].propertiesMenu,
          command : 'createMuikkuConnectField',
          group : 'muikkuConnectFieldGroup'
        });
        editor.contextMenu.addListener(function(element, selection) {
          if (element && element.is('img') && !element.isReadOnly()
              && element.data('cke-real-element-type') == 'muikkuconnectfield')
            return {
              muikkuConnectFieldItem : CKEDITOR.TRISTATE_OFF
            };
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
              if (type == 'application/vnd.muikku.field.connect') {
                return createFakeParserElement(editor, element)
              }
            }
          }
        }, 5);
      }
    }
  });

})();