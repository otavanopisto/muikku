import actions from '~/actions/main-function';
import Websocket from '~/util/websocket';
import {Action} from 'redux';

export default function(store: any){
  let websocket = new Websocket(store, {
    "Communicator:newmessagereceived": {
      actions: [actions.messageCount.updateMessageCount, actions.lastMessages.updateLastMessages.bind(null, 6)]
    },
    "Communicator:messageread": {
      actions: [actions.messageCount.updateMessageCount, actions.lastMessages.updateLastMessages.bind(null, 6)]
    },
    "Communicator:threaddeleted": {
      actions: [actions.messageCount.updateMessageCount, actions.lastMessages.updateLastMessages.bind(null, 6)]
    }
  });
  store.dispatch(<Action>actions.messageCount.updateMessageCount());
  return websocket;
}