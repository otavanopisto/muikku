(function() {
  'use strict';

  $(document).ready(function() {
    if($('.workspace-materials-view-page').length > 0){
      $(document).muikkuMaterialLoader()
      .muikkuMaterialLoader('loadMaterial', $('.workspace-materials-view-page'), true); 
    }
  });

}).call(this);