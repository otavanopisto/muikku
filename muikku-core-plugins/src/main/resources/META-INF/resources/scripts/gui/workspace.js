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
    
    // Functionality for workspace's material's TOC
    if ($('.wi-dock-workspace-navi-button-materials-toc').length > 0) {
      var tocButton = $('.wi-dock-workspace-navi-button-materials-toc');
      var tocWrapper = tocButton.children('.workspace-materials-toc-wrapper');
      var tocButtonLabel = $('.wi-dock-workspace-navi-button-materials-toc .workspace-navi-tt-container-materials-toc'); 

      // Some hiding and showing for TOC by click event
      $(tocButton).click(function() {
        
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
  
  // Workspace's materials's reading view
  if ($('#workspaceMaterialReadingTOCWrapper').length > 0) {
    var height = $(window).height();
    var thinTocWrapper = $('#workspaceMaterialReadingTOCClosed');
    var wideTocWrapper = $('#workspaceMaterialReadingTOCOpen');
    var tocOpeningButton = $('.workspace-material-reading-toc-opening-button');
    var tocClosingButton = $('.workspace-material-reading-toc-closing-button');

    if (thinTocWrapper.length > 0) {
      thinTocWrapper
      .show()
      .css({
        height: height
      });
    }
    
    if (wideTocWrapper.length > 0) {
      wideTocWrapper
      .hide()
      .css({
        height: height,
        "margin-left" : "-370px"
      });
    }
    
    $(window).resize(function(){
      height = $(window).height();
      wideTocWrapper.height(height);
      thinTocWrapper.height(height);
    });
    
    $(tocOpeningButton).click(function() {
      thinTocWrapper
      .clearQueue()
      .stop()
      .animate({
        "margin-left" : "-55px"
      }, {
        duration : 200,
        easing : "easeInOutQuint",
        complete : function(){
          $(this).hide();
          
          wideTocWrapper
          .show()
          .clearQueue()
          .stop()
          .animate({
            opacity:0.97,
            "margin-left" : "0"
          }, {
            duration:500,
            easing: "easeInOutQuint"
          });
          
        }
      });
    });
    
    $(tocClosingButton).click(function() {
      wideTocWrapper
      .clearQueue()
      .stop()
      .animate({
        "margin-left" : "-370px",
        opacity: 1
      }, {
        duration : 600,
        easing : "easeInOutQuint",
        complete : function(){
          $(this).hide();
          
          thinTocWrapper
          .show()
          .clearQueue()
          .stop()
          .animate({
            "margin-left" : "0"
          }, {
            duration:500,
            easing: "easeInOutQuint"
          });
          
        }
      });
    });
    

    
  }

  
  
});