import { AnyActionType, SpecificActionType } from "~/actions";
import {
  MessagesStateType,
  MessagesStatePatch,
  MessagesNavigationItem,
} from "~/reducers/main-function/messages";
import { displayNotification } from "~/actions/base/notifications";
import { hexToColorInt, colorIntToHex } from "~/util/modifiers";
import {
  getApiId,
  loadMessagesHelper,
  setLabelStatusCurrentMessage,
  setLabelStatusSelectedMessages,
} from "./helpers";
import { ContactRecipientType } from "~/reducers/user-index";
import { StatusType } from "~/reducers/base/status";
import i18n from "~/locales/i18n";
import MApi, { isMApiError } from "~/api/api";
import {
  CommunicatorSignature,
  Message,
  MessageThread,
  MessageThreadExpanded,
  MessageThreadLabel,
} from "~/generated/client";

/**
 * UpdateMessageThreadsCountTriggerType
 */
export interface UpdateMessageThreadsCountTriggerType {
  (): AnyActionType;
}

export type TOGGLE_ALL_MESSAGE_ITEMS = SpecificActionType<
  "TOGGLE_ALL_MESSAGE_ITEMS",
  undefined
>;
export type UPDATE_UNREAD_MESSAGE_THREADS_COUNT = SpecificActionType<
  "UPDATE_UNREAD_MESSAGE_THREADS_COUNT",
  number
>;
export type UPDATE_MESSAGE_THREADS = SpecificActionType<
  "UPDATE_MESSAGE_THREADS",
  MessageThread[]
>;
export type SET_CURRENT_MESSAGE_THREAD = SpecificActionType<
  "SET_CURRENT_MESSAGE_THREAD",
  MessageThreadExpanded
>;
export type UPDATE_MESSAGES_STATE = SpecificActionType<
  "UPDATE_MESSAGES_STATE",
  MessagesStateType
>;
export type UPDATE_MESSAGES_ALL_PROPERTIES = SpecificActionType<
  "UPDATE_MESSAGES_ALL_PROPERTIES",
  MessagesStatePatch
>;
export type UPDATE_MESSAGE_THREAD_ADD_LABEL = SpecificActionType<
  "UPDATE_MESSAGE_THREAD_ADD_LABEL",
  {
    communicatorMessageId: number;
    label: MessageThreadLabel;
  }
>;
export type UPDATE_MESSAGE_THREAD_DROP_LABEL = SpecificActionType<
  "UPDATE_MESSAGE_THREAD_DROP_LABEL",
  {
    communicatorMessageId: number;
    label: MessageThreadLabel;
  }
>;
export type PUSH_ONE_MESSAGE_THREAD_FIRST = SpecificActionType<
  "PUSH_ONE_MESSAGE_THREAD_FIRST",
  MessageThread
>;
export type LOCK_TOOLBAR = SpecificActionType<"LOCK_TOOLBAR", null>;
export type UNLOCK_TOOLBAR = SpecificActionType<"UNLOCK_TOOLBAR", null>;
export type UPDATE_ONE_MESSAGE_THREAD = SpecificActionType<
  "UPDATE_ONE_MESSAGE_THREAD",
  {
    thread: MessageThread;
    update: Partial<MessageThread>;
  }
>;
export type UPDATE_MESSAGES_SIGNATURE = SpecificActionType<
  "UPDATE_MESSAGES_SIGNATURE",
  CommunicatorSignature
>;
export type DELETE_MESSAGE_THREAD = SpecificActionType<
  "DELETE_MESSAGE_THREAD",
  MessageThread
>;
export type UPDATE_SELECTED_MESSAGE_THREADS = SpecificActionType<
  "UPDATE_SELECTED_MESSAGE_THREADS",
  MessageThread[]
>;
export type ADD_TO_MESSAGES_SELECTED_THREADS = SpecificActionType<
  "ADD_TO_MESSAGES_SELECTED_THREADS",
  MessageThread
>;
export type ADD_TO_ALL_MESSAGES_SELECTED_THREADS = SpecificActionType<
  "ADD_TO_ALL_MESSAGES_SELECTED_THREADS",
  MessageThread
>;
export type REMOVE_FROM_MESSAGES_SELECTED_THREADS = SpecificActionType<
  "REMOVE_FROM_MESSAGES_SELECTED_THREADS",
  MessageThread
>;
export type PUSH_MESSAGE_LAST_IN_CURRENT_THREAD = SpecificActionType<
  "PUSH_MESSAGE_LAST_IN_CURRENT_THREAD",
  Message
>;
export type UPDATE_MESSAGES_NAVIGATION_LABELS = SpecificActionType<
  "UPDATE_MESSAGES_NAVIGATION_LABELS",
  MessagesNavigationItem[]
>;
export type ADD_MESSAGES_NAVIGATION_LABEL = SpecificActionType<
  "ADD_MESSAGES_NAVIGATION_LABEL",
  MessagesNavigationItem
>;
export type UPDATE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS = SpecificActionType<
  "UPDATE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS",
  {
    labelId: number;
    update: {
      labelName: string;
      labelColor: number;
    };
  }
>;
export type UPDATE_MESSAGES_NAVIGATION_LABEL = SpecificActionType<
  "UPDATE_MESSAGES_NAVIGATION_LABEL",
  {
    labelId: number;
    update: {
      text: string;
      color: string;
    };
  }
>;
export type DELETE_MESSAGE_THREADS_NAVIGATION_LABEL = SpecificActionType<
  "DELETE_MESSAGE_THREADS_NAVIGATION_LABEL",
  {
    labelId: number;
  }
>;
export type REMOVE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS = SpecificActionType<
  "REMOVE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS",
  {
    labelId: number;
  }
>;

/**
 * updateUnreadMessageThreadsCount
 */
const updateUnreadMessageThreadsCount: UpdateMessageThreadsCountTriggerType =
  function updateUnreadMessageThreadsCount() {
    return async (dispatch, getState) => {
      if (!getState().status.loggedIn) {
        return;
      }

      const communicatorApi = MApi.getCommunicatorApi();

      try {
        dispatch({
          type: "UPDATE_UNREAD_MESSAGE_THREADS_COUNT",
          payload:
            (await communicatorApi.getCommunicatorReceivedItemsCount()) || 0,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "messaging",
              context: "unreadMessageCount",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * LoadLastMessageThreadsFromSeverTriggerType
 */
export interface LoadLastMessageThreadsFromSeverTriggerType {
  (maxResults: number): AnyActionType;
}

/**
 * loadLastMessageThreadsFromServer
 * @param maxResults maxResults
 */
const loadLastMessageThreadsFromServer: LoadLastMessageThreadsFromSeverTriggerType =
  function loadLastMessageThreadsFromServer(maxResults) {
    return async (dispatch, getState) => {
      const communicatorApi = MApi.getCommunicatorApi();

      try {
        dispatch({
          type: "UPDATE_MESSAGE_THREADS",
          payload: await communicatorApi.getCommunicatorThreads({
            firstResult: 0,
            maxResults: maxResults,
          }),
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "messaging",
              context: "latestMessage",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * SendMessageTriggerType
 */
export interface SendMessageTriggerType {
  (message: {
    to: ContactRecipientType[];
    replyThreadId: number;
    subject: string;
    text: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * LoadMessageThreadsTriggerType
 */
export interface LoadMessageThreadsTriggerType {
  (location: string, query: string): AnyActionType;
}

/**
 * UpdateMessagesSelectedThreads
 */
export interface UpdateMessagesSelectedThreads {
  (threads: MessageThread[]): AnyActionType;
}

/**
 * AddToMessagesSelectedThreadsTriggerType
 */
export interface AddToMessagesSelectedThreadsTriggerType {
  (thread: MessageThread): AnyActionType;
}

/**
 * LoadMoreMessageThreadsTriggerType
 */
export interface LoadMoreMessageThreadsTriggerType {
  (): AnyActionType;
}

/**
 * RemoveFromMessagesSelectedThreadsTriggerType
 */
export interface RemoveFromMessagesSelectedThreadsTriggerType {
  (thread: MessageThread): AnyActionType;
}

/**
 * AddLabelToSelectedMessageThreadsTriggerType
 */
export interface AddLabelToSelectedMessageThreadsTriggerType {
  (label: MessageThreadLabel): AnyActionType;
}

/**
 * RemoveLabelFromSelectedMessageThreadsTriggerType
 */
export interface RemoveLabelFromSelectedMessageThreadsTriggerType {
  (label: MessageThreadLabel): AnyActionType;
}

/**
 * AddLabelToCurrentMessageThreadTriggerType
 */
export interface AddLabelToCurrentMessageThreadTriggerType {
  (label: MessageThreadLabel): AnyActionType;
}

/**
 * RemoveLabelFromCurrentMessageThreadTriggerType
 */
export interface RemoveLabelFromCurrentMessageThreadTriggerType {
  (label: MessageThreadLabel): AnyActionType;
}

/**
 * ToggleMessageThreadReadStatusTriggerType
 */
export interface ToggleMessageThreadReadStatusTriggerType {
  (
    thread: MessageThread | number,
    markAsStatus?: boolean,
    dontLockToolbar?: boolean,
    callback?: () => void
  ): AnyActionType;
}

/**
 * ToggleMessageThreadsReadStatusTriggerType
 */
export interface ToggleMessageThreadsReadStatusTriggerType {
  (threads: MessageThread[]): AnyActionType;
}

/**
 * DeleteSelectedMessageThreadsTriggerType
 */
export interface DeleteSelectedMessageThreadsTriggerType {
  (): AnyActionType;
}

/**
 * RestoreSelectedMessageThreadsTriggerType
 */
export interface RestoreSelectedMessageThreadsTriggerType {
  (): AnyActionType;
}

/**
 * DeleteCurrentMessageThreadTriggerType
 */
export interface DeleteCurrentMessageThreadTriggerType {
  (): AnyActionType;
}

/**
 * RestoreCurrentMessageThreadTriggerType
 */
export interface RestoreCurrentMessageThreadTriggerType {
  (): AnyActionType;
}

/**
 * LoadMessageThreadTriggerType
 */
export interface LoadMessageThreadTriggerType {
  (location: string, messageId: number): AnyActionType;
}

/**
 * LoadNewlyReceivedMessageTriggerType
 */
export interface LoadNewlyReceivedMessageTriggerType {
  (): AnyActionType;
}

/**
 * LoadSignatureTriggerType
 */
export interface LoadSignatureTriggerType {
  (): AnyActionType;
}

/**
 * UpdateSignatureTriggerType
 */
export interface UpdateSignatureTriggerType {
  (newSignature: string): AnyActionType;
}

/**
 * ToggleSelectAllMessageThreadsTriggerType
 */
export interface ToggleSelectAllMessageThreadsTriggerType {
  (): AnyActionType;
}

/////////////////// ACTUAL DEFINITIONS
/**
 * ToggleSelectAllMessageThreadsTriggerType
 */
const toggleAllMessageItems: ToggleSelectAllMessageThreadsTriggerType =
  function toggleAllMessageItems() {
    return {
      type: "TOGGLE_ALL_MESSAGE_ITEMS",
      payload: null,
    };
  };

/**
 * sendMessage
 * @param message message
 */
const sendMessage: SendMessageTriggerType = function sendMessage(message) {
  return async (dispatch, getState) => {
    const recepientWorkspaces = message.to
      .filter((x) => x.type === "workspace")
      .map((x) => x.value.id);
    const data = {
      caption: message.subject,
      content: message.text,
      categoryName: "message",
      recipientIds: message.to
        .filter((x) => x.type === "user" || x.type === "staff")
        .map((x) => x.value.id),
      recipientGroupIds: message.to
        .filter((x) => x.type === "usergroup")
        .map((x) => x.value.id),
      recipientStudentsWorkspaceIds: recepientWorkspaces,
      recipientTeachersWorkspaceIds: recepientWorkspaces,
    };

    if (!message.subject) {
      message.fail && message.fail();
      return dispatch(
        displayNotification(
          i18n.t("validation.caption", { ns: "messaging", context: "message" }),
          "error"
        )
      );
    } else if (!message.text) {
      message.fail && message.fail();
      return dispatch(
        displayNotification(
          i18n.t("validation.content", { ns: "messaging", context: "message" }),
          "error"
        )
      );
    } else if (!message.to.length) {
      message.fail && message.fail();
      return dispatch(
        displayNotification(
          i18n.t("validation.recipients", { ns: "messaging" }),
          "error"
        )
      );
    }

    const communicatorApi = MApi.getCommunicatorApi();

    try {
      let result: Message;
      if (message.replyThreadId) {
        result = await communicatorApi.createCommunicatorMessageToThread({
          messageThreadId: message.replyThreadId,
          createCommunicatorMessageRequest: data,
        });
      } else {
        result = await communicatorApi.createCommunicatorMessage({
          createCommunicatorMessageRequest: data,
        });
      }
      dispatch(updateUnreadMessageThreadsCount());

      message.success && message.success();

      const state = getState();
      const status: StatusType = state.status;

      if (state.messages) {
        //First lets check and update the thread count in case the thread is there somewhere for that specific message
        const thread: MessageThread = state.messages.threads.find(
          (thread) =>
            thread.communicatorMessageId === result.communicatorMessageId
        );
        if (thread) {
          const newCount = thread.messageCountInThread + 1;
          dispatch({
            type: "UPDATE_ONE_MESSAGE_THREAD",
            payload: {
              thread,
              update: {
                messageCountInThread: newCount,
              },
            },
          });
        }

        //This as in the main thread list will check wheter the message was sent and we are in the inbox or unreadlocation, that will work if
        //and only if one of the receivers is us, otherwise it's always active for when a message is sent
        const isInboxOrUnread =
          state.messages.location === "inbox" ||
          state.messages.location === "unread";
        const weAreOneOfTheRecepients = result.recipients.find(
          (recipient) => recipient.userEntityId === status.userId
        );
        const isInboxOrUnreadAndWeAreOneOfTheRecepients =
          isInboxOrUnread && weAreOneOfTheRecepients;
        const weAreInSentLocation = state.messages.location === "sent";
        const weJustSentThatMessageAndWeAreInCurrent =
          state.messages.currentThread &&
          state.messages.currentThread.messages[0].communicatorMessageId ===
            result.communicatorMessageId;

        //if we are in sent location or are one of the recipients then the message should become the first one
        if (weAreInSentLocation || isInboxOrUnreadAndWeAreOneOfTheRecepients) {
          const item = state.messages.navigation.find(
            (item) => item.location === state.messages.location
          );
          if (!item) {
            return;
          }
          const params = {
            firstResult: 0,
            maxResults: 1,
          };

          //we basically conduct a search for the first result which should be our thread

          try {
            let threads: MessageThread[] = null;

            const apiPathId = getApiId(item);

            // Here only cases for items, sentitems and trash are handled
            switch (apiPathId) {
              case "items":
                threads = await communicatorApi.getCommunicatorThreads({
                  firstResult: params.firstResult,
                  maxResults: params.maxResults,
                });
                break;
              case "sentitems":
                threads = await communicatorApi.getCommunicatorSentItems({
                  firstResult: params.firstResult,
                  maxResults: params.maxResults,
                });
                break;
              case "trash":
                threads = await communicatorApi.getCommunicatorTrash({
                  firstResult: params.firstResult,
                  maxResults: params.maxResults,
                });
                break;

              default:
                threads = null;
                break;
            }

            if (threads[0]) {
              if (
                threads[0].communicatorMessageId !==
                result.communicatorMessageId
              ) {
                return;
              }
              dispatch({
                type: "PUSH_ONE_MESSAGE_THREAD_FIRST",
                payload: threads[0],
              });

              if (
                weJustSentThatMessageAndWeAreInCurrent &&
                weAreOneOfTheRecepients &&
                threads[0].unreadMessagesInThread
              ) {
                dispatch(toggleMessageThreadReadStatus(threads[0], true, true));
              }
            }
          } catch (err) {
            if (!isMApiError(err)) {
              throw err;
            }
          }
        }

        if (weJustSentThatMessageAndWeAreInCurrent) {
          dispatch({
            type: "PUSH_MESSAGE_LAST_IN_CURRENT_THREAD",
            payload: result,
          });
        }
      }

      dispatch(
        displayNotification(
          i18n.t("notifications.sendSuccess", { ns: "messaging" }),
          "success"
        )
      );
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(
        displayNotification(
          i18n.t("notifications.sendError", { ns: "messaging" }),
          "error"
        )
      );
      message.fail && message.fail();
    }
  };
};

/**
 * loadMessageThreads
 * @param location location
 * @param query query
 */
const loadMessageThreads: LoadMessageThreadsTriggerType =
  function loadMessageThreads(location, query) {
    return loadMessagesHelper.bind(this, location, query, true);
  };

/**
 * updateMessagesSelectedThreads
 * @param threads threads
 */
const updateMessagesSelectedThreads: UpdateMessagesSelectedThreads =
  function updateMessagesSelectedThreads(threads) {
    return {
      type: "UPDATE_SELECTED_MESSAGE_THREADS",
      payload: threads,
    };
  };

/**
 * addToMessagesSelectedThreads
 * @param thread thread
 */
const addToMessagesSelectedThreads: AddToMessagesSelectedThreadsTriggerType =
  function addToMessagesSelectedThreads(thread) {
    return {
      type: "ADD_TO_MESSAGES_SELECTED_THREADS",
      payload: thread,
    };
  };

/**
 * removeFromMessagesSelectedThreads
 * @param thread thread
 */
const removeFromMessagesSelectedThreads: RemoveFromMessagesSelectedThreadsTriggerType =
  function removeFromMessagesSelectedThreads(thread) {
    return {
      type: "REMOVE_FROM_MESSAGES_SELECTED_THREADS",
      payload: thread,
    };
  };

/**
 * loadMoreMessageThreads
 */
const loadMoreMessageThreads: LoadMoreMessageThreadsTriggerType =
  function loadMoreMessageThreads() {
    return loadMessagesHelper.bind(this, null, null, false);
  };

/**
 * addLabelToSelectedMessageThreads
 * @param label label
 */
const addLabelToSelectedMessageThreads: AddLabelToSelectedMessageThreadsTriggerType =
  function addLabelToSelectedMessageThreads(label) {
    return setLabelStatusSelectedMessages.bind(this, label, true);
  };

/**
 * removeLabelFromSelectedMessageThreads
 * @param label label
 */
const removeLabelFromSelectedMessageThreads: RemoveLabelFromSelectedMessageThreadsTriggerType =
  function removeLabelFromSelectedMessageThreads(label) {
    return setLabelStatusSelectedMessages.bind(this, label, false);
  };

/**
 * addLabelToCurrentMessageThread
 * @param label label
 */
const addLabelToCurrentMessageThread: AddLabelToCurrentMessageThreadTriggerType =
  function addLabelToCurrentMessageThread(label) {
    return setLabelStatusCurrentMessage.bind(this, label, true);
  };

/**
 * removeLabelFromCurrentMessageThread
 * @param label label
 */
const removeLabelFromCurrentMessageThread: RemoveLabelFromCurrentMessageThreadTriggerType =
  function removeLabelFromCurrentMessageThread(label) {
    return setLabelStatusCurrentMessage.bind(this, label, false);
  };

/**
 * toggleMessageThreadReadStatus
 * @param threadOrId threadOrId
 * @param markAsStatus markAsStatus
 * @param dontLockToolbar dontLockToolbar
 * @param callback callback
 */
const toggleMessageThreadReadStatus: ToggleMessageThreadReadStatusTriggerType =
  function toggleMessageThreadReadStatus(
    threadOrId,
    markAsStatus,
    dontLockToolbar = false,
    callback
  ) {
    return async (dispatch, getState) => {
      if (!dontLockToolbar) {
        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });
      }

      const state = getState();

      const communicatorApi = MApi.getCommunicatorApi();

      const item = state.messages.navigation.find(
        (item) => item.location === state.messages.location
      );
      if (!item) {
        dispatch(
          displayNotification(
            i18n.t("notifications.locationError", { ns: "messaging" }),
            "error"
          )
        );
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
        return;
      }

      let actualThread: MessageThread = null;
      let communicatorMessageId: number = null;
      if (typeof threadOrId === "number") {
        actualThread = state.messages.threads.find(
          (t) => t.communicatorMessageId === threadOrId
        );
        communicatorMessageId = threadOrId;
      } else {
        actualThread = threadOrId;
        communicatorMessageId = actualThread.communicatorMessageId;
      }

      if (actualThread) {
        dispatch({
          type: "UPDATE_ONE_MESSAGE_THREAD",
          payload: {
            thread: actualThread,
            update: {
              unreadMessagesInThread:
                typeof markAsStatus === "boolean"
                  ? !markAsStatus
                  : !actualThread.unreadMessagesInThread,
            },
          },
        });
      }

      const apiPathId = getApiId(item);

      try {
        if (
          (actualThread && actualThread.unreadMessagesInThread) ||
          markAsStatus === true
        ) {
          // Here only items and trash have markasread endpoints
          switch (apiPathId) {
            case "items":
              await communicatorApi.markCommunicatorThreadAsRead({
                messageId: communicatorMessageId,
              });
              break;
            case "trash":
              await communicatorApi.markCommunicatorTrashItemAsRead({
                messageId: communicatorMessageId,
              });
              break;
            default:
              break;
          }
        } else if (
          (actualThread && !actualThread.unreadMessagesInThread) ||
          markAsStatus === false
        ) {
          // Here only items and trash have markasunread endpoints
          switch (apiPathId) {
            case "items":
              await communicatorApi.markCommunicatorThreadAsUnread({
                messageId: communicatorMessageId,
              });
              break;
            case "trash":
              await communicatorApi.markCommunicatorTrashItemAsUnread({
                messageId: communicatorMessageId,
              });
              break;
            default:
              break;
          }
        }
        dispatch(updateUnreadMessageThreadsCount());
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          displayNotification(
            i18n.t("notifications.sendSuccess", { ns: "messaging" }),
            "error"
          )
        );
        if (actualThread) {
          dispatch({
            type: "UPDATE_ONE_MESSAGE_THREAD",
            payload: {
              thread: actualThread,
              update: {
                unreadMessagesInThread: actualThread.unreadMessagesInThread,
              },
            },
          });
        }
      }

      if (!dontLockToolbar) {
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
      }

      callback && callback();
    };
  };

/**
 * toggleMessageThreadsReadStatus
 * @param threads threads
 */
const toggleMessageThreadsReadStatus: ToggleMessageThreadsReadStatusTriggerType =
  function toggleMessageThreadsReadStatus(threads) {
    return async (dispatch) => {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      let done = 0;
      threads.forEach((thread) => {
        /**
         * cb
         */
        const cb = () => {
          done++;
          if (done === threads.length) {
            dispatch({
              type: "UNLOCK_TOOLBAR",
              payload: null,
            });
          }
        };
        if (
          thread.unreadMessagesInThread === !threads[0].unreadMessagesInThread
        ) {
          cb();
        } else {
          dispatch(toggleMessageThreadReadStatus(thread, null, true, cb));
        }
      });
    };
  };

/**
 * deleteSelectedMessageThreads
 */
const deleteSelectedMessageThreads: DeleteSelectedMessageThreadsTriggerType =
  function deleteSelectedMessageThreads() {
    return async (dispatch, getState) => {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      const state = getState();

      const item = state.messages.navigation.find(
        (item) => item.location === state.messages.location
      );
      if (!item) {
        dispatch(
          displayNotification(
            i18n.t("notifications.locationError", { ns: "messaging" }),
            "error"
          )
        );
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
        return;
      }

      const communicatorApi = MApi.getCommunicatorApi();

      await Promise.all(
        state.messages.selectedThreads.map(async (thread) => {
          try {
            const apiPathId = getApiId(item);

            // Here only items, sentitems and trash have delete endpoints
            switch (apiPathId) {
              case "items":
                await communicatorApi.deleteCommunicatorMessage({
                  messageId: thread.communicatorMessageId,
                });
                break;

              case "sentitems":
                await communicatorApi.deleteCommunicatorSentItem({
                  messageId: thread.communicatorMessageId,
                });
                break;

              case "trash":
                await communicatorApi.deleteCommunicatorTrashItem({
                  messageId: thread.communicatorMessageId,
                });
                break;

              default:
                break;
            }

            dispatch({
              type: "DELETE_MESSAGE_THREAD",
              payload: thread,
            });
          } catch (err) {
            if (!isMApiError(err)) {
              throw err;
            }
            dispatch(
              displayNotification(
                i18n.t("notifications.removeError", {
                  ns: "messaging",
                  context: "message",
                }),
                "error"
              )
            );
          }
        })
      );

      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
      dispatch(updateUnreadMessageThreadsCount());
    };
  };

/**
 * deleteCurrentMessageThread
 */
const deleteCurrentMessageThread: DeleteCurrentMessageThreadTriggerType =
  function deleteCurrentMessageThread() {
    return async (dispatch, getState) => {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      const state = getState();

      const communicatorApi = MApi.getCommunicatorApi();

      const item = state.messages.navigation.find(
        (item) => item.location === state.messages.location
      );
      if (!item) {
        dispatch(
          displayNotification(
            i18n.t("notifications.locationError", { ns: "messaging" }),
            "error"
          )
        );
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
        return;
      }

      const communicatorMessageId =
        state.messages.currentThread.messages[0].communicatorMessageId;

      try {
        const apiPathId = getApiId(item);

        // Here only items, sentitems and trash have delete endpoints
        switch (apiPathId) {
          case "items":
            await communicatorApi.deleteCommunicatorMessage({
              messageId: communicatorMessageId,
            });
            break;

          case "sentitems":
            await communicatorApi.deleteCommunicatorSentItem({
              messageId: communicatorMessageId,
            });
            break;

          case "trash":
            await communicatorApi.deleteCommunicatorTrashItem({
              messageId: communicatorMessageId,
            });
            break;

          default:
            break;
        }

        const toDeleteMessageThread: MessageThread =
          state.messages.threads.find(
            (message) => message.communicatorMessageId === communicatorMessageId
          );
        if (toDeleteMessageThread) {
          dispatch({
            type: "DELETE_MESSAGE_THREAD",
            payload: toDeleteMessageThread,
          });
        }
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          displayNotification(
            i18n.t("notifications.removeError", {
              ns: "messaging",
              context: "message",
            }),
            "error"
          )
        );
      }

      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });

      //SADLY the current message doesn't have a mention on wheter
      //The message is read or unread so the message count has to be recalculated
      //by server logic
      dispatch(updateUnreadMessageThreadsCount());

      location.hash = "#" + item.location;
    };
  };

/**
 * loadMessageThread
 * @param location location
 * @param messageId messageId
 */
const loadMessageThread: LoadMessageThreadTriggerType =
  function loadMessageThread(location, messageId) {
    return async (dispatch, getState) => {
      const state = getState();

      const communicatorApi = MApi.getCommunicatorApi();

      const item = state.messages.navigation.find(
        (item) => item.location === location
      );
      if (!item) {
        dispatch(
          displayNotification(
            i18n.t("notifications.locationError", { ns: "messaging" }),
            "error"
          )
        );
        return;
      }

      let currentThread: MessageThreadExpanded = null;
      try {
        // item is a folder
        if (item.type !== "label") {
          const apiPathId = getApiId(item, true);

          // Loading a expanded message thread for specific folder by messageId
          // There is only four api paths that can be used to get a expanded message thread for folders
          // messages, unread, sentitems, trash. For "items" and "messages", only one exists depending on how it is used
          // Weird, but its how it is...
          switch (apiPathId) {
            case "messages":
              currentThread =
                await communicatorApi.getCommunicatorMessageThread({
                  messageThreadId: messageId,
                });
              break;
            case "unread":
              currentThread = await communicatorApi.getCommunicatorUnread({
                messageId: messageId,
              });
              break;
            case "sentitems":
              currentThread = await communicatorApi.getCommunicatorSentItem({
                messageId: messageId,
              });
              break;
            case "trash":
              currentThread = await communicatorApi.getCommunicatorTrashItem({
                messageId: messageId,
              });
              break;

            default:
              currentThread = null;
              break;
          }
        } else {
          currentThread = await communicatorApi.getCommunicatorUserLabelMessage(
            {
              labelId: item.id as number,
              messageId: messageId,
            }
          );
        }
        dispatch({
          type: "UPDATE_MESSAGES_ALL_PROPERTIES",
          payload: {
            currentThread: currentThread,
            location,
          },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "messaging",
              constext: "messages",
            }),
            "error"
          )
        );
      }

      if (item.location !== "sent") {
        dispatch(
          toggleMessageThreadReadStatus(
            currentThread.messages[0].communicatorMessageId,
            true,
            true
          )
        );
      }
    };
  };

/**
 * loadNewlyReceivedMessage
 */
const loadNewlyReceivedMessage: LoadNewlyReceivedMessageTriggerType =
  function loadNewlyReceivedMessage() {
    return async (dispatch, getState) => {
      const state = getState();
      const communicatorApi = MApi.getCommunicatorApi();

      if (
        state.messages.location === "unread" ||
        state.messages.location === "inbox"
      ) {
        const item = state.messages.navigation.find(
          (item) => item.location === state.messages.location
        );

        if (!item) {
          return;
        }

        const params = {
          firstResult: 0,
          maxResults: 1,
          onlyUnread: true,
        };

        try {
          let threads: MessageThread[] = null;

          const apiPathId = getApiId(item);

          // Here only cases for items, sentitems and trash are handled
          switch (apiPathId) {
            case "items":
              threads = await communicatorApi.getCommunicatorThreads({
                firstResult: params.firstResult,
                maxResults: params.maxResults,
                onlyUnread: params.onlyUnread,
              });
              break;
            case "sentitems":
              threads = await communicatorApi.getCommunicatorSentItems({
                firstResult: params.firstResult,
                maxResults: params.maxResults,
              });
              break;
            case "trash":
              threads = await communicatorApi.getCommunicatorTrash({
                firstResult: params.firstResult,
                maxResults: params.maxResults,
              });
              break;

            default:
              threads = null;
              break;
          }

          if (threads[0]) {
            dispatch({
              type: "PUSH_ONE_MESSAGE_THREAD_FIRST",
              payload: threads[0],
            });
            if (
              state.messages.currentThread &&
              state.messages.currentThread.messages[0].communicatorMessageId ===
                threads[0].communicatorMessageId
            ) {
              const result = await communicatorApi.getCommunicatorMessage({
                messageId: threads[0].id,
              });

              dispatch({
                type: "PUSH_MESSAGE_LAST_IN_CURRENT_THREAD",
                payload: result,
              });
              if (threads[0].unreadMessagesInThread) {
                dispatch(toggleMessageThreadReadStatus(threads[0], true, true));
              }
            }
          }
        } catch (err) {
          if (!isMApiError(err)) {
            throw err;
          }
          dispatch(
            displayNotification(
              i18n.t("notifications.loadError", {
                ns: "messaging",
                context: "receivedMessage",
              }),
              "error"
            )
          );
        }
      }
    };
  };

/**
 * loadSignature
 */
const loadSignature: LoadSignatureTriggerType = function loadSignature() {
  return async (dispatch, getState) => {
    const communicatorApi = MApi.getCommunicatorApi();

    try {
      const signatures = await communicatorApi.getCommunicatorSignatures();

      if (signatures.length > 0) {
        dispatch({
          type: "UPDATE_MESSAGES_SIGNATURE",
          payload: signatures[0],
        });
      }
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(
        displayNotification(
          i18n.t("notifications.loadError", {
            ns: "messaging",
            context: "signature",
          }),
          "error"
        )
      );
    }
  };
};

/**
 * updateSignature
 * @param newSignature newSignature
 */
const updateSignature: UpdateSignatureTriggerType = function updateSignature(
  newSignature
) {
  return async (dispatch, getState) => {
    const state = getState();

    const communicatorApi = MApi.getCommunicatorApi();

    try {
      if (newSignature && state.messages.signature) {
        const payload = await communicatorApi.updateCommunicatorSignature({
          signatureId: state.messages.signature.id,
          updateCommunicatorSignatureRequest: {
            id: state.messages.signature.id,
            name: state.messages.signature.name,
            signature: newSignature,
          },
        });

        dispatch({
          type: "UPDATE_MESSAGES_SIGNATURE",
          payload,
        });
      } else if (newSignature) {
        const payload = await communicatorApi.createCommunicatorSignature({
          createCommunicatorSignatureRequest: {
            name: "standard",
            signature: newSignature,
          },
        });

        dispatch({
          type: "UPDATE_MESSAGES_SIGNATURE",
          payload,
        });
      } else {
        await communicatorApi.deleteCommunicatorSignature({
          signatureId: state.messages.signature.id,
        });

        dispatch({
          type: "UPDATE_MESSAGES_SIGNATURE",
          payload: null,
        });
      }
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(
        displayNotification(
          i18n.t("notifications.updateError", {
            ns: "messaging",
            context: "signature",
          }),
          "error"
        )
      );
    }
  };
};

/**
 * LoadMessagesNavigationLabelsTriggerType
 */
export interface LoadMessagesNavigationLabelsTriggerType {
  (callback: () => void): AnyActionType;
}

/**
 * AddMessagesNavigationLabelTriggerType
 */
export interface AddMessagesNavigationLabelTriggerType {
  (name: string): AnyActionType;
}

/**
 * UpdateMessagesNavigationLabelTriggerType
 */
export interface UpdateMessagesNavigationLabelTriggerType {
  (data: {
    label: MessagesNavigationItem;
    newName: string;
    newColor: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * RemoveMessagesNavigationLabelTriggerType
 */
export interface RemoveMessagesNavigationLabelTriggerType {
  (data: {
    label: MessagesNavigationItem;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * loadMessagesNavigationLabels
 * @param callback callback
 */
const loadMessagesNavigationLabels: LoadMessagesNavigationLabelsTriggerType =
  function loadMessagesNavigationLabels(callback) {
    return async (dispatch, getState) => {
      const communicatorApi = MApi.getCommunicatorApi();

      try {
        const labels = await communicatorApi.getCommunicatorUserLabels();

        dispatch({
          type: "UPDATE_MESSAGES_NAVIGATION_LABELS",
          payload: labels.map((label) => ({
            location: "label-" + label.id,
            id: label.id,
            type: "label",
            icon: "tag",
            text: label.name,
            color: colorIntToHex(label.color),
          })),
        });
        callback && callback();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "messaging",
              context: "labels",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * addMessagesNavigationLabel
 * @param name name
 */
const addMessagesNavigationLabel: AddMessagesNavigationLabelTriggerType =
  function addMessagesNavigationLabel(name) {
    return async (dispatch, getState) => {
      const communicatorApi = MApi.getCommunicatorApi();

      if (!name) {
        return dispatch(
          displayNotification(
            i18n.t("validation.name", { ns: "messaging", context: "labels" }),
            "error"
          )
        );
      }

      const color = Math.round(Math.random() * 16777215);
      const label = {
        name,
        color,
      };

      try {
        const newLabel = await communicatorApi.createCommunicatorUserLabel({
          createCommunicatorUserLabelRequest: {
            name: label.name,
            color: label.color,
          },
        });

        dispatch({
          type: "ADD_MESSAGES_NAVIGATION_LABEL",
          payload: {
            location: "label-" + newLabel.id,
            id: newLabel.id,
            type: "label",
            icon: "tag",
            /**
             * text
             */
            text: newLabel.name,
            color: colorIntToHex(newLabel.color),
          },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          displayNotification(
            i18n.t("notifications.createError", {
              ns: "messaging",
              context: "label",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * updateMessagesNavigationLabel
 * @param data data
 */
const updateMessagesNavigationLabel: UpdateMessagesNavigationLabelTriggerType =
  function updateMessagesNavigationLabel(data) {
    return async (dispatch, getState) => {
      if (!data.newName) {
        data.fail && data.fail();
        return dispatch(
          displayNotification(
            i18n.t("validation.name", { ns: "messaging", context: "labels" }),
            "error"
          )
        );
      }

      const communicatorApi = MApi.getCommunicatorApi();

      const newLabelData = {
        name: data.newName,
        color: hexToColorInt(data.newColor),
        id: data.label.id,
      };

      try {
        await communicatorApi.updateCommunicatorUserLabel({
          labelId: data.label.id as number,
          updateCommunicatorUserLabelRequest: {
            id: data.label.id as number,
            name: newLabelData.name,
            color: newLabelData.color,
          },
        });

        dispatch({
          type: "UPDATE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS",
          payload: {
            labelId: <number>data.label.id,
            update: {
              labelName: newLabelData.name,
              labelColor: newLabelData.color,
            },
          },
        });
        dispatch({
          type: "UPDATE_MESSAGES_NAVIGATION_LABEL",
          payload: {
            labelId: <number>data.label.id,
            update: {
              /**
               * text
               */
              text: newLabelData.name,
              color: data.newColor,
            },
          },
        });
        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        data.fail && data.fail();
        dispatch(
          displayNotification(
            i18n.t("notifications.updateError", {
              ns: "messaging",
              context: "label",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * removeMessagesNavigationLabel
 * @param data data
 */
const removeMessagesNavigationLabel: RemoveMessagesNavigationLabelTriggerType =
  function removeMessagesNavigationLabel(data) {
    return async (dispatch, getState) => {
      const communicatorApi = MApi.getCommunicatorApi();

      try {
        await communicatorApi.deleteCommunicatorUserLabel({
          labelId: data.label.id as number,
        });

        const { messages } = getState();

        //Notice this is an external trigger, not the nicest thing, but as long as we use hash navigation, meh
        if (messages.location === data.label.location) {
          location.hash = "#inbox";
        }

        dispatch({
          type: "DELETE_MESSAGE_THREADS_NAVIGATION_LABEL",
          payload: {
            labelId: <number>data.label.id,
          },
        });
        dispatch({
          type: "REMOVE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS",
          payload: {
            labelId: <number>data.label.id,
          },
        });
        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        data.fail && data.fail();
        dispatch(
          displayNotification(
            i18n.t("notifications.removeError", {
              ns: "messaging",
              context: "label",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * restoreSelectedMessageThreads
 */
const restoreSelectedMessageThreads: RestoreSelectedMessageThreadsTriggerType =
  function restoreSelectedMessageThreads() {
    return async (dispatch, getState) => {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      const state = getState();

      const communicatorApi = MApi.getCommunicatorApi();

      const item = state.messages.navigation.find(
        (item) => item.location === state.messages.location
      );
      if (!item) {
        dispatch(
          displayNotification(
            i18n.t("notifications.locationError", { ns: "messaging" }),
            "error"
          )
        );
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
        return;
      }

      await Promise.all(
        state.messages.selectedThreads.map(async (thread) => {
          try {
            const apiPathId = getApiId(item);

            // Here only trash has restore endpoint
            switch (apiPathId) {
              case "trash":
                await communicatorApi.restoreCommunicatorTrashItem({
                  messageId: thread.communicatorMessageId,
                });
                break;

              default:
                break;
            }

            dispatch({
              type: "DELETE_MESSAGE_THREAD",
              payload: thread,
            });
          } catch (err) {
            if (!isMApiError(err)) {
              throw err;
            }
            dispatch(
              displayNotification(
                i18n.t("notifications.restoreError", {
                  ns: "messaging",
                  context: "message",
                }),
                "error"
              )
            );
          }
        })
      );

      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
      dispatch(updateUnreadMessageThreadsCount());
    };
  };

/**
 * restoreCurrentMessageThread
 */
const restoreCurrentMessageThread: RestoreCurrentMessageThreadTriggerType =
  function restoreCurrentMessageThread() {
    return async (dispatch, getState) => {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      const state = getState();
      const communicatorApi = MApi.getCommunicatorApi();

      const item = state.messages.navigation.find(
        (item) => item.location === state.messages.location
      );
      if (!item) {
        dispatch(
          displayNotification(
            i18n.t("notifications.locationError", { ns: "messaging" }),
            "error"
          )
        );
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
        return;
      }

      const communicatorMessageId =
        state.messages.currentThread.messages[0].communicatorMessageId;

      try {
        const apiPathId = getApiId(item);

        // Here only trash has restore endpoint
        switch (apiPathId) {
          case "trash":
            await communicatorApi.restoreCommunicatorTrashItem({
              messageId: communicatorMessageId,
            });
            break;

          default:
            break;
        }

        const toDeleteMessageThread: MessageThread =
          state.messages.threads.find(
            (message) => message.communicatorMessageId === communicatorMessageId
          );
        if (toDeleteMessageThread) {
          dispatch({
            type: "DELETE_MESSAGE_THREAD",
            payload: toDeleteMessageThread,
          });
        }
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          displayNotification(
            i18n.t("notifications.restoreError", {
              ns: "messaging",
              context: "messageThread",
            }),
            "error"
          )
        );
      }

      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });

      //SADLY the current message doesn't have a mention on wheter
      //The message is read or unread so the message count has to be recalculated
      //by server logic
      dispatch(updateUnreadMessageThreadsCount());

      location.hash = "#" + item.location;
    };
  };

export {
  sendMessage,
  loadMessageThreads,
  updateMessagesSelectedThreads,
  addToMessagesSelectedThreads,
  removeFromMessagesSelectedThreads,
  loadMoreMessageThreads,
  addLabelToSelectedMessageThreads,
  removeLabelFromSelectedMessageThreads,
  addLabelToCurrentMessageThread,
  removeLabelFromCurrentMessageThread,
  toggleMessageThreadReadStatus,
  toggleMessageThreadsReadStatus,
  deleteSelectedMessageThreads,
  deleteCurrentMessageThread,
  loadMessageThread,
  loadNewlyReceivedMessage,
  loadSignature,
  updateSignature,
  updateUnreadMessageThreadsCount,
  loadLastMessageThreadsFromServer,
  loadMessagesNavigationLabels,
  addMessagesNavigationLabel,
  updateMessagesNavigationLabel,
  removeMessagesNavigationLabel,
  restoreSelectedMessageThreads,
  restoreCurrentMessageThread,
  toggleAllMessageItems,
};
