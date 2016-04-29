(function() {
  'use strict';
  
  var messages = [];
  
  console.log = function (message) {
    messages.push(message);
  };
  
  window.onerror = function (errorMsg, url, lineNumber) {
    console.log('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
  }

  $(document).ready(function () {
    $('<div>')
      .css({
        'position': 'fixed',
        'bottom': '0px',
        'left': '0px',
        'right': '0px',
        'background': '#000',
        'color': '#0a0',
        'z-index': '99999',
        'font': 'Courier New',
        'word-break': 'break-all'
      })
      .appendTo(document.body)
      .attr('id', 'log');
    
    console.log = function (message) {
      $('#log')
        .append($('<pre>')
          .css({'word-break': 'break-all', 'width': '100%', 'display': 'block'})
          .text(message === undefined ? 'undefined' : $.type(message) == 'string' ? message : JSON.stringify(message))
        );
    };
    
    for (var i = 0, l = messages.length; i < l; i++) {
      console.log(messages[i]);
    }
    
  });
}).call(this);