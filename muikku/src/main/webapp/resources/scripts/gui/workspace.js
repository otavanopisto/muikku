$(document).ready(function() {
  
  // Workspace navigation
  if ($('#workspaceNavigationWrapper').length > 0) {
    var contentContainer = $('#content');
    var cOffset = contentContainer.offset();
    var naviLeftPos = cOffset.left - 100;
    
    $('#workspaceNavigationWrapper').css({
      left:naviLeftPos + 'px'
    })
    .animate({
      opacity : 1
    }, 500, "easeOutSine");
    
    $(window).resize(function(){
      cOffset = contentContainer.offset();
      naviLeftPos = cOffset.left - 100;
      
      // Lets prevent workspace navigation not to escape browser's viewport when resizing 
      if (naviLeftPos < 10) {
        naviLeftPos = 10;
      }
      
      $('#workspaceNavigationWrapper').css({
        left:naviLeftPos + 'px'
      })
    });

  }
  
});