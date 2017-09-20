import {WorkspaceListType} from "~/reducers";
import {ActionType} from '~/actions';

export default function workspaces(state: WorkspaceListType=[], action: ActionType<any>): WorkspaceListType{
  if (action.type === 'UPDATE_WORKSPACES'){
    return <WorkspaceListType>action.payload;
  }
  return state;
}