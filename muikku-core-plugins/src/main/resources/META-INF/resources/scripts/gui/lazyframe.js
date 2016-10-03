(function() {
  'use strict';
  
  $.widget("custom.lazyFrame", {
    
    _create : function() {
      $(this.element).removeClass('lazyFrame');
      $(this.element).waypoint($.proxy(function(direction) {
        if (direction == 'down') {
          var url = $(this.element).attr('data-url');
          if (url) {
            $(this.element).removeAttr('data-url');
            $(this.element).attr('src', url);
            if (window.OPEN_FRAMES === undefined) {
              window.OPEN_FRAMES = [];
            }
            window.OPEN_FRAMES.push(this.element);
            while (window.OPEN_FRAMES.length > 4) {
              var frame = window.OPEN_FRAMES.shift();
              url = $(frame).attr('src');
              $(frame).attr('data-url', url);
              $(frame).removeAttr('src');
            }        
          }
        } 
      }, this), {
        offset: '100%'
      });
      
      $(this.element).waypoint($.proxy(function(direction) {
        if (direction == 'up') {
          var url = $(this.element).attr('data-url');
          if (url) {
            $(this.element).removeAttr('data-url');
            $(this.element).attr('src', url);
            window.OPEN_FRAMES.unshift(this.element);
            while (window.OPEN_FRAMES.length > 4) {
              var frame = window.OPEN_FRAMES.pop();
              url = $(frame).attr('src');
              $(frame).attr('data-url', url);
              $(frame).removeAttr('src');
            }        
          }
        } 
      }, this), {
        offset: '-100%'
      });
    },
    
    _destroy: function () {
      
    }
  });
  
}).call(this);
