(function() {
  'use strict';
  
  /* global converse */
  
  mApi().chat.status.read().callback(function(err, result) {
    if (result && result.enabled) {
      converse.initialize({
        bosh_service_url : '/http-bind/',
        authentication : "login",
        keepalive : "true",
        credentials_url : "/rest/chat/credentials",
        auto_login : true,
        muc_domain : 'conference.' + location.hostname,
        muc_nickname : result.mucNickName,
        muc_show_join_leave: false,
        hide_muc_server : true,
        ping_interval: 45,
        auto_minimize: true,
        hide_occupants:true
      });
    }
  });
}).call(this);