module([
  "//cdn.muikkuverkko.fi/libs/ckeditor/4.5.9/ckeditor.js"
], function(){
  
  $.widget("custom.communicatorNewMessageControllerWidget", {
    options: {
      groupMessagingPermission: false,
      isStudent: true,
      replyMessageId: undefined,
      userRecipients: undefined,
      initialCaption: undefined,
      initialMessage: undefined,
      ckeditor: {
        uploadUrl: '/communicatorAttachmentUploadServlet',
        toolbar: [
          { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
          { name: 'links', items: [ 'Link' ] },
          { name: 'insert', items: [ 'Image', 'Smiley', 'SpecialChar' ] },
          { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
          { name: 'styles', items: [ 'Format' ] },
          { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
          { name: 'tools', items: [ 'Maximize' ] }
        ]
      }
    },
      
    _create : function() {
      var extraPlugins = {
        'widget': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/4.5.9/',
        'lineutils': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/4.5.9/',
        'filetools' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/filetools/4.5.9/',
        'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.9/',
        'notificationaggregator' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notificationaggregator/4.5.9/',
        'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
        'draft' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.3/plugin.min.js',
        'uploadwidget' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadwidget/4.5.9/',
        'uploadimage' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadimage/4.5.9/'
      };
      
      Object.keys(extraPlugins).forEach(function(pluginName){
        var pluginUrl = extraPlugins[pluginName];
        CKEDITOR.plugins.addExternal(pluginName, pluginUrl);
      });
      
      this.hasBeenPopulated = false;
      this.ready = false;
      this.openWhenReady = false;
      
      var self = this;
      self.signature = null;
      mApi().communicator.signatures.read().callback(function (err, signatures) {
        if (signatures.length > 0){
          self.signature = signatures[0].signature;
        }
        self.ready = true;
        if (self.openWhenReady){
          self.open();
        }
      });
    },
    _setup: function(){
      var self = this;
      self.element.click(function(e){
        if (e.target !== e.currentTarget.children[0] && !$(e.target).hasClass("jumbo-dialog-close")){
          e.stopPropagation();
          return false;
        }
        self.close();
      });
    },
    open: function(){
      var self = this;
      
      if (!this.ready){
        self.openWhenReady = true;
        return;
      }
      
      if (!self.hasBeenPopulated){
        renderDustTemplate('communicator/new-message.dust', {signature: self.signature}, function(text) {
          self.element.html(text);
          self.hasBeenPopulated = true;
          self.element.children().addClass('displayed');
          setTimeout(function(){
            self.element.children().addClass('visible');
          }, 30);
          self._setup();
        });
      } else {
        self.element.children().addClass('displayed');
        setTimeout(function(){
          self.element.children().addClass('visible');
        }, 10);
      }
    },
    close: function(){
      var self = this;
      self.element.children().cssAnimate({
        condition: ":visible",
        removeClass: 'visible',
        callback: function(){
          self.element.children().removeClass('displayed');
        }
      });
    }
  });
});