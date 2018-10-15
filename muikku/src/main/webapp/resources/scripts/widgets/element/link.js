module(function(){
  function scrollToSection(anchor) {
    var topOffset = 90;
    var scrollTop = $(anchor).offset().top - topOffset;

    $('html, body').stop().animate({
      scrollTop : scrollTop
    }, {
      duration : 500,
      easing : "easeInOutQuad"
    });
  }

  $.widget("custom.linkWidget", {
    _create: function(){
      var self = this;
      $(self.element).click(function (event, data) {
        var anchor = $(self.element).attr('href') || "";
        if (anchor.indexOf("#") === 0){
          event.preventDefault();
          scrollToSection(anchor);
        }
      });
    }
  });
});