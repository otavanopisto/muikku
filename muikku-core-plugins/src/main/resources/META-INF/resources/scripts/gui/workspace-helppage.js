(function() { 'use strict';

  $(document).ready(function() {
    var workspaceEntityId = $('.workspaceEntityId').val();
    
    $(document)
      .muikkuMaterialLoader({
        workspaceEntityId: workspaceEntityId,
        baseUrl: $('.materialsBaseUrl').val()
      })
      .muikkuMaterialLoader('loadMaterials', $('.material-page'));

  });

}).call(this);