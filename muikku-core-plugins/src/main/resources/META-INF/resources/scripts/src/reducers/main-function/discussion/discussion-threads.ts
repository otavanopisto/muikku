import {ActionType} from '~/actions';

export interface DiscussionThreadType {
  created: string,
  creator: number,
  forumAreaId: number,
  id: number,
  lastModified: string,
  locked: boolean,
  message: string,
  numReplies: number,
  sticky: boolean,
  title: string,
  updated: string
}

export interface DiscussionThreadReplyType {
  childReplyCount: number,
  created: string,
  creator: number,
  deleted: boolean,
  forumAreaId: number,
  id: number,
  lasModified: string,
  message: string,
  parentReplyId: number
}

export interface DiscussionThreadReplyListType extends Array<DiscussionThreadReplyType> {}
export interface DiscussionThreadListType extends Array<DiscussionThreadType> {}

export type DiscussionStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";

export interface DiscussionType {
  state: DiscussionStateType,
  currentState: DiscussionStateType,
  threads: DiscussionThreadListType,
  areaId: number,
  pages: number,
  hasMore: boolean,
  current: DiscussionThreadType,
  currentReplies: DiscussionThreadReplyListType,
  currentHasMore: boolean,
  currentPages: number
}

export interface DiscussionPatchType {
  state?: DiscussionStateType,
  currentState?: DiscussionStateType,
  threads?: DiscussionThreadListType,
  areaId?: number,
  pages?: number,
  hasMore?: boolean,
  current?: any,
  currentHasMore?: boolean,
  currentReplies?: DiscussionThreadReplyListType,
  currentPages?: number
}

export default function discussionThreads(state: DiscussionType={
    state: "LOADING",
    currentState: "READY",
    threads: [],
    areaId: null,
    pages: 1,
    hasMore: false,
    current: null,
    currentHasMore: false,
    currentPages: 1,
    currentReplies: []
}, action: ActionType): DiscussionType {
  if (action.type === "UPDATE_DISCUSSION_THREADS_STATE"){
    let newState: DiscussionStateType = action.payload;
    return Object.assign({}, state, {state: newState});
  } else if (action.type === "UPDATE_DISCUSSION_CURRENT_THREAD_STATE"){
    let newState: DiscussionStateType = action.payload;
    return Object.assign({}, state, {currentState: newState});
  } else if (action.type === "UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES"){
    let newAllProperties: DiscussionPatchType = action.payload;
    return Object.assign({}, state, newAllProperties);
  } else if (action.type === "PUSH_DISCUSSION_THREAD_FIRST"){
    return Object.assign({}, state, {
      threads: [action.payload].concat(state.threads)
    });
  } else if (action.type === "SET_CURRENT_DISCUSSION_THREAD"){
    return Object.assign({}, state, {
      current: action.payload
    });
  }
  return state;
}