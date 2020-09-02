import Websocket from '~/util/websocket';
import mApi from '~/lib/mApi';
import {Action} from 'redux';
import { updateUnreadMessageThreadsCount } from '~/actions/main-function/messages';
import converse from '~/lib/converse';
import { StateType } from '~/reducers';
import { Store } from 'redux';
import $ from '~/lib/jquery';
import { updateStatusHasImage } from '~/actions/base/status';

function getOptionValue(option: boolean){
  if (typeof option === "undefined"){
    return true;
  }
  return option;
}

export default function(store: Store<StateType>, options: {
  setupChat?: boolean,
  setupMessages?: boolean
} = {}){
  let state:StateType = store.getState();

  let actionsAndCallbacks = {};
  if (getOptionValue(options.setupMessages)){
    actionsAndCallbacks = {
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
      };
  }

  let websocket = new Websocket(store, actionsAndCallbacks);

  if (state.status.isActiveUser){
    getOptionValue(options.setupMessages) && store.dispatch(<Action>updateUnreadMessageThreadsCount());

    if (state.status.loggedIn && getOptionValue(options.setupChat)){
      mApi().chat.status.read().callback(function(err:Error, result:{mucNickName:string,nick:string,enabled:boolean}) {
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
            keepalive: true,
            // This forces the use of nickname set in Muikku user's profile view
            // This is default value but added here as a reminder not to touch this as Muikku Chat UI requires this setting for displaying nick names/real names.
            muc_nickname_from_jid: false,
            // * * * * * * * * * * * * * * *

            // - - - - - - - - - - - - - - -
            // Thou shall touch these
            // - - - - - - - - - - - - - - -

            // Prevents converse to create instant rooms automatically. This prevents converse to create instant rooms automatically based on local/sessionStorage information.
            // If room is set as disabled via workspace settings and room gets deleted from openfore properly, converse added room back as an instant room.
            muc_instant_rooms: false,
            muc_respect_autojoin: false,

            // Sets timeout when user is marked away automatically
            auto_away: 300,

            // Supported locales for converse. If Muikku has more langauges in future we need to update this.
            locales: ["fi", "en"],

            // Needs to be set to "info" when in production mode
            loglevel: "debug",

            // We try to archive every message, openfire needs to have archiving turned on with chat rooms also
            message_archiving: "always",

            // This defines the maximum amount of archived messages to be returned per query.
            archived_messages_page_size: 50,

            // Should be 0 if MAM (message_archiving: "always") is in use
            muc_history_max_stanzas: 0,

            // If you set this setting to true, then you will be notified of all messages received in a room.
            //notify_all_room_messages: true,

            // This allows students and teachers private messages between each other without adding recipient to contacts
            allow_non_roster_messaging: true,

            // We could set this to IndexedDB so we don't bump into 5MB limit of local storage (not very like to happen).
            // IndexedDB is also async and might be more future proof.
            persistent_store: "localStorage",
            //persistent_store: "IndexedDB",

            // How often converse pings in milliseconds
            ping_interval: 45,

            // Force sessionStorage instead of localStorage or IndexedDB - FOR DEVELOPMENT ONLY.
            // For production this option needs to be removed.
            trusted: "false",

            // Plugins that can be used
            whitelisted_plugins: ["muikku-chat-ui"],
            // - - - - - - - - - - - - - - -

            blacklisted_plugins: ["converse-bookmarks"]
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