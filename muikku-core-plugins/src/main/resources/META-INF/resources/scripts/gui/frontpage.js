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
  
  $(document).on('click', '.nav-link', function (event, data) {
    event.preventDefault();
    var anchor = $(this).attr('href');
    scrollToSection(anchor);
  });
  
  function scrollToSection(anchor) {
    var topOffset = 90;
    var scrollTop = $(anchor).offset().top - topOffset;
    
    $('html, body').stop().animate({
      scrollTop : scrollTop
    }, {
      duration : 500,
      easing : "easeInOutQuad",
      complete : function() {
        if ($('.of-navigation').attr('data-status') == 'open') {
          $('.of-navigation')
            .find('.narrow-navigation, .mobile-navigation')
            .children('.secondary-links')
            .animate({
              opacity: 0
            }, 50, function() {
              $(this).hide();
            });
        
          $('.of-navigation').animate({
            height: "70px"
            }, 100, function() {
              $(this).removeAttr('data-status');
          });
        }
      }
    });
    
  }
  
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
        height: "200px",
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
  
  $(document).ready(function() {
    mApi().feed.feeds.read("oonews", {numItems: 5}).callback(function (err, news) {
      renderDustTemplate('frontpage/feed_news.dust', {entries: news}, function(text) {
        $(".frontpage-news-container").html(text);
      });
    });
  });
  
  $(document).ready(function() {
    mApi().feed.feeds.read("ooevents", {numItems: 4, order: "ASCENDING"}).callback(function (err, events) {
      renderDustTemplate('frontpage/feed_events.dust', {entries: events}, function(text) {
        $(".frontpage-events-container").html(text);
      });
    });
  });
  
  $(document).ready(function() {
    mApi().feed.feeds.read("eoppimiskeskus,open,ebarometri,matskula,oppiminen,polkuja,reissuvihko,jalkia", {numItems: 6}).callback(function (err, blogs) {
      renderDustTemplate('frontpage/feed_blogs.dust', {entries: blogs}, function(text) {
        $(".frontpage-posts-container").html(text);
      });
    });
  });

}).call(this);
