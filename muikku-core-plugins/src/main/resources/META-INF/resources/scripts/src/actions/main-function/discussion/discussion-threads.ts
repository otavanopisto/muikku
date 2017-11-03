import { AnyActionType, SpecificActionType} from "~/actions";
import { DiscussionAreaListType, DiscussionAreaType } from "~/reducers/main-function/discussion/discussion-areas";
import promisify from "~/util/promisify";
import notificationActions from '~/actions/base/notifications';
import mApi from '~/lib/mApi';
import {DiscussionPatchType, DiscussionStateType, DiscussionThreadType, DiscussionType, DiscussionThreadListType, DiscussionThreadReplyListType} from "~/reducers/main-function/discussion/discussion-threads";
import { loadUserIndex } from "~/actions/main-function/user-index";

const MAX_LOADED_AT_ONCE = 30;

export interface UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES extends SpecificActionType<"UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES", DiscussionPatchType>{}
export interface UPDATE_DISCUSSION_THREADS_STATE extends SpecificActionType<"UPDATE_DISCUSSION_THREADS_STATE", DiscussionStateType>{}
export interface UPDATE_DISCUSSION_CURRENT_THREAD_STATE extends SpecificActionType<"UPDATE_DISCUSSION_CURRENT_THREAD_STATE", DiscussionStateType>{}
export interface PUSH_DISCUSSION_THREAD_FIRST extends SpecificActionType<"PUSH_DISCUSSION_THREAD_FIRST", DiscussionThreadType>{};
export interface SET_CURRENT_DISCUSSION_THREAD extends SpecificActionType<"SET_CURRENT_DISCUSSION_THREAD", DiscussionThreadType>{};
export interface SET_TOTAL_DISCUSSION_PAGES extends SpecificActionType<"SET_TOTAL_DISCUSSION_PAGES", number>{};
export interface SET_TOTAL_DISCUSSION_THREAD_PAGES extends SpecificActionType<"SET_TOTAL_DISCUSSION_THREAD_PAGES", number>{};

export interface LoadDiscussionThreadsTriggerType {
  (data:{
    areaId: number,
    page: number
  }):AnyActionType
}

export interface CreateDiscussionThreadTriggerType {
  (data:{forumAreaId: number, locked: boolean, message: string, sticky: boolean, title: string, success?: ()=>any, fail?: ()=>any}):AnyActionType
}

export interface LoadDiscussionThreadTriggerType {
  (data:{
    areaId: number,
    page: number,
    threadId: number,
    threadPage: number
  }):AnyActionType
}

//NOTE this function must run only when areas area loaded otherwise the thread will fail
let loadDiscussionThreads:LoadDiscussionThreadsTriggerType = function loadDiscussionThreads(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    //Remove the current messsage
    dispatch({
      type: "SET_CURRENT_DISCUSSION_THREAD",
      payload: null
    });
    
    let state = getState();
    let discussion:DiscussionType = state.discussionThreads;
    
    //Avoid loading if it's the same area
    if (discussion.areaId === data.areaId && discussion.state === "READY"){
      return;
    }
    
    dispatch({
      type: "UPDATE_DISCUSSION_THREADS_STATE",
      payload: <DiscussionStateType>"LOADING"
    });
    
    //Calculate the amount of pages
    let allThreadNumber = 0;
    if (data.areaId){
      let area:DiscussionAreaType = state.areas.find((area: DiscussionAreaType)=>{
        return area.id === data.areaId;
      });
      allThreadNumber = area.numThreads;
    } else {
      state.areas.forEach((area: DiscussionAreaType)=>{
        allThreadNumber += area.numThreads;
      });
    }
    
    let pages = Math.ceil(allThreadNumber / MAX_LOADED_AT_ONCE) || 1;
    
    dispatch({
      type: "SET_TOTAL_DISCUSSION_PAGES",
      payload: pages
    });
    
    //Generate the api query, our first result in the pages that we have loaded multiplied by how many result we get
    let firstResult = (data.page-1)*MAX_LOADED_AT_ONCE;
    
    let params = {
        firstResult,
        maxResults: MAX_LOADED_AT_ONCE
    }
    
    try {
      let threads:DiscussionThreadListType = <DiscussionThreadListType>await promisify(data.areaId ? mApi().forum.areas.threads
          .read(data.areaId, params) : mApi().forum.latest.read(params), 'callback')();
      
      threads.forEach((thread)=>{
        dispatch(loadUserIndex(thread.creator));
      });
      
      //Create the payload for updating all the communicator properties
      let payload:DiscussionPatchType = {
        state: "READY",
        threads,
        page: data.page,
        areaId: data.areaId
      }
      
      //And there it goes
      dispatch({
        type: "UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES",
        payload
      });
    } catch (err){
      //Error :(
      dispatch(notificationActions.displayNotification(err.message, 'error'));
      dispatch({
        type: "UPDATE_DISCUSSION_THREADS_STATE",
        payload: <DiscussionStateType>"ERROR"
      });
    }
  }
}

let createDiscussionThread:CreateDiscussionThreadTriggerType = function createDiscussionThread(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      let newThread = <DiscussionThreadType>await promisify(mApi().forum.areas.threads.create(data.forumAreaId, data), 'callback')();
      
      let discussion:DiscussionType = getState().discussionThreads;
      window.location.hash = newThread.forumAreaId + "/" + 
        (newThread.forumAreaId === discussion.areaId ? discussion.page : "1") + "/" + newThread.id + "/1";
      data.success && data.success();
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
      data.fail && data.fail();
    }
  }
}

let loadDiscussionThread:LoadDiscussionThreadTriggerType = function loadDiscussionThread(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let state = getState();
    let discussion:DiscussionType = state.discussionThreads
    
    //Avoid loading if it's the same thread that has been loaded already
    if (discussion.current && discussion.current.id === data.threadId){
      return;
    }
    
    dispatch({
      type: "UPDATE_DISCUSSION_CURRENT_THREAD_STATE",
      payload: <DiscussionStateType>"LOADING"
    });
    
    //Generate the api query, our first result in the pages that we have loaded multiplied by how many result we get
    let firstResult = (data.threadPage-1)*MAX_LOADED_AT_ONCE;

    let params = {
      firstResult,
      maxResults: MAX_LOADED_AT_ONCE
    }
    
    try {
      let newCurrentThread:DiscussionThreadType = discussion.threads.find((thread)=>{
        return thread.id === data.threadId;
      }) || <DiscussionThreadType>await promisify(mApi().forum.areas.threads.read(data.areaId, data.threadId), 'callback')();
      
      let pages:number = Math.ceil(newCurrentThread.numReplies / MAX_LOADED_AT_ONCE) || 1;
    
      dispatch({
        type: "SET_TOTAL_DISCUSSION_THREAD_PAGES",
        payload: pages
      });
      
      let replies:DiscussionThreadReplyListType = <DiscussionThreadReplyListType>await promisify(mApi().forum.areas.threads.replies.read(data.areaId, data.threadId, params), 'callback')();
      replies.forEach((reply)=>{
        dispatch(loadUserIndex(reply.creator));
      });
      
      let newProps:DiscussionPatchType = {
        current: newCurrentThread,
        currentReplies: replies,
        currentState: "READY",
        page: data.page,
        currentPage: data.threadPage
      };
      
      //In a nutshell, if I go from all areas to a specific thread, then once going back it will cause it to load twice
      //back as it will detect a change of area, from a specific area to all areas.
      //this is only worth setting if the load happened in the specific area, that is the discussion threads state is not
      //ready but the current one is
      if (discussion.state !== "READY"){
        newProps.areaId = data.areaId;
      }
      
      dispatch({
        type: "UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES",
        payload: newProps
      });
    } catch (err){
      //Error :(
      dispatch(notificationActions.displayNotification(err.message, 'error'));
      dispatch({
        type: "UPDATE_DISCUSSION_CURRENT_THREAD_STATE",
        payload: <DiscussionStateType>"ERROR"
      });
    }
  }
}

export {loadDiscussionThreads, createDiscussionThread, loadDiscussionThread}
export default {loadDiscussionThreads, createDiscussionThread, loadDiscussionThread}