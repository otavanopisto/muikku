import {WorkspaceType} from "~/reducers";
import {ActionType} from "~/actions";

export default function lastWorkspace (state: WorkspaceType=null, action: ActionType): WorkspaceType{
  if (action.type === 'UPDATE_LAST_WORKSPACE'){
    return action.payload;
  }
  return state;
}