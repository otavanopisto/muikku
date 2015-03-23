(function() { 'use strict';

  $(document).ready(function() {
    $(document).muikkuMaterialLoader().muikkuMaterialLoader('loadMaterials', $('.workspace-materials-view-page'));

//    $(document).muikkuMaterialLoader();
//    $('.workspace-description-wrapper').each(function(index) {
//      $(document).muikkuMaterialLoader('loadMaterial', $(this), true); 
//    });
  });

}).call(this);