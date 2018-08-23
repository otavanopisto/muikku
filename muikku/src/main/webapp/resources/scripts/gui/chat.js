(function() {
  'use strict';
  
  /* global converse */
  
  mApi().chat.status.read().callback(function(err, result) {
    if (result && result.enabled) {
      converse.initialize({
        bosh_service_url : '/http-bind/',
        authentication : "prebind",
        keepalive : true,
        prebind_url : "/rest/chat/prebind",
        jid: MUIKKU_LOGGED_USER_ID,
        auto_login : true,
        muc_domain : 'conference.' + location.hostname,
        muc_nickname : result.mucNickName,
        muc_show_join_leave: false,
        hide_muc_server : true,
        ping_interval: 45,
        auto_minimize: true,
        auto_list_rooms: true,
        i18n: getLocale() === "fi" ? "fi" : "en",
        hide_occupants:true,
        limit_room_controls:true
      });
    }
  });
}).call(this);