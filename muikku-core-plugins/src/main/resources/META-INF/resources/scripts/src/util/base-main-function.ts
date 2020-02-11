/* global converse */
import Websocket from '~/util/websocket';
import mApi from '~/lib/mApi';
import {Action} from 'redux';
import { updateUnreadMessageThreadsCount } from '~/actions/main-function/messages';
import converse from '~/lib/converse';
import { StateType } from '~/reducers';
import { Store } from 'redux';
import $ from '~/lib/jquery';
import { updateStatusHasImage } from '~/actions/base/status';

export default function(store: Store<StateType>){
  let state:StateType = store.getState();

  let websocket = new Websocket(store, {
    "Communicator:newmessagereceived": {
      actions: [updateUnreadMessageThreadsCount],
      callbacks: [()=>mApi().communicator.cacheClear()]
    },
    "Communicator:messageread": {
      actions: [updateUnreadMessageThreadsCount],
      callbacks: [()=>mApi().communicator.cacheClear()]
    },
    "Communicator:threaddeleted": {
      actions: [updateUnreadMessageThreadsCount],
      callbacks: [()=>mApi().communicator.cacheClear()]
    }
  });

  if (state.status.isActiveUser){
    store.dispatch(<Action>updateUnreadMessageThreadsCount());

    if (state.status.loggedIn){
      mApi().chat.status.read().callback(function(err:Error, result:{mucNickName:string,nick:string,enabled:true}) {
        if (result && result.enabled) {
          converse.initialize({
            authentication : "prebind",
            prebind_url : "/rest/chat/prebind",
            bosh_service_url: "/http-bind/",
            default_domain: location.hostname,
            auto_away: 300,
            auto_login: true,
            auto_reconnect: true,
            fullname: result.mucNickName,
            nickname: result.nick,
            i18n: state.locales.current,
            jid: state.status.userSchoolDataIdentifier,
            keepalive: true,
            locales: ["fi", "en"],
            logLevel: "debug", // Needs to be set to info when in production mode
            message_archiving: "always",
            hide_muc_server: false,
            allow_muc: true,
            muc_domain : "conference." + location.hostname,
//			muc_history_max_stanzas: 25,            
			muc_history_max_stanzas: 0, // Should be 0 if MAM (message_archiving: "always") is in use
            muc_show_join_leave: true,
//            muc_nickname_from_jid: true,
//            allow_non_roster_messaging: true,
            persistent_store: "localStorage", // Activate this for production (It'll use either or anyway, so might as well have something here)
            ping_interval: 45,
//            trusted: "off", // Tämä oli päällä. Force sessionStorage instead of localStorage or IndexedDB - FOR DEVELOPMENT ONLY
            whitelisted_plugins: ["myplugin","addRoom", "profileChatSettings"]
          });
        }
      });
    }
  }

  $.ajax({type:"HEAD", url: `/rest/user/files/user/${state.status.userId}/identifier/profile-image-96`}).done(()=>{
    store.dispatch(<Action>updateStatusHasImage(true));
  });

  return websocket;
}