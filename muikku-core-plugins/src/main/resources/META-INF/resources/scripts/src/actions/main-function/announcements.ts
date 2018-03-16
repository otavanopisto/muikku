import actions from '../base/notifications';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {AnnouncementListType} from '~/reducers/main-function/announcer/announcements';
import { StateType } from '~/reducers';

//REDUX ACTIONS
export interface UPDATE_ANNOUNCEMENTS extends SpecificActionType<"UPDATE_ANNOUNCEMENTS", AnnouncementListType>{}

export interface LoadAnnouncementsFromServerTriggerType {
  (options?: any, callback?: (announcements:AnnouncementListType )=>any):AnyActionType
}

let loadAnnouncementsFromServer:LoadAnnouncementsFromServerTriggerType = function loadAnnouncementsFromServer(options={hideWorkspaceAnnouncements: "false"}, callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
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

export default {loadAnnouncementsFromServer}
export {loadAnnouncementsFromServer}