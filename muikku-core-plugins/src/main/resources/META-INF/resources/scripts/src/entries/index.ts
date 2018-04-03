import App from '~/containers/index';
import reducer from '~/reducers/index';
import runApp from '~/run';
import {Action} from 'redux';

import mainFunctionDefault from '~/util/base-main-function';

import titleActions from '~/actions/base/title';
import { loadLastMessagesFromServer } from '~/actions/main-function/messages';
import { loadAnnouncementsAsAClient } from '~/actions/main-function/announcements';
import { loadLastWorkspaceFromServer, loadWorkspacesFromServer } from '~/actions/main-function/workspaces';

let store = runApp(reducer, App);
mainFunctionDefault(store)
  .addEventListener("Communicator:newmessagereceived", loadLastMessagesFromServer.bind(null,6));

store.dispatch(<Action>loadAnnouncementsAsAClient());
store.dispatch(<Action>loadLastWorkspaceFromServer());
store.dispatch(<Action>loadWorkspacesFromServer());
store.dispatch(<Action>loadLastMessagesFromServer(6));

store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('plugin.site.title')));