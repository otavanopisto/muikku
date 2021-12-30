//This one also uses a hack to access the data in the dom
//please replace it with the following procedure
//1. Create a rest endpoint to get the permissions list
//2. in the main file gather those permissions... etc..., eg. index.ts make a call
//3. dispatch the action to this same reducer and gather the action here
//4. it works :D
import $ from "~/lib/jquery";
import { ActionType } from "~/actions";

export interface WhoAmIType {
  studyTimeEnd: string;
  studyTimeLeftStr: string;
  studyStartDate: string;
  studyEndDate: string;
  phoneNumbers: any;
  displayName: string;
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
  addresses: string;
  emails: string;
}

export interface StatusType {
  loggedIn: boolean;
  userId: number;
  permissions: any;
  contextPath: string;
  userSchoolDataIdentifier: string;
  isActiveUser: boolean;
  isStudent: boolean;
  hasFees: boolean;
  profile: ProfileStatusType;
  currentWorkspaceInfo?: {
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
  };
  canCurrentWorkspaceSignup: boolean;
  hasImage: boolean;
  imgVersion: number;
  hopsEnabled: boolean;
  currentWorkspaceId: number;
}

export interface ProfileStatusType {
  displayName: string;
  loggedUserName: string;
  emails: Array<string>;
  addresses: Array<string>;
  phoneNumbers: Array<string>;
  studyTimeLeftStr: string;
  studyStartDate: string;
  studyEndDate: string;
  studyTimeEnd: string;
}

const workspaceIdNode = document.querySelector(
  'meta[name="muikku:workspaceId"]'
);
const roleNode = document.querySelector('meta[name="muikku:role"]');

// _MUIKKU_LOCALE should be taken from the html
export default function status(
  state: StatusType = {
    loggedIn: JSON.parse(
      document
        .querySelector('meta[name="muikku:loggedIn"]')
        .getAttribute("value")
    ), //whoami.id
    userId:
      parseInt(
        document
          .querySelector('meta[name="muikku:loggedUserId"]')
          .getAttribute("value")
      ) || null, // whoami.id
    permissions: {},
    contextPath: "", // always empty
    userSchoolDataIdentifier: document
      .querySelector('meta[name="muikku:loggedUser"]')
      .getAttribute("value"), // missing
    isActiveUser: JSON.parse(
      document
        .querySelector('meta[name="muikku:activeUser"]')
        .getAttribute("value")
    ), // missing
    hasFees: JSON.parse(
      document
        .querySelector('meta[name="muikku:hasFees"]')
        .getAttribute("value")
    ),
    profile: null,
    isStudent: roleNode.getAttribute("value") === "STUDENT", // check if roles contain STUDENT
    currentWorkspaceInfo: null,
    hasImage: false,
    imgVersion: new Date().getTime(),
    currentWorkspaceId:
      (workspaceIdNode && parseInt(workspaceIdNode.getAttribute("value"))) ||
      null,
    canCurrentWorkspaceSignup: false,
    hopsEnabled: false, // /user/property/hops.enabled
  },
  action: ActionType
): StatusType {
  if (action.type === "LOGOUT") {
    // chat listens to this event to close the connection
    (window as any).ON_LOGOUT && (window as any).ON_LOGOUT();
    // remove the old session on logout
    window.sessionStorage.removeItem("strophe-bosh-session");
    // trigger the logout
    $("#logout").click();
    return state;
  } else if (action.type === "UPDATE_STATUS_PROFILE") {
    return { ...state, profile: action.payload };
  } else if (action.type === "UPDATE_STATUS_HAS_IMAGE") {
    return {
      ...state,
      hasImage: action.payload,
      imgVersion: new Date().getTime(),
    };
  } else if (action.type === "UPDATE_STATUS") {
    const actionPayloadWoPermissions = { ...action.payload };
    delete actionPayloadWoPermissions["permissions"];

    // TODO remove when JSF removed
    const stateBasedCloneWoPermissions: any = {};
    Object.keys(actionPayloadWoPermissions).forEach((k) => {
      stateBasedCloneWoPermissions[k] = (state as any)[k];
    });

    const permissionsBasedClone: any = {};
    Object.keys(action.payload.permissions || {}).forEach((k) => {
      permissionsBasedClone[k] = (state as any).permissions[k];
    });

    return {
      ...state,
      ...actionPayloadWoPermissions,
      permissions: { ...state.permissions, ...action.payload.permissions },
    };
  }
  return state;
}
