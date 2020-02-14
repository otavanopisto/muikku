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
            // * * * * * * * * * * * * * * *
            // Thou shall not touch these
            // * * * * * * * * * * * * * * *
            muc_domain : "conference." + location.hostname,
            authentication : "prebind",
            prebind_url : "/rest/chat/prebind",
            bosh_service_url: "/http-bind/",
            default_domain: location.hostname,
            auto_login: true,
            auto_reconnect: true,
            fullname: result.mucNickName,
            nickname: result.nick,
            i18n: state.locales.current,
            jid: state.status.userSchoolDataIdentifier,
            keepalive: true,
            // This forces the use of nickname set in Muikku user's profile view
            // This is default value but added here as a reminder not to touch this as Muikku Chat UI requires this setting for displaying nick names/real names.
            muc_nickname_from_jid: false,
            // * * * * * * * * * * * * * * *

            // - - - - - - - - - - - - - - -
            // Thou shall touch these
            // - - - - - - - - - - - - - - -

            // Sets timeout when user is marked away automatically
            auto_away: 300,

            // Supported locales for converse. If Muikku has more langauges in future we need to update this.
            locales: ["fi", "en"],

            // Needs to be set to "info" when in production mode
            logLevel: "debug",

            // This might be depcerated as it is not included in converse documentation
            hide_muc_server: false,

            allow_muc: true,

            // We try to archive every message, openfire needs to have archiving turned on with chat rooms also
            message_archiving: "always",

            // This defines the maximum amount of archived messages to be returned per query.
            archived_messages_page_size: 10,

            // Should be 0 if MAM (message_archiving: "always") is in use
            muc_history_max_stanzas: 0,

            muc_show_join_leave: true,

            // This allows students and teachers private messages between each other without adding recipient to contacts
            allow_non_roster_messaging: true,

            // We could set this to IndexedDB so we don't bump into 5MB limit of local storage (not very like to happen).
            // IndexedDB is also async and might be more future proof.
            persistent_store: "localStorage",

            // How often converse pings in milliseconds
            ping_interval: 45,

            // Force sessionStorage instead of localStorage or IndexedDB - FOR DEVELOPMENT ONLY.
            // For production this option needs to be removed.
            trusted: "off",

            // Plugins that can be used
            whitelisted_plugins: ["muikku-chat-ui"]
            // - - - - - - - - - - - - - - -
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