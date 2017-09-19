//This one also uses a hack to access the data in the dom
//please replace it with the following procedure
//1. Create a rest endpoint to get the permissions list
//2. in the main file gather those permissions... etc..., eg. index.ts make a call
//3. dispatch the action to this same reducer and gather the action here
//4. it works :D
import $ from "jquery";
import {ActionType} from "~/actions";

export default function status(state: StatusType={
  loggedIn: !!(<any>window).MUIKKU_LOGGED_USER_ID,
  userId: (<any>window).MUIKKU_LOGGED_USER_ID,
  permissions: (<any>window).MUIKKU_PERMISSIONS,
  contextPath: (<any>window).CONTEXTPATH
}, action: ActionType<any>): StatusType{
  if (action.type === "LOGOUT"){
    $('#logout').click();
    return state;
  }
  return state;
}

export interface StatusType {
  loggedIn: boolean,
  userId: string,
  permissions: any,
  contextPath: string
}