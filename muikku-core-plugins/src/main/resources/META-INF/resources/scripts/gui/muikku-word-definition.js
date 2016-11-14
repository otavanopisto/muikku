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
        .appendTo(document.body)[0];
      this._definitionVisible = false;
      this.element.on('mousemove', $.proxy(this._onMouseMove, this));
      this.element.on('mouseout', $.proxy(this._onMouseOut, this));
      this.element.on('touchend', $.proxy(this._onTouchEnd, this));
      $(this._definition).on('mouseout', $.proxy(this._onMouseOut, this));
      $(this._definition).on('touchend', $.proxy(this._onTouchEnd, this));
    },
    
    _onTouchEnd: function (event, data) {
      if (this._definitionVisible) {
        $('.muikku-word-definition').hide();
        this._definitionVisible = false;
      }
      else {
        $('.muikku-word-definition')
          .css({
            'left': event.pageX + 'px',
            'top': event.pageY + 'px'
          })
          .show();
        this._definitionVisible = true;
      }
    },
    
    _onMouseMove: function (event, data) {
      $('.muikku-word-definition')
        .css({
          'left': event.pageX + 'px',
          'top': event.pageY + 'px'
        });
      if (!this._definitionVisible) {
        $('.muikku-word-definition').show();
        this._definitionVisible = true;
      }
    },
    
    _onMouseOut: function (event) {
      if (this._definitionVisible) {
        var target = event.toElement||event.relatedTarget;
        if (target !== this._definition) {
          $('.muikku-word-definition').hide();
          this._definitionVisible = false;
        }
      }
    },
    
    _destroy: function () {
    }
  });
  

}).call(this);
