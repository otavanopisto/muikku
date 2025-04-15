import tabOrMouse from "~/util/tab-or-mouse";
import { loadLocale } from "~/actions/base/locales";
import { updateWorkspaceEditModeState } from "~/actions/workspaces";
import mainFunctionDefault from "~/util/base-main-function";
import { Action, Store } from "redux";
import { StateType } from "~/reducers";

/**
 * initApp
 * @param store store
 * @returns Promise<Websocket>
 */
export const initApp = async (store: Store<StateType>) => {
  store.dispatch(loadLocale() as Action);

  tabOrMouse();

  if (store.getState().status.permissions.WORKSPACE_MANAGE_WORKSPACE) {
    store.dispatch(
      updateWorkspaceEditModeState({ available: true }, true) as Action
    );
  } else {
    store.subscribe(() => {
      const state = store.getState();
      if (
        state.status.permissions.WORKSPACE_MANAGE_WORKSPACE &&
        (!state.workspaces.editMode || !state.workspaces.editMode.available)
      ) {
        store.dispatch(
          updateWorkspaceEditModeState({ available: true }, true) as Action
        );
      }
    });
  }

  const websocket = await mainFunctionDefault(store);
  return websocket;
};
