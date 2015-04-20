(function() {

  $(document).ready(function() {

    // Workspace's Materials's TOC
    if ($('#evaluationQueueWrapper').length > 0) {
      
      var height = $(window).height();
      var queueWrapper = $('#evaluationQueueContainer');
      var queueOpenCloseButton = $('.wi-evaluation-queue-navi-button-toc > .icon-navicon');
      var assigmentContainer = $('#evaluationStudentAssignmentListingWrapper');

      var queueWrapperWidth = queueWrapper.width();
      var queueWrapperLeftMargin = "-" + queueWrapperWidth + "px";
      var queueWrapperLeftMargin = "-" + queueWrapperWidth + "px";
      var contentMinLeftOffset = queueWrapperWidth + 20;
      var assigmentContainerRightPadding = 20;
        
      // Prevent icon-navicon link from working normally
      $(queueOpenCloseButton).bind('click', function(e) {
        e.stopPropagation();
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
  
  $(document).on('mouseover', '.evaluation-queue-item', function (event) {
    
    sName = $(this).attr('data-student-name');
    sContainerLoc = $(this).offset().top - $('.evaluation-queue-content-wrapper').offset().top + 2;
    
    $('#studentNameContainer').css({
      position: 'absolute',
      left: '20px',
      top: sContainerLoc
    })
    .show()
    .clearQueue()
    .stop()
    .animate({
        opacity: 1
      },{
        duration:150,
        easing: "easeInOutQuint",
        complete: function () {

        }
      })
    .text(sName);

  });
  
  $(document).on('mouseout', '.evaluation-queue-item', function (event) {
    
    $('#studentNameContainer')
    .animate({
        opacity: 0
      },{
        duration:150,
        easing: "easeInOutQuint",
        complete: function () {
          $(this).hide();
        }
      });

  });

  
}).call(this);
