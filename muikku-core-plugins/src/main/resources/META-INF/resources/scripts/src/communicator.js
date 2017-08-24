import App from './containers/communicator.jsx';
import reducer from './reducers/communicator';
import runApp from './default.debug.jsx';
import Websocket from './util/websocket';

import actions from './actions/main-function';
import communicatorActions from './actions/main-function/communicator';

runApp(reducer, App, (store)=>{
  let websocket = new Websocket(store, {
    "Communicator:newmessagereceived": {
      actions: [actions.updateMessageCount],
      callbacks: [()=>mApi().communicator.cacheClear]
    },
    "Communicator:messageread": {
      actions: [actions.updateMessageCount],
      callbacks: [()=>mApi().communicator.cacheClear]
    },
    "Communicator:threaddeleted": {
      actions: [actions.updateMessageCount],
      callbacks: [()=>mApi().communicator.cacheClear]
    }
  });
  store.dispatch(actions.messageCount.updateMessageCount());
  store.dispatch(communicatorActions.communicatorNavigation.updateCommunicatorNavigationLabels());

  window.addEventListener("hashchange", ()=>{
    let newLocation = window.location.hash.replace("#","");
    store.dispatch(actions.hash.updateHash(newLocation));
    store.dispatch(communicatorActions.communicatorMessages.updateCommunicatorMessagesForLocation(newLocation));
  }, false);
  if (!window.location.hash){
    window.location.hash = "#inbox";
  } else {
    let currentLocation = window.location.hash.replace("#","");
    store.dispatch(actions.hash.updateHash(currentLocation));
    store.dispatch(communicatorActions.communicatorMessages.updateCommunicatorMessagesForLocation(currentLocation));
  }
});