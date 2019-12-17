import { ActionType } from "~/actions";
import { WorkspaceType } from "~/reducers/main-function/workspaces";
import {UserType} from '~/reducers/main-function/user-index';

export type UserStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";
export type UsersListType = Array<UserType>;  

export interface UsersType {
  students: UsersListType ,
  staff: UsersListType,
}

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