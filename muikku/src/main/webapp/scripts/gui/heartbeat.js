$(function() {
  "use strict";

  function isObject(obj) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
    return obj === Object(obj);
  }

  setInterval(function() {

    try {
      $.ajax({url: '/heartbeat'});
    } catch (ex) {
      if (isObject(console) && console.log) {
        console.log("Heartbeat failed");
      }
    }

  }, 30 * 1000);
});