(function() {
  'use strict';
  
  function polyfillColorFields(fields) {
    if (!fields.length) {
      return;
    }
    
    fields.attr('type', 'text');
    
    $.each(fields, function (index, field) {
      new jscolor(field, {
        zIndex: 9999,
        hash: true
      });
    });    
  }
  
  if (Modernizr && !Modernizr.inputtypes.color && window.jscolor) {
    if (window.MutationObserver) {
      if (typeof (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver)) {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
       
        var observer = new MutationObserver(function(mutations, observer) {
          for (var i = 0, l = mutations.length; i < l; i++) {
            polyfillColorFields($(Array.prototype.slice.call(mutations[i].addedNodes))
                .find('input[type="color"]:not(.jscolor)'));
          }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }
    
    polyfillColorFields($('input[type="color"]'));
  }

}).call(this);
