(function() {
  
  $(document).ready(function(){
    $('.carousel-videos-wrapper').slick({
      arrows: false,
      dots: true,
      dotsClass: "carousel-video-controls",
      fade: true,
      appendDots: ".carousel-video-controls-wrapper",
      speed: 1250
    });
  });
  
  $(document).ready(function(){
    $('.carousel-images-wrapper').slick({
      arrows: false,
      dots: true,
      dotsClass: "carousel-image-controls",
      fade: true,
      appendDots: ".carousel-image-controls-wrapper",
      speed: 1250,
      autoplay: true,
      autoplaySpeed: 10000
    });
  });

}).call(this);
