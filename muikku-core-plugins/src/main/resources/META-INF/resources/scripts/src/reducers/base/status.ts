//This one also uses a hack to access the data in the dom
//please replace it with the following procedure
//1. Create a rest endpoint to get the permissions list
//2. in the main file gather those permissions... etc..., eg. index.ts make a call
//3. dispatch the action to this same reducer and gather the action here
//4. it works :D
import $ from '~/lib/jquery';
import { ActionType } from "~/actions";

export interface StatusType {
  loggedIn: boolean,
  userId: number,
  permissions: any,
  contextPath: string,
  userSchoolDataIdentifier: string,
  isActiveUser: boolean,
  isStudent: boolean,
  profile: ProfileStatusType,
  currentWorkspaceId?: number,
  currentWorkspaceName?: string,
  hasImage: boolean,
  imgVersion: number,
  hopsEnabled: boolean
}

export interface ProfileStatusType {
  displayName: string,
  loggedUserName: string,
  emails: Array<string>,
  addresses: Array<string>,
  phoneNumbers: Array<string>,
  studyTimeLeftStr: string,
  studyStartDate: string,
  studyEndDate: string,
  studyTimeEnd: string
}

export default function status(state: StatusType = {
  loggedIn: !!(<any>window).MUIKKU_LOGGED_USER_ID,
  userId: (<any>window).MUIKKU_LOGGED_USER_ID,
  permissions: (<any>window).MUIKKU_PERMISSIONS,
  contextPath: (<any>window).CONTEXTPATH,
  userSchoolDataIdentifier: (<any>window).MUIKKU_LOGGED_USER,
  isActiveUser: (<any>window).MUIKKU_IS_ACTIVE_USER,
  profile: (<any>window).PROFILE_DATA,
  isStudent: (<any>window).MUIKKU_IS_STUDENT,
  currentWorkspaceId: (<any>window).WORKSPACE_ID,
  currentWorkspaceName: (<any>window).WORKSPACE_NAME,
  hasImage: false,
  imgVersion: (new Date()).getTime(),
  hopsEnabled: (<any>window).HOPS_ENABLED
}, action: ActionType): StatusType {
  if (action.type === "LOGOUT") {
    // chat listens to this event to close the connection
    (window as any).ON_LOGOUT && (window as any).ON_LOGOUT();
    // remove the old session on logout
    window.sessionStorage.removeItem("strophe-bosh-session");
    // trigger the logout
    $('#logout').click();
    return state;
  } else if (action.type === "UPDATE_STATUS_PROFILE") {
    return { ...state, profile: action.payload };
  } else if (action.type === "UPDATE_STATUS_HAS_IMAGE") {
    return { ...state, hasImage: action.payload, imgVersion: (new Date()).getTime() };
  }
  return state;
}
