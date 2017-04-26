(function($){
	$.fn.extend({
		'onCssAnimationEnd': function(callback){
			return this.each(function(index, element){
			  var emergencyTimeout = setTimeout(function(){
			    callback();
			    if (console && console.warn){
			      console.warn(element, "animation timed out, check the animation");
			    }
			  }, 1000);

				$(element)
					.one(
							'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend' +
							'webkitAnimationEnd oAnimationEnd oAnimationEnd msAnimationEnd animationend',
							function(){
							  clearTimeout(emergencyTimeout);
							  callback();
							}
					);
			});
		},
		'cssAnimate': function(options){
			return this.each(function(index, element){
				var $element = $(element);

				if (options.condition) {
				  var status = $element.is(options.condition);
				  if ((options.falseCondition && status) || !status){
				    return;
				  }
				}

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

window.interaction = {};
window.interaction.register = function(){
	var args = Array.prototype.slice.call(arguments);
	var fn = args.pop();

	var exec = function(){
		window.interaction.registry.push(fn);
		if (window.interaction.setUpInteraction.ran){
			fn(document);
		}
	}

	if (args.length === 0){
		exec();
	}

	var counter = 0;
	args.forEach(function(library){
	  if (library.indexOf(".css", library.length - 4) !== -1){
	    $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', library) );
	    counter++;
      if (counter === args.length) {
        exec();
      }
      return;
	  }

	  var script=document.createElement('script');
	  script.type='text/javascript';
	  script.src=library;
	  script.onload = function(){
	    counter++;
      if (counter === args.length) {
        exec();
      }
	  }
	  script.onerror = script.onload;

	  document.head.appendChild(script);
	});
};
window.interaction.registry = [];
window.interaction.setUpInteraction = function setUp(root) {
	window.interaction.registry.forEach(function(fn){
		fn(root);
	});
}
window.interaction.require = function(src){
	$.getScript(src);
}

$(document).ready(function(){
	window.interaction.setUpInteraction(document);
	window.interaction.setUpInteraction.ran = true;
});