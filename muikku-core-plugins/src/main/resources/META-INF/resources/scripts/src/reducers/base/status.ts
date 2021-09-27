//This one also uses a hack to access the data in the dom
//please replace it with the following procedure
//1. Create a rest endpoint to get the permissions list
//2. in the main file gather those permissions... etc..., eg. index.ts make a call
//3. dispatch the action to this same reducer and gather the action here
//4. it works :D
import $ from '~/lib/jquery';
import { ActionType } from "~/actions";
import equals = require("deep-equal");

export interface WhoAmIType {
  curriculumIdentifier: string;
  firstName: string;
  lastName: string;
  hasEvaluationFees: boolean;
  hasImage: boolean;
  id: number;
  organizationIdentifier: string;
  nickName: string;
  isDefaultOrganization: boolean;
  permissions: string[];
  roles: string[];
  studyProgrammeName: string;
}

export interface StatusType {
  loggedIn: boolean,
  userId: number,
  permissions: any,
  contextPath: string,
  userSchoolDataIdentifier: string,
  isActiveUser: boolean,
  isStudent: boolean,
  profile: ProfileStatusType,
  currentWorkspaceInfo?: {
    id: number;
    organizationEntityId: number;
    urlName: string;
    archived: boolean;
    name: string;
    nameExtension: string;
    description: string;
    numVisits: number;
    lastVisit: string;
    access: string;
    materialDefaultLicense: string;
    published: boolean;
    curriculumIdentifiers: string[];
    subjectIdentifier: string;
    hasCustomImage: boolean;
  },
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
// CHAT_AVAILABLE                   missing
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
// WORKLIST_AVAILABLE               missing
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

function inequalityChecker(a: any, b: any) {
  Object.keys(a).forEach((k) => {
    if (a[k] !== b[k]) {
      console.log(k, a[k], b[k]);
    }
  });

  Object.keys(b).forEach((k) => {
    if (a[k] !== b[k]) {
      console.log(k, a[k], b[k]);
    }
  });
}

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
  currentWorkspaceInfo: null,
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
  } else if (action.type === "UPDATE_STATUS") {

    const actionPayloadWoPermissions = {...action.payload};
    delete actionPayloadWoPermissions["permissions"];

    // TODO remove when JSF removed
    const stateBasedCloneWoPermissions: any = {};
    Object.keys(actionPayloadWoPermissions).forEach((k) => {
      stateBasedCloneWoPermissions[k] = (state as any)[k];
    });

    const permissionsBasedClone: any = {};
    Object.keys(action.payload.permissions || {}).forEach((k) => {
      permissionsBasedClone[k] = (state as any).permissions[k];
    });

    if (!equals(stateBasedCloneWoPermissions, actionPayloadWoPermissions, {strict: true})) {
      console.log(stateBasedCloneWoPermissions, actionPayloadWoPermissions);
      inequalityChecker(stateBasedCloneWoPermissions, actionPayloadWoPermissions);
      console.warn("Unequality with JSF and API value found");
    }

    if (!equals(action.payload.permissions || {}, permissionsBasedClone, {strict: true})) {
      console.log(permissionsBasedClone, action.payload.permissions);
      inequalityChecker(permissionsBasedClone, action.payload.permissions);
      console.warn("Unequality with JSF and API value found in permissions");
    }


    return { ...state, ...actionPayloadWoPermissions, permissions: {...state.permissions, ...action.payload.permissions} };
  }
  return state;
}
