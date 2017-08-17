import App from './containers/index.jsx';
import reducer from './reducers/index';
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
  store.dispatch(actions.announcements.updateAnnouncements());
  store.dispatch(actions.lastWorkspace.updateLastWorkspace());
});