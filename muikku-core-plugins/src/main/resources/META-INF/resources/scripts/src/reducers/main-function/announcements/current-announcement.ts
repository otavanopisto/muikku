import {ActionType} from '~/actions';
import {AnnouncementType} from '~/reducers/main-function/announcer/announcements';

export default function currentAnnouncement(state: AnnouncementType=null, action: ActionType): AnnouncementType {
  if (action.type === "SET_CURRENT_ANNOUNCEMENT"){
    return action.payload;
  }
  return state;
}