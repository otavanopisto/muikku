loadModules([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/base.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/websocket.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/generic-environment.js.jsf",
  
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/communicator/navigation.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/communicator/toolbar.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/communicator/body.js.jsf"
], function(){
  $(document).muikkuWebSocket();
  $(document.body).baseControllerWidget();
  $.getWidgetContainerFor("generic-environment").genericEvironmentControllerWidget();
  
  var toolbar = $.getWidgetContainerFor("communicator-toolbar").communicatorToolbarControllerWidget();
  var body = $.getWidgetContainerFor("communicator-body").communicatorBodyControllerWidget();
  
  $.getWidgetContainerFor("communicator-navigation").communicatorNavigationControllerWidget({
    onLocationChange: function(newLocation){
      toolbar.communicatorToolbarControllerWidget('updateFolder', newLocation ? newLocation.text : null);
      if (newLocation.type === "folder"){
        body.communicatorBodyControllerWidget('loadFolder', newLocation.id);
      } else if (newLocation.type === "label"){
        body.communicatorBodyControllerWidget('loadLabel', newLocation.id);
      }
    }
  });
});