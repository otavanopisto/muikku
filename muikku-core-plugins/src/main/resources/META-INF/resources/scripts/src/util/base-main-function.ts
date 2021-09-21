import Websocket from '~/util/websocket';
import mApi from '~/lib/mApi';
import {Action} from 'redux';
import { updateUnreadMessageThreadsCount } from '~/actions/main-function/messages';
import { StateType } from '~/reducers';
import { Store } from 'redux';
import { loadStatus } from '~/actions/base/status';

function getOptionValue(option: boolean){
  if (typeof option === "undefined"){
    return true;
  }
  return option;
}

export default function(store: Store<StateType>, options: {
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

  if (state.status.isActiveUser) {
    getOptionValue(options.setupMessages) && store.dispatch(<Action>updateUnreadMessageThreadsCount());
  }

  store.dispatch(<Action> loadStatus());

  return websocket;
}
