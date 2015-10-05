$(function() {
  "use strict";

  function isObject(obj) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
    return obj === Object(obj);
  }

  if (mApi) {
    setInterval(function() {

      try {
        mApi().system.ping.read().callback(function() {
        });
      } catch (ex) {
        if (isObject(console) && console.log) {
          console.log("Ping failed");
        }
      }

    }, 15 * 60 * 1000);
  }
});