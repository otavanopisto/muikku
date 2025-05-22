import tabOrMouse from "~/util/tab-or-mouse";
import { loadLocale } from "~/actions/base/locales";
import { updateWorkspaceEditModeState } from "~/actions/workspaces";
import mainFunctionDefault from "~/util/base-main-function";
import { AppStore } from "~/reducers/configureStore";

/**
 * initApp
 * @param store store
 * @returns Promise<Websocket>
 */
export const initApp = async (store: AppStore) => {
  store.dispatch(loadLocale());

  tabOrMouse();

  if (store.getState().status.permissions.WORKSPACE_MANAGE_WORKSPACE) {
    store.dispatch(updateWorkspaceEditModeState({ available: true }, true));
  } else {
    store.subscribe(() => {
      const state = store.getState();
      if (
        state.status.permissions.WORKSPACE_MANAGE_WORKSPACE &&
        (!state.workspaces.editMode || !state.workspaces.editMode.available)
      ) {
        store.dispatch(updateWorkspaceEditModeState({ available: true }, true));
      }
    });
  }

  const websocket = await mainFunctionDefault(store);
  return websocket;
};
