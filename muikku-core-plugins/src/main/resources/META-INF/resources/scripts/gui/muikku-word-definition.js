(function() {
  'use strict';
  
  $.widget("custom.wordDefinition", {
    
    options: {
    },
    
    _create : function() {
      if ($('.muikku-word-definition').length == 0) {
        $('<div>')
          .addClass('muikku-word-definition')
          .hide()
          .appendTo(document.body);
      }

      this.element.on('mousemove', $.proxy(this._onMouseMove, this));
      this.element.on('mouseout', $.proxy(this._onMouseOut, this));
    },
    
    _onMouseMove: function (event, data) {
      $('.muikku-word-definition')
        .text(this.element.attr('data-muikku-word-definition'))
        .css({
          'left': event.pageX + 'px',
          'top': event.pageY + 'px'
        })
        .show();
    },
    
    _onMouseOut: function (event) {
      $('.muikku-word-definition').hide();
    },
    
    _destroy: function () {
      
    }
  });
  
  

}).call(this);
