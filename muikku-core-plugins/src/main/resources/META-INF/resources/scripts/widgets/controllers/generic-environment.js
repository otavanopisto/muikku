module([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/menu.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/dropdown.js.jsf"
], function(){
  
  $.widget("custom.genericEvironmentControllerWidget", {
    _create: function(){
      var self = this;
      self.element.find(".dropdown").dropdownWidget();
      self.element.find(".menu").menuWidget();
      
      self.element.find(".generic-environment-interact-show-language-picker").click(function(e){
        self.element.find("#generic-environment-language-picker").dropdownWidget('open', e.currentTarget);
      });
      self.element.find(".generic-environment-interact-show-profile-menu").click(function(e){
        self.element.find("#generic-environment-profile-menu").dropdownWidget('open', e.currentTarget);
      });
      self.element.find(".generic-environment-interact-show-menu").click(function(e){
        self.element.find("#generic-environment-menu").menuWidget("open");
      });
      
      if (MUIKKU_LOGGEDIN && self.element.find(".generic-environment-communicator-message-counter").length){
        self.initMessageCounter();
      }
    },
    initMessageCounter(){
      self = this;
      $(document).muikkuWebSocket("addEventListener", "Communicator:newmessagereceived", function () {
        self.reloadMessageCount();
      });
      
      $(document).muikkuWebSocket("addEventListener", "Communicator:messageread", function () {
        self.reloadMessageCount();
      });
      
      $(document).muikkuWebSocket("addEventListener", "Communicator:threaddeleted", function () {
        self.reloadMessageCount();
      });
      
      self.reloadMessageCount();
    },
    reloadMessageCount(){
      mApi()
      .communicator
      .receiveditemscount
      .cacheClear()
      .read()
      .callback(function (err, result) {
        if (result > 0) {
          $('.generic-environment-communicator-message-counter').text(result < 100 ? result : "99+");
        } else {
          $('.generic-environment-communicator-message-counter').text('');
        }
      });
    }
  });
  
});