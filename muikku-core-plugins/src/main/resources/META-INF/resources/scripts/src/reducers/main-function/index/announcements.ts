import {ActionType} from '~/actions';
import {AnnouncementListType} from '~/reducers';

export default function announcements(state: AnnouncementListType=[], action: ActionType<any>): AnnouncementListType{
  if (action.type === 'UPDATE_ANNOUNCEMENTS'){
    return <AnnouncementListType>action.payload;
  }
  return state;
}