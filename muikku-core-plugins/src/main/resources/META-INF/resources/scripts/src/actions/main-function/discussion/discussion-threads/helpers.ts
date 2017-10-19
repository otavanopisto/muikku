import { AnyActionType } from "~/actions";
import promisify from "~/util/promisify";
import mApi from '~/lib/mApi';
import notificationActions from '~/actions/base/notifications';
import {DiscussionType, DiscussionStateType, DiscussionThreadListType, DiscussionPatchType} from "~/reducers/main-function/discussion/discussion-threads";

const MAX_LOADED_AT_ONCE = 30;

export async function loadThreadsHelper(initial:boolean, areaId:number | null, dispatch:(arg:AnyActionType)=>any, getState:()=>any){
  //Remove the current messsage
  dispatch({
    type: "SET_CURRENT_DISCUSSION_THREAD",
    payload: null
  });
  
  let state = getState();
  let discussion:DiscussionType = state.discussionThreads
  
  //Avoid loading if it's the same area
  if (initial && discussion.areaId === areaId && discussion.state === "READY"){
    return;
  }
  
  let actualAreaId = initial ? areaId : discussion.areaId;
  
  //We set this state to loading
  dispatch({
    type: "UPDATE_DISCUSSION_THREADS_STATE",
    payload: <DiscussionStateType>"LOADING"
  });
  
  //Generate the api query, our first result in the pages that we have loaded multiplied by how many result we get
  let firstResult = initial ? 0 : discussion.pages*MAX_LOADED_AT_ONCE;
  //The pages that we will have loaded will be the first one for initial or otherwise the current one plus 1
  let pages = initial ? 1 : discussion.pages + 1;
  //We only concat if it is not the initial, that means adding to the next messages
  let concat = !initial;
  
  let params = {
      firstResult,
      maxResults: MAX_LOADED_AT_ONCE + 1
  }
  
  try {
    let threads:DiscussionThreadListType = <DiscussionThreadListType>await promisify(actualAreaId ? mApi().forum.areas.threads.read(actualAreaId, params) : mApi().forum.latest.read(params), 'callback')();
    let hasMore:boolean = threads.length === MAX_LOADED_AT_ONCE + 1;
    
    //This is because of the array is actually a reference to a cached array
    //so we rather make a copy otherwise you'll mess up the cache :/
    let actualThreads = threads.concat([]);
    if (hasMore){
      //we got to get rid of that extra loaded message
      actualThreads.pop();
    }
    
    //Create the payload for updating all the communicator properties
    let payload:DiscussionPatchType = {
      state: "READY",
      threads: (concat ? discussion.threads.concat(actualThreads) : actualThreads),
      pages: pages,
      hasMore,
      areaId
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