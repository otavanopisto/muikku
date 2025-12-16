//import App from "~/containers/main-function";
import App from "~/containers/app";
import reducer from "~/reducers/main-function";
import runApp from "../run";
import { loadLocale } from "~/actions/base/locales";
import mainFunctionDefault from "~/util/base-main-function";
import tabOrMouse from "~/util/tab-or-mouse";
import { Action } from "redux";
import { updateWorkspaceEditModeState } from "~/actions/workspaces";

runApp(reducer, App, async (store) => {
  // This is needed, otherwise the locales will default to "fi" on refresh even if they are set to "en"
  store.dispatch(<Action>loadLocale());

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

  const websocket = await mainFunctionDefault(store);

  return { websocket };
});
