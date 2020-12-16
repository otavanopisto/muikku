import { ActionType } from "~/actions";
import { WorkspaceType } from "~/reducers/workspaces";
export type ManipulateType = "UPDATE" | "CREATE";

export interface ManipulateStudentType {
  id?: string,
  firstName: string,
  lastName: string,
  studyProgrammeIdentifier: string,
  email: string,
  gender?: "MALE" | "FEMALE" | "OTHER",
  ssn?: string
}

export interface ManipulateStaffmemberType {
  id? : string
  firstName: string,
  lastName: string,
  email: string,
  role: string
 }


export interface UserType {
  id: number,
  firstName: string,
  lastName?: string,
  nickName?: string,
  studyProgrammeName?: string,
  hasImage?: boolean,
  hasEvaluationFees?: false,
  curriculumIdentifier?: string,
  organizationIdentifier?: string,

  //EXTENDED VALUES, may or may not be available
  email?: string,
  language?: string,
  municipality?: string,
  nationality?: string,
  school?: string,
  studyStartDate?: string,
  studyTimeEnd?: string,
  lastLogin?: string
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
  lastLogin?: string,
  updatedByStudent: boolean,
  userEntityId: number
}

export interface OrganizationType {
  id: number,
  name: string
}

export interface UserGroupType {
  id: number,
  name: string,
  userCount: number,
  organization?: OrganizationType
}

export interface UserStaffType {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  properties: any,
  userEntityId: number
}

export interface ShortWorkspaceUserWithActiveStatusType {
  workspaceUserEntityId: number,
  userEntityId: number,
  firstName: string,
  nickName?: string,
  lastName: string,
  studyProgrammeName: string,
  active: boolean,
  hasImage: boolean
}

export type UserGroupListType = Array<UserGroupType>;

export interface UserBaseIndexType {
  [index: number]: UserType
}

export type ContactRecepientType = WorkspaceRecepientType | UserRecepientType  | UserGroupRecepientType | StaffRecepientType;

export interface WorkspaceRecepientType {
  type: "workspace",
  value: WorkspaceType
}

export interface UserRecepientType {
  type: "user",
  value: UserType
}

export interface UserGroupRecepientType {
  type: "usergroup",
  value: UserGroupType
}

export interface StaffRecepientType {
  type: "staff",
  value: UserStaffType
}

export interface UserGroupBaseIndexType {
  [index: number]: UserGroupType
}

export interface UsersBySchoolDataType {
  [index: string]: UserType
}

export interface UserIndexType {
  users: UserBaseIndexType,
  groups: UserGroupBaseIndexType,
  usersBySchoolData: UsersBySchoolDataType
}

export interface UserFileType {
  id: number,
  userEntityId: number,
  fileName: string,
  contentType: string,
  title: string,
  description: string,
  archived: boolean
}

export interface StudentUserProfileEmailType {
  studentIdentifier: string,
  type: string,
  address: string,
  defaultAddress: boolean
}

export interface StudentUserProfilePhoneType {
  studentIdentifier: string,
  type: string,
  number: string,
  defaultNumber: boolean
}

export interface StudentUserAddressType {
  identifier: string,
  studentIdentifier: string,
  street: string,
  postalCode: string,
  city: string,
  region: string,
  country: string,
  type: string,
  defaultAddress: boolean
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
    return Object.assign({}, state, {usersBySchoolData: Object.assign({}, state.usersBySchoolData, prop)});
  }

  return state;
}
