import App from "~/containers/workspace";
import reducer from "~/reducers/workspace";
import { prepareApp } from "~/run";

import mainFunctionDefault from "~/util/base-main-function";
import { updateWorkspaceEditModeState } from "~/actions/workspaces";
import { Action } from "redux";
import tabOrMouse from "~/util/tab-or-mouse";

export function renderWorkspaces() {
  return prepareApp(reducer, App, async (store) => {
    tabOrMouse();

    if (store.getState().status.permissions.WORKSPACE_MANAGE_WORKSPACE) {
      store.dispatch(
        <Action>updateWorkspaceEditModeState({ available: true }, true)
      );
    } else {
      store.subscribe(() => {
        const state = store.getState();
        if (
          state.status.permissions.WORKSPACE_MANAGE_WORKSPACE &&
          (!state.workspaces.editMode || !state.workspaces.editMode.available)
        ) {
          store.dispatch(
            <Action>updateWorkspaceEditModeState({ available: true }, true)
          );
        }
      });
    }
    const websocket = await mainFunctionDefault(store, {
      setupMessages: false,
      setupWorkspacePermissions: true,
    });
    return { websocket };
  });
}
