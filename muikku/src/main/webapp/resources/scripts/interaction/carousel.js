$(document).ready(function(){
	$('.carousel').slick({
		appendDots: ".carousel-controls",
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