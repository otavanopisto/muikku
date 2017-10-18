import {ActionType} from '~/actions';

export interface DiscussionThreadType {
  created: string,
  creator: number,
  forumAreadId: number,
  id: number,
  lastModified: string,
  locked: boolean,
  message: string,
  numReplies: number,
  sticky: boolean,
  title: string,
  updated: string
}

export interface DiscussionThreadListType extends Array<DiscussionThreadType> {}

export type DiscussionStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";

export interface DiscussionType {
  state: DiscussionStateType,
  threads: DiscussionThreadListType,
  areaId: number,
  pages: number,
  hasMore: boolean
}

export interface DiscussionPatchType {
  state?: DiscussionStateType,
  threads?: DiscussionThreadListType,
  areaId?: number,
  pages?: number,
  hasMore?: boolean
}

export default function discussionThreads(state: DiscussionType={
    state: "LOADING",
    threads: [],
    areaId: null,
    pages: 1,
    hasMore: false
}, action: ActionType): DiscussionType {
  if (action.type === "UPDATE_DISCUSSION_THREADS_STATE"){
    let newState: DiscussionStateType = action.payload;
    return Object.assign({}, state, {state: newState});
  } else if (action.type === "UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES"){
    let newAllProperties: DiscussionPatchType = action.payload;
    return Object.assign({}, state, newAllProperties);
  }
  return state;
}