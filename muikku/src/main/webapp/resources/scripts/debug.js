$(document).ready(function () {
  $('<div>')
    .css({
      'position': 'fixed',
      'bottom': '0px',
      'left': '0px',
      'right': '0px',
      'background': '#000',
      'color': '#0a0',
      'z-index': '9999'
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
  
});