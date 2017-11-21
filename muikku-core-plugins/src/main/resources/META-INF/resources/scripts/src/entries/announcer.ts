import App from '~/containers/announcer';
import reducer from '~/reducers/announcer';
import runApp from '~/run';

import titleActions from '~/actions/base/title';

import mainFunctionDefault from '~/util/base-main-function';
import { loadAnnouncements } from '~/actions/main-function/announcer/announcements';
import { Action } from 'redux';

let store = runApp(reducer, App);
mainFunctionDefault(store);
store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('plugin.announcer.pageTitle')));
//
//let currentLocation = window.location.hash.replace("#","").split("/");
//function loadLocation(location: string[]){
//  if (location.length === 1){
//    store.dispatch(<Action>loadAnnouncements(location[0]));
//  } else {
//    store.dispatch(<Action>loadMessage(location[0], parseInt(location[1])));
//  }
//}
//store.dispatch(<Action>communicatorActions.communicatorNavigation.updateCommunicatorNavigationLabels(()=>{
//  if (currentLocation[0].includes("label")){
//    loadLocation(currentLocation);
//  }
//}));
//
//window.addEventListener("hashchange", ()=>{
//  let newLocation: string[] = window.location.hash.replace("#","").split("/");
//  loadLocation(newLocation);
//}, false);
//if (!window.location.hash){
//  window.location.hash = "#inbox";
//} else {
//  if (!currentLocation[0].includes("labels")) {
//    loadLocation(currentLocation);
//  }
//}
//
//store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('plugin.communicator.pageTitle')));
//store.dispatch(<Action>communicatorActions.communicatorMessages.loadSignature());