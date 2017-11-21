import actions from '~/actions/main-function';
import Websocket from '~/util/websocket';
import mApi from '~/lib/mApi';
import {Action} from 'redux';

export default function(store: any){
  let websocket = new Websocket(store, {
    "Communicator:newmessagereceived": {
      actions: [actions.messageCount.updateMessageCount],
      callbacks: [()=>mApi().communicator.cacheClear()]
    },
    "Communicator:messageread": {
      actions: [actions.messageCount.updateMessageCount],
      callbacks: [()=>mApi().communicator.cacheClear()]
    },
    "Communicator:threaddeleted": {
      actions: [actions.messageCount.updateMessageCount],
      callbacks: [()=>mApi().communicator.cacheClear()]
    }
  });
  store.dispatch(<Action>actions.messageCount.updateMessageCount());
  return websocket;
}