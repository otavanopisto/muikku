(function() {
  'use strict'
  
  /* global CKEDITOR */
  
  var Confirm = null;
  
  function enquireCancel(editor, original) {
    var lang = editor.lang['draft'];
    var confirm = new Confirm(editor, { 
      text: '<div class="draft-cancel"><span class="draft-label">' + lang.draftRestoredLabel + '</span><span class="draft-text">' + lang.draftRestoredText + '</span>{cancel}</div>',
      links: [{
        'id': 'cancel',
        'text': lang.restoreDraft,
        'click': function () {
          editor.setData(original);
          confirm.hide();
        }
      }]
    });
    
    confirm.show();
  }  
  
  function enquireRestore(editor, draft) {
    var lang = editor.lang['draft'];
    var confirm = new Confirm(editor, { 
      text: '<div class="draft-restore"><span class="draft-label">' + lang.restoreDraftLabel + '</span><span class="draft-text">' + lang.restoreDraftText + '</span>{load}</div>',
      links: [{
        'id': 'load',
        'text': lang.restoreDraft,
        'click': function () {
          var original = editor.getData();
          editor.discardDraft();
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
        Confirm = CKEDITOR.tools.createClass({
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
        
        editor.on('instanceReady', function(event) {
          var draft = event.editor.getDraft();
          if (draft) {
            enquireRestore(editor, draft);
          }

          editor.on('contentChange', function (event) {
            event.editor.storeDraft();
          }); 
        });
        
        editor.getDraft = CKEDITOR.tools.bind(function () {
          var draftData = localStorage.getItem(this.config.draftKey);
          if (draftData) {
            try {
              var draft = JSON.parse(draftData);
              if (draft) {
                return draft; 
              }
            } catch (e) {
            }
          }
          
          return null;
        }, editor);
        
        editor.storeDraft = CKEDITOR.tools.bind(function () {
          localStorage.setItem(this.config.draftKey, JSON.stringify({
            data: this.getData(),
            time: new Date().getTime()
          }));
        }, editor);
        
        editor.discardDraft = CKEDITOR.tools.bind(function () {
          localStorage.removeItem(this.config.draftKey);
        }, editor);
      }
    }
  });
  
}).call(this);