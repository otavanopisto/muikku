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

export interface UserBaseIndexType {
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
  value: any      //TODO fix here too
}

export interface UserGroupBaseIndexType {
  [index: number]: any    //TODO and fix here
}

export interface UserIndexType {
  users: UserBaseIndexType,
  groups: UserGroupBaseIndexType
}

export default function userIndex(state:UserIndexType={
  users: {},
  groups: {}
}, action: ActionType):UserIndexType{
  if (action.type === "SET_USER_INDEX"){
    let prop:{[index: number]: UserType} = {};
    prop[action.payload.index] = action.payload.value;
    return Object.assign({}, state, {users: Object.assign({}, state.users, prop)});
  } else if (action.type === "SET_USER_GROUP_INDEX"){
    let prop:{[index: number]: any} = {};
    prop[action.payload.index] = action.payload.value;
    return Object.assign({}, state, {groups: Object.assign({}, state.groups, prop)});
  }
  return state;
}