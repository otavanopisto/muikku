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

(function($){

  function loadCss(url){
    $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', url));
  }

  function loadScript(url, callback){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    if (callback){
      script.onload = callback;
      script.onerror = callback;
    }

    document.head.appendChild(script);
  }

  widgets = [];
  $.defineWidget = function(selector, name, dependencies, widget){

    var fn = function(root){
      $(root).find(selector).addBack(selector)[name]();
    };

    var exec = function(){
      widgets.push(fn);
      fn(document.body);
    }

    if (!dependencies.length){
      exec();
      return;
    }

    var counter = 0;
    dependencies.forEach(function(library){
      if (library.indexOf(".css", library.length - 4) !== -1){
        loadCss(library);

        counter++;
        if (counter === dependencies.length) {
          exec();
        }
        return;
      }

      loadScript(library, function(){
        counter++;
        if (counter === dependencies.length) {
          exec();
        }
      });

    });
  }

  $.fn.setupWidgets = function(){
    var root = this;
    widgets.forEach(function(fn){
      fn(root);
    });
  }

  $.requireWidget = function(src){
    loadScript(src);
  }

  $(document).ready(function(){
    $(document.body).setupWidgets();
  });

})(jQuery);