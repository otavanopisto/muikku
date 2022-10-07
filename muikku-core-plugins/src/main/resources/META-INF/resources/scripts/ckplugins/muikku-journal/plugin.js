(function() {
  'use strict'
  
  /* global CKEDITOR */

  CKEDITOR.plugins.add('muikku-journal', {
    requires: 'dialog,muikku-fields',
    icons: 'muikkumemofield',
    hidpi: true,
    lang: 'fi,en',
    init: function(editor) {
      editor.ui.addButton('muikku-journal', {
        label: editor.lang['muikku-journal'].toolbarMenu,
        command: 'createMuikkuJournal',
        toolbar: 'insert,20'
      });
      editor.addCommand('createMuikkuJournal', {
        exec: function (editor) {

          // JSON representation
          
          var contentJson = {};
          contentJson.name = editor.createRandomMuikkuFieldName();
          
          // Object representation
          
          var object = new CKEDITOR.dom.element('cke:object');
          object.setAttribute('type', 'application/vnd.muikku.field.journal');
          var paramType = new CKEDITOR.dom.element('cke:param');
          paramType.setAttribute('name', 'type');
          paramType.setAttribute('value', 'application/json');
          var paramContent = new CKEDITOR.dom.element('cke:param');
          paramContent.setAttribute('name', 'content');
          paramContent.setAttribute('value', JSON.stringify(contentJson));
          object.append(paramType);
          object.append(paramContent);

          // Default UI representation
          
          var input = new CKEDITOR.dom.element('input');
          input.setAttribute('name', contentJson.name);
          input.setAttribute('type', 'file');
          object.append(input);

          // CKEditor UI representation
          
          var fakeElement = editor.createFakeElement(object, 'muikku-journal', 'object');
          fakeElement.setAttribute('src', CKEDITOR.plugins.getPath('muikku-journal') + 'gfx/muikku-placeholder-memofield.gif'); 
          fakeElement.setAttribute('title', editor.lang['muikku-journal'].uiElement);
          editor.insertElement(fakeElement);
        }
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
              if (type == 'application/vnd.muikku.field.journal') {
                var fakeElement = editor.createFakeParserElement(element, 'muikku-journal', 'object');
                fakeElement.attributes['src'] = path + 'gfx/muikku-placeholder-memofield.gif'; 
                fakeElement.attributes['title'] = editor.lang['muikku-journal'].uiElement;
                return fakeElement;
              }
            }
          }
        }, 5);
      }
    }
  });
  
  CKEDITOR.dialog.add('muikkujournal', function (editor) {
    return {
      title : editor.lang['muikku-journal'].propertiesDialogTitle,
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

        var newJson = {
          'name': name,
          'rows': this.getContentElement('info', 'rows').getValue(),
          'example': this.getContentElement('info', 'example').getValue(),
          'richedit': this.getContentElement('info', 'richedit').getValue()
        };

        var object = new CKEDITOR.dom.element('object');
        object.setAttribute('type', 'application/vnd.muikku.field.journal');
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
            id: 'rows',
            type: 'text',
            label: editor.lang['muikku-journal'].propertiesDialogRows,
            setup: function(json) {
              this.setValue(json.rows);
            }
          },
          {
            id: 'example',
            type: 'textarea',
            label: editor.lang['muikku-journal'].propertiesDialogExample,
            setup: function(json) {
              this.setValue(json.example);
            }
          },
          {
            id: 'richedit',
            type: 'checkbox',
            label: editor.lang['muikku-journal'].propertiesDialogRichEdit,
            setup: function(json) {
              this.setValue(json.richedit);
            }
          }
        ]
      } ]
    };
  });
  
}).call(this);