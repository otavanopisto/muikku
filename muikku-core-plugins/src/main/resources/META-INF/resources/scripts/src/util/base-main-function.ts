/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import Websocket from "~/util/websocket";
import { updateUnreadMessageThreadsCount } from "~/actions/main-function/messages";
import {
  loadEnviromentalForumAreaPermissions,
  loadStatus,
  loadWorkspaceStatus,
  updateStatusChatSettings,
} from "~/actions/base/status";
import { AppStore } from "~/reducers/configureStore";
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
 * @param options.setupChat setupChat
 */
export default async function (
  store: AppStore,
  options: {
    setupMessages?: boolean;
    setupWorkspacePermissions?: boolean;
    setupChat?: boolean;
  } = {}
) {
  let actionsAndCallbacks = {};
  if (getOptionValue(options.setupMessages)) {
    actionsAndCallbacks = {
      "Communicator:newmessagereceived": {
        actions: [updateUnreadMessageThreadsCount],
        callbacks: [],
      },
      "Communicator:messageread": {
        actions: [updateUnreadMessageThreadsCount],
        callbacks: [],
      },
      "Communicator:threaddeleted": {
        actions: [updateUnreadMessageThreadsCount],
        callbacks: [],
      },
      "chat:settings-change": {
        actions: [updateStatusChatSettings],
        callbacks: [],
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
    store.dispatch(updateUnreadMessageThreadsCount());

  /**
   * Loads chat settings after logging status has been resolved by loadStatus action.
   */
  const loadChatSettings = () =>
    getOptionValue(options.setupChat) &&
    store.getState().status.loggedIn &&
    store.dispatch(updateStatusChatSettings());

  /**
   * Loads area permissions for environmental forum
   * after logging status has been resolved by loadStatus action.
   */
  const loadAreaPermissions = () =>
    store.dispatch(loadEnviromentalForumAreaPermissions());

  const isWorkspace = window.location.pathname.includes("/workspace/");
  const workspaceUrl = window.location.pathname.split("/")[2];

  // If the user is trying to access a workspace,
  // and the workspace URL is defined, initialize as workspace
  const initializeAsWorkspace = isWorkspace && workspaceUrl !== undefined;

  if (!initializeAsWorkspace) {
    return new Promise((resolve) => {
      // eslint-disable-next-line jsdoc/require-jsdoc
      const resolveFn = () => {
        loadAreaPermissions();
        updateUnreadThreadMessagesCount();
        loadChatSettings();
        resolve(initializeWebsocket(actionsAndCallbacks));
      };
      store.dispatch(loadStatus(resolveFn));
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
          loadChatSettings();
          resolve(initializeWebsocket(actionsAndCallbacks));
        }
      };
      store.dispatch(loadStatus(resolveFn));
      store.dispatch(loadWorkspaceStatus(resolveFn));
    });
  }
}
