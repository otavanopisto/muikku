import { ActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18nOLD";
import { UserGroupType, UserType } from "~/reducers/user-index";
import { Reducer } from "redux";

export type MessagesStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";
export type MessagesSearchResultFolderType = "INBOX" | "TRASH" | "SENT";
/**
 * MessageSignatureType
 */
export interface MessageSignatureType {
  id: number;
  name: string;
  signature: string;
}

/**
 * MessageSearchResult
 */
export interface MessageSearchResult {
  caption: string;
  communicatorMessageId: number;
  created: string;
  id: number;
  readByReceiver: boolean;
  folder: MessagesSearchResultFolderType;
  labels: Array<{
    labelColor: number;
    id: number;
    labelName: string;
  }>;
  sender: {
    userEntityId: number;
    firstName: string;
    lastName: string;
    nickName: string;
    studyProgrammeName?: string;
  };
  senderId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tags: any;
  recipients?: Array<MessageRecepientType>;
  userGroupRecipients?: Array<UserGroupType>;
  workspaceRecipients?: Array<MessageWorkspaceRecipientType>;
}

/**
 * MessageThreadLabelType
 */
export interface MessageThreadLabelType {
  id: number;
  labelColor: number;
  labelId: number;
  labelName: string;
  messageThreadId: number;
  userEntityId: number;
}

/**
 * MessageThreadLabelUpdateType
 */
export interface MessageThreadLabelUpdateType {
  id?: number;
  labelColor?: number;
  labelId?: number;
  labelName?: string;
  messageThreadId?: number;
  userEntityId?: number;
}

export type MessageThreadLabelListType = Array<MessageThreadLabelType>;

/**
 * MessageThreadType
 */
export interface MessageThreadType {
  caption: string;
  categoryName: "message";
  communicatorMessageId: number;
  created: string;
  id: number;
  labels: MessageThreadLabelListType;
  messageCountInThread: number;
  recipientCount?: number;
  recipients?: Array<MessageRecepientType>;
  sender: UserType;
  senderId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tags: any;
  threadLatestMessageDate: string;
  unreadMessagesInThread: boolean;
  userGroupRecipients?: Array<UserGroupType>;
  workspaceRecipients?: Array<{
    archetype: string;
    workspaceEntityId: number;
    workspaceExtension?: string;
    workspaceName: string;
  }>;
}

/**
 * MessageThreadUpdateType
 */
export interface MessageThreadUpdateType {
  communicatorMessageId?: number;
  senderId?: number;
  categoryName?: "message";
  caption?: string;
  created?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tags?: any;
  threadLatestMessageDate?: string;
  unreadMessagesInThread?: boolean;
  sender?: UserType;
  messageCountInThread?: number;
  labels?: MessageThreadLabelListType;
}

/**
 * MessageThreadExpandedType
 */
export interface MessageThreadExpandedType {
  olderThreadId?: number;
  newerThreadId?: number;
  messages: Array<MessageType>;
  labels: MessageThreadLabelListType;
}

/**
 * MessageType
 */
export interface MessageType {
  caption: string;
  categoryName: "message";
  communicatorMessageId: number;
  content: string;
  created: string;
  id: number;
  recipientCount: number;
  recipients: Array<MessageRecepientType>;
  sender: UserType;
  senderId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tags: any;
  userGroupRecipients: Array<UserGroupType>;
  workspaceRecipients: Array<MessageWorkspaceRecipientType>;
}

/**
 * MessageRecepientType
 */
export interface MessageRecepientType {
  communicatorMessageId: number;
  userEntityId: number;
  nickName?: string | null;
  firstName: string;
  lastName?: string | null;
  recipientId: number;
  archived?: boolean;
  studiesEnded?: boolean;
}

/**
 * MessageWorkspaceRecipientType
 */
export interface MessageWorkspaceRecipientType {
  archetype: string;
  workspaceEntityId: number;
  workspaceExtension?: string;
  workspaceName: string;
}
export type MessageThreadListType = Array<MessageThreadType>;

/**
 * MessagesNavigationItemUpdateType
 */
export interface MessagesNavigationItemUpdateType {
  location?: string;
  type?: string;
  id?: string | number;
  icon?: string;
  color?: string;
  /**
   *
   */
  text?(i18nOLD: i18nType): string;
}

/**
 * MessagesNavigationItemType
 */
export interface MessagesNavigationItemType {
  location: string;
  type: string;
  id: string | number;
  icon: string;
  color?: string;
  /**
   *
   */
  text(i18nOLD: i18nType): string;
}

/**
 * LabelType
 */
export interface LabelType {
  id: number;
  color: number;
  name: string;
}

export type LabelListType = Array<LabelType>;

export type MessagesNavigationItemListType = Array<MessagesNavigationItemType>;

const defaultNavigation: MessagesNavigationItemListType = [
  {
    location: "inbox",
    type: "folder",
    id: "inbox",
    icon: "folder",
    /**
     * text
     * @param i18nOLD i18nOLD
     */
    text(i18nOLD: i18nType): string {
      return i18nOLD.text.get("plugin.communicator.category.title.inbox");
    },
  },
  {
    location: "unread",
    type: "folder",
    id: "unread",
    icon: "folder",
    /**
     * text
     * @param i18nOLD i18nOLD
     */
    text(i18nOLD: i18nType): string {
      return i18nOLD.text.get("plugin.communicator.category.title.unread");
    },
  },
  {
    location: "sent",
    type: "folder",
    id: "sent",
    icon: "folder",
    /**
     * text
     * @param i18nOLD i18nOLD
     */
    text(i18nOLD: i18nType): string {
      return i18nOLD.text.get("plugin.communicator.category.title.sent");
    },
  },
  {
    location: "trash",
    type: "folder",
    id: "trash",
    icon: "trash-alt",
    /**
     * text
     * @param i18nOLD i18nOLD
     */
    text(i18nOLD: i18nType): string {
      return i18nOLD.text.get("plugin.communicator.category.title.trash");
    },
  },
];

/**
 * MessagesType
 */
export interface MessagesType {
  state: MessagesStateType;
  searchMessages: MessageSearchResult[];
  threads: MessageThreadListType;
  selectedThreads: MessageThreadListType;
  selectedThreadsIds: Array<number>;
  toggleSelectAllMessageItemsActive: boolean;
  hasMore: boolean;
  location: string;
  query: string;
  toolbarLock: boolean;
  currentThread?: MessageThreadExpandedType;
  signature?: MessageSignatureType;
  navigation: MessagesNavigationItemListType;
  unreadThreadCount: number;
}

/**
 * MessagesPatchType
 */
export interface MessagesPatchType {
  state?: MessagesStateType;
  searchMessages?: MessageSearchResult[];
  threads?: MessageThreadListType;
  selectedThreads?: MessageThreadListType;
  selectedThreadsIds?: Array<number>;
  hasMore?: boolean;
  location?: string;
  toolbarLock?: boolean;
  currentThread?: MessageThreadExpandedType;
  signature?: MessageSignatureType;
  navigation?: MessagesNavigationItemListType;
  unreadThreadCount?: number;
  query?: string;
}

/**
 * sortNavigationItems
 * @param itemA itemA
 * @param itemB itemB
 */
function sortNavigationItems(
  itemA: MessagesNavigationItemType,
  itemB: MessagesNavigationItemType
) {
  if (itemA.type !== "label" && itemB.type !== "label") {
    return 0;
  } else if (itemA.type === "label" && itemB.type !== "label") {
    return 1;
  } else if (itemA.type !== "label" && itemB.type === "label") {
    return -1;
  }

  const labelAUpperCase = itemA.text(null).toUpperCase();
  const labelBUpperCase = itemB.text(null).toUpperCase();
  return labelAUpperCase < labelBUpperCase
    ? -1
    : labelAUpperCase > labelBUpperCase
    ? 1
    : 0;
}

const initialMessagesState: MessagesType = {
  state: "LOADING",
  searchMessages: null,
  threads: [],
  selectedThreads: [],
  selectedThreadsIds: [],
  toggleSelectAllMessageItemsActive: false,
  hasMore: false,
  location: "",
  toolbarLock: false,
  currentThread: null,
  signature: null,
  query: null,
  unreadThreadCount: 0,
  navigation: defaultNavigation,
};

/**
 * Reducer function for messages
 *
 * @param state state
 * @param action action
 * @returns State of messages
 */
export const messages: Reducer<MessagesType> = (
  state = initialMessagesState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_MESSAGE_THREADS":
      return { ...state, threads: action.payload };

    case "UPDATE_UNREAD_MESSAGE_THREADS_COUNT":
      return { ...state, unreadThreadCount: action.payload };

    case "UPDATE_MESSAGES_NAVIGATION_LABELS":
      return {
        ...state,
        navigation: defaultNavigation
          .concat(action.payload)
          .sort(sortNavigationItems),
      };

    case "ADD_MESSAGES_NAVIGATION_LABEL":
      return {
        ...state,
        navigation: state.navigation
          .concat([action.payload])
          .sort(sortNavigationItems),
      };

    case "DELETE_MESSAGE_THREADS_NAVIGATION_LABEL":
      return {
        ...state,
        navigation: state.navigation
          .filter((item) => item.id !== action.payload.labelId)
          .sort(sortNavigationItems),
      };

    case "UPDATE_MESSAGES_NAVIGATION_LABEL":
      return {
        ...state,
        navigation: state.navigation
          .map((item) => {
            if (item.id !== action.payload.labelId) {
              return item;
            }

            return {
              ...item,
              ...action.payload.update,
            };
          })
          .sort(sortNavigationItems),
      };

    case "UPDATE_MESSAGES_STATE":
      return { ...state, state: action.payload };

    case "UPDATE_MESSAGES_ALL_PROPERTIES":
      return {
        ...state,
        ...action.payload,
        selectedThreads: state.toggleSelectAllMessageItemsActive
          ? action.payload.threads.map((thread) => thread)
          : state.selectedThreads,
        selectedThreadsIds: state.toggleSelectAllMessageItemsActive
          ? action.payload.threads.map((thread) => thread.communicatorMessageId)
          : state.selectedThreadsIds,
      };

    case "UPDATE_SELECTED_MESSAGE_THREADS":
      return {
        ...state,
        selectedThreads: action.payload,
        selectedThreadsIds: action.payload.map((s) => s.communicatorMessageId),
      };

    case "ADD_TO_MESSAGES_SELECTED_THREADS":
      return {
        ...state,
        selectedThreads: state.selectedThreads.concat([action.payload]),
        selectedThreadsIds: state.selectedThreadsIds.concat([
          action.payload.communicatorMessageId,
        ]),
        toggleSelectAllMessageItemsActive:
          state.selectedThreads.length === state.threads.length - 1
            ? true
            : false,
      };

    case "REMOVE_FROM_MESSAGES_SELECTED_THREADS":
      return {
        ...state,
        selectedThreads: state.selectedThreads.filter(
          (selectedThread) =>
            selectedThread.communicatorMessageId !==
            action.payload.communicatorMessageId
        ),
        selectedThreadsIds: state.selectedThreadsIds.filter(
          (id) => id !== action.payload.communicatorMessageId
        ),
        toggleSelectAllMessageItemsActive: false,
      };

    case "UPDATE_ONE_MESSAGE_THREAD": {
      const update = action.payload.update;
      const oldThread = action.payload.thread;
      const newThread = Object.assign({}, oldThread, update);

      return {
        ...state,
        selectedThreads: state.selectedThreads.map(
          (selectedThread: MessageThreadType) => {
            if (
              selectedThread.communicatorMessageId ===
              oldThread.communicatorMessageId
            ) {
              return newThread;
            }
            return selectedThread;
          }
        ),
        threads: state.threads.map((thread: MessageThreadType) => {
          if (
            thread.communicatorMessageId === oldThread.communicatorMessageId
          ) {
            return newThread;
          }
          return thread;
        }),
      };
    }

    case "LOCK_TOOLBAR":
      return { ...state, toolbarLock: true };

    case "UNLOCK_TOOLBAR":
      return { ...state, toolbarLock: false };

    case "UPDATE_MESSAGE_THREAD_ADD_LABEL": {
      let newCurrent = state.currentThread;

      if (
        newCurrent &&
        newCurrent.messages[0].communicatorMessageId ===
          action.payload.communicatorMessageId
      ) {
        newCurrent = Object.assign(newCurrent, {
          labels: newCurrent.labels.concat([action.payload.label]),
        });
      }

      return {
        ...state,
        selectedThreads: state.selectedThreads.map((selectedThread) => {
          if (
            selectedThread.communicatorMessageId ===
            action.payload.communicatorMessageId
          ) {
            if (
              !selectedThread.labels.find(
                (label) => label.labelId === action.payload.label.labelId
              )
            ) {
              return {
                ...selectedThread,
                labels: selectedThread.labels.concat([action.payload.label]),
              };
            } else {
              return selectedThread;
            }
          }
          return selectedThread;
        }),
        threads: state.threads.map((thread) => {
          if (
            thread.communicatorMessageId ===
            action.payload.communicatorMessageId
          ) {
            if (
              !thread.labels.find(
                (label) => label.labelId === action.payload.label.labelId
              )
            ) {
              return {
                ...thread,
                labels: thread.labels.concat([action.payload.label]),
              };
            } else {
              return thread;
            }
          }
          return thread;
        }),
        currentThread: newCurrent,
      };
    }

    case "UPDATE_MESSAGE_THREAD_DROP_LABEL": {
      let newCurrent = state.currentThread;
      if (
        newCurrent &&
        newCurrent.messages[0].communicatorMessageId ===
          action.payload.communicatorMessageId
      ) {
        newCurrent = Object.assign(newCurrent, {
          labels: newCurrent.labels.filter(
            (label) => label.labelId !== action.payload.label.labelId
          ),
        });
      }

      return {
        ...state,
        selectedThreads: state.selectedThreads.map((selectedThread) => {
          if (
            selectedThread.communicatorMessageId ===
            action.payload.communicatorMessageId
          ) {
            return {
              ...selectedThread,
              labels: selectedThread.labels.filter(
                (label) => label.labelId !== action.payload.label.labelId
              ),
            };
          }
          return selectedThread;
        }),
        threads: state.threads.map((thread) => {
          if (
            thread.communicatorMessageId ===
            action.payload.communicatorMessageId
          ) {
            return {
              ...thread,
              labels: thread.labels.filter(
                (label) => label.labelId !== action.payload.label.labelId
              ),
            };
          }
          return thread;
        }),
        currentThread: newCurrent,
      };
    }

    case "DELETE_MESSAGE_THREAD":
      return {
        ...state,
        selectedThreads: state.selectedThreads.filter(
          (selectedThread) =>
            selectedThread.communicatorMessageId !==
            action.payload.communicatorMessageId
        ),
        threads: state.threads.filter(
          (thread) =>
            thread.communicatorMessageId !==
            action.payload.communicatorMessageId
        ),
        selectedThreadsIds: state.selectedThreadsIds.filter(
          (id: number) => id !== action.payload.communicatorMessageId
        ),
      };

    case "SET_CURRENT_MESSAGE_THREAD":
      return { ...state, currentThread: action.payload };

    case "UPDATE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS":
      return {
        ...state,
        selectedThreads: state.selectedThreads.map((selectedThread) => ({
          ...selectedThread,
          labels: selectedThread.labels.map((label) => {
            if (label.labelId === action.payload.labelId) {
              return {
                ...label,
                ...action.payload.update,
              };
            }
            return label;
          }),
        })),

        threads: state.threads.map((thread: MessageThreadType) => ({
          ...thread,
          labels: thread.labels.map((label) => {
            if (label.labelId === action.payload.labelId) {
              return {
                ...label,
                ...action.payload.update,
              };
            }
            return label;
          }),
        })),

        currentThread: state.currentThread
          ? {
              ...state.currentThread,
              labels: state.currentThread.labels.map((label) => {
                if (label.labelId === action.payload.labelId) {
                  return { ...label, ...action.payload.update };
                }
                return label;
              }),
            }
          : state.currentThread,
      };

    case "REMOVE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS":
      return {
        ...state,
        selectedThreads: state.selectedThreads.map((selectedThread) => ({
          ...selectedThread,
          labels: selectedThread.labels.filter(
            (label) => label.labelId !== action.payload.labelId
          ),
        })),

        threads: state.threads.map((thread) => ({
          ...thread,
          labels: thread.labels.filter(
            (label) => label.labelId !== action.payload.labelId
          ),
        })),
        currentThread: state.currentThread
          ? {
              ...state.currentThread,
              labels: state.currentThread.labels.filter(
                (label) => label.labelId !== action.payload.labelId
              ),
            }
          : state.currentThread,
      };

    case "PUSH_ONE_MESSAGE_THREAD_FIRST": {
      const newThreads = state.threads.filter(
        (m) => m.communicatorMessageId !== action.payload.communicatorMessageId
      );
      return {
        ...state,
        threads: [action.payload].concat(newThreads),
      };
    }

    case "UPDATE_MESSAGES_SIGNATURE": {
      return { ...state, signature: action.payload };
    }

    case "PUSH_MESSAGE_LAST_IN_CURRENT_THREAD": {
      if (!state.currentThread) {
        return state;
      }
      return {
        ...state,
        currentThread: {
          ...state.currentThread,
          messages: state.currentThread.messages.concat([action.payload]),
        },
      };
    }

    case "TOGGLE_ALL_MESSAGE_ITEMS":
      return {
        ...state,
        toggleSelectAllMessageItemsActive:
          !state.toggleSelectAllMessageItemsActive,
        selectedThreads: !state.toggleSelectAllMessageItemsActive
          ? state.threads
          : [],
        selectedThreadsIds: !state.toggleSelectAllMessageItemsActive
          ? state.threads.map((thread) => thread.communicatorMessageId)
          : [],
      };

    default:
      return state;
  }
};
