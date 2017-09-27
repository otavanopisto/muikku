import App from '~/containers/communicator';
import reducer from '~/reducers/communicator';
import runApp from '~/run';
import Websocket from '~/util/websocket';
import mApi from '~/lib/mApi';

import actions from '~/actions/main-function';
import communicatorActions from '~/actions/main-function/communicator';
import titleActions from '~/actions/base/title';

import {Action} from 'redux';

let store = runApp(reducer, App);
let websocket = new Websocket(store, {
  "Communicator:newmessagereceived": {
    actions: [actions.messageCount.updateMessageCount, communicatorActions.communicatorMessages.loadNewlyReceivedMessage],
    callbacks: [()=>mApi().communicator.cacheClear]
  },
  "Communicator:messageread": {
    actions: [actions.messageCount.updateMessageCount],
    callbacks: [()=>mApi().communicator.cacheClear]
  },
  "Communicator:threaddeleted": {
    actions: [actions.messageCount.updateMessageCount],
    callbacks: [()=>mApi().communicator.cacheClear]
  }
});
let currentLocation = window.location.hash.replace("#","").split("/");
function loadLocation(location: string[]){
  if (location.length === 1){
    store.dispatch(<Action>communicatorActions.communicatorMessages.loadMessages(location[0]));
  } else {
    store.dispatch(<Action>communicatorActions.communicatorMessages.loadMessage(location[0], parseInt(location[1])));
  }
}

store.dispatch(<Action>actions.messageCount.updateMessageCount());
store.dispatch(<Action>communicatorActions.communicatorNavigation.updateCommunicatorNavigationLabels(()=>{
  if (currentLocation[0].includes("label")){
    loadLocation(currentLocation);
  }
}));

window.addEventListener("hashchange", ()=>{
  let newLocation: string[] = window.location.hash.replace("#","").split("/");
  loadLocation(newLocation);
}, false);
if (!window.location.hash){
  window.location.hash = "#inbox";
} else {
  if (!currentLocation[0].includes("labels")) {
    loadLocation(currentLocation);
  }
}

store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('plugin.communicator.pageTitle')));
store.dispatch(<Action>communicatorActions.communicatorMessages.loadSignature());