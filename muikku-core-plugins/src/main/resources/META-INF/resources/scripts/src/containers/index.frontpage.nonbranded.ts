loadModules([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/base.ts.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/websocket.ts.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/generic-environment.ts.jsf"
], function(){
  $(document).muikkuWebSocket();
  $(document.body).baseControllerWidget();
  $.getWidgetContainerFor("generic-environment").genericEvironmentControllerWidget();
});