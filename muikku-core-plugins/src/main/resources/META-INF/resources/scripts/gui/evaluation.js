(function() {

  $(window).load(function() {

    // Workspace's Materials's TOC
    if ($('#evaluationQueueWrapper').length > 0) {
      
      var height = $(window).height();
      var queueWrapper = $('#evaluationQueueFullContainer');
      var navWrapper = $('#evaluationQueueShrinkedContainer');
      var queueOpenCloseButton = $('.wi-evaluation-queue-navi-button-toc > .icon-navicon');
      var assigmentContainer = $('#evaluationStudentAssignmentListingWrapper');
      
      var contentOffset;
      var windowMinWidth;
      var queueWrapperWidth = queueWrapper.width();
      var navWrapperWidth = navWrapper.width();
      var queueWrapperLeftMargin = "-" + (queueWrapperWidth - navWrapperWidth) + "px";
      var contentMinLeftOffset = queueWrapperWidth + navWrapperWidth + 20;
      var assigmentContainerRightPadding = 20;

      if (queueWrapper.length > 0) {
        queueWrapper
        .css({
          height: height,
          "margin-left" : navWrapperWidth
        });
        
        assigmentContainer.css({
          paddingLeft: contentMinLeftOffset,
          paddingRight: assigmentContainerRightPadding
        });
      }
      
      $(window).resize(function(){
        height = $(window).height();
        queueWrapper.height(height);
        contentOffset = assigmentContainer.offset();
        windowMinWidth = assigmentContainer.width() + contentMinLeftOffset*2;
        
        // Lets prevent page content to slide under TOC when browser window is been resized
        if ($('#evaluationQueueFullContainer:visible').length !== 0) {
          
          if (contentOffset.left < contentMinLeftOffset) {
            assigmentContainer.css({
              paddingLeft: contentMinLeftOffset,
              paddingRight: assigmentContainerRightPadding
            });
          } 
        } else {
          assigmentContainer.css({
            paddingLeft: navWrapperWidth + 20,
            paddingRight: assigmentContainerRightPadding
          });
        }
        
      });

      // Prevent icon-navicon link from working normally
      $(queueOpenCloseButton).bind('click', function(e) {
        e.stopPropagation();
      });

      $(queueOpenCloseButton).click(function() {
        // If queueWrapper is visible
        if ($('#evaluationQueueFullContainer:visible').length !== 0) {
          assigmentContainer
          .animate({
            paddingLeft: navWrapperWidth,
            paddingRight: assigmentContainerRightPadding
          },{
            duration:500,
            easing: "easeInOutQuint"
          });
          
          queueWrapper
          .clearQueue()
          .stop()
          .animate({
            "margin-left" : queueWrapperLeftMargin,
          }, {
            duration:500,
            easing: "easeInOutQuint",
            complete: function () {
              $(this).hide();
            }
          });
        // If queueWrapper is not visible  
        } else {
          assigmentContainer
          .animate({
            paddingLeft: contentMinLeftOffset,
            paddingRight: assigmentContainerRightPadding
          },{
            duration:500,
            easing: "easeInOutQuint"
          });
          queueWrapper
          .show()
          .clearQueue()
          .stop()
          .animate({
            "margin-left" : navWrapperWidth,
          }, {
            duration:500,
            easing: "easeInOutQuint",
            complete: function () {
            }
          });
        }
      });
      
      // Prevent page scroll happening if TOC scroll reaches bottom
      $('.evaluation-queue-content-inner').on('DOMMouseScroll mousewheel', function(ev) {
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
