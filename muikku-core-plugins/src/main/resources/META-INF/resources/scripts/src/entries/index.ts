import App from '~/containers/index';
import reducer from '~/reducers/index';
import runApp from '~/run';
import {Action} from 'redux';

import mainFunctionDefault from './util/base-main-function';

import actions from '~/actions/main-function';
import titleActions from '~/actions/base/title';

let store = runApp(reducer, App);
mainFunctionDefault(store);

store.dispatch(<Action>actions.announcements.updateAnnouncements());
store.dispatch(<Action>actions.lastWorkspace.updateLastWorkspace());
store.dispatch(<Action>actions.workspaces.updateWorkspaces());
store.dispatch(<Action>actions.lastMessages.updateLastMessages(6));

store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('plugin.site.title')));