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
      mApi().chat.status.read().callback(function(err:Error, result:{mucNickName:string,enabled:true}) {
        if (result && result.enabled) {
          converse.initialize({
            authentication : "prebind",
            auto_away: 300,
            auto_login : true,
            auto_reconnect: true,
            bosh_service_url : "/http-bind/",
            fullname: result.mucNickName,
            hide_muc_server: true,
            i18n: state.locales.current,
            jid: state.status.userSchoolDataIdentifier,
            keepalive : true,
            locales: ["fi", "en"],
            logLevel: "debug", // Needs to be set to info when in production mode
            message_archiving: "always",
            muc_domain : "conference." + location.hostname,
            muc_history_max_stanzas: 0, // Should be 0 if MAM (message_archiving: "always") is in use
            muc_show_join_leave: true,
            ping_interval: 45,
            prebind_url : "/rest/chat/prebind",
            // websocket_url: This is worth to check out if we can use websockets instead of BOSH
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