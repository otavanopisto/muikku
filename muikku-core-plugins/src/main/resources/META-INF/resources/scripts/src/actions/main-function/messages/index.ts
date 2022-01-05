import promisify from "~/util/promisify";
import { AnyActionType, SpecificActionType } from "~/actions";
import mApi, { MApiError } from "~/lib/mApi";
import { StateType } from "~/reducers";
import {
  MessageThreadListType,
  MessageThreadExpandedType,
  MessagesStateType,
  MessagesPatchType,
  MessageThreadLabelType,
  MessageThreadType,
  MessageThreadUpdateType,
  MessageSignatureType,
  MessageType,
  MessagesNavigationItemListType,
  MessageRecepientType,
  MessagesNavigationItemType,
  LabelListType,
  LabelType,
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
  MessageThreadListType
>;
export type SET_CURRENT_MESSAGE_THREAD = SpecificActionType<
  "SET_CURRENT_MESSAGE_THREAD",
  MessageThreadExpandedType
>;
export type UPDATE_MESSAGES_STATE = SpecificActionType<
  "UPDATE_MESSAGES_STATE",
  MessagesStateType
>;
export type UPDATE_MESSAGES_ALL_PROPERTIES = SpecificActionType<
  "UPDATE_MESSAGES_ALL_PROPERTIES",
  MessagesPatchType
>;
export type UPDATE_MESSAGE_THREAD_ADD_LABEL = SpecificActionType<
  "UPDATE_MESSAGE_THREAD_ADD_LABEL",
  {
    communicatorMessageId: number;
    label: MessageThreadLabelType;
  }
>;
export type UPDATE_MESSAGE_THREAD_DROP_LABEL = SpecificActionType<
  "UPDATE_MESSAGE_THREAD_DROP_LABEL",
  {
    communicatorMessageId: number;
    label: MessageThreadLabelType;
  }
>;
export type PUSH_ONE_MESSAGE_THREAD_FIRST = SpecificActionType<
  "PUSH_ONE_MESSAGE_THREAD_FIRST",
  MessageThreadType
>;
export type LOCK_TOOLBAR = SpecificActionType<"LOCK_TOOLBAR", null>;
export type UNLOCK_TOOLBAR = SpecificActionType<"UNLOCK_TOOLBAR", null>;
export type UPDATE_ONE_MESSAGE_THREAD = SpecificActionType<
  "UPDATE_ONE_MESSAGE_THREAD",
  {
    thread: MessageThreadType;
    update: MessageThreadUpdateType;
  }
>;
export type UPDATE_MESSAGES_SIGNATURE = SpecificActionType<
  "UPDATE_MESSAGES_SIGNATURE",
  MessageSignatureType
>;
export type DELETE_MESSAGE_THREAD = SpecificActionType<
  "DELETE_MESSAGE_THREAD",
  MessageThreadType
>;
export type UPDATE_SELECTED_MESSAGE_THREADS = SpecificActionType<
  "UPDATE_SELECTED_MESSAGE_THREADS",
  MessageThreadListType
>;
export type ADD_TO_MESSAGES_SELECTED_THREADS = SpecificActionType<
  "ADD_TO_MESSAGES_SELECTED_THREADS",
  MessageThreadType
>;
export type ADD_TO_ALL_MESSAGES_SELECTED_THREADS = SpecificActionType<
  "ADD_TO_ALL_MESSAGES_SELECTED_THREADS",
  MessageThreadType
>;
export type REMOVE_FROM_MESSAGES_SELECTED_THREADS = SpecificActionType<
  "REMOVE_FROM_MESSAGES_SELECTED_THREADS",
  MessageThreadType
>;
export type PUSH_MESSAGE_LAST_IN_CURRENT_THREAD = SpecificActionType<
  "PUSH_MESSAGE_LAST_IN_CURRENT_THREAD",
  MessageType
>;
export type UPDATE_MESSAGES_NAVIGATION_LABELS = SpecificActionType<
  "UPDATE_MESSAGES_NAVIGATION_LABELS",
  MessagesNavigationItemListType
>;
export type ADD_MESSAGES_NAVIGATION_LABEL = SpecificActionType<
  "ADD_MESSAGES_NAVIGATION_LABEL",
  MessagesNavigationItemType
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
      text: () => string;
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

const updateUnreadMessageThreadsCount: UpdateMessageThreadsCountTriggerType =
  function updateUnreadMessageThreadsCount() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      if (!getState().status.loggedIn) {
        return;
      }

      try {
        dispatch({
          type: "UPDATE_UNREAD_MESSAGE_THREADS_COUNT",
          payload: <number>(
            ((await promisify(
              mApi().communicator.receiveditemscount.cacheClear().read(),
              "callback"
            )()) || 0)
          ),
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.communicator.errormessage.unreadMessageCount"
            ),
            "error"
          )
        );
      }
    };
  };

export interface LoadLastMessageThreadsFromSeverTriggerType {
  (maxResults: number): AnyActionType;
}

const loadLastMessageThreadsFromServer: LoadLastMessageThreadsFromSeverTriggerType =
  function loadLastMessageThreadsFromServer(maxResults) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_MESSAGE_THREADS",
          payload: <MessageThreadListType>await promisify(
            mApi().communicator.items.read({
              firstResult: 0,
              maxResults: maxResults,
            }),
            "callback"
          )(),
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.communicator.errormessage.lastMessageLoad"
            ),
            "error"
          )
        );
      }
    };
  };

export interface SendMessageTriggerType {
  (message: {
    to: ContactRecipientType[];
    replyThreadId: number;
    subject: string;
    text: string;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

export interface LoadMessageThreadsTriggerType {
  (location: string, query: string): AnyActionType;
}

export interface UpdateMessagesSelectedThreads {
  (threads: MessageThreadListType): AnyActionType;
}

export interface AddToMessagesSelectedThreadsTriggerType {
  (thread: MessageThreadType): AnyActionType;
}

export interface LoadMoreMessageThreadsTriggerType {
  (): AnyActionType;
}

export interface RemoveFromMessagesSelectedThreadsTriggerType {
  (thread: MessageThreadType): AnyActionType;
}

export interface AddLabelToSelectedMessageThreadsTriggerType {
  (label: MessageThreadLabelType): AnyActionType;
}

export interface RemoveLabelFromSelectedMessageThreadsTriggerType {
  (label: MessageThreadLabelType): AnyActionType;
}

export interface AddLabelToCurrentMessageThreadTriggerType {
  (label: MessageThreadLabelType): AnyActionType;
}

export interface RemoveLabelFromCurrentMessageThreadTriggerType {
  (label: MessageThreadLabelType): AnyActionType;
}

export interface ToggleMessageThreadReadStatusTriggerType {
  (
    thread: MessageThreadType | number,
    markAsStatus?: boolean,
    dontLockToolbar?: boolean,
    callback?: () => any
  ): AnyActionType;
}

export interface ToggleMessageThreadsReadStatusTriggerType {
  (threads: MessageThreadListType): AnyActionType;
}

export interface DeleteSelectedMessageThreadsTriggerType {
  (): AnyActionType;
}

export interface RestoreSelectedMessageThreadsTriggerType {
  (): AnyActionType;
}

export interface DeleteCurrentMessageThreadTriggerType {
  (): AnyActionType;
}

export interface RestoreCurrentMessageThreadTriggerType {
  (): AnyActionType;
}

export interface LoadMessageThreadTriggerType {
  (location: string, messageId: number): AnyActionType;
}

export interface LoadNewlyReceivedMessageTriggerType {
  (): AnyActionType;
}

export interface LoadSignatureTriggerType {
  (): AnyActionType;
}

export interface UpdateSignatureTriggerType {
  (newSignature: string): AnyActionType;
}

export interface ToggleSelectAllMessageThreadsTriggerType {
  (): AnyActionType;
}

/////////////////// ACTUAL DEFINITIONS
const toggleAllMessageItems: ToggleSelectAllMessageThreadsTriggerType =
  function toggleAllMessageItems() {
    return {
      type: "TOGGLE_ALL_MESSAGE_ITEMS",
      payload: null,
    };
  };

const sendMessage: SendMessageTriggerType = function sendMessage(message) {
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

  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    if (!message.subject) {
      message.fail && message.fail();
      return dispatch(
        displayNotification(
          getState().i18n.text.get(
            "plugin.communicator.errormessage.createMessage.missing.subject"
          ),
          "error"
        )
      );
    } else if (!message.text) {
      message.fail && message.fail();
      return dispatch(
        displayNotification(
          getState().i18n.text.get(
            "plugin.communicator.errormessage.createMessage.missing.content"
          ),
          "error"
        )
      );
    } else if (!message.to.length) {
      message.fail && message.fail();
      return dispatch(
        displayNotification(
          getState().i18n.text.get(
            "plugin.communicator.errormessage.createMessage.missing.recipients"
          ),
          "error"
        )
      );
    }

    try {
      let result: MessageType;
      if (message.replyThreadId) {
        result = <MessageType>(
          await promisify(
            mApi().communicator.messages.create(message.replyThreadId, data),
            "callback"
          )()
        );
      } else {
        result = <MessageType>(
          await promisify(
            mApi().communicator.messages.create(data),
            "callback"
          )()
        );
      }
      dispatch(updateUnreadMessageThreadsCount());

      mApi().communicator.sentitems.cacheClear();
      message.success && message.success();

      const state = getState();
      const status: StatusType = state.status;

      if (state.messages) {
        //First lets check and update the thread count in case the thread is there somewhere for that specific message
        const thread: MessageThreadType = state.messages.threads.find(
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
          (recipient: MessageRecepientType) =>
            recipient.userEntityId === status.userId
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
            const threads: MessageThreadListType = <MessageThreadListType>(
              await promisify(
                mApi().communicator[getApiId(item)].read(params),
                "callback"
              )()
            );
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
            if (!(err instanceof MApiError)) {
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
          getState().i18n.text.get(
            "plugin.communicator.infomessage.newMessage.success"
          ),
          "success"
        )
      );
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        displayNotification(
          getState().i18n.text.get(
            "plugin.communicator.errormessage.sendFailed"
          ),
          "error"
        )
      );
      message.fail && message.fail();
    }
  };
};

const loadMessageThreads: LoadMessageThreadsTriggerType =
  function loadMessageThreads(location, query) {
    return loadMessagesHelper.bind(this, location, query, true);
  };

const updateMessagesSelectedThreads: UpdateMessagesSelectedThreads =
  function updateMessagesSelectedThreads(threads) {
    return {
      type: "UPDATE_SELECTED_MESSAGE_THREADS",
      payload: threads,
    };
  };

const addToMessagesSelectedThreads: AddToMessagesSelectedThreadsTriggerType =
  function addToMessagesSelectedThreads(thread) {
    return {
      type: "ADD_TO_MESSAGES_SELECTED_THREADS",
      payload: thread,
    };
  };

const removeFromMessagesSelectedThreads: RemoveFromMessagesSelectedThreadsTriggerType =
  function removeFromMessagesSelectedThreads(thread) {
    return {
      type: "REMOVE_FROM_MESSAGES_SELECTED_THREADS",
      payload: thread,
    };
  };

const loadMoreMessageThreads: LoadMoreMessageThreadsTriggerType =
  function loadMoreMessageThreads() {
    return loadMessagesHelper.bind(this, null, null, false);
  };

const addLabelToSelectedMessageThreads: AddLabelToSelectedMessageThreadsTriggerType =
  function addLabelToSelectedMessageThreads(label) {
    return setLabelStatusSelectedMessages.bind(this, label, true);
  };

const removeLabelFromSelectedMessageThreads: RemoveLabelFromSelectedMessageThreadsTriggerType =
  function removeLabelFromSelectedMessageThreads(label) {
    return setLabelStatusSelectedMessages.bind(this, label, false);
  };

const addLabelToCurrentMessageThread: AddLabelToCurrentMessageThreadTriggerType =
  function addLabelToCurrentMessageThread(label) {
    return setLabelStatusCurrentMessage.bind(this, label, true);
  };

const removeLabelFromCurrentMessageThread: RemoveLabelFromCurrentMessageThreadTriggerType =
  function removeLabelFromCurrentMessageThread(label) {
    return setLabelStatusCurrentMessage.bind(this, label, false);
  };

const toggleMessageThreadReadStatus: ToggleMessageThreadReadStatusTriggerType =
  function toggleMessageThreadReadStatus(
    threadOrId,
    markAsStatus,
    dontLockToolbar = false,
    callback
  ) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      if (!dontLockToolbar) {
        dispatch({
          type: "LOCK_TOOLBAR",
          payload: null,
        });
      }

      const state = getState();

      const item = state.messages.navigation.find(
        (item) => item.location === state.messages.location
      );
      if (!item) {
        //TODO translate this
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.communicator.errormessage.badLocation"
            ),
            "error"
          )
        );
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
        return;
      }

      let actualThread: MessageThreadType = null;
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

      try {
        if (
          (actualThread && actualThread.unreadMessagesInThread) ||
          markAsStatus === true
        ) {
          await promisify(
            mApi().communicator[getApiId(item)].markasread.create(
              communicatorMessageId
            ),
            "callback"
          )();
        } else if (
          (actualThread && !actualThread.unreadMessagesInThread) ||
          markAsStatus === false
        ) {
          await promisify(
            mApi().communicator[getApiId(item)].markasunread.create(
              communicatorMessageId
            ),
            "callback"
          )();
        }
        dispatch(updateUnreadMessageThreadsCount());
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.communicator.errormessage.changeStatusFailed"
            ),
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

      mApi().communicator[getApiId(item)].cacheClear();

      if (!dontLockToolbar) {
        dispatch({
          type: "UNLOCK_TOOLBAR",
          payload: null,
        });
      }

      callback && callback();
    };
  };

const toggleMessageThreadsReadStatus: ToggleMessageThreadsReadStatusTriggerType =
  function toggleMessageThreadsReadStatus(threads) {
    return async (dispatch: (arg: AnyActionType) => any) => {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      let done = 0;
      threads.forEach((thread) => {
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

const deleteSelectedMessageThreads: DeleteSelectedMessageThreadsTriggerType =
  function deleteSelectedMessageThreads() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      const state = getState();

      const item = state.messages.navigation.find(
        (item) => item.location === state.messages.location
      );
      if (!item) {
        //TODO translate this
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.communicator.errormessage.badLocation"
            ),
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
            await promisify(
              mApi().communicator[getApiId(item)].del(
                thread.communicatorMessageId
              ),
              "callback"
            )();
            dispatch({
              type: "DELETE_MESSAGE_THREAD",
              payload: thread,
            });
          } catch (err) {
            if (!(err instanceof MApiError)) {
              throw err;
            }
            dispatch(
              displayNotification(
                getState().i18n.text.get(
                  "plugin.communicator.errormessage.deleteFailed"
                ),
                "error"
              )
            );
          }
        })
      );

      mApi().communicator[getApiId(item)].cacheClear();
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
      dispatch(updateUnreadMessageThreadsCount());
    };
  };

const deleteCurrentMessageThread: DeleteCurrentMessageThreadTriggerType =
  function deleteCurrentMessageThread() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      const state = getState();

      const item = state.messages.navigation.find(
        (item) => item.location === state.messages.location
      );
      if (!item) {
        //TODO translate this
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.communicator.errormessage.badLocation"
            ),
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
        await promisify(
          mApi().communicator[getApiId(item)].del(communicatorMessageId),
          "callback"
        )();
        const toDeleteMessageThread: MessageThreadType =
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
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.communicator.errormessage.deleteFailed"
            ),
            "error"
          )
        );
      }

      mApi().communicator[getApiId(item)].cacheClear();
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

const loadMessageThread: LoadMessageThreadTriggerType =
  function loadMessageThread(location, messageId) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const state = getState();

      const item = state.messages.navigation.find(
        (item) => item.location === location
      );
      if (!item) {
        //TODO translate this
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.communicator.errormessage.badLocation"
            ),
            "error"
          )
        );
        return;
      }

      let currentThread: MessageThreadExpandedType;
      try {
        if (item.type !== "label") {
          currentThread = <MessageThreadExpandedType>(
            await promisify(
              mApi().communicator[getApiId(item, true)].read(messageId),
              "callback"
            )()
          );
        } else {
          currentThread = <MessageThreadExpandedType>(
            await promisify(
              mApi().communicator.userLabels.messages.read(item.id, messageId),
              "callback"
            )()
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
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.communicator.errormessage.threadLoadFailed"
            ),
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

const loadNewlyReceivedMessage: LoadNewlyReceivedMessageTriggerType =
  function loadNewlyReceivedMessage() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const state = getState();

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
          const threads: MessageThreadListType = <MessageThreadListType>(
            await promisify(
              mApi().communicator[getApiId(item)].read(params),
              "callback"
            )()
          );
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
              const result: MessageType = <MessageType>(
                await promisify(
                  mApi().communicator.communicatormessages.read(
                    threads[0].id,
                    params
                  ),
                  "callback"
                )()
              );
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
          if (!(err instanceof MApiError)) {
            throw err;
          }
          dispatch(
            displayNotification(
              getState().i18n.text.get(
                "plugin.communicator.errormessage.receivedFailed"
              ),
              "error"
            )
          );
        }
      }
    };
  };

const loadSignature: LoadSignatureTriggerType = function loadSignature() {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      const signatures: Array<MessageSignatureType> = <
        Array<MessageSignatureType>
      >await promisify(mApi().communicator.signatures.read(), "callback")();
      if (signatures.length > 0) {
        dispatch({
          type: "UPDATE_MESSAGES_SIGNATURE",
          payload: signatures[0],
        });
      }
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        displayNotification(
          getState().i18n.text.get(
            "plugin.communicator.errormessage.signatureLoadFailed"
          ),
          "error"
        )
      );
    }
  };
};

const updateSignature: UpdateSignatureTriggerType = function updateSignature(
  newSignature
) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => any) => {
    const state = getState();

    try {
      if (newSignature && state.messages.signature) {
        const nSignatureShape: MessageSignatureType = <MessageSignatureType>{
          id: state.messages.signature.id,
          name: state.messages.signature.name,
          signature: newSignature,
        };
        const payload: MessageSignatureType = <MessageSignatureType>(
          await promisify(
            mApi().communicator.signatures.update(
              state.messages.signature.id,
              nSignatureShape
            ),
            "callback"
          )()
        );
        dispatch({
          type: "UPDATE_MESSAGES_SIGNATURE",
          payload,
        });
      } else if (newSignature) {
        const payload: MessageSignatureType = <MessageSignatureType>(
          await promisify(
            mApi().communicator.signatures.create({
              name: "standard",
              signature: newSignature,
            }),
            "callback"
          )()
        );
        dispatch({
          type: "UPDATE_MESSAGES_SIGNATURE",
          payload,
        });
      } else {
        await promisify(
          mApi().communicator.signatures.del(state.messages.signature.id),
          "callback"
        )();
        dispatch({
          type: "UPDATE_MESSAGES_SIGNATURE",
          payload: null,
        });
      }
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        displayNotification(
          getState().i18n.text.get(
            "plugin.communicator.errormessage.signatureUpdateFailed"
          ),
          "error"
        )
      );
    }
  };
};

export interface LoadMessagesNavigationLabelsTriggerType {
  (callback: () => any): AnyActionType;
}

export interface AddMessagesNavigationLabelTriggerType {
  (name: string): AnyActionType;
}

export interface UpdateMessagesNavigationLabelTriggerType {
  (data: {
    label: MessagesNavigationItemType;
    newName: string;
    newColor: string;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

export interface RemoveMessagesNavigationLabelTriggerType {
  (data: {
    label: MessagesNavigationItemType;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

const loadMessagesNavigationLabels: LoadMessagesNavigationLabelsTriggerType =
  function loadMessagesNavigationLabels(callback) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => any
    ) => {
      try {
        const labels: LabelListType = <LabelListType>(
          await promisify(mApi().communicator.userLabels.read(), "callback")()
        );
        dispatch({
          type: "UPDATE_MESSAGES_NAVIGATION_LABELS",
          payload: labels.map((label: LabelType) => ({
            location: "label-" + label.id,
            id: label.id,
            type: "label",
            icon: "tag",
            text() {
              return label.name;
            },
            color: colorIntToHex(label.color),
          })),
        });
        callback && callback();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.communicator.errormessage.labelsLoadFailed"
            ),
            "error"
          )
        );
      }
    };
  };

const addMessagesNavigationLabel: AddMessagesNavigationLabelTriggerType =
  function addMessagesNavigationLabel(name) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => any
    ) => {
      if (!name) {
        return dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.communicator.errormessage.createUpdateLabels.missing.title"
            ),
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
        const newLabel: LabelType = <LabelType>(
          await promisify(
            mApi().communicator.userLabels.create(label),
            "callback"
          )()
        );
        dispatch({
          type: "ADD_MESSAGES_NAVIGATION_LABEL",
          payload: {
            location: "label-" + newLabel.id,
            id: newLabel.id,
            type: "label",
            icon: "tag",
            text() {
              return newLabel.name;
            },
            color: colorIntToHex(newLabel.color),
          },
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.communicator.errormessage.label.createFailed"
            ),
            "error"
          )
        );
      }
    };
  };

const updateMessagesNavigationLabel: UpdateMessagesNavigationLabelTriggerType =
  function updateMessagesNavigationLabel(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => any
    ) => {
      if (!data.newName) {
        data.fail && data.fail();
        return dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.communicator.errormessage.createUpdateLabels.missing.title"
            ),
            "error"
          )
        );
      }

      const newLabelData = {
        name: data.newName,
        color: hexToColorInt(data.newColor),
        id: data.label.id,
      };

      try {
        await promisify(
          mApi().communicator.userLabels.update(data.label.id, newLabelData),
          "callback"
        )();
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
              text: () => newLabelData.name,
              color: data.newColor,
            },
          },
        });
        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        data.fail && data.fail();
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.communicator.errormessage.label.updateFailed"
            ),
            "error"
          )
        );
      }
    };
  };

const removeMessagesNavigationLabel: RemoveMessagesNavigationLabelTriggerType =
  function removeMessagesNavigationLabel(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        await promisify(
          mApi().communicator.userLabels.del(data.label.id),
          "callback"
        )();
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
        if (!(err instanceof MApiError)) {
          throw err;
        }
        data.fail && data.fail();
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.communicator.errormessage.label.deleteFailed"
            ),
            "error"
          )
        );
      }
    };
  };

const restoreSelectedMessageThreads: RestoreSelectedMessageThreadsTriggerType =
  function restoreSelectedMessageThreads() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      const state = getState();

      const item = state.messages.navigation.find(
        (item) => item.location === state.messages.location
      );
      if (!item) {
        //TODO translate this
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.communicator.errormessage.badLocation"
            ),
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
            await promisify(
              mApi().communicator[getApiId(item)].restore.update(
                thread.communicatorMessageId
              ),
              "callback"
            )();
            dispatch({
              type: "DELETE_MESSAGE_THREAD",
              payload: thread,
            });
          } catch (err) {
            if (!(err instanceof MApiError)) {
              throw err;
            }
            dispatch(
              displayNotification(
                getState().i18n.text.get(
                  "plugin.communicator.errormessage.msgRestoreFailed"
                ),
                "error"
              )
            );
          }
        })
      );

      mApi().communicator[getApiId(item)].cacheClear();
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
      dispatch(updateUnreadMessageThreadsCount());
    };
  };

const restoreCurrentMessageThread: RestoreCurrentMessageThreadTriggerType =
  function restoreCurrentMessageThread() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
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
            getState().i18n.text.get(
              "plugin.communicator.errormessage.badLocation"
            ),
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
        await promisify(
          mApi().communicator[getApiId(item)].restore.update(
            communicatorMessageId
          ),
          "callback"
        )();
        const toDeleteMessageThread: MessageThreadType =
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
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get("currentThreadRestoreFailed"),
            "error"
          )
        );
      }

      mApi().communicator[getApiId(item)].cacheClear();
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
