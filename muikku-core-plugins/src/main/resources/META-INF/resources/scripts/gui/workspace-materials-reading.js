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
      loadAnswers: true,
      workspaceEntityId: $('.workspaceEntityId').val()
    }).muikkuMaterialLoader('loadMaterials', $('.workspace-materials-view-page'));

    $('.workspace-materials-view-page').waypoint(function(direction) {
      if ($(window).data('scrolling') !== true && $(window).data('initializing') !== true) {
        var workspaceMaterialId = $(this).data('workspace-material-id');
        $('a.active').removeClass('active');
        $('a[href="#page-' + workspaceMaterialId + '"]').addClass('active');
        window.location.hash = 'p-' + workspaceMaterialId;
      }
    }, {
      offset: '60%'
    });
    
    $('.workspace-materials-view-page[data-workspace-material-assigment-type="EXERCISE"]').each(function (index, page) {
      $(page).prepend($('<div>')
          .addClass('muikku-page-assignment-type exercise')
          .text(getLocaleText("plugin.workspace.materialsLoader.exerciseAssignmentLabel"))
      );
    });
    
    $('.workspace-materials-view-page[data-workspace-material-assigment-type="EVALUATED"]').each(function (index, page) {
      $(page).prepend($('<div>')
          .addClass('muikku-page-assignment-type evaluated')
          .text(getLocaleText("plugin.workspace.materialsLoader.evaluatedAssignmentLabel"))
      );
    });
    
    $('.muikku-connect-field').muikkuConnectField('refresh');

    $(window).data('initializing', false);
  });
  
  $(document).on('click', '.workspace-materials-toc-item a', function (event) {
    event.preventDefault();
    scrollToPage($($(this).attr('href')).data('workspaceMaterialId'), true);
  });
  
  $(document).on('change', '.muikku-field', function (event, data) {
    $(this).removeClass('muikku-field-correct-answer muikku-field-incorrect-answer');
    var page = $(this).closest('.workspace-materials-view-page');
    var saveButton = $(page).find('.muikku-save-page');
    if (saveButton.length) {
      saveButton
        .removeClass('save-successful')          
        .text(saveButton.data('unsaved-text'));
    }
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

  $(document).on('click', '.muikku-save-page', function (event, data) {
    var page = $(this).closest('.workspace-materials-view-page');
    var workspaceEntityId = $('.workspaceEntityId').val(); 
    var workspaceMaterialId = $(page).data('workspace-material-id');
    var reply = [];
    var exercise = $(page).data('workspace-material-assigment-type') == "EXERCISE" ;
 
    page.find('.muikku-field-examples').remove();
    page.find('.muikku-field').each(function (index, field) {
      $(field).removeClass('muikku-field-correct-answer muikku-field-incorrect-answer');
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
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.workspace.materialsReading.answerSavingFailed', err));
      } else {
        if (exercise) {
          // Correct answer checking
          page.find('.muikku-field').each(function (index, field) {
            if ($(field).muikkuField('canCheckAnswer')) {
              $(field).addClass($(field).muikkuField('isCorrectAnswer') ? 'muikku-field-correct-answer' : 'muikku-field-incorrect-answer');
            }
            else {
              if ($(field).muikkuField('hasExamples')) {
                var exampleDetails = $('<span>')
                  .addClass('muikku-field-examples')
                  .attr('data-for-field', $(field).attr('name'));
                
                exampleDetails.append( 
                  $('<span>')
                    .addClass('muikku-field-examples-title')
                    .text(getLocaleText('plugin.workspace.assigment.checkAnswers.detailsSummary.title'))
                );
                
                $.each($(field).muikkuField('getExamples'), function (index, example) {
                  exampleDetails.append(
                    $('<span>') 
                      .addClass('muikku-field-example')
                      .text(example)    
                  );
                });

                $(field).after(exampleDetails);
              }
            }
          });
        } 
        
        $(this)
          .addClass("save-successful")
          .text(exercise ? getLocaleText('plugin.workspace.materials.exerciseSaved') : getLocaleText('plugin.workspace.materials.assignmentSaved'));
      } 
    }, this));
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
              $(document).bind('click', function(event){
                if ($(event.target).closest('#workspaceMaterialsReadingTOCContainer').length == 1) {
                  return;
                }
                
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
