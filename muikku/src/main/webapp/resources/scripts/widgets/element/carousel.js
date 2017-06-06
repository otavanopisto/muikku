module([
  "//cdn.muikkuverkko.fi/libs/slick/1.6.0/slick.min.js",
  "//cdn.muikkuverkko.fi/libs/slick/1.6.0/slick.css"
], function(){

  $.widget("custom.carouselWidget", {
    _create: function(){
      this.element.find(".carousel-item").each((index, element)=>{
        $(element).show();
      });

      this.element.slick({
        appendDots: this.element.siblings(".carousel-controls"),
        arrows: false,
        dots: true,
        dotsClass: "carousel-dots",
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
    }
  });

});