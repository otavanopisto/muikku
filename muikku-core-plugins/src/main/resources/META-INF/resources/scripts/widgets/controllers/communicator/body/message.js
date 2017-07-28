module([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/communicator/body/message/label.js.jsf"
], function(){
  $.widget("custom.communicatorBodyMessageControllerWidget", {
    options: {
      message: null,
      onMessageOpen: null,
      onMessageSelected: null,
      onMessageDeselected: null
    },
    _create: function(){
      this._render();
      this.inTouchSelectionMode = false;
      this.selectTimeout = null;
      this.firstWasJustSelected = false;
    },
    _render: function(){
      var self = this;
      renderDustTemplate('communicator/body/message.dust', this.options.message, function(text) {
        self.element.html(text);
        self._setup();
      });
    },
    _toggleMessageSelection(isAlreadyChecked){
      this.element.children().toggleClass("selected");
      
      var newState;
      if (!isAlreadyChecked){
        newState = !this.element.find("input").prop("checked");
        this.element.find("input").prop('checked', newState);
      } else {
        newState = this.element.find("input").prop("checked");
      }
      
      var wasTouchEvent = !isAlreadyChecked;
      
      if (newState){
        this.options.onMessageSelected(wasTouchEvent);
      } else {
        this.options.onMessageDeselected();
      }
    },
    _setup: function(){
      var self = this;
      self.element.bind("contextmenu", function(e){
        e.preventDefault();
      });
      self.element.find("input").bind("click", function(e){
        e.stopPropagation();
        self._toggleMessageSelection(true);
      });
      self.element.click(function(e){
        if (!self.inTouchSelectionMode){
          self.options.onMessageOpen();
        } else if (!self.firstWasJustSelected){
          self._toggleMessageSelection();
        }
        self.firstWasJustSelected = false;
      });
      self.element.bind("touchstart", function(e){
        if (!self.inSelectionMode){
          self.selectTimeout = setTimeout(function(){
            self._toggleMessageSelection();
            self.firstWasJustSelected = true;
          }, 300);
        }
      });
      self.element.bind("touchend", function(e){
        clearTimeout(self.selectTimeout);
      });
      
      var $labelList = self.element.find(".communicator-application-list-item-labels");
      self.options.message.labels.forEach(function(label, index){
        return $("<span></span>").communicatorBodyMessageLabelControllerWidget({
          label: label
        }).appendTo($labelList);
      });
    },
    setInTouchSelectionMode(status){
      this.inTouchSelectionMode = status;
      if (status){
        this.element.children().addClass("application-list-item-select-mode");
      } else {
        this.element.children().removeClass("application-list-item-select-mode");
      }
    },
    addLabelIfSelected(label){
      var isSelected = this.element.children().hasClass("selected");
      if (isSelected){
        $("<span></span>").communicatorBodyMessageLabelControllerWidget({
          label: label
        }).appendTo($(".communicator-application-list-item-labels"));
      }
    },
    removeLabelIfSelected(label){
      var isSelected = this.element.children().hasClass("selected");
      if (isSelected){
        $(".communicator-application-list-item-labels").children().communicatorBodyMessageLabelControllerWidget('removeLabelIfMatches', label);
      }
    }
  });
});