module([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/notification-queue.js.jsf"
], function(){
  $.widget("custom.baseControllerWidget", {
    _create(){
      this.element.find(".notification-queue").notificationQueue();
    }
  });
});