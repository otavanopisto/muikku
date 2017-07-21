module([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/dropdown.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/communicator/toolbar/labels-dropdown/labels-list.js.jsf"
], function(){
  
  $.widget("custom.communicatorToolbarLabelsDropdownControllerWidget", {
    options: {
      onLabelsUpdated: null
    },
    _create: function(){
      this.dropdown = null;
      this.labels = null;
      this._render();
    },
    _render: function(){
      var self = this;
      renderDustTemplate('communicator/toolbar/labels-dropdown.dust', {}, function(text) {
        self.element.html(text);
        self._setupEvents();
      });
    },
    _createLabel: function(){
      var self = this;
      var color = Math.round(Math.random() * 16777215);
      var label = {
        name: self.dropdown.find("input").val().trim(),
        color: color
      };
      
      mApi().communicator.userLabels.create(label).callback(function (err, label) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          self.options.onLabelsUpdated();
          self.labels && self.labels.communicatorToolbarLabelsDropdownLabelsListControllerWidget('update');
        }
      });
    },
    _setupEvents: function(){
      this.element.find(".communicator-toolbar-labels-dropdown-interact-create-label").click(this._createLabel.bind(this));
      if (!this.dropdown){
        this.dropdown = this.element.find(".dropdown").dropdownWidget();
      }
      this.labels = this.element.getWidgetContainerFor("communicator-toolbar-labels-dropdown-labels-list").communicatorToolbarLabelsDropdownLabelsListControllerWidget();
    },
    open(target){
      if (this.dropdown){
        this.dropdown.dropdownWidget("open", target);
      }
    }
  });
});