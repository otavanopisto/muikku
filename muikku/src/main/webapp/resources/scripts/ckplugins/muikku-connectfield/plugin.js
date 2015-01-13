/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben, Otavan
 *          opisto. All rights reserved.
 */

(function() {
  CKEDITOR.plugins
      .add(
          'muikku-connectfield',
          {
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
              editor.addCommand('createMuikkuConnectField',
                  new CKEDITOR.dialogCommand('muikkuconnectfield', {}));
              editor
                  .on(
                      'doubleclick',
                      function(evt) {
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
                editor.contextMenu
                    .addListener(function(element, selection) {
                      if (element
                          && element.is('img')
                          && !element.isReadOnly()
                          && element.data('cke-real-element-type') == 'muikkuconnectfield')
                        return {
                          muikkuTextFieldItem : CKEDITOR.TRISTATE_OFF
                        };
                    });
              }
            },
            afterInit : function(editor) {
              var path = this.path;
              var dataProcessor = editor.dataProcessor;
              var dataFilter = dataProcessor && dataProcessor.dataFilter;
              if (dataFilter) {
                dataFilter
                    .addRules(
                        {
                          elements : {
                            'cke:object' : function(element) {
                              var type = element.attributes.type;
                              if (type == 'application/vnd.muikku.field.connect') {
                                var fakeElement = editor
                                    .createFakeParserElement(element,
                                        'muikku-connect-field', 'muikkuconnectfield');
                                fakeElement.attributes['src'] = path
                                    + 'gfx/muikku-placeholder-connectfield.gif';
                                fakeElement.attributes['title'] = editor.lang['muikku-connectfield'].uiElement;
                                return fakeElement;
                              }
                            }
                          }
                        }, 5);
              }
            }
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

        var newJson = {};

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
          id : 'counterparts',
          /*
           * type : 'muikkuConnectFieldCounterparts', addOptionLink :
           * "LOCALIZE", deleteOptionLink : "LOCALIZE", correctTooltip :
           * "LOCALIZE", setup : function(json) { this.clear();
           * this.setupContainers(); if (isEmpty(json)) { return; } for (var i =
           * 0; i < json.counterparts.length; i++) { var name =
           * json.counterparts[i].name; var text = json.counterparts[i].text;
           * this.addCounterpart(name, text); } }
           */
          type : 'textarea',
          label : "LOCALIZE",
          setup : function(json) {
            if (!json) {
              return;
            }
            this.setValue(JSON.stringify(json.counterparts));
          }
        }, {
          id : 'fields',
          /*
           * type : 'muikkuConnectFieldCounterparts', addOptionLink :
           * "LOCALIZE", deleteOptionLink : "LOCALIZE", correctTooltip :
           * "LOCALIZE", setup : function(json) { this.clear();
           * this.setupContainers(); if (isEmpty(json)) { return; } for (var i =
           * 0; i < json.counterparts.length; i++) { var name =
           * json.counterparts[i].name; var text = json.counterparts[i].text;
           * this.addCounterpart(name, text); } }
           */
          type : 'textarea',
          label : "LOCALIZE",
          setup : function(json) {
            if (!json) {
              return;
            }
            this.setValue(JSON.stringify(json.fields));
          }
        } ]
      } ]
    };
  });
})();