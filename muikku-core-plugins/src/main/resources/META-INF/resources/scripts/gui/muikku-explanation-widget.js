(function() {
  'use strict';
  
  $.widget("custom.explanation", {
    
    options: {
      text: ''
    },
    
    _create : function() {
      this._icon = $('<span>').addClass('explanation-button icon-explanation');
      this._content = $('<span>').addClass('explanation-content');
      if (this.options.text) {
        this._content.html(this.options.text.replace(/\u00A0/g, ' ').replace(/(?:\r\n|\r|\n)/g, '<br/>')).hide();
      }
      this.element.append(this._icon);
      this._content.appendTo(document.body);
      this._icon.on('touch', $.proxy(function(event) {
        if (this._content.is(':visible')) {
          this._content.hide();
        }
        else {
          var iconPos = $(event.target).offset();
          this._content
            .css({
              'left': Math.max(0, Math.min(iconPos.left, $(window).width() - this._content.outerWidth())) + 'px',
              'top': (iconPos.top - this._content.outerHeight()) + 'px'
            })
            .show();
        }
      }, this));
      this._icon.on('mouseenter', $.proxy(function(event) {
        var iconPos = $(event.target).offset();
        this._content
          .css({
            'left': Math.max(0, Math.min(iconPos.left, $(window).width() - this._content.outerWidth())) + 'px',
            'top': (iconPos.top - this._content.outerHeight()) + 'px'
          })
          .show();
      }, this));
      this._icon.on('mouseleave', $.proxy(function() {
        this._content.hide();
      }, this));
    },
    
    _destroy: function () {
      this._content.remove();
      this._icon.off();
    }
  });
  

}).call(this);
