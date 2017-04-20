window.interaction.register(
    "//cdn.muikkuverkko.fi/libs/slick/1.6.0/slick.min.js",
    "//cdn.muikkuverkko.fi/libs/slick/1.6.0/slick.css"
, function(root){
	
	$(root).find('.carousel').addBack(".carousel").each(function(){
		$(this).slick({
			appendDots: $(this).siblings(".carousel-controls"),
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
	});
	
});