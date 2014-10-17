$(document).ready(function() {
  
  // Workspace navigation
  if ($('#workspaceNavigationWrapper').length > 0) {
    var contentContainer = $('#content');
    var cOffset = contentContainer.offset();
    var naviLeftPos = cOffset.left - 100;
    
    $('#workspaceNavigationWrapper').css({
      left:naviLeftPos + 'px'
    })
    
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
    
    if ($('.wi-dock-workspace-navi-button-materials-toc').length > 0) {
      var tocButton = $('.wi-dock-workspace-navi-button-materials-toc');
      var tocWrapper = tocButton.children('.workspace-materials-toc-wrapper');
      var tocButtonLabel = $('.wi-dock-workspace-navi-button-materials-toc .workspace-navi-tt-container-materials-toc'); 

      
      $(tocButton).click(function(e) {
        
        if ($('.workspace-materials-toc-wrapper:hidden').length !== 0) {
         
          tocButtonLabel.hide().css({
            opacity:0
          });
          
          tocButton.addClass('wi-dock-workspace-navi-button-selected');
          
          tocWrapper
          .show()
          .clearQueue()
          .stop()
          .animate({
            opacity: 1
          }, {
            duration : 400,
            easing : "easeInOutQuad"
          });
          
        } else { 
          
          $(".workspace-materials-toc-wrapper").bind('click', function(e) {
            e.stopPropagation();
          });
          
          tocButtonLabel
          .show()
          .animate({
            opacity: 1
          }, {
            duration : 100,
            easing : "easeInOutQuad"
          });
          
          tocWrapper
          .clearQueue()
          .stop()
          .animate({
            opacity: 0
          }, {
            duration : 200,
            easing : "easeInOutQuad",
            complete : function(){
              $(this).hide();
              tocButton.removeClass('wi-dock-workspace-navi-button-selected');
            }
          });
          
        }
        
      });

    }
  }
  
});