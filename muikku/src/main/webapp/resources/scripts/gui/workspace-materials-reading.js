(function() {
  
  'use strict';

  $(document).ready(function() {
    $(document).muikkuMaterialLoader()
      .muikkuMaterialLoader('loadMaterials', $('.workspace-materials-view-page'));

    // Smooth scrolling in workspace Material's View 
    var $sections =$('.workspace-materials-view-page');

    $sections.each(function() {
      var $section = $(this);
      var hash = '#' + this.id;

      $('a[href="' + hash + '"]').click(function(event) {
        $('html, body').stop().animate({
          scrollTop : $section.offset().top - 25
        }, {
          duration : 500,
          easing : "easeInOutQuad",
          complete : function() {
            window.location.hash = hash;
          }
        });
        event.preventDefault();
      });
    });

    // Highlighting toc item at appropriate time when we scroll to the
    // corresponding section

    $('.workspace-materials-view-page').waypoint(function(direction) {
      var $links = $('a[href="#' + this.id + '"]');
      $links.toggleClass('active', direction === 'down');
    }, {
      offset : '60%'
    }).waypoint(function(direction) {
      var $links = $('a[href="#' + this.id + '"]');
      $links.toggleClass('active', direction === 'up');
    }, {
      offset : function() {
        return -$(this).height() + 250;
      }
    });
    
  });

  $(document).on('click', '.muikku-save-page', function (event, data) {
    var page = $(this).closest('.workspace-materials-view-page');
    var workspaceEntityId = $('.workspaceEntityId').val(); //  TODO: data?
    var workspaceMaterialId = $(page).data('workspace-material-id');
    var reply = [];
    
    page.find('.muikku-field').each(function (index, field) {
      reply.push({
        value: $(field).muikkuField('answer'),
        embedId: $(field).muikkuField('embedId'),
        materialId: $(field).muikkuField('materialId'),
        fieldName: $(field).muikkuField('fieldName')
      });
    });
    
    mApi().workspace.workspaces.materials.replies.create(workspaceEntityId, workspaceMaterialId, {
      answers: reply
    })
    .callback($.proxy(function (err) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', "Error occurred while saving field replies " + err);
      } else {
        $(this).addClass("icon-checkmark save-successful").text('Saved');;
      } 
    }, this));
  });
  
  // Workspace's materials's reading view
  $(window).load(function() {

    if ($('#workspaceMaterialsReadingTOCWrapper').length > 0) {
      
      var height = $(window).height();
      var tocWrapper = $('#workspaceMaterialsReadingTOCContainer');
      var navWrapper = $('#workspaceMaterialsReadingNav');
      var tocOpenCloseButton = $('.wi-workspace-materials-full-screen-navi-button-toc > .icon-navicon');
      var tocPinButton = $('#workspaceMaterialsReadingTOCPinicon');
      var contentPageContainer = $('#contentWorkspaceMaterialsReading');
      
      var contentOffset;
      var windowMinWidth;
      var tocWrapperWidth = tocWrapper.width();
      var navWrapperWidth = navWrapper.width();
      var tocWrapperLeftMargin = "-" + (tocWrapperWidth - navWrapperWidth) + "px";
      var contentMinLeftOffset = tocWrapperWidth + navWrapperWidth + 10;
      var contentPageContainerRightPadding = 10;
      
      if (tocWrapper.length > 0) {
        // If we have tocWrapper lets hide it first and set negative margin for later animation
        tocWrapper
        .hide()
        .css({
          height: height,
          "margin-left" : tocWrapperLeftMargin
        });
        
        contentPageContainer.css({
          paddingLeft: navWrapperWidth + 10,
          paddingRight: contentPageContainerRightPadding
        });
      }
      
      $(window).resize(function(){
        height = $(window).height();
        tocWrapper.height(height);
        contentOffset = contentPageContainer.offset();
        windowMinWidth = contentPageContainer.width() + contentMinLeftOffset*2;
        
        // Lets prevent page content to slide under TOC when browser window is been resized
        if ($('#workspaceMaterialsReadingTOCContainer:visible').length !== 0) {
          
          if (contentOffset.left < contentMinLeftOffset) {
            contentPageContainer.css({
              paddingLeft: contentMinLeftOffset,
              paddingRight: contentPageContainerRightPadding
            });
          } 
        } else {
          contentPageContainer.css({
            paddingLeft: navWrapperWidth + 10,
            paddingRight: contentPageContainerRightPadding
          });
        }
        
      });
      
      // TOC pin button click handling
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
      
      // Prevent icon-navicon link from working normally
      $(tocOpenCloseButton).bind('click', function(e) {
        e.stopPropagation();
      });
  
      $(tocOpenCloseButton).click(function() {
        
        // If tocWrapper is visible
        if ($('#workspaceMaterialsReadingTOCContainer:visible').length !== 0) {
          contentPageContainer
          .animate({
            paddingLeft: navWrapperWidth,
            paddingRight: contentPageContainerRightPadding
          },{
            duration:500,
            easing: "easeInOutQuint"
          });
          
          tocWrapper
          .clearQueue()
          .stop()
          .animate({
            "margin-left" : tocWrapperLeftMargin
          }, {
            duration:500,
            easing: "easeInOutQuint",
            complete: function () {
              $(this).hide();
            }
          });
        // If tocWrapper is not visible  
        } else {
          contentPageContainer
          .animate({
            paddingLeft: contentMinLeftOffset,
            paddingRight: "10px"
          },{
            duration:500,
            easing: "easeInOutQuint"
          });
          tocWrapper
          .show()
          .clearQueue()
          .stop()
          .animate({
            "margin-left" : navWrapperWidth
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
                    paddingLeft: navWrapperWidth,
                    paddingRight: "10px"
                  },{
                    duration:600,
                    easing: "easeInOutQuint"
                  });
                  
                  tocWrapper
                  .clearQueue()
                  .stop()
                  .animate({
                    "margin-left" : tocWrapperLeftMargin
                  }, {
                    duration : 600,
                    easing : "easeInOutQuint",
                    complete: function() {
                      $(this).hide();
                      $(document).unbind('click');
                    }
                  });
                }
              });
  
              // Preventing TOC wrapper to disappear if user clicks inside wrapper
              $(tocWrapper).bind('click', function(e) {
                e.stopPropagation();
              });
              
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
    
  });

}).call(this);
