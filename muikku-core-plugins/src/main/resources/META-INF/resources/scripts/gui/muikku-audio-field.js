(function() {
  'use strict';
  
  $.widget("custom.muikkuAudioField", {
    options : {
      meta: null,
      clips: [],
      trackChange: true,
      trackKeyUp: false
    },
    _create : function() {
      var methods = {};
      
      _.each($.custom.muikkuField['_proto'].options, $.proxy(function (value, key) {
        if ((!_.startsWith(key, '_')) && $.isFunction(value)) {
          if (this[key]) {
            methods[key] = $.proxy(this[key], this);
          }
        }
      }, this));
      
      this.element.audioRecord();
      this.element.muikkuField($.extend(this.options, methods));
      
      this.setReadonly(this.options.readonly);
    },
    _destroy : function() {
      
    },
    isReadonly: function () {
      return this.element.audioRecord('readonly');
    },
    setReadonly: function(readonly) {
      this.element.audioRecord('readonly', readonly);
    },
    answer: function(val) {
      if (val === undefined) {
        return JSON.stringify(this.element.audioRecord('clips'));
      } else {
        this.element.audioRecord('clips', val ? $.parseJSON(val) : []);
      }
    },
    hasDisplayableAnswers: function() {
      return false;
    },
    checksOwnAnswer: function() {
      return true;
    },
    checkAnswer: function(showCorrectAnswers) {
      return null;
    },
    canCheckAnswer: function() {
      return false;
    }
  });

}).call(this);