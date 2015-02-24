(function() { 'use strict';

  $(document).ready(function() {
    $(document).muikkuMaterialLoader();
    $('.workspace-description-wrapper').each(function(index) {
      $(document).muikkuMaterialLoader('loadMaterial', $(this), true); 
    });
  });

}).call(this);