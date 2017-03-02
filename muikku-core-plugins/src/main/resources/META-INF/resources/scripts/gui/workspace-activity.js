(function() {
  'use strict';
  
  $(document).ready(function () {
    var workspaceEntityId = $('.workspaceEntityId').val();
    if (workspaceEntityId) {
      mApi().guider.workspaces.activity
        .read(workspaceEntityId)
        .callback($.proxy(function (err, activity) {
          if (!err) {

            var progressViewType = $('.workspace-progress-container').length ? 'frontpage' : 'materials';
            
            if (progressViewType === 'materials') {
               progressViewType = $('.workspace-materials-fullscreen-progress-container').length ? 'materials-fullscreen' : 'materials-normal';              
            }
            
            var progressContainer = null;
            var template = null;  
            
            switch (progressViewType) {
              case 'frontpage':
                progressContainer = $('.workspace-progress-container');
                template = 'workspace/workspace_progress_frontpage.dust';
                break;
              case 'materials-normal':
                progressContainer = $('.workspace-materials-progress-container');
                template = 'workspace/workspace_progress_materials.dust';
                break;
              case 'materials-fullscreen':
                progressContainer = $('.workspace-materials-fullscreen-progress-container');
                template = 'workspace/workspace_progress_materials_fullscreen.dust';
                break;
              
              default:
                progressContainer = $('.workspace-materials-progress-container');
                template = 'workspace/workspace_progress_materials.dust';
            }

            activity.evaluablesDone = activity.evaluablesPassed + activity.evaluablesSubmitted + activity.evaluablesFailed + activity.evaluablesIncomplete;
            activity.evaluablesUndone = activity.evaluablesTotal - (activity.evaluablesPassed + activity.evaluablesSubmitted);   
            
            renderDustTemplate(template, {progress : activity}, $.proxy(function (text) {
              progressContainer.html(text);
              $(progressContainer).on('click', '.c100', function (event) {
                $(event.target).closest('.c100').next('.workspace-progress-element-menu').toggle();              
              });
              
            }, this));
          }
        }, this));
    }
  });
  
}).call(this);