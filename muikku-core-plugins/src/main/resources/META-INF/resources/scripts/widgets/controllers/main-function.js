module([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/menu.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/dropdown.js.jsf"
], function(){
  
  $.widget("custom.mainFunctionControllerWidget", {
    _create: function(){
      var self = this;
      self.element.find(".dropdown").dropdownWidget();
      self.element.find(".menu").menuWidget();
      
      self.element.find(".main-function-interact-show-language-picker").click(function(e){
        self.element.find("#language-picker").dropdownWidget('open', e.currentTarget);
      });
      self.element.find(".main-function-interact-show-profile-menu").click(function(e){
        self.element.find("#profile-menu").dropdownWidget('open', e.currentTarget);
      });
      self.element.find(".main-function-interact-show-menu").click(function(e){
        self.element.find("#main-function-menu").menuWidget("open");
      });
    }
  });
  
});