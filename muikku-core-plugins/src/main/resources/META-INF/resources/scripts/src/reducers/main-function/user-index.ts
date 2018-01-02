import { ActionType } from "~/actions";
import { WorkspaceType } from "~/reducers/main-function/index/workspaces";

export interface UserType {
  id: Number,
  firstName: string,
  lastName?: string,
  nickName?: string,
  studyProgrammeName?: string,
  hasImage: boolean,
  hasEvaluationFees: false,
  curriculumIdentifier?: string;
}

export interface UserWithSchoolDataType {
  curriculumIdentifier?: string,
  email: string,
  firstName: string,
  hasImage: boolean,
  id: string,
  language?: string,
  lastName?: string,
  municipality?: string,
  nationality?: string,
  nickName?: string,
  school?: string,
  studyEndDate?: string,
  studyProgrammeName?: string,
  studyStartDate?: string,
  studyTimeEnd?: string,
  updatedByStudent: boolean
}

export interface UserGroupType {
  id: number,
  name: string,
  userCount: number
}

export interface UserGroupListType extends Array<UserGroupType> {}

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

export interface UsersBySchoolDataType {
  [index: string]: UserType
}

export interface UserIndexType {
  users: UserBaseIndexType,
  groups: UserGroupBaseIndexType,
  usersBySchoolData: UsersBySchoolDataType
}

export default function userIndex(state:UserIndexType={
  users: {},
  groups: {},
  usersBySchoolData: {}
}, action: ActionType):UserIndexType{
  if (action.type === "SET_USER_INDEX"){
    let prop:{[index: number]: UserType} = {};
    prop[action.payload.index] = action.payload.value;
    return Object.assign({}, state, {users: Object.assign({}, state.users, prop)});
  } else if (action.type === "SET_USER_GROUP_INDEX"){
    let prop:{[index: number]: any} = {}; //TODO change to the user group type
    prop[action.payload.index] = action.payload.value;
    return Object.assign({}, state, {groups: Object.assign({}, state.groups, prop)});
  } else if (action.type === "SET_USER_BY_SCHOOL_DATA_INDEX"){
    let prop:{[index: string]: UserType} = {};
    prop[action.payload.index] = action.payload.value;
    return Object.assign({}, state, {usersBySchoolData: Object.assign({}, state.groups, prop)});
  }
  return state;
}