(function() {
  'use strict';
  
  $.widget("custom.lazyPdf", {
    options : {
    },
    
    _create : function() {
      $(this.element).addClass('lazy-pdf');
      $(this.element).waypoint($.proxy(function(direction) {
        $(this.element).addClass('lazy-loading-pdf');
        var url = $(this.element).attr('data-url');
        if (url) {
          $(this.element).removeAttr('data-url');
          
          var object = $('<object>').attr({
            'type': 'application/pdf',
            'width': '100%',
            'height': '100%',
            'data': url
          });
          
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

  $(document).ready(function() {
    $('div.lazyPdf').lazyPdf({
      
    });
  });
  
}).call(this);
