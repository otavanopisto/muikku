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
  let currentLocation = window.location.hash.replace("#","").split("/");
  
  store.dispatch(actions.messageCount.updateMessageCount());
  store.dispatch(communicatorActions.communicatorNavigation.updateCommunicatorNavigationLabels(()=>{
    if (currentLocation[0].includes("label")){
      store.dispatch(communicatorActions.communicatorMessages.updateCommunicatorMessagesForLocation(currentLocation[0]));
    }
  }));

  window.addEventListener("hashchange", ()=>{
    let newLocation = window.location.hash.replace("#","").split("/");
    store.dispatch(actions.hash.updateHash(newLocation));
    store.dispatch(communicatorActions.communicatorMessages.updateCommunicatorMessagesForLocation(newLocation[0]));
  }, false);
  if (!window.location.hash){
    window.location.hash = "#inbox";
  } else {
    store.dispatch(actions.hash.updateHash(currentLocation));
    if (!currentLocation[0].includes("labels")) {
      store.dispatch(communicatorActions.communicatorMessages.updateCommunicatorMessagesForLocation(currentLocation[0]));
    }
  }
});