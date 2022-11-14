//This one also uses a hack to access the data in the dom
//please replace it with the following procedure
//1. Create a rest endpoint to get the permissions list
//2. in the main file gather those permissions... etc..., eg. index.ts make a call
//3. dispatch the action to this same reducer and gather the action here
//4. it works :D
import $ from "~/lib/jquery";
import { ActionType } from "~/actions";

/**
 * WhoAmIType
 */
export interface WhoAmIType {
  studyTimeEnd: string;
  studyTimeLeftStr: string;
  studyStartDate: string;
  studyEndDate: string;
  phoneNumbers: any;
  displayName: string;
  curriculumIdentifier: string;
  curriculumName: string;
  firstName: string;
  lastName: string;
  hasEvaluationFees: boolean;
  hasImage: boolean;
  id: number;
  /**
   * Whether user is active
   */
  isActive: boolean;
  /**
   * PYRAMUS-STAFF-XX or PYRAMUS-STUDENT-XX type identifier
   */
  identifier: string;
  organizationIdentifier: string;
  locale: string;
  nickName: string;
  isDefaultOrganization: boolean;
  permissions: string[];
  roles: string[];
  studyProgrammeName: string;
  studyProgrammeIdentifier: string;
  addresses: string;
  emails: string;
}

/**
 * StatusType
 */
export interface StatusType {
  loggedIn: boolean;
  userId: number;
  userSchoolDataIdentifier: string;
  permissions: any;
  contextPath: string;
  isActiveUser: boolean;
  role: Role;
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

/**
 * ProfileStatusType
 */
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
  studyProgrammeName: string;
  studyProgrammeIdentifier: string;
  permissions: string[];
  curriculumName: string;
}

export enum Role {
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  ADMINISTRATOR = "ADMINISTRATOR",
  MANAGER = "MANAGER",
  STUDY_PROGRAMME_LEADER = "STUDY_PROGRAMME_LEADER",
  STUDY_GUIDER = "STUDY_GUIDER",
  CUSTOM = "CUSTOM",
}

const workspaceIdNode = document.querySelector(
  'meta[name="muikku:workspaceId"]'
);
const roleNode = document.querySelector('meta[name="muikku:role"]');

// _MUIKKU_LOCALE should be taken from the html
/**
 * status
 * @param state state
 * @param action action
 */
export default function status(
  state: StatusType = {
    loggedIn: false, //whoami.id is checked if exists
    userId: null, // whoami.id
    userSchoolDataIdentifier: null, // whoami.identifier
    role: <Role>(
      document.querySelector('meta[name="muikku:role"]').getAttribute("value")
    ),
    permissions: {},
    contextPath: "", // always empty
    isActiveUser: false, // whoamI.isActive
    hasFees: false, // whoami.hasEvaluationFees
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
  switch (action.type) {
    case "LOGOUT": {
      // chat listens to this event to close the connection
      (window as any).ON_LOGOUT && (window as any).ON_LOGOUT();
      // remove the old session on logout
      window.sessionStorage.removeItem("strophe-bosh-session");
      // trigger the logout
      $("#logout").click();

      return {
        ...state,
      };
    }

    case "UPDATE_STATUS_PROFILE":
      return { ...state, profile: action.payload };

    case "UPDATE_STATUS_HAS_IMAGE":
      return {
        ...state,
        hasImage: action.payload,
        imgVersion: new Date().getTime(),
      };

    case "UPDATE_STATUS": {
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

    default:
      return state;
  }
}
