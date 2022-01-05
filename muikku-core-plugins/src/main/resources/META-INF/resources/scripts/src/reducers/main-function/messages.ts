import { ActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";

import { UserGroupType, UserType } from "~/reducers/user-index";

export type MessagesStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";
export type MessagesSearchResultFolderType = "INBOX" | "TRASH" | "SENT";
export interface MessageSignatureType {
  id: number;
  name: string;
  signature: string;
}
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
  };
  senderId: number;
  tags: any;
  recipients?: Array<MessageRecepientType>;
  userGroupRecipients?: Array<UserGroupType>;
  workspaceRecipients?: Array<MessageWorkspaceRecipientType>;
}
export interface MessageThreadLabelType {
  id: number;
  labelColor: number;
  labelId: number;
  labelName: string;
  messageThreadId: number;
  userEntityId: number;
}
export interface MessageThreadLabelUpdateType {
  id?: number;
  labelColor?: number;
  labelId?: number;
  labelName?: string;
  messageThreadId?: number;
  userEntityId?: number;
}
export type MessageThreadLabelListType = Array<MessageThreadLabelType>;

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
export interface MessageThreadUpdateType {
  communicatorMessageId?: number;
  senderId?: number;
  categoryName?: "message";
  caption?: string;
  created?: string;
  tags?: any;
  threadLatestMessageDate?: string;
  unreadMessagesInThread?: boolean;
  sender?: UserType;
  messageCountInThread?: number;
  labels?: MessageThreadLabelListType;
}
export interface MessageThreadExpandedType {
  olderThreadId?: number;
  newerThreadId?: number;
  messages: Array<MessageType>;
  labels: MessageThreadLabelListType;
}
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
  tags: any;
  userGroupRecipients: Array<UserGroupType>;
  workspaceRecipients: Array<MessageWorkspaceRecipientType>;
}
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
export interface MessageWorkspaceRecipientType {
  archetype: string;
  workspaceEntityId: number;
  workspaceExtension?: string;
  workspaceName: string;
}
export type MessageThreadListType = Array<MessageThreadType>;

export interface MessagesNavigationItemUpdateType {
  location?: string;
  type?: string;
  id?: string | number;
  icon?: string;
  color?: string;
  text?(i18n: i18nType): string;
}

export interface MessagesNavigationItemType {
  location: string;
  type: string;
  id: string | number;
  icon: string;
  color?: string;
  text(i18n: i18nType): string;
}

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
    text(i18n: i18nType): string {
      return i18n.text.get("plugin.communicator.category.title.inbox");
    },
  },
  {
    location: "unread",
    type: "folder",
    id: "unread",
    icon: "folder",
    text(i18n: i18nType): string {
      return i18n.text.get("plugin.communicator.category.title.unread");
    },
  },
  {
    location: "sent",
    type: "folder",
    id: "sent",
    icon: "folder",
    text(i18n: i18nType): string {
      return i18n.text.get("plugin.communicator.category.title.sent");
    },
  },
  {
    location: "trash",
    type: "folder",
    id: "trash",
    icon: "trash-alt",
    text(i18n: i18nType): string {
      return i18n.text.get("plugin.communicator.category.title.trash");
    },
  },
];

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

export default function messages(
  state: MessagesType = {
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
  },
  action: ActionType
): MessagesType {
  if (action.type === "UPDATE_MESSAGE_THREADS") {
    return Object.assign({}, state, {
      threads: <MessageThreadListType>action.payload,
    });
  } else if (action.type === "UPDATE_UNREAD_MESSAGE_THREADS_COUNT") {
    return Object.assign({}, state, {
      unreadThreadCount: <number>action.payload,
    });
  } else if (action.type === "UPDATE_MESSAGES_NAVIGATION_LABELS") {
    return Object.assign({}, state, {
      navigation: defaultNavigation
        .concat(<MessagesNavigationItemListType>action.payload)
        .sort(sortNavigationItems),
    });
  } else if (action.type === "ADD_MESSAGES_NAVIGATION_LABEL") {
    return Object.assign({}, state, {
      navigation: state.navigation
        .concat(<MessagesNavigationItemListType>[
          <MessagesNavigationItemType>action.payload,
        ])
        .sort(sortNavigationItems),
    });
  } else if (action.type === "DELETE_MESSAGE_THREADS_NAVIGATION_LABEL") {
    return Object.assign({}, state, {
      navigation: state.navigation
        .filter(
          (item: MessagesNavigationItemType) =>
            item.id !== action.payload.labelId
        )
        .sort(sortNavigationItems),
    });
  } else if (action.type === "UPDATE_MESSAGES_NAVIGATION_LABEL") {
    return Object.assign({}, state, {
      navigation: state.navigation
        .map((item: MessagesNavigationItemType) => {
          if (item.id !== action.payload.labelId) {
            return item;
          }
          return Object.assign(
            {},
            item,
            <MessagesNavigationItemUpdateType>action.payload.update
          );
        })
        .sort(sortNavigationItems),
    });
  } else if (action.type === "UPDATE_MESSAGES_STATE") {
    const newState: MessagesStateType = action.payload;
    return Object.assign({}, state, { state: newState });
  } else if (action.type === "UPDATE_MESSAGES_ALL_PROPERTIES") {
    const newAllProperties: MessagesPatchType = action.payload;
    return Object.assign({}, state, {
      ...newAllProperties,
      selectedThreads: state.toggleSelectAllMessageItemsActive
        ? newAllProperties.threads.map((thread) => thread)
        : state.selectedThreads,
      selectedThreadsIds: state.toggleSelectAllMessageItemsActive
        ? newAllProperties.threads.map((thread) => thread.communicatorMessageId)
        : state.selectedThreadsIds,
    });
  } else if (action.type === "UPDATE_SELECTED_MESSAGE_THREADS") {
    const newThreads: MessageThreadListType = action.payload;
    return Object.assign({}, state, {
      selectedThreads: newThreads,
      selectedThreadsIds: newThreads.map(
        (s: MessageThreadType) => s.communicatorMessageId
      ),
    });
  } else if (action.type === "ADD_TO_MESSAGES_SELECTED_THREADS") {
    const newThread: MessageThreadType = action.payload;
    return Object.assign({}, state, {
      selectedThreads: state.selectedThreads.concat([newThread]),
      selectedThreadsIds: state.selectedThreadsIds.concat([
        newThread.communicatorMessageId,
      ]),
      toggleSelectAllMessageItemsActive:
        state.selectedThreads.length === state.threads.length - 1
          ? true
          : false,
    });
  } else if (action.type === "REMOVE_FROM_MESSAGES_SELECTED_THREADS") {
    return Object.assign({}, state, {
      selectedThreads: state.selectedThreads.filter(
        (selectedThread: MessageThreadType) =>
          selectedThread.communicatorMessageId !==
          action.payload.communicatorMessageId
      ),
      selectedThreadsIds: state.selectedThreadsIds.filter(
        (id: number) => id !== action.payload.communicatorMessageId
      ),
      toggleSelectAllMessageItemsActive: false,
    });
  } else if (action.type === "UPDATE_ONE_MESSAGE_THREAD") {
    const update: MessageThreadUpdateType = action.payload.update;
    const oldThread: MessageThreadType = action.payload.thread;
    const newThread: MessageThreadType = Object.assign({}, oldThread, update);
    return Object.assign({}, state, {
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
        if (thread.communicatorMessageId === oldThread.communicatorMessageId) {
          return newThread;
        }
        return thread;
      }),
    });
  } else if (action.type === "LOCK_TOOLBAR") {
    return Object.assign({}, state, { toolbarLock: true });
  } else if (action.type === "UNLOCK_TOOLBAR") {
    return Object.assign({}, state, { toolbarLock: false });
  } else if (action.type === "UPDATE_MESSAGE_THREAD_ADD_LABEL") {
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

    return Object.assign({}, state, {
      selectedThreads: state.selectedThreads.map(
        (selectedThread: MessageThreadType) => {
          if (
            selectedThread.communicatorMessageId ===
            action.payload.communicatorMessageId
          ) {
            if (
              !selectedThread.labels.find(
                (label) => label.labelId === action.payload.label.labelId
              )
            ) {
              return Object.assign({}, selectedThread, {
                labels: selectedThread.labels.concat([action.payload.label]),
              });
            } else {
              return selectedThread;
            }
          }
          return selectedThread;
        }
      ),
      threads: state.threads.map((thread: MessageThreadType) => {
        if (
          thread.communicatorMessageId === action.payload.communicatorMessageId
        ) {
          if (
            !thread.labels.find(
              (label) => label.labelId === action.payload.label.labelId
            )
          ) {
            return Object.assign({}, thread, {
              labels: thread.labels.concat([action.payload.label]),
            });
          } else {
            return thread;
          }
        }
        return thread;
      }),
      currentThread: newCurrent,
    });
  } else if (action.type === "UPDATE_MESSAGE_THREAD_DROP_LABEL") {
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

    return Object.assign({}, state, {
      selectedThreads: state.selectedThreads.map(
        (selectedThread: MessageThreadType) => {
          if (
            selectedThread.communicatorMessageId ===
            action.payload.communicatorMessageId
          ) {
            return Object.assign({}, selectedThread, {
              labels: selectedThread.labels.filter(
                (label) => label.labelId !== action.payload.label.labelId
              ),
            });
          }
          return selectedThread;
        }
      ),
      threads: state.threads.map((thread: MessageThreadType) => {
        if (
          thread.communicatorMessageId === action.payload.communicatorMessageId
        ) {
          return Object.assign({}, thread, {
            labels: thread.labels.filter(
              (label) => label.labelId !== action.payload.label.labelId
            ),
          });
        }
        return thread;
      }),
      currentThread: newCurrent,
    });
  } else if (action.type === "DELETE_MESSAGE_THREAD") {
    return Object.assign({}, state, {
      selectedThreads: state.selectedThreads.filter(
        (selectedThread: MessageThreadType) =>
          selectedThread.communicatorMessageId !==
          action.payload.communicatorMessageId
      ),
      threads: state.threads.filter(
        (thread: MessageThreadType) =>
          thread.communicatorMessageId !== action.payload.communicatorMessageId
      ),
      selectedThreadsIds: state.selectedThreadsIds.filter(
        (id: number) => id !== action.payload.communicatorMessageId
      ),
    });
  } else if (action.type === "SET_CURRENT_MESSAGE_THREAD") {
    return Object.assign({}, state, {
      currentThread: <MessageThreadExpandedType>action.payload,
    });
  } else if (action.type === "UPDATE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS") {
    const update: MessageThreadLabelUpdateType = action.payload.update;
    return Object.assign({}, state, {
      selectedThreads: state.selectedThreads.map(
        (selectedThread: MessageThreadType) =>
          Object.assign({}, selectedThread, {
            labels: selectedThread.labels.map((label) => {
              if (label.labelId === action.payload.labelId) {
                return Object.assign({}, label, update);
              }
              return label;
            }),
          })
      ),
      threads: state.threads.map((thread: MessageThreadType) =>
        Object.assign({}, thread, {
          labels: thread.labels.map((label) => {
            if (label.labelId === action.payload.labelId) {
              return Object.assign({}, label, update);
            }
            return label;
          }),
        })
      ),
      currentThread: state.currentThread
        ? Object.assign({}, state.currentThread, {
            labels: state.currentThread.labels.map((label) => {
              if (label.labelId === action.payload.labelId) {
                return Object.assign({}, label, update);
              }
              return label;
            }),
          })
        : state.currentThread,
    });
  } else if (action.type === "REMOVE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS") {
    return Object.assign({}, state, {
      selectedThreads: state.selectedThreads.map(
        (selectedThread: MessageThreadType) =>
          Object.assign({}, selectedThread, {
            labels: selectedThread.labels.filter(
              (label) => label.labelId !== action.payload.labelId
            ),
          })
      ),
      threads: state.threads.map((thread: MessageThreadType) =>
        Object.assign({}, thread, {
          labels: thread.labels.filter(
            (label) => label.labelId !== action.payload.labelId
          ),
        })
      ),
      currentThread: state.currentThread
        ? Object.assign({}, state.currentThread, {
            labels: state.currentThread.labels.filter(
              (label) => label.labelId !== action.payload.labelId
            ),
          })
        : state.currentThread,
    });
  } else if (action.type === "PUSH_ONE_MESSAGE_THREAD_FIRST") {
    const newThreads: MessageThreadListType = state.threads.filter(
      (m) => m.communicatorMessageId !== action.payload.communicatorMessageId
    );
    return Object.assign({}, state, {
      threads: [<MessageThreadType>action.payload].concat(newThreads),
    });
  } else if (action.type === "UPDATE_MESSAGES_SIGNATURE") {
    return Object.assign({}, state, {
      signature: <MessageSignatureType>action.payload,
    });
  } else if (action.type === "PUSH_MESSAGE_LAST_IN_CURRENT_THREAD") {
    if (!state.currentThread) {
      return state;
    }
    return Object.assign({}, state, {
      currentThread: Object.assign({}, state.currentThread, {
        messages: state.currentThread.messages.concat([
          <MessageType>action.payload,
        ]),
      }),
    });
  } else if (action.type === "TOGGLE_ALL_MESSAGE_ITEMS") {
    return Object.assign({}, state, {
      toggleSelectAllMessageItemsActive:
        !state.toggleSelectAllMessageItemsActive,
      selectedThreads: !state.toggleSelectAllMessageItemsActive
        ? state.threads
        : [],
      selectedThreadsIds: !state.toggleSelectAllMessageItemsActive
        ? state.threads.map((thread) => thread.communicatorMessageId)
        : [],
    });
  }
  return state;
}
