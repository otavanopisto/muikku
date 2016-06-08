(function() {
  'use strict';
  
  function scrollToPage(workspaceMaterialId, animate) {
    var topOffset = $('#contentWorkspaceMaterialsReading').offset().top;
    var scrollTop = $('#page-' + workspaceMaterialId).offset().top - topOffset;
    if (animate) {
      $(window).data('scrolling', true);
      
      $('html, body').stop().animate({
        scrollTop : scrollTop
      }, {
        duration : 500,
        easing : "easeInOutQuad",
        complete : function() {
          $('a.active').removeClass('active');
          $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
          window.location.hash = 'p-' + workspaceMaterialId;
          $(window).data('scrolling', false);
        }
      });
    } else {
      $('html, body').stop().scrollTop(scrollTop);
      $('a.active').removeClass('active');
      $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
      window.location.hash = 'p-' + workspaceMaterialId;
    }
  }
  
  $(document).on('click', '.workspace-materials-toc-item a', function (event) {
    event.preventDefault();
    scrollToPage($($(this).attr('href')).data('workspaceMaterialId'), true);
  });

  $(document).ready(function() {
    
    $("#materialsScrollableTOC").perfectScrollbar({
      wheelSpeed:3,
      swipePropagation:false
    });
    
    $(window).data('initializing', true);
    $(document).muikkuMaterialLoader({
      loadAnswers: MUIKKU_LOGGED_USER ? true : false,
      readOnlyFields: MUIKKU_LOGGED_USER ? false: true,
      workspaceEntityId: $('.workspaceEntityId').val(),
      baseUrl: $('.materialsBaseUrl').val()
    }).muikkuMaterialLoader('loadMaterials', $('.workspace-materials-view-page'));

    $('.workspace-materials-view-page').waypoint(function(direction) {
      if ($(window).data('scrolling') !== true && $(window).data('initializing') !== true) {
        var workspaceMaterialId = $(this).data('workspace-material-id');
        $('a.active').removeClass('active');
        $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
        window.location.hash = 'p-' + workspaceMaterialId;
      }
    }, {
      offset: '0%'
    });
    
    $('.workspace-materials-view-page[data-assignment-type="EXERCISE"]').each(function (index, page) {
      $(page).prepend($('<div>')
          .addClass('muikku-page-assignment-type exercise')
          .text(getLocaleText("plugin.workspace.materialsLoader.exerciseAssignmentLabel"))
      );
    });
    
    $('.workspace-materials-view-page[data-assignment-type="EVALUATED"]').each(function (index, page) {
      $(page).prepend($('<div>')
          .addClass('muikku-page-assignment-type assignment')
          .text(getLocaleText("plugin.workspace.materialsLoader.evaluatedAssignmentLabel"))
      );
    });

    $(window).data('initializing', false);
  });
  
  $(document).on('click', '.workspace-materials-toc-item a', function (event) {
    event.preventDefault();
    scrollToPage($($(this).attr('href')).data('workspaceMaterialId'), true);
  });

  $(document).on('click', '.muikku-request-evaluation', function (event) {
    $('.icon-cancel-evaluation').show();
    $(this).hide();
    
    $('.notification-queue').notificationQueue('notification', 'success',getLocaleText('plugin.workspace.evaluation.requestAssigmentEvaluationNotification'));
    
  });
  
  $(document).on('click', '.muikku-cancel-evaluation', function (event) {
    $(this).hide();
    $('.icon-request-evaluation').show();
    
    $('.notification-queue').notificationQueue('notification', 'success',getLocaleText('plugin.workspace.evaluation.cancelAssignmentEvaluationNotification'));
    
  });

  // Workspace's materials's reading view
  $(window).load(function() {
    if (window.location.hash && (window.location.hash.indexOf('p-') > 0)) {
      scrollToPage(window.location.hash.substring(3), false);
    }    
    if ($('#workspaceMaterialsReadingTOCWrapper').length > 0) {
      
      var height = $(window).height();
      var tocWrapper = $('#workspaceMaterialsReadingTOCContainer');
      var navWrapper = $('#workspaceMaterialsReadingNav');
      var tocOpenCloseButton = $('.wi-workspace-materials-full-screen-navi-button-toc > .icon-navicon');
      var tocPinButton = $('#workspaceMaterialsReadingTOCPinicon');
      
      var windowMinWidth;
      var tocWrapperWidth = tocWrapper.width();
      var navWrapperWidth = navWrapper.width();
      var tocWrapperLeftMargin = "-" + (tocWrapperWidth - navWrapperWidth) + "px";
      
      if (tocWrapper.length > 0) {
        // If we have tocWrapper lets hide it first and set negative margin for later animation
        tocWrapper
        .hide()
        .css({
          height: height,
          "margin-left" : tocWrapperLeftMargin
        });
      }
      
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
              $(document).bind('click', function(event){
                if ($(event.target).closest('#workspaceMaterialsReadingTOCContainer').length == 1) {
                  return;
                }
                
                // Need to check if toc is pinned or not
                if (tocPinned == 0) {
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
  
  $(document).on('afterHtmlMaterialRender', function (event, data) {
    var license = $(data.pageElement).attr('data-license');
    var producers = $(data.pageElement).attr('data-producers');
    
    if (license || producers) {
      $('<footer>')
        .articleDetails({
          license: license,
          producers: producers
        })
        .appendTo(data.pageElement);
    }
  });
  
}).call(this);
