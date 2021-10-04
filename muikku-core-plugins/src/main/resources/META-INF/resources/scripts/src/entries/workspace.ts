import App from '~/containers/workspace';
import reducer from '~/reducers/workspace';
import runApp from '~/run';

import mainFunctionDefault from '~/util/base-main-function';
import { updateWorkspaceEditModeState } from '~/actions/workspaces';
import {Action} from 'redux';
import tabOrMouse from '~/util/tab-or-mouse';

runApp(reducer, App, async (store)=>{
  tabOrMouse();

  if (store.getState().status.permissions.WORKSPACE_MANAGE_WORKSPACE) {
    store.dispatch(<Action>updateWorkspaceEditModeState({available: true}, true));
  } else {
    store.subscribe(() => {
      if (store.getState().status.permissions.WORKSPACE_MANAGE_WORKSPACE) {
        store.dispatch(<Action>updateWorkspaceEditModeState({available: true}, true));
      }
    });
  }
  let websocket = null;
  if (store.getState().status.loggedIn) {
    websocket = await mainFunctionDefault(store, {setupMessages: false, setupWorkspacePermissions: true});
  }
  return {websocket};
});
