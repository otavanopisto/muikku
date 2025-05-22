import { ActionType } from "~/actions";
import { Reducer } from "redux";
import {
  DiscussionArea,
  DiscussionSubscribedArea,
  DiscussionSubscribedThread,
  DiscussionThread,
  DiscussionThreadReply,
} from "~/generated/client";

export type DiscussionStateType = "LOADING" | "ERROR" | "WAIT" | "READY";

/**
 * DiscussionState
 */
export interface DiscussionState {
  state: DiscussionStateType;
  threads: DiscussionThread[];
  subscribedAreas: DiscussionSubscribedArea[];
  subscribedThreads: DiscussionSubscribedThread[];
  subscribedThreadOnly: boolean;
  page: number;
  areaId: number;
  workspaceId?: number;
  totalPages: number;
  current: DiscussionThread;
  currentState: DiscussionStateType;
  currentReplies: DiscussionThreadReply[];
  currentPage: number;
  currentTotalPages: number;
  areas: DiscussionArea[];
}

/**
 * DiscussionStatePatch
 */
export interface DiscussionStatePatch {
  state?: DiscussionStateType;
  threads?: DiscussionThread[];
  page?: number;
  areaId?: number;
  workspaceId?: number;
  totalPages?: number;
  current?: DiscussionThread;
  currentState?: DiscussionStateType;
  currentReplies?: DiscussionThreadReply[];
  currentPage?: number;
  currentTotalPages?: number;
  areas?: DiscussionArea[];
}

/**
 * initialDiscussionState
 */
const initialDiscussionState: DiscussionState = {
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
export const discussion: Reducer<DiscussionState, ActionType> = (
  state = initialDiscussionState,
  action
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
        threads: state.threads.map((thread: DiscussionThread) => {
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
        currentReplies: state.currentReplies.map((reply) => {
          if (reply.id !== action.payload.id) {
            return reply;
          }
          return action.payload;
        }),
      };

    case "UPDATE_DISCUSSION_AREAS":
      return { ...state, areas: action.payload };

    case "PUSH_DISCUSSION_AREA_LAST": {
      const newAreas = state.areas.concat([action.payload]);

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
