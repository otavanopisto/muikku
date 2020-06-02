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
      mApi().chat.status.read().callback(function(err:Error, result:{mucNickName:string,enabled:boolean}) {
        if (result && result.enabled) {
          converse.initialize({
            bosh_service_url : '/http-bind/',
            authentication : "prebind",
            keepalive : true,
            prebind_url : "/rest/chat/prebind",
            jid: state.status.userId,
            auto_login : true,
            muc_domain : 'conference.' + location.hostname,
            muc_nickname : result.mucNickName,
            muc_show_join_leave: false,
            hide_muc_server : true,
            ping_interval: 45,
            auto_minimize: true,
            i18n: state.locales.current,
            hide_occupants:true,
            limit_room_controls:true
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
