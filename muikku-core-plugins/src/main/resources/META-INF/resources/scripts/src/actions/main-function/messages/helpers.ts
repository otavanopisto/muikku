import notificationActions from "~/actions/base/notifications";
import promisify from "~/util/promisify";
import mApi from "~/lib/mApi";
import { AnyActionType } from "~/actions";
import {
  MessagesNavigationItemType,
  MessagesStateType,
  MessageThreadListType,
  MessagesPatchType,
  MessageThreadLabelType,
  MessageThreadType,
  MessageSearchResult,
} from "~/reducers/main-function/messages";
import { StateType } from "~/reducers";

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
  item: MessagesNavigationItemType,
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
  dispatch: (arg: AnyActionType) => any,
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

  let results: MessageThreadListType | MessageSearchResult[];
  try {
    if (searchQuery) {
      const queryParams = {
        ...params,
        q: searchQuery,
      };
      results = <MessageSearchResult[]>(
        await promisify(
          mApi().communicator.searchItems.cacheClear().read(queryParams),
          "callback"
        )()
      );
    } else if (item.type !== "label") {
      results = <MessageThreadListType>(
        await promisify(
          mApi().communicator[getApiId(item)].read(params),
          "callback"
        )()
      );
    } else {
      results = <MessageThreadListType>(
        await promisify(
          mApi().communicator.userLabels.messages.read(item.id, params),
          "callback"
        )()
      );
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
    const payload: MessagesPatchType = {
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
    //Error :(
    dispatch(
      notificationActions.displayNotification(
        getState().i18nOLD.text.get(
          "plugin.communicator.errormessage.msgsLoadFailed"
        ),
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
  label: MessageThreadLabelType,
  isToAddLabel: boolean,
  dispatch: (arg: AnyActionType) => any,
  getState: () => StateType
) {
  const state = getState();
  const messageLabel = state.messages.currentThread.labels.find(
    (mlabel: MessageThreadLabelType) => mlabel.labelId === label.id
  );
  const communicatorMessageId =
    state.messages.currentThread.messages[0].communicatorMessageId;

  try {
    if (isToAddLabel && !messageLabel) {
      const serverProvidedLabel: MessageThreadLabelType = <
        MessageThreadLabelType
      >await promisify(
        mApi().communicator.messages.labels.create(communicatorMessageId, {
          labelId: label.id,
        }),
        "callback"
      )();
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
            getState().i18nOLD.text.get(
              "plugin.communicator.errormessage.labelDoesNotExist"
            ),
            "error"
          )
        );
      } else {
        await promisify(
          mApi().communicator.messages.labels.del(
            communicatorMessageId,
            messageLabel.id
          ),
          "callback"
        )();
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
    dispatch(
      notificationActions.displayNotification(
        getState().i18nOLD.text.get(
          "plugin.communicator.errormessage.labelingFailed"
        ),
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
  label: MessageThreadLabelType,
  isToAddLabel: boolean,
  dispatch: (arg: AnyActionType) => any,
  getState: () => StateType
) {
  const state = getState();

  state.messages.selectedThreads.forEach(async (thread: MessageThreadType) => {
    const threadLabel = thread.labels.find(
      (mlabel) => mlabel.labelId === label.id
    );

    try {
      if (isToAddLabel && !threadLabel) {
        const serverProvidedLabel: MessageThreadLabelType = <
          MessageThreadLabelType
        >await promisify(
          mApi().communicator.messages.labels.create(
            thread.communicatorMessageId,
            {
              labelId: label.id,
            }
          ),
          "callback"
        )();
        dispatch({
          type: "UPDATE_MESSAGE_THREAD_ADD_LABEL",
          payload: {
            communicatorMessageId: thread.communicatorMessageId,
            label: serverProvidedLabel,
          },
        });
      } else if (!isToAddLabel) {
        if (!threadLabel) {
          //TODO translate this
          dispatch(
            notificationActions.displayNotification(
              getState().i18nOLD.text.get(
                "plugin.communicator.errormessage.labelDoesNotExist"
              ),
              "error"
            )
          );
        } else {
          await promisify(
            mApi().communicator.messages.labels.del(
              thread.communicatorMessageId,
              threadLabel.id
            ),
            "callback"
          )();
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
      dispatch(
        notificationActions.displayNotification(
          getState().i18nOLD.text.get(
            "plugin.communicator.errormessage.labelingFailed"
          ),
          "error"
        )
      );
    }
  });
}
