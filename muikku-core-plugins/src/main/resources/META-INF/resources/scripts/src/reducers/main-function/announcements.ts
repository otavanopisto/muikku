import {ActionType} from '~/actions';
import { AnnouncementListType } from '~/reducers/main-function/announcer/announcements';

export default function announcements(state: AnnouncementListType=[], action: ActionType): AnnouncementListType{
  if (action.type === 'UPDATE_ANNOUNCEMENTS'){
    return <AnnouncementListType>action.payload;
  }
  return state;
}