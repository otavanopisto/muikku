$(document).ready(function() {
  
  $('#staticNavigationWrapperWorkspace').waypoint('sticky', {
    stuckClass : 'stuckStNav'
  });
  
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
  
  // Workspace's materials's reading view
  if ($('#workspaceMaterialsReadingTOCWrapper').length > 0) {
    
    var height = $(window).height();
    var thinTocWrapper = $('#workspaceMaterialsReadingTOCClosed');
    var wideTocWrapper = $('#workspaceMaterialsReadingTOCOpen');
    var tocOpeningButton = $('.workspace-materials-reading-toc-opening-button');
    var tocClosingButton = $('.workspace-materials-reading-toc-closing-button');
    var tocPinButton = $('#workspaceMaterialsReadingTOCPinicon');
    var contentPageContainer = $('#contentWorkspaceMaterialsReading');
    
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
      if ($('#workspaceMaterialsReadingTOCOpen:visible').length !== 0) {
        
        if (contentOffset.left < contentMinOffset) {
          contentPageContainer.css({
            paddingLeft: contentMinOffset,
            paddingRight: "60px"
          });
        } 
      } else {
        contentPageContainer.css({
          paddingLeft: "60px",
          paddingRight: "60px"
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
            paddingRight: "60px"
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
                    paddingRight: "60px"
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
              $("#workspaceMaterialsReadingTOCWrapper").bind('click', function(e) {
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
        paddingRight: "60px"
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

});