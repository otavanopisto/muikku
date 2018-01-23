import actions from '../base/notifications';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {AnnouncementListType} from '~/reducers/main-function/announcer/announcements';

export interface UpdateAnnouncementsTriggerType {
  (options?: any, callback?: (announcements:AnnouncementListType )=>any):AnyActionType
}

export interface UPDATE_ANNOUNCEMENTS extends SpecificActionType<"UPDATE_ANNOUNCEMENTS", AnnouncementListType>{}

let updateAnnouncements:UpdateAnnouncementsTriggerType = function updateAnnouncements(options={hideWorkspaceAnnouncements: "false"}, callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      let announcements:AnnouncementListType = <AnnouncementListType>await promisify(mApi().announcer.announcements.read(options), 'callback')();
      dispatch({
        type: 'UPDATE_ANNOUNCEMENTS',
        payload: announcements
      });
      callback && callback(announcements);
    } catch (err){
      dispatch(actions.displayNotification(err.message, 'error'));
    }
  }
}

export default {updateAnnouncements}
export {updateAnnouncements}