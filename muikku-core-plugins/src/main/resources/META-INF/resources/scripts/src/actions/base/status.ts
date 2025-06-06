import { Dispatch, Action } from "redux";
import { AnyActionType, SpecificActionType } from "~/actions";
import MApi, { isMApiError, isResponseError } from "~/api/api";
import { StateType } from "~/reducers";
import { ProfileStatusType, StatusType } from "~/reducers/base/status";
import { ChatUser, WorkspaceBasicInfo } from "~/generated/client";
import { localize } from "~/locales/i18n";
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

export type UPDATE_STATUS_CHAT_SETTINGS = SpecificActionType<
  "UPDATE_STATUS_CHAT_SETTINGS",
  ChatUser
>;

export type UPDATE_STATUS_WORKSPACE_PERMISSIONS = SpecificActionType<
  "UPDATE_STATUS_WORKSPACE_PERMISSIONS",
  Partial<StatusType>
>;

export type UPDATE_STATUS_WORKSPACEID = SpecificActionType<
  "UPDATE_STATUS_WORKSPACEID",
  number
>;

export type UPDATE_STATUS_WORKSPACE_ERROR = SpecificActionType<
  "UPDATE_STATUS_WORKSPACE_ERROR",
  {
    error: string;
    status: number;
  }
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
 * LoadChatSettingsType
 */
export interface LoadStatusChatSettingsType {
  (): AnyActionType;
}

/**
 * UpdateStatusChatSettingsType
 */
export interface UpdateStatusChatSettingsType {
  (): AnyActionType;
}

/**
 * loadWhoAMI
 * @param dispatch dispatch
 * @param whoAmIReadyCb whoAmIReadyCb
 */
async function loadWhoAMI(
  dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
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
      roles: Array.from(whoAmI.roles),
      isStudent: whoAmI.roles.has(Role.Student),
      userSchoolDataIdentifier: whoAmI.identifier,
      services: whoAmI.services,
      permissions: {
        ANNOUNCER_CAN_PUBLISH_ENVIRONMENT: whoAmI.permissions.has(
          "CREATE_ANNOUNCEMENT"
        ),
        ANNOUNCER_CAN_PUBLISH_GROUPS: whoAmI.permissions.has(
          "CREATE_ANNOUNCEMENT"
        ),
        ANNOUNCER_CAN_PUBLISH_WORKSPACES: true,
        ANNOUNCER_TOOL: whoAmI.permissions.has("ANNOUNCER_TOOL"),
        CHAT_MANAGE_PUBLIC_ROOMS: whoAmI.permissions.has(
          "CHAT_MANAGE_PUBLIC_ROOMS"
        ),
        COMMUNICATOR_GROUP_MESSAGING: whoAmI.permissions.has(
          "COMMUNICATOR_GROUP_MESSAGING"
        ),
        EVALUATION_VIEW_INDEX: whoAmI.permissions.has("ACCESS_EVALUATION"),
        FORUM_LOCK_STICKY_PERMISSION: whoAmI.permissions.has(
          "FORUM_LOCK_OR_STICKIFY_MESSAGES"
        ),
        FORUM_SHOW_FULL_NAME_PERMISSION: whoAmI.permissions.has(
          "FORUM_SHOW_FULL_NAMES"
        ),
        FORUM_UPDATEENVIRONMENTFORUM: whoAmI.permissions.has(
          "FORUM_UPDATEENVIRONMENTFORUM"
        ),
        GUARDIAN_VIEW: whoAmI.permissions.has("GUARDIAN_VIEW"),
        GUIDER_VIEW: whoAmI.permissions.has("GUIDER_VIEW"),
        ORGANIZATION_VIEW: whoAmI.permissions.has("ORGANIZATION_VIEW"),
        TRANSCRIPT_OF_RECORDS_VIEW: whoAmI.permissions.has(
          "TRANSCRIPT_OF_RECORDS_VIEW"
        ),
        LIST_USER_ORDERS: whoAmI.permissions.has("LIST_USER_ORDERS"),
        FIND_ORDER: whoAmI.permissions.has("FIND_ORDER"),
        REMOVE_ORDER: whoAmI.permissions.has("REMOVE_ORDER"),
        CREATE_ORDER: whoAmI.permissions.has("CREATE_ORDER"),
        PAY_ORDER: whoAmI.permissions.has("PAY_ORDER"),
        LIST_PRODUCTS: whoAmI.permissions.has("LIST_PRODUCTS"),
        COMPLETE_ORDER: whoAmI.permissions.has("COMPLETE_ORDER"),
        FORUM_ACCESSENVIRONMENTFORUM: whoAmI.permissions.has(
          "FORUM_ACCESSENVIRONMENTFORUM"
        ),
        FORUM_CREATEENVIRONMENTFORUM: whoAmI.permissions.has(
          "FORUM_CREATEENVIRONMENTFORUM"
        ),
        FORUM_DELETEENVIRONMENTFORUM: whoAmI.permissions.has(
          "FORUM_DELETEENVIRONMENTFORUM"
        ),
        WORKLIST_AVAILABLE: whoAmI.services.worklist.isAvailable,
      },
      profile: {
        addresses: whoAmI.addresses,
        emails: whoAmI.emails,
        displayName: whoAmI.displayName,
        loggedUserName: whoAmI.displayName,
        phoneNumbers: whoAmI.phoneNumbers,
        studyEndDate: whoAmI.studyEndDate,
        studyStartDate: whoAmI.studyStartDate,
        studyTimeEnd: whoAmI.studyTimeEnd,
        studyTimeLeftStr: whoAmI.studyTimeLeftStr,
        permissions: Array.from(whoAmI.permissions),
        studyProgrammeName: whoAmI.studyProgrammeName,
        studyProgrammeIdentifier: whoAmI.studyProgrammeIdentifier,
        curriculumName: whoAmI.curriculumName,
      },
    },
  });

  localize.language = whoAmI.locale;

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
  dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
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
      canCurrentWorkspaceSignup: canCurrentWorkspaceSignup.canSignup,
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
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const workspaceApi = MApi.getWorkspaceApi();

      const workspaceUrlName = window.location.pathname.split("/")[2];

      let workspaceBasicInfo: WorkspaceBasicInfo = undefined;

      if (workspaceUrlName) {
        try {
          workspaceBasicInfo = await workspaceApi.getWorkspaceBasicInfo({
            urlName: workspaceUrlName,
          });
        } catch (err) {
          if (!isMApiError(err)) {
            throw err;
          }

          // Handling workspace errors
          if (isResponseError(err)) {
            const status = err.response.status;

            switch (status) {
              case 401:
                window.location.href = `/login?redirectUrl=${window.location.pathname}`;
                break;
              case 403:
                window.location.href = `/error/403?workspace=true`;
                break;
              case 404:
                window.location.href = `/error/404?workspace=true`;
                break;
              default:
                window.location.href = `/error/${status}?workspace=true`;
                break;
            }
            return;
          }
        }
      }

      // Statistic endpoint
      await workspaceApi.visitWorkspace({
        workspaceId: workspaceBasicInfo.id,
      });

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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
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
 * loadChatSettings
 */
const updateStatusChatSettings: LoadStatusChatSettingsType =
  function loadChatSettings() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const chatApi = MApi.getChatApi();
      const chatSettings = await chatApi.getChatSettings();
      dispatch({
        type: "UPDATE_STATUS_CHAT_SETTINGS",
        payload: chatSettings,
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
  updateStatusChatSettings,
};
export {
  logout,
  updateStatusProfile,
  updateStatusHasImage,
  loadStatus,
  loadWorkspaceStatus,
  loadEnviromentalForumAreaPermissions,
  updateStatusChatSettings,
};
