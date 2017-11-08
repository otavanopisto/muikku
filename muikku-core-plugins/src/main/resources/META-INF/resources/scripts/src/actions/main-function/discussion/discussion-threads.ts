import { AnyActionType, SpecificActionType} from "~/actions";
import { DiscussionAreaListType, DiscussionAreaType } from "~/reducers/main-function/discussion/discussion-areas";
import promisify from "~/util/promisify";
import notificationActions from '~/actions/base/notifications';
import mApi from '~/lib/mApi';
import {DiscussionPatchType, DiscussionStateType, DiscussionThreadType, DiscussionType, DiscussionThreadListType, DiscussionThreadReplyListType} from "~/reducers/main-function/discussion/discussion-threads";
import { loadUserIndex } from "~/actions/main-function/user-index";
import {loadDiscussionAreas} from './discussion-areas';

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
    page?: number,
    threadId: number,
    threadPage?: number,
    success?: ()=>any,
    fail?: ()=>any
  }):AnyActionType
}

export interface ReplyToCurrentDiscussionThreadTriggerType {
  (data:{
    message: string,
    replyId?: number,
    success?: ()=>any,
    fail?: ()=>any
  }):AnyActionType
}

let loadDiscussionThreads:LoadDiscussionThreadsTriggerType = function loadDiscussionThreads(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    
    //Remove the current messsage
    dispatch({
      type: "SET_CURRENT_DISCUSSION_THREAD",
      payload: null
    });
    dispatch({
      type: "UPDATE_DISCUSSION_CURRENT_THREAD_STATE",
      payload: <DiscussionStateType>"WAIT"
    });
    
    //NOTE we reload the discussion areas every time we load the threads because we have absolutely no
    //idea if the amount of pages per thread change every time I select a page, data updates on the fly
    //one solution would be to make a realtime change
    dispatch(loadDiscussionAreas(async ()=>{
      
      let state = getState();
      let discussion:DiscussionType = state.discussionThreads;
      
      //Avoid loading if it's the same area
      if (discussion.areaId === data.areaId && discussion.state === "READY" && discussion.page === data.page){
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
    }));
  }
}

let createDiscussionThread:CreateDiscussionThreadTriggerType = function createDiscussionThread(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      let newThread = <DiscussionThreadType>await promisify(mApi().forum.areas.threads.create(data.forumAreaId, data), 'callback')();
      
      let discussion:DiscussionType = getState().discussionThreads;
      window.location.hash = newThread.forumAreaId + "/" + 
        (newThread.forumAreaId === discussion.areaId ? discussion.page : "1") + "/" + newThread.id + "/1";
      
      //since we cannot be sure how the new tread affected whatever they are looking at now, and we can't just push first
      //because we might not have the last, lets make it so that when they go back the server is called in order
      //to retrieve the data properly
      
      //this will do it, since it will consider the discussion thread to be in a waiting state
      //non-ready, also area count might change, so let's reload it
      dispatch(loadDiscussionAreas());
      dispatch({
        type: "UPDATE_DISCUSSION_THREADS_STATE",
        payload: <DiscussionStateType>"WAIT"
      });
      
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
    if (discussion.current && discussion.current.id === data.threadId && discussion.currentPage === data.threadPage){
      return;
    }
    
    let actualThreadPage = data.threadPage || discussion.currentPage;
    let actualPage = data.page || discussion.page;
    
    dispatch({
      type: "UPDATE_DISCUSSION_CURRENT_THREAD_STATE",
      payload: <DiscussionStateType>"LOADING"
    });
    
    //Generate the api query, our first result in the pages that we have loaded multiplied by how many result we get
    let firstResult = (actualThreadPage-1)*MAX_LOADED_AT_ONCE;

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
        page: actualPage,
        currentPage: actualThreadPage
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
      
      data.success && data.success();
    } catch (err){
      //Error :(
      dispatch(notificationActions.displayNotification(err.message, 'error'));
      dispatch({
        type: "UPDATE_DISCUSSION_CURRENT_THREAD_STATE",
        payload: <DiscussionStateType>"ERROR"
      });
      
      data.fail && data.fail();
    }
  }
}

let replyToCurrentDiscussionThread:ReplyToCurrentDiscussionThreadTriggerType = function replyToDiscussionThread(data){ 
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let payload:any = {
      message: data.message
    }
    
    if (data.replyId){
      payload.parentReplyId = data.replyId;
    }
  
    let state = getState();
    let discussion:DiscussionType = state.discussionThreads
    
    try {
      let newThread = <DiscussionThreadType>await promisify(mApi().forum.areas.threads.replies.create(
          discussion.current.forumAreaId, discussion.current.id, payload), 'callback')();
      
      //sadly the new calculation is overly complex and error prone so we'll just do this;
      
      dispatch(loadDiscussionThread({
        areaId: discussion.current.forumAreaId,
        threadId: discussion.current.id,
        success: data.success,
        fail: data.fail
      }));
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
      data.fail && data.fail();
    }
  }
}

export {loadDiscussionThreads, createDiscussionThread, loadDiscussionThread, replyToCurrentDiscussionThread}
export default {loadDiscussionThreads, createDiscussionThread, loadDiscussionThread, replyToCurrentDiscussionThread}