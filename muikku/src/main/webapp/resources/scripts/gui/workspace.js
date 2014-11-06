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
    var tocPinButton = $('#workspaceMaterialReadingTOCPinicon');
    var contentPageContainer = $('#content-workspace-reading');
    
    var contentMinOffset;
    var contentOffset;
    var windowMinWidth;
    
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
      
      contentMinOffset = wideTocWrapper.width() + 10; 
      contentOffset = contentPageContainer.offset();
      windowMinWidth = contentPageContainer.width() + contentMinOffset*2;
      
      // Lets prevent page content to slide under TOC when browser window is been resized
      if ($('#workspaceMaterialReadingTOCOpen:visible').length !== 0) {
        
        if (contentOffset.left < contentMinOffset) {
          contentPageContainer.css({
            paddingLeft: contentMinOffset,
            paddingRight: "10px"
          });
        } 
      } else {
        contentPageContainer.css({
          paddingLeft: "60px",
          paddingRight: "10px"
        });
      }
      
    });
    
    var tocPinned = 0;
    
    $(tocPinButton).click(function() {
      if (tocPinned == 0) {
        tocPinButton.addClass('selected');
        tocPinned = 1;  
      } else {
        tocPinButton.removeClass('selected');
        tocPinned = 0;
      }
      
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
          
          contentMinOffset = wideTocWrapper.width() + 10; 
          
          contentPageContainer
          .animate({
            paddingLeft: contentMinOffset,
            paddingRight: "10px"
          },{
            duration:500,
            easing: "easeInOutQuint"
          });
          
          wideTocWrapper
          .show()
          .clearQueue()
          .stop()
          .animate({
            opacity:0.97,
            "margin-left" : "0"
          }, {
            duration:500,
            easing: "easeInOutQuint",
            complete: function () {

              // Lets hide wrapper when user clicks anywhere in the document
              $(document).bind('click', function(){
                // Need to check if toc is pinned or not
                if (tocPinned == 0) {
                  
                  contentPageContainer
                  .animate({
                    paddingLeft: "60px",
                    paddingRight: "10px"
                  },{
                    duration:600,
                    easing: "easeInOutQuint"
                  });
                  
                  wideTocWrapper
                  .clearQueue()
                  .stop()
                  .animate({
                    "margin-left" : "-370px",
                    opacity: 1
                  }, {
                    duration : 600,
                    easing : "easeInOutQuint",
                    complete: function() {
                      $(this).hide();
                      $(document).unbind('click');
                      
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
                }
              });

              // Preventing TOC wrapper to disappear if user clicks inside wrapper
              $("#workspaceMaterialReadingTOCWrapper").bind('click', function(e) {
                e.stopPropagation();
              });
              
            }
          });
          
        }
      });
    });
    
    $(tocClosingButton).click(function() {
            
      contentPageContainer
      .animate({
        paddingLeft: "60px",
        paddingRight: "10px"
      },{
        duration:600,
        easing: "easeInOutQuint"
      });
      
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