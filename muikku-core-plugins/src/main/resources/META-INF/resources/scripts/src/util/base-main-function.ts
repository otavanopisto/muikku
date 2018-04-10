import Websocket from '~/util/websocket';
import mApi from '~/lib/mApi';
import {Action} from 'redux';
import { updateUnreadMessageThreadsCount } from '~/actions/main-function/messages';

export default function(store: any){
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
  store.dispatch(<Action>updateUnreadMessageThreadsCount());
  return websocket;
}