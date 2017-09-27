import {ActionType} from "~/actions";

//TODO not sure the structure of this
export interface LastWorkspaceType {
  workspaceName: string,
  materialName: string,
  url: string
}

export default function lastWorkspace (state: LastWorkspaceType=null, action: ActionType): LastWorkspaceType{
  if (action.type === 'UPDATE_LAST_WORKSPACE'){
    return action.payload;
  }
  return state;
}