import { AnyActionType, SpecificActionType } from '~/actions';
import mApi from '~/lib/mApi';
import { StateType } from '~/reducers';
import { ProfileStatusType, StatusType, WhoAmIType } from '~/reducers/base/status';
import promisify from '~/util/promisify';

export interface LOGOUT extends SpecificActionType<"LOGOUT", null> { }
export interface UPDATE_STATUS_PROFILE extends SpecificActionType<"UPDATE_STATUS_PROFILE", ProfileStatusType> { }
export interface UPDATE_STATUS_HAS_IMAGE extends SpecificActionType<"UPDATE_STATUS_HAS_IMAGE", boolean> { }
export interface UPDATE_STATUS extends SpecificActionType<"UPDATE_STATUS", Partial<StatusType>> { }

export interface LoadStatusType {
  (whoAmIReadyCb: () => void): AnyActionType
}

export interface LoadWorkspaceStatusInfoType {
  (readyCb: () => void): AnyActionType
}

async function loadWhoAMI(dispatch: (arg: AnyActionType) => any, whoAmIReadyCb: () => void) {
  const whoAmI = <WhoAmIType>(await promisify(mApi().user.whoami.read(), 'callback')());

  dispatch({
    type: "UPDATE_STATUS",
    payload: {
      loggedIn: !!whoAmI.id,
      userId: whoAmI.id,
      hasImage: whoAmI.hasImage,
      permissions: {
        ANNOUNCER_CAN_PUBLISH_ENVIRONMENT: whoAmI.permissions.includes("CREATE_ANNOUNCEMENT"),
        ANNOUNCER_CAN_PUBLISH_GROUPS: whoAmI.permissions.includes("CREATE_ANNOUNCEMENT"),
        ANNOUNCER_CAN_PUBLISH_WORKSPACES: true,
        ANNOUNCER_TOOL: whoAmI.permissions.includes("ANNOUNCER_TOOL"),
        COMMUNICATOR_GROUP_MESSAGING: whoAmI.permissions.includes("COMMUNICATOR_GROUP_MESSAGING"),
        EVALUATION_VIEW_INDEX: whoAmI.permissions.includes("ACCESS_EVALUATION"),
        FORUM_LOCK_STICKY_PERMISSION: whoAmI.permissions.includes("FORUM_LOCK_OR_STICKIFY_MESSAGES"),
        FORUM_SHOW_FULL_NAME_PERMISSION: whoAmI.permissions.includes("FORUM_SHOW_FULL_NAMES"),
        FORUM_UPDATEENVIRONMENTFORUM: whoAmI.permissions.includes("FORUM_UPDATEENVIRONMENTFORUM"),
        GUIDER_VIEW: whoAmI.permissions.includes("GUIDER_VIEW"),
        ORGANIZATION_VIEW: whoAmI.permissions.includes("ORGANIZATION_VIEW"),
        TRANSCRIPT_OF_RECORDS_VIEW: whoAmI.permissions.includes("TRANSCRIPT_OF_RECORDS_VIEW"),
      },
      profile: {
        addresses: (whoAmI.addresses && JSON.parse(whoAmI.addresses)) || [],
        emails: (whoAmI.emails && JSON.parse(whoAmI.emails)) || [],
        displayName: whoAmI.displayName,
        loggedUserName: whoAmI.displayName,
        phoneNumbers: (whoAmI.phoneNumbers && JSON.parse(whoAmI.phoneNumbers)) || [],
        studyEndDate: whoAmI.studyEndDate,
        studyStartDate: whoAmI.studyStartDate,
        studyTimeEnd: whoAmI.studyTimeEnd,
        studyTimeLeftStr: whoAmI.studyTimeLeftStr,
      },
    },
  });

  whoAmIReadyCb();
}

// User has set nickname for chat and activated the chat funtionality via profile view
async function loadChatActive(dispatch: (arg: AnyActionType) => any) {
  const isActive = <boolean>(await promisify(mApi().chat.isActive.read(), 'callback')());

  dispatch({
    type: "UPDATE_STATUS",
    payload: {
      permissions: {
        CHAT_ACTIVE: isActive,
      }
    },
  });
}

// User is loggedin and is part of default organization that has access to chat
async function loadChatAvailable(dispatch: (arg: AnyActionType) => any) {
  const isAvailable = <boolean>(await promisify(mApi().chat.isAvailable.read(), 'callback')());

  dispatch({
    type: "UPDATE_STATUS",
    payload: {
      permissions: {
        CHAT_AVAILABLE: isAvailable,
      }
    },
  });
}

async function loadWorklistAvailable(dispatch: (arg: AnyActionType) => any) {
  const isAvailable = <boolean>(await promisify(mApi().worklist.isAvailable.read(), 'callback')());

  dispatch({
    type: "UPDATE_STATUS",
    payload: {
      permissions: {
        WORKLIST_AVAILABLE: isAvailable,
      }
    },
  });
}

async function loadForumIsAvailable(dispatch: (arg: AnyActionType) => any) {
  const isAvailable = <boolean>(await promisify(mApi().forum.isAvailable.read(), 'callback')());
  const areaPermissions = isAvailable ? <any>(await promisify(mApi().forum.environmentAreaPermissions.read(), 'callback')()) : null;

  dispatch({
    type: "UPDATE_STATUS",
    payload: {
      permissions: {
        FORUM_ACCESSENVIRONMENTFORUM: isAvailable,
        FORUM_CREATEENVIRONMENTFORUM: isAvailable,
        FORUM_DELETEENVIRONMENTFORUM: isAvailable,
        AREA_PERMISSIONS: areaPermissions,
      }
    },
  });
}

async function loadHopsEnabled(dispatch: (arg: AnyActionType) => any) {
  const value = <any>(await promisify(mApi().user.property.read("hops.enabled"), 'callback')());

  dispatch({
    type: "UPDATE_STATUS",
    payload: {
      hopsEnabled: value.value,
    },
  });
}

async function loadWorkspacePermissions(workspaceId: number, dispatch: (arg: AnyActionType) => any, readyCb: () => void) {
  const permissions = <string[]>(await promisify(mApi().workspace.workspaces.permissions.read(workspaceId), 'callback')());
  const canCurrentWorkspaceSignup = <boolean>(await promisify(mApi().coursepicker.workspaces.canSignup.read(workspaceId), 'callback')())

  dispatch({
    type: "UPDATE_STATUS",
    payload: {
      permissions: {
        WORKSPACE_ACCESS_EVALUATION: permissions.includes("ACCESS_WORKSPACE_EVALUATION"),
        WORKSPACE_ANNOUNCER_TOOL: permissions.includes("WORKSPACE_ANNOUNCER_TOOL"),
        WORKSPACE_CAN_PUBLISH: permissions.includes("PUBLISH_WORKSPACE"),
        WORKSPACE_DELETE_FORUM_THREAD: permissions.includes("FORUM_DELETE_WORKSPACE_MESSAGES"),
        WORKSPACE_DISCUSSIONS_VISIBLE: permissions.includes("FORUM_ACCESSWORKSPACEFORUMS"),
        WORKSPACE_GUIDES_VISIBLE: true,
        WORKSPACE_HOME_VISIBLE: true,
        WORKSPACE_IS_WORKSPACE_STUDENT: permissions.includes("IS_WORKSPACE_STUDENT"),
        WORKSPACE_JOURNAL_VISIBLE: permissions.includes("ACCESS_WORKSPACE_JOURNAL"),
        WORKSPACE_LIST_WORKSPACE_ANNOUNCEMENTS: permissions.includes("LIST_WORKSPACE_ANNOUNCEMENTS"),
        WORKSPACE_MANAGE_PERMISSIONS: permissions.includes("WORKSPACE_MANAGE_PERMISSIONS"),
        WORKSPACE_MANAGE_WORKSPACE: permissions.includes("MANAGE_WORKSPACE"),
        WORKSPACE_MANAGE_WORKSPACE_DETAILS: permissions.includes("MANAGE_WORKSPACE_DETAILS"),
        WORKSPACE_MANAGE_WORKSPACE_FRONTPAGE: permissions.includes("MANAGE_WORKSPACE_FRONTPAGE"),
        WORKSPACE_MANAGE_WORKSPACE_HELP: permissions.includes("MANAGE_WORKSPACE_HELP"),
        WORKSPACE_MANAGE_WORKSPACE_MATERIALS: permissions.includes("MANAGE_WORKSPACE_MATERIALS"),
        WORKSPACE_MATERIALS_VISIBLE: true,
        WORKSPACE_REQUEST_WORKSPACE_ASSESSMENT: permissions.includes("REQUEST_WORKSPACE_ASSESSMENT"),
        WORKSPACE_SIGNUP: permissions.includes("WORKSPACE_SIGNUP"),
        WORKSPACE_USERS_VISIBLE: permissions.includes("MANAGE_WORKSPACE_MEMBERS"),
        WORKSPACE_VIEW_WORKSPACE_DETAILS: permissions.includes("VIEW_WORKSPACE_DETAILS"),
        WORSKPACE_LIST_WORKSPACE_MEMBERS: permissions.includes("LIST_WORKSPACE_MEMBERS"),
      },
      canCurrentWorkspaceSignup,
    },
  });

  readyCb();
}

const loadStatus: LoadStatusType = function loadStatus(whoAmIReadyCb: () => void) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    loadWhoAMI(dispatch, whoAmIReadyCb);
    loadChatActive(dispatch);
    loadChatAvailable(dispatch);
    loadWorklistAvailable(dispatch);
    loadForumIsAvailable(dispatch);
    loadHopsEnabled(dispatch);
  }
}

const loadWorkspaceStatus: LoadWorkspaceStatusInfoType = function loadWorkspaceStatusInfo(readyCb: () => void) {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    const worspaceId = getState().status.currentWorkspaceId;
    loadWorkspacePermissions(worspaceId, dispatch, readyCb);
  }
}

export interface LogoutTriggerType {
  (): LOGOUT
}

export interface UpdateStatusProfileTriggerType {
  (profile: ProfileStatusType): UPDATE_STATUS_PROFILE
}

export interface UpdateStatusHasImageTriggerType {
  (value: boolean): UPDATE_STATUS_HAS_IMAGE
}

let logout: LogoutTriggerType = function logout() {
  return {
    type: 'LOGOUT',
    payload: null
  }
}

let updateStatusProfile: UpdateStatusProfileTriggerType = function updateStatusProfile(profile) {
  return {
    type: 'UPDATE_STATUS_PROFILE',
    payload: profile
  }
}

let updateStatusHasImage: UpdateStatusHasImageTriggerType = function updateStatusHasImage(value) {
  return {
    type: 'UPDATE_STATUS_HAS_IMAGE',
    payload: value
  }
}

export default { logout, updateStatusProfile, updateStatusHasImage, loadStatus, loadWorkspaceStatus };
export { logout, updateStatusProfile, updateStatusHasImage, loadStatus, loadWorkspaceStatus };
