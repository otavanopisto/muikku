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
		'cssAnimate': function(options){
			return this.each(function(index, element){
				var $element = $(element);
				if (options.callback) {
					$element.onCssAnimationEnd(options.callback);
				}
				if (options.addClass) {
					$element.addClass(options.addClass);
				}
				if (options.removeClass) {
					$element.removeClass(options.removeClass);
				}
			});
		}
	});
})(jQuery);