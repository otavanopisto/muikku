(function() {
  'use strict';
  
  $.widget("custom.workspaceActivity", {
    options: {
      workspaceEntityId: null
    },
    _create : function() {
      this.loadActivity();
    },
    loadActivity: function() {
      mApi().guider.workspaces.activity
        .cacheClear()
        .read(this.options.workspaceEntityId)
        .callback($.proxy(function (err, activity) {
          if (!err) {
            activity.evaluablesDone = activity.evaluablesPassed + activity.evaluablesSubmitted + activity.evaluablesFailed + activity.evaluablesIncomplete;
            var template = 'workspace/workspace_progress_materials.dust';
            if ($(this.element).hasClass('workspace-progress-container')) {
              template = 'workspace/workspace_progress_frontpage.dust';
            }
            else if ($(this.element).hasClass('workspace-materials-fullscreen-progress-container')) {
              template = 'workspace/workspace_progress_materials_fullscreen.dust';
            }
            renderDustTemplate(template, {progress : activity}, $.proxy(function (text) {
              $(this.element).html(text);
              $(this.element).on('click', '.c100', function (event) {
                var activeMenu = $('.workspace-progress-element-menu:visible');
                var thisMenu = $(event.target).closest('.c100').next('.workspace-progress-element-menu');
                  if (thisMenu.attr('id') == activeMenu.attr('id') || activeMenu.length == 0) {
                  $(event.target).closest('.c100').next('.workspace-progress-element-menu').toggle();          
                }
                else {
                  activeMenu.hide();
                  thisMenu.show();
                }
              });
              
            }, this));
          }
        }, this));
    }
  });
  
  $(document).ready(function () {
    var workspaceEntityId = $('.workspaceEntityId').val();
    if (workspaceEntityId) {
      $('.workspace-progress-widget').workspaceActivity({
        workspaceEntityId: workspaceEntityId
      });
    }
  });
  
}).call(this);