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
    .read({onlyActive: "true", workspaceEntityId: workspaceEntityId})
    .callback($.proxy(function(err, result) {
        if (err) {
          $(".notification-queue").notificationQueue('notification','error', err);
        } else {
          var baseUrl = $('.announcementsBaseUrl').val();

          for (var i=0; i<result.length; i++) {
            result[i].link = baseUrl + "?announcementId=" + result[i].id;
          }
          
          renderDustTemplate('workspace/workspace_frontpage_announcements.dust', result, $.proxy(function (text) {
            var element = $(text);
            var href = element.attr('data-href');
            element.click(function () {
              window.location.assign(href);
            });

            $('.workspace-announcements-container').append(element);
            $('.workspace-announcements-container').perfectScrollbar({"suppressScrollY" : true});
          }, this));
        }
    }, this));
    
    
  });

}).call(this);