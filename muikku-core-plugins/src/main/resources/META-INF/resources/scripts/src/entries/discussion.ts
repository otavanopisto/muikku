import App from '~/containers/discussion';
import reducer from '~/reducers/discussion';
import runApp from '~/run';
import Websocket from '~/util/websocket';
import {Action} from 'redux';

import actions from '~/actions/main-function';
import titleActions from '~/actions/base/title';
import {loadDiscussionAreas} from '~/actions/main-function/discussion/discussion-areas';
import {loadDiscussionThreads, loadDiscussionThread} from '~/actions/main-function/discussion/discussion-threads';

let store = runApp(reducer, App);
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
store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('plugin.forum.pageTitle')));

store.dispatch(<Action>loadDiscussionAreas());

let currentLocation = window.location.hash.replace("#","").split("/");
if (currentLocation[0] === ""){
  currentLocation = [];
}
loadLocation(currentLocation);
function loadLocation(location: string[]){
  if (location.length === 0){
    store.dispatch(<Action>loadDiscussionThreads(null));
  } else if (location.length === 1){
    store.dispatch(<Action>loadDiscussionThreads(parseInt(location[0])));
  } else {
    store.dispatch(<Action>loadDiscussionThread(parseInt(location[0]), parseInt(location[1])));
  }
}
window.addEventListener("hashchange", ()=>{
  let newLocation: string[] = window.location.hash.replace("#","").split("/");
  if (newLocation[0] === ""){
    newLocation = [];
  }
  loadLocation(newLocation);
}, false);