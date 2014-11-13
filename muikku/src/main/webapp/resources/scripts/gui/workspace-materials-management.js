(function() {
  
  function loadPageNode(node) {
    var materialId = $(node).data('material-id');
    var materialType = $(node).data('material-type');
    
    if (materialType !== 'folder') {
      var typeEndpoint = mApi().materials[materialType];
      if (typeEndpoint != null) {
        typeEndpoint.read(materialId).callback($.proxy(function (err, result) {
          renderDustTemplate('workspace/materials-management-page.dust', { id: materialId, type: materialType, data: result }, $.proxy(function (text) {
            $(this).html(text);
          }, node));
        }, node));
      } else {
        $('.notification-queue').notificationQueue('notification', 'error', "Could not find rest service for " + materialType);
      }
    } else {
      renderDustTemplate('workspace/materials-management-page.dust', { id: materialId, type: materialType }, $.proxy(function (text) {
        $(this).html(text);
      }, node));
    }
  }
  
  $(document).ready(function() {
    // Workspace Material's page loading
    $('.workspace-materials-reading-view-page').each(function(index, node) {
      loadPageNode(node);
    });

    /* Smooth scrolling in workspace Material's Management View */
    var $sections = $('.workspace-materials-management-view-page');

    $sections.each(function() {
      var $section = $(this);
      var hash = '#' + this.id;

      $('a[href="' + hash + '"]').click(function(event) {
        $('html, body').stop().animate({
          scrollTop: $section.offset().top - 29
        },{
          duration: 500,
          easing : "easeInOutQuad",
          complete: function() {
            window.location.hash = hash;
          }
        });
        event.preventDefault();
      });
    });

    /* Highlighting toc item at appropriate time when we scroll to the corresponding section - Management View */
    $('.workspace-materials-management-view-page')
      .waypoint(function(direction) {
        var $links = $('a[href="#' + this.id + '"]');
        $links.toggleClass('active', direction === 'down');
      }, {
        offset: '60%'
      })
      .waypoint(function(direction) {
        var $links = $('a[href="#' + this.id + '"]');
        $links.toggleClass('active', direction === 'up');
      }, {
        offset: function() {
          return -$(this).height() + 250;
        }
      });
    
    //
    
   // Workspace's Materials's Management view
    if ($('#workspaceMaterialsManagementTOCWrapper').length > 0) {
      
      var height = $(window).height();
      var thinTocWrapper = $('#workspaceMaterialsManagementTOCClosed');
      var wideTocWrapper = $('#workspaceMaterialsManagementTOCOpen');
      var tocOpeningButton = $('.workspace-materials-management-toc-opening-button');
      var tocClosingButton = $('.workspace-materials-management-toc-closing-button');
      var tocPinButton = $('#workspaceMaterialsManagementTOCPinicon');
      var contentPageContainer = $('#contentWorkspaceMaterialsManagement');
      
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
        if ($('#workspaceMaterialsManagementTOCOpen:visible').length !== 0) {
          
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
                $("#workspaceMaterialsManagementTOCWrapper").bind('click', function(e) {
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
    
    //
    
  });
  
  $(document).on('click', '.edit-page', function (event, data) {
    var materialId = $(this).data('material-id');
    var materialType = $(this).data('material-type');
    var editorName = 'workspaceMaterialEditor' + (materialType.substring(0, 1).toUpperCase() + materialType.substring(1));
    var pageElement = $('#page-' + materialId);
    
    var editor = pageElement[editorName];
    if (editor) {
      $(pageElement).find('.page-content').hide();
      
      editor.call(pageElement, {
        materialId: materialId
      });
      
      $(document).one("click",$.proxy(function () {
        editor.call(pageElement, 'destroy');
        loadPageNode($(this).closest('section'));
      }, this));
    } else {
      $('.notification-queue').notificationQueue('notification', 'error', "Could not find editor for " + materialType);
    }
  });
  
}).call(this);
