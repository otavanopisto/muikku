import App from './containers/communicator.jsx';
import reducer from './reducers/communicator';
import runApp from './default.debug.jsx';
import Websocket from './util/websocket';

import actions from './actions/main-function';

runApp(reducer, App, (store)=>{
  let websocket = new Websocket(store, {
    "Communicator:newmessagereceived": [actions.updateMessageCount],
    "Communicator:messageread": [actions.updateMessageCount],
    "Communicator:threaddeleted": [actions.updateMessageCount]
  });
  store.dispatch(actions.messageCount.updateMessageCount());
  store.dispatch(actions.labels.updateLabels());
  
  window.addEventListener("hashchange", ()=>{
    store.dispatch(actions.hash.updateHash(window.location.hash.replace("#","")));
  }, false);
  if (!window.location.hash){
    window.location.hash = "#inbox";
  } else {
    store.dispatch(actions.hash.updateHash(window.location.hash.replace("#","")));
  }
});