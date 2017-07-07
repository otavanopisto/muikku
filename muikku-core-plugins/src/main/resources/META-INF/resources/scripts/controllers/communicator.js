loadModules([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/base.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/websocket.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/generic-environment.js.jsf",
  
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/communicator/navigation.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/communicator/toolbar.js.jsf"
], function(){
  $(document).muikkuWebSocket();
  $(document.body).baseControllerWidget();
  $.getWidgetContainerFor("generic-environment").genericEvironmentControllerWidget();
  
  var toolbar = $.getWidgetContainerFor("communicator-toolbar").communicatorToolbarControllerWidget();
  $.getWidgetContainerFor("communicator-navigation").communicatorNavigationControllerWidget({
    onLocationChange: function(newLocation){
      toolbar.communicatorToolbarControllerWidget('updateFolder', newLocation ? newLocation.text : null);
    }
  });
});