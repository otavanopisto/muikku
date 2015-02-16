(function() { 'use strict';

  $(document).ready(function() {
    $(document).muikkuMaterialLoader();
    $('.workspace-materials-view-page').each(function(index) {
      $(document).muikkuMaterialLoader('loadMaterial', $(this), true); 
    });
  });

}).call(this);