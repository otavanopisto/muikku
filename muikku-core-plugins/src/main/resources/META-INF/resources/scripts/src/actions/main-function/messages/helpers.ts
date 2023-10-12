import notificationActions from "~/actions/base/notifications";
import { AnyActionType } from "~/actions";
import {
  MessagesNavigationItem,
  MessagesStateType,
  MessagesStatePatch,
} from "~/reducers/main-function/messages";
import { StateType } from "~/reducers";
import i18n from "~/locales/i18n";
import {
  MessageSearchResult,
  MessageThread,
  MessageThreadLabel,
} from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import { Dispatch } from "react-redux";

//HELPERS

const MAX_LOADED_AT_ONCE = 30;

//Why in the world do we have a weird second version?
//This is a server-side issue, just why we have different paths for different things.
/**
 * getApiId
 * @param item item
 * @param weirdSecondVersion weirdSecondVersion
 */
export function getApiId(
  item: MessagesNavigationItem,
  weirdSecondVersion = false
) {
  if (item.type === "folder") {
    switch (item.id) {
      case "inbox":
        return !weirdSecondVersion ? "items" : "messages";
      case "unread":
        return !weirdSecondVersion ? "items" : "unread";
      case "sent":
        return "sentitems";
      case "trash":
        return "trash";
    }
    // eslint-disable-next-line no-console
    if (console && console.warn) {
      // eslint-disable-next-line no-console
      console.warn("Invalid navigation item location", item);
    }
  } else {
    return !weirdSecondVersion ? "items" : "messages";
  }
}

let internalLastLoadId: number = null;

/**
 * loadMessagesHelper
 * @param location location
 * @param query query
 * @param initial initial
 * @param dispatch dispatch
 * @param getState getState
 */
export async function loadMessagesHelper(
  location: string | null,
  query: string | null,
  initial: boolean,
  dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
  getState: () => StateType
) {
  //Remove the current message
  dispatch({
    type: "SET_CURRENT_MESSAGE_THREAD",
    payload: null,
  });

  const loadId = new Date().getTime();
  internalLastLoadId = loadId;

  const state = getState();
  const actualLocation: string = location || state.messages.location;
  const searchQuery: string =
    (typeof query === "string" ? query : state.messages.query) || null;

  //Avoid loading messages again for the first time if it's the same location
  if (
    initial &&
    actualLocation === state.messages.location &&
    state.messages.query === (query || null) &&
    state.messages.state === "READY"
  ) {
    return;
  }

  //If it's for the first time
  if (initial) {
    //We set this state to loading
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: <MessagesStateType>"LOADING",
    });
  } else {
    //Otherwise we are loading more
    dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: <MessagesStateType>"LOADING_MORE",
    });
  }

  //We get the navigation location item
  const item = state.messages.navigation.find(
    (item) => item.location === actualLocation
  );
  if (!item) {
    return dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: <MessagesStateType>"ERROR",
    });
  }

  let slotUsed = "threads";
  if (searchQuery) {
    slotUsed = "searchMessages";
  }

  //Generate the api query, our first result in the messages that we have loaded
  //because searchMessages might be null we need to consider that
  const firstResult =
    (initial
      ? 0
      : (state.messages as any)[slotUsed] &&
        (state.messages as any)[slotUsed].length) || 0;
  //We only concat if it is not the initial, that means adding to the next messages
  const concat = !initial;

  let params;
  //If we got a folder
  if (item.type === "folder" && !searchQuery) {
    params = {
      firstResult,
      //We load one more to check if they have more
      maxResults: MAX_LOADED_AT_ONCE + 1,
    };
    switch (item.id) {
      case "inbox":
        (<any>params).onlyUnread = false;
        break;
      case "unread":
        (<any>params).onlyUnread = true;
        break;
    }
    //If we got a label
  } else if (item.type === "label" || searchQuery) {
    params = {
      firstResult,
      //We load one more to check if they have more
      maxResults: MAX_LOADED_AT_ONCE + 1,
    };
    //Otherwise if it's some weird thing we don't recognize
  } else {
    return dispatch({
      type: "UPDATE_MESSAGES_STATE",
      payload: <MessagesStateType>"ERROR",
    });
  }

  const communicatorApi = MApi.getCommunicatorApi();

  let results: MessageThread[] | MessageSearchResult[];

  try {
    if (searchQuery) {
      const queryParams = {
        ...params,
        q: searchQuery,
      };

      results = await communicatorApi.getCommunicatorSearchItems({
        q: searchQuery,
        firstResult: queryParams.firstResult,
        maxResults: queryParams.maxResults,
      });
    } else if (item.type !== "label") {
      const apiPathId = getApiId(item);

      // Only these three paths are supported
      switch (apiPathId) {
        case "items":
          results = await communicatorApi.getCommunicatorThreads(params);
          break;

        case "sentitems":
          results = await communicatorApi.getCommunicatorSentItems(params);
          break;

        case "trash":
          results = await communicatorApi.getCommunicatorTrash(params);
          break;

        default:
          break;
      }
    } else {
      results = await communicatorApi.getCommunicatorUserLabelMessages({
        labelId: item.id as number,
      });
    }
    const hasMore: boolean = results.length === MAX_LOADED_AT_ONCE + 1;

    //This is because of the array is actually a reference to a cached array
    //so we rather make a copy otherwise you'll mess up the cache :/
    const actualResults = (results as any).concat([]);
    if (hasMore) {
      //we got to get rid of that extra loaded message
      actualResults.pop();
    }

    //Create the payload for updating all the communicator properties
    const properLocation = location || item.location;
    const payload: MessagesStatePatch = {
      state: "READY",
      hasMore,
      location: properLocation,
      query: searchQuery,
    };
    if (searchQuery) {
      payload.searchMessages = concat
        ? (state.messages.searchMessages || []).concat(actualResults)
        : actualResults;
    } else {
      payload.threads = concat
        ? state.messages.threads.concat(actualResults)
        : actualResults;
      payload.searchMessages = null;
    }
    if (!concat) {
      payload.selectedThreads = [];
      payload.selectedThreadsIds = [];
    }

    //And there it goes
    if (internalLastLoadId === loadId) {
      dispatch({
        type: "UPDATE_MESSAGES_ALL_PROPERTIES",
        payload,
      });
    }
  } catch (err) {
    if (!isMApiError(err)) {
      throw err;
    }
    //Error :(
    dispatch(
      notificationActions.displayNotification(
        i18n.t("notifications.loadError", {
          ns: "messaging",
          context: "messages",
        }),
        "error"
      )
    );
    if (internalLastLoadId === loadId) {
      dispatch({
        type: "UPDATE_MESSAGES_STATE",
        payload: <MessagesStateType>"ERROR",
      });
    }
  }
}

/**
 * setLabelStatusCurrentMessage
 * @param label label
 * @param isToAddLabel isToAddLabel
 * @param dispatch dispatch
 * @param getState getState
 */
export async function setLabelStatusCurrentMessage(
  label: MessageThreadLabel,
  isToAddLabel: boolean,
  dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
  getState: () => StateType
) {
  const state = getState();
  const messageLabel = state.messages.currentThread.labels.find(
    (mlabel: MessageThreadLabel) => mlabel.labelId === label.id
  );
  const communicatorMessageId =
    state.messages.currentThread.messages[0].communicatorMessageId;

  const communicatorApi = MApi.getCommunicatorApi();

  try {
    if (isToAddLabel && !messageLabel) {
      const serverProvidedLabel =
        await communicatorApi.addCommunicatorMessageLabel({
          messageId: communicatorMessageId,
          addCommunicatorMessageLabelRequest: {
            labelId: label.id,
          },
        });

      dispatch({
        type: "UPDATE_MESSAGE_THREAD_ADD_LABEL",
        payload: {
          communicatorMessageId,
          label: serverProvidedLabel,
        },
      });
    } else if (!isToAddLabel) {
      if (!messageLabel) {
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.doesNotExistError", {
              ns: "messaging",
              context: "label",
            }),
            "error"
          )
        );
      } else {
        await communicatorApi.deleteCommunicatorMessageLabel({
          messageId: communicatorMessageId,
          labelId: messageLabel.id,
        });

        dispatch({
          type: "UPDATE_MESSAGE_THREAD_DROP_LABEL",
          payload: {
            communicatorMessageId,
            label: messageLabel,
          },
        });
      }
    }
  } catch (err) {
    if (!isMApiError(err)) {
      throw err;
    }

    dispatch(
      notificationActions.displayNotification(
        i18n.t("notifications.addError", { ns: "messaging", context: "label" }),
        "error"
      )
    );
  }
}

/**
 * setLabelStatusSelectedMessages
 * @param label label
 * @param isToAddLabel isToAddLabel
 * @param dispatch dispatch
 * @param getState getState
 */
export function setLabelStatusSelectedMessages(
  label: MessageThreadLabel,
  isToAddLabel: boolean,
  dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
  getState: () => StateType
) {
  const state = getState();

  const communicatorApi = MApi.getCommunicatorApi();

  state.messages.selectedThreads.forEach(async (thread: MessageThread) => {
    const threadLabel = thread.labels.find(
      (mlabel) => mlabel.labelId === label.id
    );

    try {
      if (isToAddLabel && !threadLabel) {
        const serverProvidedLabel =
          await communicatorApi.addCommunicatorMessageLabel({
            messageId: thread.communicatorMessageId,
            addCommunicatorMessageLabelRequest: {
              labelId: label.id,
            },
          });

        dispatch({
          type: "UPDATE_MESSAGE_THREAD_ADD_LABEL",
          payload: {
            communicatorMessageId: thread.communicatorMessageId,
            label: serverProvidedLabel,
          },
        });
      } else if (!isToAddLabel) {
        if (!threadLabel) {
          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.doesNotExistError", {
                ns: "messaging",
                context: "label",
              }),
              "error"
            )
          );
        } else {
          await communicatorApi.deleteCommunicatorMessageLabel({
            messageId: thread.communicatorMessageId,
            labelId: threadLabel.id,
          });

          dispatch({
            type: "UPDATE_MESSAGE_THREAD_DROP_LABEL",
            payload: {
              communicatorMessageId: thread.communicatorMessageId,
              label: threadLabel,
            },
          });
        }
      }
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.addError", {
            ns: "messaging",
            context: "label",
          }),
          "error"
        )
      );
    }
  });
}
