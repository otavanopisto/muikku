module([
], function(){
  $.widget("custom.communicatorBodyControllerWidget", {
    options: {
      maxResults: 31
    },
    _create: function(){
      this._render();
      this.firstResult = 0;
    },
    _render: function(){
      var self = this;
      renderDustTemplate('communicator/body.dust', {messages: this.messages}, function(text) {
        self.element.html(text);
        self._setupEvents();
      });
    },
    _setupEvents: function(){
      this.element.find("input").bind("click", function(e){
        $(e.target).parents(".application-list-item").toggleClass("selected");
      });
    },
    _processMessages: function(err, messages){
      if (err){
        $('.notification-queue').notificationQueue("error", err.message);
      } else {
        this.messages = messages;
        console.log(messages);
        this._render();
      }
    },
    loadFolder(id){
      var params = {
        firstResult: this.firstResult,
        maxResults: this.options.maxResults
      }
      
      switch(id){
        case "inbox":
          params.onlyUnread = false;
          mApi().communicator.items.read(params).callback(this._processMessages.bind(this));
          break;
        case "unread":
          params.onlyUnread = true;
          mApi().communicator.items.read(params).callback(this._processMessages.bind(this));
          break;
      }
    },
    loadLabel(id){
      console.log("load label", id);
    }
  });
});