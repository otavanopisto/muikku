module([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/communicator/body/message.js.jsf"
], function(){
  $.widget("custom.communicatorBodyControllerWidget", {
    options: {
      maxResults: 31,
      onSelect: null,
      onSelectManyChange: null
    },
    _create: function(){
      this._render();
      
      this.folderId = null;
      this.labelId = null;
      
      this.firstResult = 0;
      
      this.selectTimeout = null;
      this.firstWasSelected = false;
      this.selectedElements = {};
    },
    _clean: function(){
      this.folderId = null;
      this.labelId = null;
      this.firstWasSelected = false;
      this.selectedElements = {};
      this.element.html("");
    },
    _render: function(){
      var self = this;
      renderDustTemplate('communicator/body.dust', {messages: this.messages}, function(text) {
        self.element.html(text);
        self._setupEvents();
      });
    },
    _setupEvents: function(){
      if (!this.messages){
        return;
      }
      
      var self = this;
      $applicationList = this.element.find(".application-list");
      this.messages.forEach(function(message, index){
        return $("<div></div>").communicatorBodyMessageControllerWidget({
          message: message,
          onMessageSelected: function(wasTouchEvent){
            self.element.children().children().communicatorBodyMessageControllerWidget('setInTouchSelectionMode', wasTouchEvent);
            self.selectedElements[index] = message;
            self.options.onSelectManyChange(self.getSelectedMessages());
          },
          onMessageDeselected: function(){
            delete self.selectedElements[index];
            if (!Object.keys(self.selectedElements).length){
              self.element.children().children().communicatorBodyMessageControllerWidget('setInTouchSelectionMode', false);
            }
            self.options.onSelectManyChange(self.getSelectedMessages());
          },
          onMessageOpen: function(){
            if (!Object.keys(self.selectedElements).length){
              console.log("open", message);
            }
          }
        }).appendTo($applicationList);
      });
    },
    _processMessages: function(err, messages){
      if (err){
        $('.notification-queue').notificationQueue("error", err.message);
      } else {
        this.messages = messages;
        this._render();
      }
    },
    loadFolder(id){
      this._clean();
      this.folderId = id;
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
        case "sent":
          mApi().communicator.sentitems.read(params).callback(this._processMessages.bind(this));
          break;
        case "trash":
          mApi().communicator.trash.read(params).callback(this._processMessages.bind(this));
          break;
      }
    },
    addLabelToSelected: function(label){
      var label = {
        labelId: label.id,
        labelName: label.name,
        labelColor: label.color
      };
      var self = this;
      Object.keys(self.selectedElements).forEach(function(index){
        var element = self.selectedElements[index];
        element.labels.push(label);
      });
      
      $(".application-list").children().communicatorBodyMessageControllerWidget('addLabelIfSelected', label);
    },
    removeLabelToSelected: function(label){
      var label = {
        labelId: label.id,
        labelName: label.name,
        labelColor: label.color
      };
      var self = this;
      Object.keys(self.selectedElements).forEach(function(index){
        var element = self.selectedElements[index];
        var index = element.labels.findIndex(function(glabel){
          return glabel.labelId === label.labelId;
        });
        if (index !== null){
          element.labels.splice(index, 1);
        }
      });
      
      $(".application-list").children().communicatorBodyMessageControllerWidget('removeLabelIfSelected', label);
    },
    loadLabel: function(id){
      this._clean();
      this.labelId = id;
      var params = {
        labelId: id,
        firstResult: this.firstResult,
        maxResults: this.options.maxResults
      }
      mApi().communicator.items.read(params).callback(this._processMessages.bind(this));
    },
    getSelectedMessages: function(){
      var self = this;
      var arrayForm = [];
      Object.keys(self.selectedElements).forEach(function(key) { arrayForm[key] = self.selectedElements[key]; });
      return arrayForm.filter(function(value){
        return !!value;
      });
    },
    reload: function(){
      if (this.folderId){
        this.loadFolder(this.folderId);
      } else if (this.labelId) {
        this.loadLabel(this.labelId);
      }
    }
  });
});