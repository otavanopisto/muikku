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
  
  function editPage(materialType, materialId) {
    var editorName = 'workspaceMaterialEditor' + (materialType.substring(0, 1).toUpperCase() + materialType.substring(1));
    var pageElement = $('#page-' + materialId);
    
    var pageSection = $(pageElement).parent(".workspace-materials-management-view-page");
    
    pageSection.addClass("page-edit-mode");
    
    var editor = pageElement[editorName];
    if (editor) {
      $(pageElement).find('.page-content').hide();
      
      editor.call(pageElement, {
        materialId: materialId
      });
      
      $(document).on("click",$.proxy(function (event) {
        var target = $(event.target);
        if (target.closest('.workspace-materials-management-view-page').length == 0) {
          editor.call(pageElement, 'destroy');
          loadPageNode($(this).closest('section'));
        }
      }, node));
    } else {
      $('.notification-queue').notificationQueue('notification', 'error', "Could not find editor for " + materialType);
    }
  }
  
  $(document).ready(function() {
    // Workspace Material's page loading
    $('.workspace-materials-management-view-page').each(function(index, node) {
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
      var contentPageContainer = $('#contentWorkspaceMaterialsManagement');
      
      var contentMinOffset;
      var contentOffset;
      var windowMinWidth;
      
      if (thinTocWrapper.length > 0) {
        thinTocWrapper
        .hide()
        .css({
          height: height,
          "margin-left" : "-55px"
        });
      }
      
      if (wideTocWrapper.length > 0) {
        wideTocWrapper
        .show()
        .css({
          height: height,
          "margin-left" : "0px"
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
    var materialId = $(node).data('material-id');
    var materialType = $(node).data('material-type');
    editPage(materialType, materialId);
  });
  
  $(document).on('click', '.delete-page', function (event, data) {
    alert('TODO: Actually delete page!');

  });
  
  $(document).on('click', '.workspaces-materials-management-add-page', function (event, data) {
    var nextMaterial = $(this).next('.workspace-materials-management-view-page');
    
    renderDustTemplate('workspace/materials-management-new-page.dust', { }, $.proxy(function (text) {
      var newPage = $(text);
      $(this).after(newPage);
      $(newPage).after($('<a>').attr({
        'class': 'workspaces-materials-management-add-page',
        'href': 'javascript:void(null)'
      }).html('ADD A PAGE'));
      
      $(newPage).find('.workspace-materials-management-new-page-link').one('click', function (event) {
        event.preventDefault();
        
        var materialType = $(this).data('material-type');
        var parentId = $(nextMaterial).data('parent-id');
        var nextSiblingId = $(nextMaterial).data('workspace-material-id');
        
        var typeEndpoint = mApi().materials[materialType];
        if (typeEndpoint != null) {
          // TODO: Localize
          typeEndpoint.create({
            title: 'Untitled',
            contentType: 'text/html;editor=CKEditor'
          })
          .callback($.proxy(function (materialErr, materialResult) {
            if (materialErr) {
              $('.notification-queue').notificationQueue('notification', 'error', materialErr);
              return;
            }
            
            var workspaceEntityId = $('.workspaceEntityId').val();
            
            mApi().workspace.workspaces.materials.create(workspaceEntityId, {
              materialId: materialResult.id,
              parentId: parentId,
              nextSiblingId: nextSiblingId
            })
            .callback($.proxy(function (workspaceMaterialErr, workspaceMaterialResult) {
              if (workspaceMaterialErr) {
                $('.notification-queue').notificationQueue('notification', 'error', workspaceMaterialErr);
                return;
              } else {
                newPage.removeClass('workspace-materials-management-new-page');
                newPage.attr({
                  'id': 'page-' + materialResult.id,
                  'data-material-title': materialResult.title,
                  'data-parent-id': workspaceMaterialResult.parentId,
                  'data-material-id': materialResult.id,
                  'data-material-type': materialType,
                  'data-workspace-material-id': workspaceMaterialResult.id
                });

                editPage(materialType, materialResult.id);
              } 
            }, this));
          }, newPage));
        } else {
          $('.notification-queue').notificationQueue('notification', 'error', "Could not find rest service for " + materialType);
        }
        
      });
    }, this));
  });
  
  
}).call(this);
