module([
], function(){
  $.widget("custom.communicatorBodyControllerWidget", {
    options: {
      maxResults: 31,
      onSelect: null,
      onSelectManyChange: null
    },
    _create: function(){
      this._clean();
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
    _toggleMessageSelection(target, index, isAlreadyChecked){
      var $applicationListItems = this.element.find(".application-list-item");
      $applicationListItems.addClass("application-list-item-select-mode");
      
      $(target).toggleClass("selected");
      
      var newState;
      if (!isAlreadyChecked){
        newState = !$(target).find("input").prop("checked");
        $(target).find("input").prop('checked', newState);
      } else {
        newState = $(target).find("input").prop("checked");
      }
      
      var element = this.messages[target.dataset.index];
      if (!newState){
        delete this.selectedElements[index];
      } else {
        this.selectedElements[index] = element;
      }
      
      if (!Object.keys(this.selectedElements).length){
        $applicationListItems.removeClass("application-list-item-select-mode");
      }
      
      this.options.onSelectManyChange(this.getSelectedMessages());
    },
    _setupEvents: function(){
      var self = this;
      self.element.find(".application-list-item").bind("contextmenu", function(e){
        e.preventDefault();
      });
      self.element.find("input").bind("click", function(e){
        var $item = $(e.target).parents(".application-list-item");
        e.stopPropagation();
        self._toggleMessageSelection($item[0], parseInt($item[0].dataset.index), true);
      });
      
      var $applicationListItems = this.element.find(".application-list-item");
      $applicationListItems.click(function(e){
        if (!self.selectedElements.length){
          self.options.onSelect(self.messages[e.currentTarget.dataset.index]);
        } else if (!self.firstWasSelected){
          self._toggleMessageSelection(e.currentTarget, parseInt(e.currentTarget.dataset.index));
        }
        self.firstWasSelected = false;
      });
      $applicationListItems.bind("touchstart", function(e){
        if (!self.selectedElements.length){
          self.selectTimeout = setTimeout(function(){
            self.firstWasSelected = true;
            self._toggleMessageSelection(e.currentTarget, parseInt(e.currentTarget.dataset.index));
          }, 300);
        }
      });
      $applicationListItems.bind("touchend", function(e){
        clearTimeout(self.selectTimeout);
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
    loadLabel(id){
      this._clean();
      this.labelId = id;
      var params = {
        labelId: id,
        firstResult: this.firstResult,
        maxResults: this.options.maxResults
      }
      mApi().communicator.items.read(params).callback(this._processMessages.bind(this));
    },
    getSelectedMessages(){
      var self = this;
      var arrayForm = [];
      Object.keys(self.selectedElements).forEach(function(key) { arrayForm[key] = self.selectedElements[key]; });
      return arrayForm.filter(function(value){
        return !!value;
      });
    },
    reload(){
      if (this.folderId){
        this.loadFolder(this.folderId);
      } else if (this.labelId) {
        this.loadLabel(this.labelId);
      }
    }
  });
});