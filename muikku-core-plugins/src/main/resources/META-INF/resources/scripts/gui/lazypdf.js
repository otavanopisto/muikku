(function() {
  'use strict';
  
  $.widget("custom.lazyPdf", {
    
    _create : function() {
      $(this.element).removeClass('lazyPdf');
      $(this.element).addClass('lazy-pdf');
      
      $(this.element).waypoint($.proxy(function(direction) {
        if (direction == 'down') {
          this._onEnterView();
        } 
      }, this), {
        offset: '100%'
      });
      
      $(this.element).waypoint($.proxy(function(direction) {
        if (direction == 'up') {
          this._onEnterView();
        } 
      }, this), {
        offset: '-100%'
      });
    },
    
    _onEnterView: function () {
      this.openViewer();
    },
    
    openViewer: function () {
      var url = $(this.element).attr('data-url');
      if (url) {
        $(this.element).removeAttr('data-url');
        
        var object = $('<object>').attr({
          'type': 'application/pdf',
          'width': '100%',
          'height': '100%',
          'data': url
        });
        
        object.append($('<a>').attr({ 'href': url }).text($(this.element).attr('data-link-text')));
        this.element.append(object);

        if (navigator && (navigator.userAgent.toLowerCase().indexOf('firefox') > 0)) {
          // Issue #560 - Firefox pdf.js stops loading pdfs after 20 instances
          
          if (window.OPEN_VIEWERS === undefined) {
            window.OPEN_VIEWERS = [];
          }
          
          window.OPEN_VIEWERS.push(this.element);
          while (window.OPEN_VIEWERS.length > 10) {
            var viewer = window.OPEN_VIEWERS.shift();
            $(viewer).lazyPdf('closeViewer');
          }        
        }
        
      }
    },
    
    closeViewer: function () {
      var object = this.element.find('object');
      if (object.length) {
        this.element.attr({
          'data-url': $(object).attr('data')
        });
        $(object).remove();
      }
    },
    
    _destroy: function () {
      
    }
  });
  
}).call(this);
