import App from '~/containers/communicator';
import reducer from '~/reducers/communicator';
import runApp from '~/run';
import mApi from '~/lib/mApi';

import mainFunctionDefault from '~/util/base-main-function';

import { loadNewlyReceivedMessage, loadMessageThreads, loadMessageThread, loadMessagesNavigationLabels, loadSignature } from '~/actions/main-function/messages';
import titleActions from '~/actions/base/title';

import {Action} from 'redux';

let store = runApp(reducer, App);
mainFunctionDefault(store)
  .addEventListener("Communicator:newmessagereceived", loadNewlyReceivedMessage);

let currentLocation = window.location.hash.replace("#","").split("/");
function loadLocation(location: string[]){
  if (location.length === 1){
    store.dispatch(<Action>loadMessageThreads(location[0]));
  } else {
    store.dispatch(<Action>loadMessageThread(location[0], parseInt(location[1])));
  }
}
store.dispatch(<Action>loadMessagesNavigationLabels(()=>{
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
  if (!currentLocation[0].includes("label")) {
    loadLocation(currentLocation);
  }
}

store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('plugin.communicator.pageTitle')));
store.dispatch(<Action>loadSignature());