loadModules([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/base.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/websocket.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/generic-environment.js.jsf"
], function(){
  $(document).muikkuWebSocket();
  $(document.body).baseControllerWidget();
  $.getWidgetContainerFor("generic-environment").genericEvironmentControllerWidget();
});