import Websocket from "~/util/websocket";
import mApi from "~/lib/mApi";
import { Action } from "redux";
import { updateUnreadMessageThreadsCount } from "~/actions/main-function/messages";
import { StateType } from "~/reducers";
import { Store } from "redux";
import { loadStatus, loadWorkspaceStatus } from "~/actions/base/status";

/**
 * getOptionValue
 * @param option option
 */
function getOptionValue(option: boolean) {
  if (typeof option === "undefined") {
    return true;
  }
  return option;
}

/**
 * @param store store
 * @param options options
 * @param options.setupMessages setupMessages
 * @param options.setupWorkspacePermissions setupWorkspacePermissions
 */
export default async function (
  store: Store<StateType>,
  options: {
    setupMessages?: boolean;
    setupWorkspacePermissions?: boolean;
  } = {}
) {
  const state: StateType = store.getState();

  let actionsAndCallbacks = {};
  if (getOptionValue(options.setupMessages)) {
    actionsAndCallbacks = {
      "Communicator:newmessagereceived": {
        actions: [updateUnreadMessageThreadsCount],
        callbacks: [() => mApi().communicator.cacheClear()],
      },
      "Communicator:messageread": {
        actions: [updateUnreadMessageThreadsCount],
        callbacks: [() => mApi().communicator.cacheClear()],
      },
      "Communicator:threaddeleted": {
        actions: [updateUnreadMessageThreadsCount],
        callbacks: [() => mApi().communicator.cacheClear()],
      },
    };
  }

  const websocket = new Websocket(store, actionsAndCallbacks);

  if (state.status.isActiveUser) {
    getOptionValue(options.setupMessages) &&
      store.dispatch(<Action>updateUnreadMessageThreadsCount());
  }

  if (!options.setupWorkspacePermissions) {
    return new Promise((resolve) => {
      /**
       * resolveFn
       */
      const resolveFn = () => {
        resolve(websocket);
      };
      store.dispatch(<Action>loadStatus(resolveFn));
    });
  } else {
    return new Promise((resolve) => {
      let loadedTotal = 0;
      /**
       * resolveFn
       */
      const resolveFn = () => {
        loadedTotal++;
        if (loadedTotal === 2) {
          resolve(websocket);
        }
      };
      store.dispatch(<Action>loadStatus(resolveFn));
      store.dispatch(<Action>loadWorkspaceStatus(resolveFn));
    });
  }
}
