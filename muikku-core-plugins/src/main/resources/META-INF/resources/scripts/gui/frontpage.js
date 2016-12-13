(function() {
  
  $(document).ready(function(){
    $('.carousel-videos-wrapper').slick({
      appendDots: ".carousel-video-controls-wrapper",
      arrows: false,
      dots: true,
      dotsClass: "carousel-video-controls",
      fade: true,
      speed: 750,
      waitForAnimate: false,
      responsive: [
                   {
                     breakpoint: 769,
                     settings: {
                       adaptiveHeight: true,
                       fade: false
                     }
                   }
                 ]
    });
  });
  
  $(document).ready(function(){
    $('.carousel-images-wrapper').slick({
      appendDots: ".carousel-image-controls-wrapper",
      arrows: false,
      dots: true,
      dotsClass: "carousel-image-controls",
      fade: true,
      speed: 750,
      swipeToSlide: true,
      waitForAnimate: false,
      responsive: [
                   {
                     breakpoint: 769,
                     settings: {
                       adaptiveHeight: true,
                       fade: false
                     }
                   }
                 ]
    });
  });
  
  $(document).on('click', '.show-more-nav-desktop', function (event, data) {
    event.preventDefault();
    
    if ($('.of-navigation').attr('data-status') != 'open') {
      $('.of-navigation').animate({
        height: "140px"
        }, 250, function() {
          $(this).attr('data-status', 'open');
          
          $('.of-navigation')
            .find('.narrow-navigation')
            .children('.secondary-links')
            .css({
              display: 'flex',
              padding: '0 0 0 50px'
            }).animate({
              opacity: 1
            }, 100);
          
      });  
      
    } else {
      $('.of-navigation')
        .find('.narrow-navigation')
        .children('.secondary-links')
        .animate({
          opacity: 0
        }, 100, function() {
          $(this).hide();
        });
      
      $('.of-navigation').animate({
        height: "70px"
        }, 250, function() {
          $(this).removeAttr('data-status');
      });
    }
    
  });
  
  $(document).on('click', '.show-more-nav-mobile', function (event, data) {
    event.preventDefault();
    
    if ($('.of-navigation').attr('data-status') != 'open') {
      $('.of-navigation').animate({
        height: "50vh",
        background: '#fff'
        }, 250, function() {
          $(this).attr('data-status', 'open');
          
          $('.of-navigation')
          .find('.mobile-navigation')
          .children('.secondary-links')
          .css({
            display: 'flex',
            position: 'absolute',
            top: '70px',
            'justify-content' : 'space-around',
            height: 'calc(100% - 70px)'
          }).animate({
            opacity: 1
          }, 100);
          
      });  
    } else {
      $('.of-navigation')
        .find('.mobile-navigation')
        .children('.secondary-links')
        .animate({
          opacity: 0
        }, 100, function() {
          $(this).hide();
        });
      
      $('.of-navigation').animate({
        height: "70px"
        }, 250, function() {
          $(this).removeAttr('data-status');
      });
    }
    
  });

}).call(this);
