(function() {
  'use strict';
  
  /* global converse */
  
  mApi().chat.status.read().callback(function(err, result) {
    if (result && result.enabled) {
      converse.initialize({
        bosh_service_url : '/http-bind/',
        authentication : "prebind",
        keepalive : false,
        prebind_url : "/rest/chat/prebind",
        auto_login : true,
        muc_domain : 'conference.' + location.hostname,
        muc_nickname : result.mucNickName,
        muc_show_join_leave: false,
        hide_muc_server : true,
        auto_join_rooms : ['muikku@conference.' + location.hostname],
        ping_interval: 45,
        auto_minimize: true
      });
    }
  });
}).call(this);