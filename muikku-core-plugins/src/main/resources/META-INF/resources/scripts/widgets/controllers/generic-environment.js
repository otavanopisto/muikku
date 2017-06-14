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
    }
  });
  
});