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
