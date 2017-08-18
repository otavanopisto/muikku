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
});