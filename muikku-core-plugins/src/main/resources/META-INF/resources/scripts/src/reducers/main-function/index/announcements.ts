import {ActionType} from '~/actions';

//TODO remove anies
export interface AnnouncementType {
  archived: boolean,
  caption: string,
  content: string,
  created: string,
  endDate: string,
  id: number,
  publiclyVisible: boolean,
  publisherUserEntityId: number,
  startDate: string,
  temporalStatus: string,
  userGroupEntityIds: Array<any>,
  workspaceEntityIds: Array<any>,
  workspaces: Array<any>
}

export interface AnnouncementListType extends Array<AnnouncementType> {}

export default function announcements(state: AnnouncementListType=[], action: ActionType): AnnouncementListType{
  if (action.type === 'UPDATE_ANNOUNCEMENTS'){
    return <AnnouncementListType>action.payload;
  }
  return state;
}