import {ActionType} from '~/actions';

export interface WorkspaceType {
  access: string,
  archived: boolean,
  curriculumIdentifiers: Array<string>,
  description: string,
  hasCustomImage: boolean,
  id: number,
  lastVisit: string,
  materialDefaultLicense: string,
  name: string,
  nameExtension?: string | null,
  numVisits: number,
  published: boolean,
  subjectIdentifier: string | number,
  urlName: string
}

export interface WorkspaceListType extends Array<WorkspaceType> {}

export default function workspaces(state: WorkspaceListType=[], action: ActionType): WorkspaceListType{
  if (action.type === 'UPDATE_WORKSPACES'){
    return <WorkspaceListType>action.payload;
  }
  return state;
}