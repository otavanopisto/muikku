/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import Websocket from "~/util/websocket";
import mApi from "~/lib/mApi";
import { Action } from "redux";
import { updateUnreadMessageThreadsCount } from "~/actions/main-function/messages";
import { StateType } from "~/reducers";
import { Store } from "redux";
import {
  loadEnviromentalForumAreaPermissions,
  loadStatus,
  loadWorkspaceStatus,
} from "~/actions/base/status";

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
 * Main function to be called when initializing the app
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

  /**
   * Actions to intialize websocket when user is logged in
   *
   * @param actionsAndCallbacks actionsAndCallbacks
   */
  const initializeWebsocket = (actionsAndCallbacks: any) => {
    let websocket: any = null;

    if (store.getState().status.loggedIn) {
      websocket = new Websocket(store, actionsAndCallbacks);
    }

    return websocket;
  };

  /**
   * Updates unread thread messages count
   */
  const updateUnreadThreadMessagesCount = () =>
    getOptionValue(options.setupMessages) &&
    store.dispatch(<Action>updateUnreadMessageThreadsCount());

  /**
   * Loads area permissions for environmental forum
   * after logging status has been resolved by loadStatus action.
   */
  const loadAreaPermissions = () =>
    store.dispatch(<Action>loadEnviromentalForumAreaPermissions());

  if (!options.setupWorkspacePermissions) {
    return new Promise((resolve) => {
      // eslint-disable-next-line jsdoc/require-jsdoc
      const resolveFn = () => {
        loadAreaPermissions();
        updateUnreadThreadMessagesCount();
        resolve(initializeWebsocket(actionsAndCallbacks));
      };
      store.dispatch(<Action>loadStatus(resolveFn));
    });
  } else {
    return new Promise((resolve) => {
      let loadedTotal = 0;

      // eslint-disable-next-line jsdoc/require-jsdoc
      const resolveFn = () => {
        loadedTotal++;

        if (loadedTotal === 2) {
          loadAreaPermissions();
          updateUnreadThreadMessagesCount();
          resolve(initializeWebsocket(actionsAndCallbacks));
        }
      };
      store.dispatch(<Action>loadStatus(resolveFn));
      store.dispatch(<Action>loadWorkspaceStatus(resolveFn));
    });
  }
}
