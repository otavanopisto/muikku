(function() {
  
  'use strict';

  $(document).ready(function() {
    $(document).muikkuMaterialLoader();
    $(document).muikkuMaterialLoader('loadMaterials', $('.workspace-materials-reading-view-page'));
  });

  $(document).on('click', '.muikku-save-page', function (event, data) {
    var page = $(this).closest('.workspace-materials-reading-view-page');
    var workspaceEntityId = $('.workspaceEntityId').val(); //  TODO: data?
    var workspaceMaterialId = $(page).data('workspace-material-id');
    var reply = [];
    
    page.find('.muikku-field').each(function (index, field) {
      reply.push({
        value: $(field).muikkuField('answer'),
        embedId: $(field).muikkuField('embedId'),
        materialId: $(field).muikkuField('materialId'),
        fieldName: $(field).muikkuField('fieldName')
      });
    });
    
    mApi().workspace.workspaces.materials.replies.create(workspaceEntityId, workspaceMaterialId, {
      answers: reply
    })
    .callback(function (err) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', "Error occurred while saving field replies " + err);
      }
    });
  });

}).call(this);
