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

// from whoami
// ANNOUNCER_CAN_PUBLISH_ENVIRONMENT
// ANNOUNCER_CAN_PUBLISH_GROUPS
// ANNOUNCER_CAN_PUBLISH_WORKSPACES
// ANNOUNCER_TOOL
// CHAT_AVAILABLE
// COMMUNICATOR_GROUP_MESSAGING
// COMMUNICATOR_WORKSPACE_MESSAGING
// EVALUATION_VIEW_INDEX
// FORUM_ACCESSENVIRONMENTFORUM
// FORUM_CREATEENVIRONMENTFORUM
// FORUM_DELETEENVIRONMENTFORUM
// FORUM_LOCK_STICKY_PERMISSION
// FORUM_SHOW_FULL_NAME_PERMISSION
// FORUM_UPDATEENVIRONMENTFORUM
// GUIDER_VIEW
// ORGANIZATION_VIEW
// TRANSCRIPT_OF_RECORDS_VIEW
// WORKLIST_AVAILABLE
// AREA_PERMISSIONS                 missing

// from /workspace/workspaces/123/permissions 
// WORKSPACE_ACCESS_EVALUATION: true
// WORKSPACE_ANNOUNCER_TOOL: true
// WORKSPACE_CAN_PUBLISH: true
// WORKSPACE_DELETE_FORUM_THREAD: true
// WORKSPACE_DISCUSSIONS_VISIBLE: true
// WORKSPACE_GUIDES_VISIBLE: true
// WORKSPACE_HOME_VISIBLE: true
// WORKSPACE_IS_WORKSPACE_STUDENT: false
// WORKSPACE_JOURNAL_VISIBLE: true
// WORKSPACE_LIST_WORKSPACE_ANNOUNCEMENTS: true
// WORKSPACE_MANAGE_PERMISSIONS: true
// WORKSPACE_MANAGE_WORKSPACE: true
// WORKSPACE_MANAGE_WORKSPACE_DETAILS: true
// WORKSPACE_MANAGE_WORKSPACE_FRONTPAGE: true
// WORKSPACE_MANAGE_WORKSPACE_HELP: true
// WORKSPACE_MANAGE_WORKSPACE_MATERIALS: true
// WORKSPACE_MATERIALS_VISIBLE: true
// WORKSPACE_REQUEST_WORKSPACE_ASSESSMENT: false
// WORKSPACE_SIGNUP: false
// WORKSPACE_USERS_VISIBLE: true
// WORKSPACE_VIEW_WORKSPACE_DETAILS: true
// WORSKPACE_LIST_WORKSPACE_MEMBERS: true

// _MUIKKU_LOCALE should be taken from the html
export default function status(state: StatusType = {
  loggedIn: !!(<any>window).MUIKKU_LOGGED_USER_ID,    //whoami.id
  userId: (<any>window).MUIKKU_LOGGED_USER_ID,     // whoami.id
  permissions: (<any>window).MUIKKU_PERMISSIONS,    
  contextPath: (<any>window).CONTEXTPATH,   // always empty
  userSchoolDataIdentifier: (<any>window).MUIKKU_LOGGED_USER, // missing
  isActiveUser: (<any>window).MUIKKU_IS_ACTIVE_USER, // missing
  profile: (<any>window).PROFILE_DATA,
  isStudent: (<any>window).MUIKKU_IS_STUDENT, // check if roles contain STUDENT
  currentWorkspaceId: (<any>window).WORKSPACE_ID, // missing, different endpoint required, will require workspace path as parameter
  currentWorkspaceName: (<any>window).WORKSPACE_NAME, // missing, different endpoint required
  hasImage: false,
  imgVersion: (new Date()).getTime(),
  hopsEnabled: (<any>window).HOPS_ENABLED // /user/property/hops.enabled
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
