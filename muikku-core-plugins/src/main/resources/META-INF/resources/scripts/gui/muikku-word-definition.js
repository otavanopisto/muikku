(function() {
  'use strict';
  
  $.widget("custom.wordDefinition", {
    
    options: {
    },
    
    _create : function() {
      this._definition = $('<div>')
        .addClass('muikku-word-definition')
        .text(this.element.attr('data-muikku-word-definition'))
        .hide()
        .appendTo(document.body);
      this._outerWidth = $(this._definition).outerWidth();
      this.element.on('mousemove', $.proxy(this._onMouseMove, this));
      this.element.on('mouseout', $.proxy(this._onMouseOut, this));
      this.element.on('touch', $.proxy(this._onTouch, this));
    },
    
    _onTouch: function (event, data) {
      if ($(this._definition).is(":visible")) {
        $(this._definition).hide();
      }
      else {
        $(this._definition)
          .css({
            'left': Math.max(0, Math.min(event.pageX, $(window).width() - this._outerWidth)) + 'px',
            'top': event.pageY + 'px'
          })
          .show();
      }
    },
    
    _onMouseMove: function (event, data) {
      $(this._definition)
        .css({
          'left': Math.max(0, Math.min(event.pageX, $(window).width() - this._outerWidth)) + 'px',
          'top': event.pageY + 'px'
        });
      if (!$(this._definition).is(':visible')) {
        $(this._definition).show();
      }
    },
    
    _onMouseOut: function (event) {
      if ($(this._definition).is(':visible')) {
        $(this._definition).hide();
      }
    },
    
    _destroy: function () {
      $(this._definition).remove();
      this._defintion = null;
    }
  });
  

}).call(this);
