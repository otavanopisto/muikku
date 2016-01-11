(function() { 'use strict';

  $(document).ready(function() {
    $(document)
      .muikkuMaterialLoader({
        workspaceEntityId: $('.workspaceEntityId').val(),
        baseUrl: $('.materialsBaseUrl').val()
      })
      .muikkuMaterialLoader('loadMaterials', $('.workspace-materials-view-page'));
  });

}).call(this);