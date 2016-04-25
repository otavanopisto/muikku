(function() {
  'use strict'
  
  /* global CKEDITOR */
  
  var Confirm = CKEDITOR.tools.createClass({
    base: CKEDITOR.plugins.notification,
    
    $ : function(editor, options) {
      var message = options.text;
      
      if (options.links) {
        for (var i = 0, l = options.links.length; i < l; i++) {
          var link = options.links[i];
          var clickRef = CKEDITOR.tools.addFunction(link.click);
          var linkHtml = '<a href="javascript:CKEDITOR.tools.callFunction(' + clickRef + ')">' + link.text + '</a>';
          message = message.replace('{' + link.id + '}', linkHtml);
        }
      }
      
      this.base(editor, {
        duration: 60000,
        message: message
      });
    }
  });
  
  function enquireCancel(editor, original) {
    var confirm = new Confirm(editor, { 
      text: '<div class="draft-cancel"><span class="draft-label">Vedos palautettu.</span><span class="draft-text">Voit palauttaa alkuperäisen sisällön klikkaamalla</span>{cancel}</div>',
      links: [{
        'id': 'cancel',
        'text': 'tästä',
        'click': function () {
          editor.setData(original);
          confirm.hide();
        }
      }]
    });
    
    confirm.show();
  }  
  
  function enquireRestore(editor, draft) {
    var confirm = new Confirm(editor, { 
      text: '<div class="draft-restore"><span class="draft-label">Dokumentista on olemassa uudempi vedos</span><span class="draft-text">lataa vedos klikkaamalla</span>{load}</div>',
      links: [{
        'id': 'load',
        'text': 'tästä',
        'click': function () {
          var original = editor.getData();
          localStorage.removeItem(editor.config.draftKey);
          editor.setData(draft.data);
          enquireCancel(editor, original);
          confirm.hide();
        }
      }]
    });
    
    confirm.show();
  }

  CKEDITOR.plugins.add('draft', {
    requires: ['notification','change'],
    lang: 'fi,en',
    init: function (editor) {
      if (window.localStorage) {
        editor.on( 'instanceReady', function(event) {
          var draftKey = editor.config.draftKey;
          
          var draftData = localStorage.getItem(draftKey);
          if (draftData) {
            var draft = JSON.parse(draftData);
            if (draft/** && draft.time >= editor.config.draftExpired**/) {
              enquireRestore(editor, draft);
            }
          }

          editor.on('contentChange', function (event) {
            localStorage.setItem(draftKey, JSON.stringify({
              data: event.editor.getData(),
              time: new Date().getTime()
            }));
          }); 
        });
      }
    }
  });
  
}).call(this);