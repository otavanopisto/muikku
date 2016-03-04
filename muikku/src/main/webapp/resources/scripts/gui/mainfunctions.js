(function() {

  
  $.widget("custom.mainDropdown", {
    _create : function() {
      this.element.on('click', $.proxy(this._onClick, this));
      $(document).click($.proxy(this._onDocumentClick, this));
      this._select(this.element.find('li').first());
      
      this.element.on('click', 'li', $.proxy(this._onItemClick, this));
    },
    
    val: function (val) {
      if (val === undefined) {
        return this._val;
      } else {
        this._select(this.element.find("li[data-value='" + val + "']"));
      }
    },
    
    _setValue: function (value) {
      if (this._val !== value) {
        var old = this._val; 
        this._val = value;
        this.element.trigger("change", {
          oldValue: old,
          value: value
        });
      }
    },
    
    _select: function (item) {
      if ($(item).length == 0) {
        this._setValue(null);
        this.element.find('.mf-dropdown-text').text('');
      } else {
        this._setValue($(item).attr('data-value'));
        this.element.find('.mf-dropdown-text').text($(item).find('.mf-dropdown-item').text());
      }
    },
    
    _show: function () {
      if (!this.element.hasClass("active")) {
        this.element.addClass("active");
      
        this.element
         .find(".mf-dropdown-arrow")
         .removeClass("icon-arrow-down")
         .addClass("icon-arrow-up");
       
        this.element.find("ul").show(10);
      }
    },
    
    _hide: function () {
      if (this.element.hasClass("active")) {
        this.element.find("ul").hide(10, $.proxy(function() {
          this.element
            .find(".mf-dropdown-arrow")
            .removeClass("icon-arrow-up")
            .addClass("icon-arrow-down");
  
          this.element.removeClass("active");
         }, this));
      }
    },
    
    _onItemClick: function (event) {
      this._select($(event.target).closest('li'));
      this._hide();
    },
    
    _onClick: function (event) {
      this._show();
    },
    
    _onDocumentClick: function (event) {
      if ($(event.target).closest('.mf-dropdown').length != 0) {
        return;
      }
      
      this._hide();
    }
  });
  
  $(document).ready(function () {
    $('.mf-dropdown').mainDropdown();
  });
  
}).call(this);