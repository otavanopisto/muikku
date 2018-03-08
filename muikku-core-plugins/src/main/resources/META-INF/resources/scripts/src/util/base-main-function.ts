import Websocket from '~/util/websocket';
import mApi from '~/lib/mApi';
import {Action} from 'redux';
import { updateMessageCount } from '~/actions/main-function/messages';

export default function(store: any){
  let websocket = new Websocket(store, {
    "Communicator:newmessagereceived": {
      actions: [updateMessageCount],
      callbacks: [()=>mApi().communicator.cacheClear()]
    },
    "Communicator:messageread": {
      actions: [updateMessageCount],
      callbacks: [()=>mApi().communicator.cacheClear()]
    },
    "Communicator:threaddeleted": {
      actions: [updateMessageCount],
      callbacks: [()=>mApi().communicator.cacheClear()]
    }
  });
  store.dispatch(<Action>updateMessageCount());
  return websocket;
}