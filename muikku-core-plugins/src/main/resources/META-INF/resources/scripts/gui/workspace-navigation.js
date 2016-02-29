(function() {
  'use strict';  

  function refreshNavigationWrapperPosition() {
    var contentContainer = ($('#contentWorkspaceMaterials').length > 0 ? contentContainer = $('#contentWorkspaceMaterials') : contentContainer = $('#content'));
    var naviWrapper = $('#workspaceNavigationWrapper');
    $(naviWrapper).css({
      left:(Math.max(contentContainer.offset().left - naviWrapper.width() - 10, 10)) + 'px'
    });
  }

  $(document).ready(function() {

    // Workspace navigation
    if ($('#workspaceNavigationWrapper').length > 0) {
      refreshNavigationWrapperPosition();
      $(window).resize(function(){
        refreshNavigationWrapperPosition();
      });
    }
   
  });

}).call(this);