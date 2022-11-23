import { ActionType } from "~/actions";
import { Reducer } from "redux";

/**
 * DiscussionUserType
 */
export interface DiscussionUserType {
  id: number;
  firstName: string;
  lastName: string;
  nickname: string;
  hasImage: boolean;
}

/**
 * DiscussionSubscribedArea
 */
export interface DiscussionSubscribedArea {
  /**
   * Area id
   */
  areaId: number;
  /**
   * Users id
   */
  userEntityId: number;
  /**
   * Area information
   */
  area: DiscussionAreaType;
  /**
   * Id of workspace.
   */
  workspaceId: null;
  /**
   * Includes name extension
   */
  workspaceUrlName: null;
  /**
   * url of workspace
   */
  workspaceName: null;
}

/**
 * DiscussionSubscribedThread
 */
export interface DiscussionSubscribedThread {
  /**
   * Users id
   */
  userEntityId: number;
  /**
   * Thread id
   */
  threadId: number;
  /**
   * Thread information
   */
  thread: DiscussionThreadType;
  /**
   * Id of workspace.
   */
  workspaceId?: number;
  /**
   * Includes name extension
   */
  workspaceName?: string;
  /**
   * url of workspace
   */
  workspaceUrlName?: string;
}

/**
 * DiscussionThreadType
 */
export interface DiscussionThreadType {
  created: string;
  creator: DiscussionUserType;
  entryPoint: number[];
  forumAreaId: number;
  id: number;
  lastModified: string;
  locked: boolean;
  message: string;
  numReplies: number;
  sticky: boolean;
  title: string;
  updated: string;
}

/**
 * DiscussionThreadReplyType
 */
export interface DiscussionThreadReplyType {
  childReplyCount: number;
  created: string;
  creator: DiscussionUserType;
  deleted: boolean;
  forumAreaId: number;
  id: number;
  lastModified: string;
  message: string;
  parentReplyId: number;
}

export type DiscussionThreadReplyListType = Array<DiscussionThreadReplyType>;
export type DiscussionThreadListType = Array<DiscussionThreadType>;

export type DiscussionStateType = "LOADING" | "ERROR" | "READY";

/**
 * DiscussionAreaType
 */
export interface DiscussionAreaType {
  id: number;
  name: string;
  description: string;
  groupId: number;
  numThreads: number;
}

/**
 * DiscussionAreaUpdateType
 */
export interface DiscussionAreaUpdateType {
  id?: number;
  name?: string;
  description?: string;
  groupId?: number;
  numThreads?: number;
}

export type DiscussionAreaListType = Array<DiscussionAreaType>;

/**
 * DiscussionType
 */
export interface DiscussionType {
  state: DiscussionStateType;
  threads: DiscussionThreadListType;
  subscribedAreas: DiscussionSubscribedArea[];
  subscribedThreads: DiscussionSubscribedThread[];
  subscribedThreadOnly: boolean;
  page: number;
  areaId: number;
  workspaceId?: number;
  totalPages: number;
  current: DiscussionThreadType;
  currentState: DiscussionStateType;
  currentReplies: DiscussionThreadReplyListType;
  currentPage: number;
  currentTotalPages: number;
  areas: DiscussionAreaListType;
}

/**
 * DiscussionPatchType
 */
export interface DiscussionPatchType {
  state?: DiscussionStateType;
  threads?: DiscussionThreadListType;
  page?: number;
  areaId?: number;
  workspaceId?: number;
  totalPages?: number;
  current?: DiscussionThreadType;
  currentState?: DiscussionStateType;
  currentReplies?: DiscussionThreadReplyListType;
  currentPage?: number;
  currentTotalPages?: number;
  areas?: DiscussionAreaListType;
}

/**
 * initialDiscussionState
 */
const initialDiscussionState: DiscussionType = {
  state: "LOADING",
  areas: [],
  subscribedAreas: [],
  threads: [],
  subscribedThreads: [],
  subscribedThreadOnly: false,
  areaId: null,
  workspaceId: null,
  page: 1,
  totalPages: 1,
  current: null,
  currentState: "READY",
  currentPage: 1,
  currentTotalPages: 1,
  currentReplies: [],
};

/**
 * Reducer function for discussion
 *
 * @param state state
 * @param action action
 * @returns State of discussion
 */
export const discussion: Reducer<DiscussionType> = (
  state = initialDiscussionState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_DISCUSSION_THREADS_STATE":
      return { ...state, state: action.payload };

    case "UPDATE_DISCUSSION_CURRENT_THREAD_STATE":
      return { ...state, currentState: action.payload };

    case "UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES":
      return Object.assign({}, state, action.payload);

    case "PUSH_DISCUSSION_THREAD_FIRST":
      return { ...state, threads: [action.payload].concat(state.threads) };

    case "SET_CURRENT_DISCUSSION_THREAD":
      return { ...state, current: action.payload };

    case "SET_TOTAL_DISCUSSION_PAGES":
      return { ...state, totalPages: action.payload };

    case "SET_TOTAL_DISCUSSION_THREAD_PAGES":
      return { ...state, currentTotalPages: action.payload };

    case "UPDATE_DISCUSSION_THREAD": {
      let newCurrent = state.current;
      if (newCurrent && newCurrent.id === action.payload.id) {
        newCurrent = action.payload;
      }

      return {
        ...state,
        current: newCurrent,
        threads: state.threads.map((thread: DiscussionThreadType) => {
          if (thread.id !== action.payload.id) {
            return thread;
          }
          return action.payload;
        }),
      };
    }

    case "UPDATE_DISCUSSION_THREAD_REPLY":
      return {
        ...state,
        currentReplies: state.currentReplies.map(
          (reply: DiscussionThreadReplyType) => {
            if (reply.id !== action.payload.id) {
              return reply;
            }
            return action.payload;
          }
        ),
      };

    case "UPDATE_DISCUSSION_AREAS":
      return { ...state, areas: action.payload };

    case "PUSH_DISCUSSION_AREA_LAST": {
      const newAreas: DiscussionAreaListType = state.areas.concat([
        action.payload,
      ]);

      return { ...state, areas: newAreas };
    }

    case "UPDATE_DISCUSSION_AREA":
      return {
        ...state,
        areas: state.areas.map((area) => {
          if (area.id === action.payload.areaId) {
            return Object.assign({}, area, action.payload.update);
          }
          return area;
        }),
      };

    case "DELETE_DISCUSSION_AREA":
      return {
        ...state,
        areas: state.areas.filter((area) => area.id !== action.payload),
      };

    case "SET_DISCUSSION_WORKSPACE_ID":
      return { ...state, workspaceId: action.payload };

    case "UPDATE_SUBSCRIBED_AREA_LIST": {
      return { ...state, subscribedAreas: action.payload };
    }

    case "UPDATE_SUBSCRIBED_THREAD_LIST": {
      return { ...state, subscribedThreads: action.payload };
    }

    case "UPDATE_SHOW_ONLY_SUBSCRIBED_THREADS":
      return { ...state, subscribedThreadOnly: action.payload };

    default:
      return state;
  }
};
