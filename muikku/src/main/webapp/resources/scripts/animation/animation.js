(function($){
	$.fn.extend({
		'onCssAnimationEnd': function(callback){
			return this.each(function(index, element){
				$(element)
					.one(
							'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend' +
							'webkitAnimationEnd oAnimationEnd oAnimationEnd msAnimationEnd animationend',
							callback
					);
			});
		},
		'cssAnimate': function(classAdd, css, callback){
			return this.each(function(index, element){
				var $element = $(element);
				$element.addClass(classAdd);
				$element.onCssAnimationEnd(callback);
				setTimeout(function(){
					$element.css(css);
				}, 10);
			});
		}
	});
})(jQuery);