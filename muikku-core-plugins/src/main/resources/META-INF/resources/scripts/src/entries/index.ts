import App from '~/containers/index';
import reducer from '~/reducers/index';
import runApp from '~/run';
import Websocket from '~/util/websocket';
import {Action} from 'redux';

import actions from '~/actions/main-function';
import titleActions from '~/actions/base/title';

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
store.dispatch(<Action>actions.announcements.updateAnnouncements());
store.dispatch(<Action>actions.lastWorkspace.updateLastWorkspace());
store.dispatch(<Action>actions.workspaces.updateWorkspaces());
store.dispatch(<Action>actions.lastMessages.updateLastMessages(6));

store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('plugin.site.title')));