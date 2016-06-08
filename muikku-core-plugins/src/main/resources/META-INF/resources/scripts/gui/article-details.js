(function() {
  'use strict';

  $.widget("custom.articleDetails", {
    
    _create: function() {
      this.element.addClass('article-details');
      this._producers = this.options.producers ? this.options.producers.split(',') : null;
      
      this._load($.proxy(function () {
        
      }, this));
    },
    
    _load: function (callback) {
      var data = { 
        license: this.options.license,
        producers: this._producers
      };
      
      renderDustTemplate('workspace/materials-article-details.dust', data, $.proxy(function (text) {
        this.element.html(text);
        callback();
      }, this));
    }
  
  });
  
}).call(this);