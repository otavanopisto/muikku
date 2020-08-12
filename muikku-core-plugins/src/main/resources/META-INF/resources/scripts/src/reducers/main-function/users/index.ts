import { ActionType } from "~/actions";
import {UserWithSchoolDataType} from '~/reducers/user-index';
export type UserStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";
export type StudyprogrammeTypeStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";
export type UsersListType = Array<UserWithSchoolDataType>;
export type StudyprogrammeListType= Array<StudyprogrammeType>;

export interface StudyprogrammeTypes {
  list: StudyprogrammeListType,
  status: StudyprogrammeTypeStatusType
}

export interface StudyprogrammeType {
  identifier: string,
  name: string
}

export interface UserUpdateType {
  firstName: string,
  lastName: string,
  identifier: string,
  email: string,
  role: string,
  ssn?: string,
  studyProgrammeIdentifier?: string
}

export interface UsersType {
  students: UsersListType ,
  staff: UsersListType
}

// Do not delete, this is for organization

export default function users (state:UsersType={
  students: [],
  staff: [],
}, action: ActionType):UsersType{
  if (action.type === "UPDATE_STUDENT_USERS"){
    return Object.assign({}, state, {
      students: action.payload
    });
  } else if (action.type === "UPDATE_STAFF_USERS"){
    return Object.assign({}, state, {
      staff: action.payload
    });
  }
  return state;
}

// These are here, because they are needed in the creation of a new user.
// Not sure if they should actually be here, but changing their location is easy
// At the time of writing, it's only used when creating a user in the organization

export function studyprogrammes (state:StudyprogrammeTypes={
  list: [],
  status: "WAIT"
}, action: ActionType):StudyprogrammeTypes{
  if (action.type === "UPDATE_STUDYPROGRAMME_TYPES"){
    return Object.assign({}, state, {
      list: action.payload
    });
  }
  if (action.type === "UPDATE_STUDYPROGRAMME_STATUS_TYPE"){
    return Object.assign({}, state, {
      status: action.payload
    });
  }
  return state;
}

