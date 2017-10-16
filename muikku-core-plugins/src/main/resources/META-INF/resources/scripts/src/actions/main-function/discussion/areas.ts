import notificationActions from '~/actions/base/notifications';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import { DiscussionAreaListType } from '~/reducers/main-function/discussion/areas';

export interface UPDATE_DISCUSSION_AREAS extends SpecificActionType<"UPDATE_DISCUSSION_AREAS", DiscussionAreaListType>{}

export interface UpdateDiscussionAreasTriggerType {
  ():AnyActionType
}

let updateDiscussionAreas:UpdateDiscussionAreasTriggerType = function updateDiscussionAreas(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      dispatch({
        type: 'UPDATE_DISCUSSION_AREAS',
        payload: <DiscussionAreaListType>await promisify(mApi().forum.areas.read(), 'callback')()
      });
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
    }
  }
}
  
export {updateDiscussionAreas}
export default {updateDiscussionAreas}