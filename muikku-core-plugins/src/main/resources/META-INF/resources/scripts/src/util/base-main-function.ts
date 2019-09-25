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
            debug: true,
            bosh_service_url : '/http-bind/',
            authentication : "prebind",
            keepalive : true,
            prebind_url : "/rest/chat/prebind",
            whitelisted_plugins: ['myplugin','addRoom'],
            jid: state.status.userSchoolDataIdentifier,
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