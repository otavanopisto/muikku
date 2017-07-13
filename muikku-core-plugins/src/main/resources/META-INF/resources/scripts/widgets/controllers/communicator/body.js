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
      this.firstResult = 0;
      
      this.selectTimeout = null;
      this.firstWasSelected = false;
      this.selectedElements = [];
    },
    _clean: function(){
      this.element.html("");
    },
    _render: function(){
      var self = this;
      renderDustTemplate('communicator/body.dust', {messages: this.messages}, function(text) {
        self.element.html(text);
        self._setupEvents();
      });
    },
    _toggleMessageSelection(target, isAlreadyChecked){
      var $applicationListItems = this.element.find(".application-list-item");
      $applicationListItems.addClass("application-list-item-select-mode");
      
      var newState = !$(target).find("input").prop("checked");
      $(target).toggleClass("selected")
      if (!isAlreadyChecked){
        $(target).find("input").prop('checked', newState);
      }
      
      var element = this.messages[target.dataset.index];
      if (!newState){
        this.selectedElements.splice(this.selectedElements.indexOf(element), 1);
      } else {
        this.selectedElements.push(element);
      }
      
      if (!this.selectedElements.length){
        $applicationListItems.removeClass("application-list-item-select-mode");
      }
      
      this.options.onSelectManyChange(this.selectedElements);
    },
    _setupEvents: function(){
      var self = this;
      self.element.find(".application-list-item").bind("contextmenu", function(e){
        e.preventDefault();
      });
      self.element.find("input").bind("click", function(e){
        var $item = $(e.target).parents(".application-list-item");
        e.stopPropagation();
        self._toggleMessageSelection($item[0], true);
      });
      
      var $applicationListItems = this.element.find(".application-list-item");
      $applicationListItems.click(function(e){
        if (!self.selectedElements.length){
          self.options.onSelect(self.messages[e.currentTarget.dataset.index]);
        } else if (!self.firstWasSelected){
          self._toggleMessageSelection(e.currentTarget);
        }
        self.firstWasSelected = false;
      });
      $applicationListItems.bind("touchstart", function(e){
        if (!self.selectedElements.length){
          self.selectTimeout = setTimeout(function(){
            self.firstWasSelected = true;
            self._toggleMessageSelection(e.currentTarget);
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
      var params = {
        labelId: id,
        firstResult: this.firstResult,
        maxResults: this.options.maxResults
      }
      mApi().communicator.items.read(params).callback(this._processMessages.bind(this));
    }
  });
});