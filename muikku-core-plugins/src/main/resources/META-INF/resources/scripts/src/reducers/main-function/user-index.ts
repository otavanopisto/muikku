import { ActionType } from "~/actions";
import { WorkspaceType } from "~/reducers/main-function/index/workspaces";

export interface UserType {
  id: Number,
  firstName: string,
  lastName?: string | null,
  nickName?: string | null,
  studyProgrammeName?: string | null,
  hasImage: boolean,
  hasEvaluationFees: false,
  curriculumIdentifier?: string | number | null;
}

export interface UserIndexType {
  [index: number]: UserType
}

//TODO fix these anies
export interface WorkspaceRecepientType {
  type: "workspace",
  value: WorkspaceType
}

export interface UserRecepientType {
  type: "user",
  value: any        //TODO fix user and usergoup type
}

export interface UserGroupRecepientType {
  type: "usergroup",
  value: any
}

export default function userIndex(state={}, action: ActionType){
  if (action.type === "SET_USER_INDEX"){
    let prop:{[index: number]: UserType} = {};
    prop[action.payload.index] = action.payload.value;
    return Object.assign({}, state, prop);
  }
  return state;
}