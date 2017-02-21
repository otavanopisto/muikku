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
            $('.workspace-frontpage-footer').append($.parseHTML(text));
          }, this));
        }
      });
    mApi().workspace.workspaces
      .read(workspaceEntityId).callback($.proxy(function (err, workspace) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var materialLicenseIcons = [];
          switch (workspace.materialDefaultLicense) {
            case 'https://creativecommons.org/licenses/by/4.0':
              materialLicenseIcons = ['cc', 'cc-by'];
              break;
            case 'https://creativecommons.org/licenses/by-sa/4.0':
              materialLicenseIcons = ['cc', 'cc-by', 'cc-sa'];
              break;
            case 'https://creativecommons.org/licenses/by-nc/4.0':
              materialLicenseIcons = ['cc', 'cc-by', 'cc-nc'];
              break;
            case 'https://creativecommons.org/licenses/by-nd/4.0':
              materialLicenseIcons = ['cc', 'cc-by', 'cc-nd'];
              break;
            case 'https://creativecommons.org/licenses/by-nc-sa/4.0':
              materialLicenseIcons = ['cc', 'cc-by', 'cc-nc', 'cc-sa'];
              break;
            case 'https://creativecommons.org/licenses/by-nc-nd/4.0':
              materialLicenseIcons = ['cc', 'cc-by', 'cc-nc', 'cc-nd'];
              break;
          }
          renderDustTemplate('workspace/workspace-index-material-license.dust', {
            materialDefaultLicense: workspace.materialDefaultLicense,
            materialLicenseIcons: materialLicenseIcons
          }, $.proxy(function (text) {
            $('.workspace-frontpage-footer').prepend($.parseHTML(text));
          }, this));
        }
      }, this));
    
    if ($('.workspace-announcements-container').length > 0) {

      $('.workspace-announcements-container').on('click', '.workspace-single-announcement', function() {
        var href = $(this).attr('data-href');
        window.location.assign(href);
      });
  
      mApi().announcer.announcements
        .read({ hideEnvironmentAnnouncements: true, workspaceEntityId: workspaceEntityId })
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
              $('.workspace-announcements-container').append(element);
              $('.workspace-announcements-container').perfectScrollbar({"suppressScrollY" : true});
            }, this));
          }
        }, this));
    }
  });

}).call(this);