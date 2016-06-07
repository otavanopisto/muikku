(function() {
  'use strict';

  $.widget("custom.articleDetails", {
    
    _create: function() {
      this.element.addClass('article-details');
      
      this._load($.proxy(function () {
        
      }, this));
    },
    
    _load: function (callback) {
      var data = { 
        license: this.options.license  
      };
      
      renderDustTemplate('workspace/materials-article-details.dust', data, $.proxy(function (text) {
        this.element.html(text);
        callback();
      }, this));
    }
  
  });
  
}).call(this);