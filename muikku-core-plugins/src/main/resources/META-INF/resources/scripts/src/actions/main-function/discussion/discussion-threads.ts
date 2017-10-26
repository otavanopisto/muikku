import { AnyActionType, SpecificActionType} from "~/actions";
import { DiscussionAreaListType } from "~/reducers/main-function/discussion/discussion-areas";
import promisify from "~/util/promisify";
import notificationActions from '~/actions/base/notifications';
import mApi from '~/lib/mApi';
import {DiscussionPatchType, DiscussionStateType, DiscussionThreadType} from "~/reducers/main-function/discussion/discussion-threads";
import {loadThreadsHelper} from "./discussion-threads/helpers";

export interface UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES extends SpecificActionType<"UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES", DiscussionPatchType>{}
export interface UPDATE_DISCUSSION_THREADS_STATE extends SpecificActionType<"UPDATE_DISCUSSION_THREADS_STATE", DiscussionStateType>{}
export interface PUSH_DISCUSSION_THREAD_FIRST extends SpecificActionType<"PUSH_DISCUSSION_THREAD_FIRST", DiscussionThreadType>{};

export interface LoadDiscussionThreadsTriggerType {
  (areaId: number):AnyActionType
}

export interface LoadMoreDiscussionThreadsTriggerType {
  (areaId: number):AnyActionType
}

export interface CreateDiscussionThreadTriggerType {
  (data:{forumAreaId: number, locked: boolean, message: string, sticky: boolean, title: string, success?: ()=>any, fail?: ()=>any}):AnyActionType
}

export interface SetCurrentDiscussionThreadTriggerType {
  (threadId: number):AnyActionType
}

let loadDiscussionThreads:LoadDiscussionThreadsTriggerType = function loadDiscussionThreads(areaId){
  return loadThreadsHelper.bind(null, true, areaId);
}
  
let loadMoreDiscussionThreads:LoadMoreDiscussionThreadsTriggerType = function loadMoreDiscussionThreads(){
  return loadThreadsHelper.bind(null, false, null);
}

let createDiscussionThread:CreateDiscussionThreadTriggerType = function createDiscussionThread(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      let newThread = <DiscussionThreadType>await promisify(mApi().forum.areas.threads.create(data.forumAreaId, data), 'callback')();
      let areaId:number = getState().discussionThreads.areaId;
      if (areaId === data.forumAreaId || areaId === null){
        dispatch({
          type: 'PUSH_DISCUSSION_THREAD_FIRST',
          payload: newThread
        });
      }
      data.success && data.success();
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
      data.fail && data.fail();
    }
  }
}

export {loadDiscussionThreads, loadMoreDiscussionThreads, createDiscussionThread}
export default {loadDiscussionThreads, loadMoreDiscussionThreads, createDiscussionThread}