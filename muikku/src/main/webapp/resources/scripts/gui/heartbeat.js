$(function() {
  if (mApi) {
      setInterval(function() {

        mApi().system.ping.read().callback(function() {});
        
      }, 15*60*1000);
  }
});