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

window.interaction.register(function(root){
  
	$(root).find('.link').addBack(".link").click(function (event, data) {
		var anchor = $(this).attr('href') || "";
		if (anchor.indexOf("#") === 0){
		  event.preventDefault();
			scrollToSection(anchor);
		}
	});
});