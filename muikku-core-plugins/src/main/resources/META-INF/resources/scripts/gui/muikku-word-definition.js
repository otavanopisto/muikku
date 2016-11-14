(function() {
  'use strict';
  
  $.widget("custom.wordDefinition", {
    
    options: {
    },
    
    _create : function() {
      $('<div>')
        .addClass('muikku-word-definition')
        .text(this.element.attr('data-muikku-word-definition'))
        .hide()
        .appendTo(document.body);
      this.element.on('mousemove', $.proxy(this._onMouseMove, this));
      this.element.on('mouseout', $.proxy(this._onMouseOut, this));
      this.element.on('touch', $.proxy(this._onTouch, this));
    },
    
    _onTouch: function (event, data) {
      if ($('.muikku-word-definition').is(":visible")) {
        $('.muikku-word-definition').hide();
      }
      else {
        $('.muikku-word-definition')
          .css({
            'left': event.pageX + 'px',
            'top': event.pageY + 'px'
          })
          .show();
      }
    },
    
    _onMouseMove: function (event, data) {
      $('.muikku-word-definition')
        .css({
          'left': event.pageX + 'px',
          'top': event.pageY + 'px'
        });
      if (!$('.muikku-word-definition').is(':visible')) {
        $('.muikku-word-definition').show();
      }
    },
    
    _onMouseOut: function (event) {
      if ($('.muikku-word-definition').is(':visible')) {
        $('.muikku-word-definition').hide();
      }
    },
    
    _destroy: function () {
    }
  });
  

}).call(this);
