//This controller is in charge of the logged in view

loadModules([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/menu.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/notification-queue.js.jsf"
], function(){
  ENSURE_DEPRECATED_NON_INTERACTION();
  
  //$(".menu").menuWidget();
  $(".notification-queue").notificationQueue();
});