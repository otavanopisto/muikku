import notificationActions from '~/actions/base/notifications';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import { DiscussionAreaListType } from '~/reducers/main-function/discussion/discussion-areas';

export interface UPDATE_DISCUSSION_AREAS extends SpecificActionType<"UPDATE_DISCUSSION_AREAS", DiscussionAreaListType>{}

export interface LoadDiscussionAreasTriggerType {
  (callback?: ()=>any):AnyActionType
}

let loadDiscussionAreas:LoadDiscussionAreasTriggerType = function loadDiscussionAreas(callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      dispatch({
        type: 'UPDATE_DISCUSSION_AREAS',
        payload: <DiscussionAreaListType>await promisify(mApi().forum.areas.read(), 'callback')()
      });
      callback && callback();
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
    }
  }
}
  
export {loadDiscussionAreas}
export default {loadDiscussionAreas}