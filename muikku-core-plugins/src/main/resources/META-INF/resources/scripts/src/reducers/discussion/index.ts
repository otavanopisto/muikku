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
 * DiscussionThreadType
 */
export interface DiscussionThreadType {
  created: string;
  creator: DiscussionUserType;
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
  threads: [],
  areaId: null,
  workspaceId: null,
  page: 1,
  totalPages: 1,
  current: null,
  currentState: "READY",
  currentPage: 1,
  currentTotalPages: 1,
  currentReplies: [],
  areas: [],
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

    default:
      return state;
  }
};

/**
 * discussion
 * @param state state
 * @param action action
 */
/* export default function discussion(
  state: DiscussionType = {
    state: "LOADING",
    threads: [],
    areaId: null,
    workspaceId: null,
    page: 1,
    totalPages: 1,
    current: null,
    currentState: "READY",
    currentPage: 1,
    currentTotalPages: 1,
    currentReplies: [],
    areas: [],
  },
  action: ActionType
): DiscussionType {
  if (action.type === "UPDATE_DISCUSSION_THREADS_STATE") {
    const newState: DiscussionStateType = action.payload;
    return Object.assign({}, state, { state: newState });
  } else if (action.type === "UPDATE_DISCUSSION_CURRENT_THREAD_STATE") {
    const newState: DiscussionStateType = action.payload;
    return Object.assign({}, state, { currentState: newState });
  } else if (action.type === "UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES") {
    const newAllProperties: DiscussionPatchType = action.payload;
    return Object.assign({}, state, newAllProperties);
  } else if (action.type === "PUSH_DISCUSSION_THREAD_FIRST") {
    return Object.assign({}, state, {
      threads: [action.payload].concat(state.threads),
    });
  } else if (action.type === "SET_CURRENT_DISCUSSION_THREAD") {
    return Object.assign({}, state, {
      current: action.payload,
    });
  } else if (action.type === "SET_TOTAL_DISCUSSION_PAGES") {
    return Object.assign({}, state, {
      totalPages: action.payload,
    });
  } else if (action.type === "SET_TOTAL_DISCUSSION_THREAD_PAGES") {
    return Object.assign({}, state, {
      currentTotalPages: action.payload,
    });
  } else if (action.type === "UPDATE_DISCUSSION_THREAD") {
    let newCurrent = state.current;
    if (newCurrent && newCurrent.id === action.payload.id) {
      newCurrent = action.payload;
    }
    return Object.assign({}, state, {
      current: newCurrent,
      threads: state.threads.map((thread: DiscussionThreadType) => {
        if (thread.id !== action.payload.id) {
          return thread;
        }
        return action.payload;
      }),
    });
  } else if (action.type === "UPDATE_DISCUSSION_THREAD_REPLY") {
    return Object.assign({}, state, {
      currentReplies: state.currentReplies.map(
        (reply: DiscussionThreadReplyType) => {
          if (reply.id !== action.payload.id) {
            return reply;
          }
          return action.payload;
        }
      ),
    });
  } else if (action.type === "UPDATE_DISCUSSION_AREAS") {
    const newAreas: DiscussionAreaListType = action.payload;
    return Object.assign({}, state, { areas: newAreas });
  } else if (action.type === "PUSH_DISCUSSION_AREA_LAST") {
    const newAreas: DiscussionAreaListType = state.areas.concat([
      action.payload,
    ]);
    return Object.assign({}, state, { areas: newAreas });
  } else if (action.type === "UPDATE_DISCUSSION_AREA") {
    return Object.assign({}, state, {
      areas: state.areas.map((area) => {
        if (area.id === action.payload.areaId) {
          return Object.assign({}, area, action.payload.update);
        }
        return area;
      }),
    });
  } else if (action.type === "DELETE_DISCUSSION_AREA") {
    return Object.assign({}, state, {
      areas: state.areas.filter((area) => area.id !== action.payload),
    });
  } else if (action.type === "SET_DISCUSSION_WORKSPACE_ID") {
    return Object.assign({}, state, { workspaceId: action.payload });
  }
  return state;
} */
