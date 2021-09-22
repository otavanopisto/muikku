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
  (): AnyActionType
}

async function loadWhoAMI(dispatch: (arg: AnyActionType) => any) {
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
      }
    },
  });
}

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

async function loadWorkspacePermissions(workspaceId: number, dispatch: (arg: AnyActionType) => any) {
  const permissions = <boolean>(await promisify(mApi().workspace.workspaces.permissions.read(workspaceId), 'callback')());

  dispatch({
    type: "UPDATE_STATUS",
    payload: {
      permissions: {

      }
    },
  });
}

const loadStatus: LoadStatusType = function loadStatus() {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    loadWhoAMI(dispatch);
    loadChatAvailable(dispatch);
    loadWorklistAvailable(dispatch);
    loadForumIsAvailable(dispatch);

    if (location.pathname.startsWith("/workspace/")) {
      const workspaceName = location.pathname.split("/")[2];

      const workspaceId = (await promisify(mApi().workspace.workspaces.basicInfo.read(workspaceName), 'callback')());

      //loadWorkspacePermissions();
    }
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

export default { logout, updateStatusProfile, updateStatusHasImage, loadStatus };
export { logout, updateStatusProfile, updateStatusHasImage, loadStatus };
