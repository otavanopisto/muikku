import { ActionType } from "~/actions";
import {UserWithSchoolDataType} from '~/reducers/user-index';

export type UserStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";
export type UsersListType = Array<UserWithSchoolDataType>;  
export type StudyprogrammeListType= Array<EducationType>;


export interface EducationType {
  identifier: string,
  name: string
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