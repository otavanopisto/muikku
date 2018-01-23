import notificationActions from '~/actions/base/notifications';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {AnnouncementType} from '~/reducers/main-function/announcer/announcements';


export interface LoadAnnouncementTriggerType {
  (announcementId:number):AnyActionType
}

export interface SET_CURRENT_ANNOUNCEMENT extends SpecificActionType<"SET_CURRENT_ANNOUNCEMENT", AnnouncementType>{}

let loadAnnouncement:LoadAnnouncementTriggerType = function loadAnnouncement(announcementId){
  
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let state = getState();
    
    let announcement:AnnouncementType = state.announcements.find((a:AnnouncementType)=>a.id === announcementId);
    try {
      if (!announcement){
        announcement = <AnnouncementType>await promisify(mApi().announcer.announcements.read(announcementId), 'callback')();
      }
      
      dispatch({
        type: "SET_CURRENT_ANNOUNCEMENT",
        payload: announcement
      });
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
    }
  }
}
  
export {loadAnnouncement}
export default {loadAnnouncement}