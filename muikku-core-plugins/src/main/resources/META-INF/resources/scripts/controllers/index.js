//This controller is in charge of the logged in view

loadModules([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/main-function.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/notification-queue.js.jsf"
], function(){
  ENSURE_DEPRECATED_NON_INTERACTION();
  
  $("#main-function").mainFunctionControllerWidget();
  
  $(".notification-queue").notificationQueue();
});