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
        
        if (options.clearStyle){
          $element.attr("style", "");
        }
      });
    }
  });
})(jQuery);