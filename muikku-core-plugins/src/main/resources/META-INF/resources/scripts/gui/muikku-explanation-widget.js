(function() {
  'use strict';
  
  $.widget("custom.explanation", {
    
    options: {
      text: ''
    },
    
    _create : function() {
      this._icon = $('<span>').addClass('explanation-icon').text('X');
      this._content = $('<span>').addClass('explanation-content').text(this.options.text).hide();
      this.element.append(this._icon);
      this.element.append(this._content);
      this._icon.on('touch', $.proxy(function() {
        if (this._content.is(':visible')) {
          this._content.hide();
        }
        else {
          this._content.show();
        }
      }, this));
      this._icon.on('mouseenter', $.proxy(function() {
        this._content.show();
      }, this));
      this._icon.on('mouseleave', $.proxy(function() {
        this._content.hide();
      }, this));
    },
    
    _destroy: function () {
      this._icon.off();
    }
  });
  

}).call(this);
