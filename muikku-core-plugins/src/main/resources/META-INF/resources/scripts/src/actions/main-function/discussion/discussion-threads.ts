import { AnyActionType, SpecificActionType} from "~/actions";
import { DiscussionAreaListType } from "~/reducers/main-function/discussion/discussion-areas";
import promisify from "~/util/promisify";
import notificationActions from '~/actions/base/notifications';
import mApi from '~/lib/mApi';
import {DiscussionPatchType, DiscussionStateType} from "~/reducers/main-function/discussion/discussion-threads";
import {loadThreadsHelper} from "./discussion-threads/helpers";

export interface UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES extends SpecificActionType<"UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES", DiscussionPatchType>{}
export interface UPDATE_DISCUSSION_THREADS_STATE extends SpecificActionType<"UPDATE_DISCUSSION_THREADS_STATE", DiscussionStateType>{}

export interface LoadDiscussionThreadsTriggerType {
  (areaId: number):AnyActionType
}

export interface LoadMoreDiscussionThreadsTriggerType {
  (areaId: number):AnyActionType
}

let loadDiscussionThreads:LoadDiscussionThreadsTriggerType = function loadDiscussionThreads(areaId){
  return loadThreadsHelper.bind(null, true, areaId);
}
  
let loadMoreDiscussionThreads:LoadMoreDiscussionThreadsTriggerType = function loadMoreDiscussionThreads(){
  return loadThreadsHelper.bind(null, false, null);
}

export {loadDiscussionThreads, loadMoreDiscussionThreads}
export default {loadDiscussionThreads, loadMoreDiscussionThreads}