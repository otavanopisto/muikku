(function() { 'use strict';

  $(document).ready(function() {
    var workspaceEntityId = $('.workspaceEntityId').val();
    
    $(document)
      .muikkuMaterialLoader({
        workspaceEntityId: workspaceEntityId,
        baseUrl: $('.materialsBaseUrl').val()
      })
      .muikkuMaterialLoader('loadMaterials', $('.workspace-materials-view-page'));
    
    mApi().workspace.workspaces.materialProducers
      .read(workspaceEntityId).callback(function (err, materialProducers) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          renderDustTemplate('workspace/workspace-index-material-producers.dust', {
            materialProducers: materialProducers
          }, $.proxy(function (text) {
            $('#content').append($.parseHTML(text));
          }, this));
        }
      });
    
    mApi()
    .announcer
    .announcements
    .read({onlyActive: "true", onlyMine: "true"})
    .callback($.proxy(function(err, result) {
        if (err) {
          $(".notification-queue").notificationQueue('notification','error', err);
        } else {
          renderDustTemplate('workspace/workspace_frontpage_announcements.dust', result, $.proxy(function (text) {
            var element = $(text);
            $('.workspace-announcements-container').append(element);
            $('.workspace-announcements-container').perfectScrollbar({"suppressScrollY" : true});
          }, this));
        }
    }, this));
    
    
  });

}).call(this);