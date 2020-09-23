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

  $.ajax({type:"HEAD", url: `/rest/user/files/user/${state.status.userId}/identifier/profile-image-96`}).done(()=>{
    store.dispatch(<Action>updateStatusHasImage(true));
  });

  return websocket;
}
