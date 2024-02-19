import { Dispatch } from "react-redux";
import { AnyActionType, SpecificActionType } from "~/actions";
import MApi from "~/api/api";
import { StateType } from "~/reducers";
import { ProfileStatusType, StatusType } from "~/reducers/base/status";
import { WorkspaceBasicInfo } from "~/generated/client";
import { Role } from "~/generated/client";

export type LOGOUT = SpecificActionType<"LOGOUT", null>;
export type UPDATE_STATUS_PROFILE = SpecificActionType<
  "UPDATE_STATUS_PROFILE",
  ProfileStatusType
>;
export type UPDATE_STATUS_HAS_IMAGE = SpecificActionType<
  "UPDATE_STATUS_HAS_IMAGE",
  boolean
>;
export type UPDATE_STATUS = SpecificActionType<
  "UPDATE_STATUS",
  Partial<StatusType>
>;

export type UPDATE_STATUS_WORKSPACE_PERMISSIONS = SpecificActionType<
  "UPDATE_STATUS_WORKSPACE_PERMISSIONS",
  Partial<StatusType>
>;

export type UPDATE_STATUS_WORKSPACEID = SpecificActionType<
  "UPDATE_STATUS_WORKSPACEID",
  number
>;

/**
 * LoadStatusType
 */
export interface LoadStatusType {
  (whoAmIReadyCb: () => void): AnyActionType;
}

/**
 * LoadWorkspaceStatusInfoType
 */
export interface LoadWorkspaceStatusInfoType {
  (readyCb: () => void): AnyActionType;
}

/**
 * LoadWorkspaceStatusInfoType
 */
export interface LoadEnviromentalForumAreaPermissionsType {
  (): AnyActionType;
}

/**
 * loadWhoAMI
 * @param dispatch dispatch
 * @param whoAmIReadyCb whoAmIReadyCb
 */
async function loadWhoAMI(
  dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
  whoAmIReadyCb: () => void
) {
  const userApi = MApi.getUserApi();

  const whoAmI = await userApi.getWhoAmI();

  dispatch({
    type: "UPDATE_STATUS",
    payload: {
      loggedIn: !!whoAmI.id,
      userId: whoAmI.id,
      hasImage: whoAmI.hasImage,
      hasFees: whoAmI.hasEvaluationFees,
      isActiveUser: whoAmI.isActive,
      roles: whoAmI.roles,
      isStudent: whoAmI.roles.includes(Role.Student),
      userSchoolDataIdentifier: whoAmI.identifier,
      services: whoAmI.services,
      permissions: {
        ANNOUNCER_CAN_PUBLISH_ENVIRONMENT: whoAmI.permissions.includes(
          "CREATE_ANNOUNCEMENT"
        ),
        ANNOUNCER_CAN_PUBLISH_GROUPS: whoAmI.permissions.includes(
          "CREATE_ANNOUNCEMENT"
        ),
        ANNOUNCER_CAN_PUBLISH_WORKSPACES: true,
        ANNOUNCER_TOOL: whoAmI.permissions.includes("ANNOUNCER_TOOL"),
        COMMUNICATOR_GROUP_MESSAGING: whoAmI.permissions.includes(
          "COMMUNICATOR_GROUP_MESSAGING"
        ),
        EVALUATION_VIEW_INDEX: whoAmI.permissions.includes("ACCESS_EVALUATION"),
        FORUM_LOCK_STICKY_PERMISSION: whoAmI.permissions.includes(
          "FORUM_LOCK_OR_STICKIFY_MESSAGES"
        ),
        FORUM_SHOW_FULL_NAME_PERMISSION: whoAmI.permissions.includes(
          "FORUM_SHOW_FULL_NAMES"
        ),
        FORUM_UPDATEENVIRONMENTFORUM: whoAmI.permissions.includes(
          "FORUM_UPDATEENVIRONMENTFORUM"
        ),
        GUARDIAN_VIEW: whoAmI.permissions.includes("GUARDIAN_VIEW"),
        GUIDER_VIEW: whoAmI.permissions.includes("GUIDER_VIEW"),
        ORGANIZATION_VIEW: whoAmI.permissions.includes("ORGANIZATION_VIEW"),
        TRANSCRIPT_OF_RECORDS_VIEW: whoAmI.permissions.includes(
          "TRANSCRIPT_OF_RECORDS_VIEW"
        ),
        LIST_USER_ORDERS: whoAmI.permissions.includes("LIST_USER_ORDERS"),
        FIND_ORDER: whoAmI.permissions.includes("FIND_ORDER"),
        REMOVE_ORDER: whoAmI.permissions.includes("REMOVE_ORDER"),
        CREATE_ORDER: whoAmI.permissions.includes("CREATE_ORDER"),
        PAY_ORDER: whoAmI.permissions.includes("PAY_ORDER"),
        LIST_PRODUCTS: whoAmI.permissions.includes("LIST_PRODUCTS"),
        COMPLETE_ORDER: whoAmI.permissions.includes("COMPLETE_ORDER"),
        CHAT_ACTIVE: whoAmI.services.chat.isActive,
        CHAT_AVAILABLE: whoAmI.services.chat.isAvailable,
        FORUM_ACCESSENVIRONMENTFORUM: whoAmI.permissions.includes(
          "FORUM_ACCESSENVIRONMENTFORUM"
        ),
        FORUM_CREATEENVIRONMENTFORUM: whoAmI.permissions.includes(
          "FORUM_CREATEENVIRONMENTFORUM"
        ),
        FORUM_DELETEENVIRONMENTFORUM: whoAmI.permissions.includes(
          "FORUM_DELETEENVIRONMENTFORUM"
        ),
        WORKLIST_AVAILABLE: whoAmI.services.worklist.isAvailable,
      },
      profile: {
        addresses: (whoAmI.addresses && JSON.parse(whoAmI.addresses)) || [],
        emails: (whoAmI.emails && JSON.parse(whoAmI.emails)) || [],
        displayName: whoAmI.displayName,
        loggedUserName: whoAmI.displayName,
        phoneNumbers:
          (whoAmI.phoneNumbers && JSON.parse(whoAmI.phoneNumbers)) || [],
        studyEndDate: whoAmI.studyEndDate,
        studyStartDate: whoAmI.studyStartDate,
        studyTimeEnd: whoAmI.studyTimeEnd,
        studyTimeLeftStr: whoAmI.studyTimeLeftStr,
        permissions: whoAmI.permissions,
        studyProgrammeName: whoAmI.studyProgrammeName,
        studyProgrammeIdentifier: whoAmI.studyProgrammeIdentifier,
        curriculumName: whoAmI.curriculumName,
      },
    },
  });

  dispatch({
    type: "LOCALE_UPDATE",
    payload: whoAmI.locale,
  });

  whoAmIReadyCb();
}

/**
 * loadWorkspacePermissions
 * @param workspaceId workspaceId
 * @param dispatch dispatch
 * @param readyCb readyCb
 */
async function loadWorkspacePermissions(
  workspaceId: number,
  dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
  readyCb: () => void
) {
  const workspaceApi = MApi.getWorkspaceApi();
  const coursepickerApi = MApi.getCoursepickerApi();

  const permissions = await workspaceApi.getWorkspacePermissions({
    workspaceEntityId: workspaceId,
  });

  const canCurrentWorkspaceSignup = await coursepickerApi.workspaceCanSignUp({
    workspaceId,
  });

  dispatch({
    type: "UPDATE_STATUS_WORKSPACE_PERMISSIONS",
    payload: {
      permissions: {
        WORKSPACE_ACCESS_EVALUATION: permissions.includes(
          "ACCESS_WORKSPACE_EVALUATION"
        ),
        WORKSPACE_ANNOUNCER_TOOL: permissions.includes(
          "WORKSPACE_ANNOUNCER_TOOL"
        ),
        WORKSPACE_CAN_PUBLISH: permissions.includes("PUBLISH_WORKSPACE"),
        WORKSPACE_DELETE_FORUM_THREAD: permissions.includes(
          "FORUM_DELETE_WORKSPACE_MESSAGES"
        ),
        WORKSPACE_DISCUSSIONS_VISIBLE: permissions.includes(
          "FORUM_ACCESSWORKSPACEFORUMS"
        ),
        WORKSPACE_GUIDES_VISIBLE: true,
        WORKSPACE_HOME_VISIBLE: true,
        WORKSPACE_IS_WORKSPACE_STUDENT: permissions.includes(
          "IS_WORKSPACE_STUDENT"
        ),
        WORKSPACE_JOURNAL_VISIBLE: permissions.includes(
          "ACCESS_WORKSPACE_JOURNAL"
        ),
        WORKSPACE_LIST_WORKSPACE_ANNOUNCEMENTS: permissions.includes(
          "LIST_WORKSPACE_ANNOUNCEMENTS"
        ),
        WORKSPACE_MANAGE_PERMISSIONS: permissions.includes(
          "WORKSPACE_MANAGE_PERMISSIONS"
        ),
        WORKSPACE_MANAGE_WORKSPACE: permissions.includes("MANAGE_WORKSPACE"),
        WORKSPACE_MANAGE_WORKSPACE_DETAILS: permissions.includes(
          "MANAGE_WORKSPACE_DETAILS"
        ),
        WORKSPACE_MANAGE_WORKSPACE_FRONTPAGE: permissions.includes(
          "MANAGE_WORKSPACE_FRONTPAGE"
        ),
        WORKSPACE_MANAGE_WORKSPACE_HELP: permissions.includes(
          "MANAGE_WORKSPACE_HELP"
        ),
        WORKSPACE_MANAGE_WORKSPACE_MATERIALS: permissions.includes(
          "MANAGE_WORKSPACE_MATERIALS"
        ),
        WORKSPACE_MATERIALS_VISIBLE: true,
        WORKSPACE_REQUEST_WORKSPACE_ASSESSMENT: permissions.includes(
          "REQUEST_WORKSPACE_ASSESSMENT"
        ),
        WORKSPACE_SIGNUP: permissions.includes("WORKSPACE_SIGNUP"),
        WORKSPACE_USERS_VISIBLE: permissions.includes(
          "MANAGE_WORKSPACE_MEMBERS"
        ),
        WORKSPACE_VIEW_WORKSPACE_DETAILS: permissions.includes(
          "VIEW_WORKSPACE_DETAILS"
        ),
        WORSKPACE_LIST_WORKSPACE_MEMBERS: permissions.includes(
          "LIST_WORKSPACE_MEMBERS"
        ),
      },
      canCurrentWorkspaceSignup,
    },
  });

  readyCb();
}

/**
 * loadStatus
 * @param whoAmIReadyCb whoAmIReadyCb
 */
const loadStatus: LoadStatusType = function loadStatus(
  whoAmIReadyCb: () => void
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    loadWhoAMI(dispatch, whoAmIReadyCb);
  };
};

/**
 * loadWorkspaceStatus
 * @param readyCb readyCb
 */
const loadWorkspaceStatus: LoadWorkspaceStatusInfoType =
  function loadWorkspaceStatusInfo(readyCb: () => void) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const workspaceApi = MApi.getWorkspaceApi();

      const workspaceUrlName = window.location.pathname.split("/")[2];

      let workspaceBasicInfo: WorkspaceBasicInfo = undefined;

      if (workspaceUrlName) {
        workspaceBasicInfo = await workspaceApi.getWorkspaceBasicInfo({
          urlName: workspaceUrlName,
        });
      }

      dispatch({
        type: "UPDATE_STATUS_WORKSPACEID",
        payload: workspaceBasicInfo.id,
      });

      loadWorkspacePermissions(workspaceBasicInfo.id, dispatch, readyCb);
    };
  };

/**
 * loadWorkspaceStatus
 */
const loadEnviromentalForumAreaPermissions: LoadEnviromentalForumAreaPermissionsType =
  function loadEnviromentalForumAreaPermissions() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      const discussionApi = MApi.getDiscussionApi();

      const areaPermissions = state.status.services.environmentForum.isAvailable
        ? await discussionApi.getDiscussionEnvironmentAreaPermissions()
        : null;

      dispatch({
        type: "UPDATE_STATUS",
        payload: {
          ...state.status,
          permissions: {
            AREA_PERMISSIONS: areaPermissions,
          },
        },
      });
    };
  };

/**
 * LogoutTriggerType
 */
export interface LogoutTriggerType {
  (): LOGOUT;
}

/**
 * UpdateStatusProfileTriggerType
 */
export interface UpdateStatusProfileTriggerType {
  (profile: ProfileStatusType): UPDATE_STATUS_PROFILE;
}

/**
 * UpdateStatusHasImageTriggerType
 */
export interface UpdateStatusHasImageTriggerType {
  (value: boolean): UPDATE_STATUS_HAS_IMAGE;
}

/**
 * LogoutTriggerType
 */
const logout: LogoutTriggerType = function logout() {
  return {
    type: "LOGOUT",
    payload: null,
  };
};

/**
 * updateStatusProfile
 * @param profile profile
 */
const updateStatusProfile: UpdateStatusProfileTriggerType =
  function updateStatusProfile(profile) {
    return {
      type: "UPDATE_STATUS_PROFILE",
      payload: profile,
    };
  };

/**
 * updateStatusHasImage
 * @param value value
 */
const updateStatusHasImage: UpdateStatusHasImageTriggerType =
  function updateStatusHasImage(value) {
    return {
      type: "UPDATE_STATUS_HAS_IMAGE",
      payload: value,
    };
  };

export default {
  logout,
  updateStatusProfile,
  updateStatusHasImage,
  loadStatus,
  loadWorkspaceStatus,
  loadEnviromentalForumAreaPermissions,
};
export {
  logout,
  updateStatusProfile,
  updateStatusHasImage,
  loadStatus,
  loadWorkspaceStatus,
  loadEnviromentalForumAreaPermissions,
};
