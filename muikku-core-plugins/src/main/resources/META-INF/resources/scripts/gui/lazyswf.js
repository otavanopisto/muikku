(function() {
  'use strict';
  
  $.widget("custom.lazySwf", {
    options : {
    },
    
    _create : function() {
      $(this.element).removeClass('lazySwf');
      $(this.element).addClass('lazy-swf');
      $(this.element).waypoint($.proxy(function(direction) {
        var url = $(this.element).attr('data-url');
        if (url) {
          $(this.element).removeAttr('data-url');
          
          var object = $('<object>').attr({
            'type': 'application/x-shockwave-flash',
            'width': '100%',
            'height': '100%',
            'data': url
          });
          
          object.append($('<param>').attr({
            'name': 'wmode',
            'value': 'transparent'
          }));
          
          object.append($('<param>').attr({
            'name': 'menu',
            'value': 'false'
          }));
          
          object.append($('<param>').attr({
            'name': 'quality',
            'value': 'high'
          }));
          
          object.append($('<param>').attr({
            'name': 'scale',
            'value': 'exactfit'
          }));
          
          object.append($('<a>').attr({ 'href': url }).text($(this.element).attr('data-link-text')));
          this.element.append(object);
        }
      }, this), {
        offset: '90%',
        triggerOnce: true 
      });
    },
    
    _destroy: function () {
      
    }
  });
  
}).call(this);
