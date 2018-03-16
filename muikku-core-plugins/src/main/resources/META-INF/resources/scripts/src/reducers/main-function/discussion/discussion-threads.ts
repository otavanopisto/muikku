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

export type DiscussionThreadReplyListType = Array<DiscussionThreadReplyType>;
export type DiscussionThreadListType = Array<DiscussionThreadType>;

export type DiscussionStateType = "LOADING" | "ERROR" | "READY";

export interface DiscussionType {
  state: DiscussionStateType,
  threads: DiscussionThreadListType,
  page: number,
  areaId: number,
  totalPages: number,
  current: DiscussionThreadType,
  currentState: DiscussionStateType,
  currentReplies: DiscussionThreadReplyListType,
  currentPage: number,
  currentTotalPages: number
}

export interface DiscussionPatchType {
  state?: DiscussionStateType,
  threads?: DiscussionThreadListType,
  page?: number,
  areaId?: number,
  totalPages?: number,
  current?: DiscussionThreadType,
  currentState?: DiscussionStateType,
  currentReplies?: DiscussionThreadReplyListType,
  currentPage?: number,
  currentTotalPages?: number
}

export default function discussionThreads(state: DiscussionType={
    state: "LOADING",
    threads: [],
    areaId: null,
    page: 1,
    totalPages: 1,
    current: null,
    currentState: "READY",
    currentPage: 1,
    currentTotalPages: 1,
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
  } else if (action.type === "SET_TOTAL_DISCUSSION_PAGES"){
    return Object.assign({}, state, {
      totalPages: action.payload
    });
  } else if (action.type === "SET_TOTAL_DISCUSSION_THREAD_PAGES"){
    return Object.assign({}, state, {
      currentTotalPages: action.payload
    });
  } else if (action.type === "UPDATE_DISCUSSION_THREAD"){
    let newCurrent = state.current;
    if (newCurrent && newCurrent.id === action.payload.id){
      newCurrent = action.payload;
    }
    return Object.assign({}, state, {
      current: newCurrent,
      threads: state.threads.map((thread: DiscussionThreadType)=>{
        if (thread.id !== action.payload.id){
          return thread;
        }
        return action.payload;
      })
    });
  } else if (action.type === "UPDATE_DISCUSSION_THREAD_REPLY"){
    let newCurrent = state.current;
    return Object.assign({}, state, {
      currentReplies: state.currentReplies.map((reply: DiscussionThreadReplyType)=>{
        if (reply.id !== action.payload.id){
          return reply;
        }
        return action.payload;
      })
    });
  }
  return state;
}