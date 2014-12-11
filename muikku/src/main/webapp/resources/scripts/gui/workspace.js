$(document).ready(function() {
  
  $('#staticNavigationWrapperWorkspace').waypoint('sticky', {
    stuckClass : 'stuckStNav'
  });
  
  // Workspace navigation
  if ($('#workspaceNavigationWrapper').length > 0) {
    if ($('#contentWorkspaceMaterials').length > 0) {
      var contentContainer = $('#contentWorkspaceMaterials');
    } else {
      var contentContainer = $('#content');
    }
    var cOffset = contentContainer.offset();
    var naviLeftPos = cOffset.left - 100;
    
    $('#workspaceNavigationWrapper').css({
      left:naviLeftPos + 'px'
    })
    
    $(window).resize(function(){
      cOffset = contentContainer.offset();
      naviLeftPos = cOffset.left - 100;
      
      // Lets prevent workspace navigation from escaping browser's viewport when resizing 
      if (naviLeftPos < 10) {
        naviLeftPos = 10;
      }
      
      $('#workspaceNavigationWrapper').css({
        left:naviLeftPos + 'px'
      })
    });
    
    // Functionality for workspace's material's TOC
    if ($('.wi-workspace-dock-navi-button-materials-toc').length > 0) {
      var tocButton = $('.wi-workspace-dock-navi-button-materials-toc');
      var tocWrapper = tocButton.children('.workspace-materials-toc-wrapper');
      var tocButtonLabel = $('.wi-workspace-dock-navi-button-materials-toc .workspace-navi-tt-container-materials-toc'); 

      $(".workspace-materials-toc-wrapper").bind('click', function(e) {
        e.stopPropagation();
      });
      
      // Some hiding and showing for TOC by click event
      $(tocButton).click(function() {
        
        if ($('.workspace-materials-toc-wrapper:hidden').length !== 0) {
         
          tocButtonLabel.hide().css({
            opacity:0
          });
          
          tocButton.addClass('wi-workspace-dock-navi-button-selected');
          
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
              tocButton.removeClass('wi-workspace-dock-navi-button-selected');
            }
          });
          
        }
        
      });
      
      // Prevent page scroll happening if TOC scroll reaches bottom
      $('.workspace-materials-toc-content-inner').on('DOMMouseScroll mousewheel', function(ev) {
        var $this = $(this),
          scrollTop = this.scrollTop,
          scrollHeight = this.scrollHeight,
          height = $this.height(),
          delta = (ev.type == 'DOMMouseScroll' ?
            ev.originalEvent.detail * -40 :
            ev.originalEvent.wheelDelta),
          up = delta > 0;

        var prevent = function() {
          ev.stopPropagation();
          ev.preventDefault();
          ev.returnValue = false;
          return false;
        }

        if (!up && -delta > scrollHeight - height - scrollTop) {
          // Scrolling down, but this will take us past the bottom.
          $this.scrollTop(scrollHeight);

          return prevent();
        } else if (up && delta > scrollTop) {
          // Scrolling up, but this will take us past the top.
          $this.scrollTop(0);
          return prevent();
        }
      });

    }

  }
 
});