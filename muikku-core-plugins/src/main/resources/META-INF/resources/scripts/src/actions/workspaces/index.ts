/* eslint-disable @typescript-eslint/no-explicit-any */
import actions, { displayNotification } from "../base/notifications";
import promisify from "~/util/promisify";
import mApi, { MApiError } from "~/lib/mApi";
import {
  WorkspaceListType,
  WorkspaceMaterialReferenceType,
  WorkspaceType,
  WorkspaceChatStatusType,
  WorkspaceAssessementStateType,
  WorkspaceAssessmentRequestType,
  WorkspaceEducationFilterListType,
  WorkspaceCurriculumFilterListType,
  WorkspacesActiveFiltersType,
  WorkspacesStateType,
  WorkspacesPatchType,
  WorkspaceAdditionalInfoType,
  WorkspaceUpdateType,
  WorkspaceSignUpDetails,
  WorkspaceCurriculumFilterType,
  WorkspaceActivityType,
  WorkspaceInterimEvaluationRequest,
} from "~/reducers/workspaces";
import {
  ShortWorkspaceUserWithActiveStatusType,
  WorkspaceStudentListType,
  WorkspaceStaffListType,
} from "~/reducers/user-index";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import {
  loadWorkspacesHelper,
  reuseExistantValue,
} from "~/actions/workspaces/helpers";
import { Dispatch } from "react-redux";
import {
  MaterialCompositeRepliesStateType,
  WorkspaceJournalsType,
  WorkspaceDetailsType,
  WorkspaceTypeType,
  WorkspaceProducerType,
  WorkspacePermissionsType,
  WorkspaceStateFilterListType,
  MaterialContentNodeType,
  WorkspaceEditModeStateType,
} from "~/reducers/workspaces";
import i18n from "~/locales/i18n";

export type UPDATE_AVAILABLE_CURRICULUMS = SpecificActionType<
  "UPDATE_AVAILABLE_CURRICULUMS",
  WorkspaceCurriculumFilterType[]
>;

export type UPDATE_USER_WORKSPACES = SpecificActionType<
  "UPDATE_USER_WORKSPACES",
  WorkspaceListType
>;

export type UPDATE_LAST_WORKSPACE = SpecificActionType<
  "UPDATE_LAST_WORKSPACE",
  WorkspaceMaterialReferenceType
>;

export type SET_CURRENT_WORKSPACE = SpecificActionType<
  "SET_CURRENT_WORKSPACE",
  WorkspaceType
>;

export type UPDATE_CURRENT_WORKSPACE_ACTIVITY = SpecificActionType<
  "UPDATE_CURRENT_WORKSPACE_ACTIVITY",
  WorkspaceActivityType
>;

export type UPDATE_CURRENT_WORKSPACE_ASESSMENT_REQUESTS = SpecificActionType<
  "UPDATE_CURRENT_WORKSPACE_ASESSMENT_REQUESTS",
  WorkspaceAssessmentRequestType[]
>;

export type UPDATE_CURRENT_WORKSPACE_INTERIM_EVALUATION_REQUESTS =
  SpecificActionType<
    "UPDATE_CURRENT_WORKSPACE_INTERIM_EVALUATION_REQUESTS",
    WorkspaceInterimEvaluationRequest[]
  >;

export type UPDATE_WORKSPACE_ASSESSMENT_STATE = SpecificActionType<
  "UPDATE_WORKSPACE_ASSESSMENT_STATE",
  {
    workspace: WorkspaceType;
    newState: WorkspaceAssessementStateType;
    newDate: string;
    newAssessmentRequest?: WorkspaceAssessmentRequestType;
    oldAssessmentRequestToDelete?: WorkspaceAssessmentRequestType;
  }
>;

export type UPDATE_WORKSPACES_EDIT_MODE_STATE = SpecificActionType<
  "UPDATE_WORKSPACES_EDIT_MODE_STATE",
  Partial<WorkspaceEditModeStateType>
>;

export type UPDATE_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES =
  SpecificActionType<
    "UPDATE_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES",
    WorkspaceEducationFilterListType
  >;

export type UPDATE_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS =
  SpecificActionType<
    "UPDATE_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS",
    WorkspaceCurriculumFilterListType
  >;

export type UPDATE_WORKSPACES_AVAILABLE_FILTERS_STATE_TYPES =
  SpecificActionType<
    "UPDATE_WORKSPACES_AVAILABLE_FILTERS_STATE_TYPES",
    WorkspaceStateFilterListType
  >;

export type UPDATE_WORKSPACES_ACTIVE_FILTERS = SpecificActionType<
  "UPDATE_WORKSPACES_ACTIVE_FILTERS",
  WorkspacesActiveFiltersType
>;

export type UPDATE_WORKSPACES_ALL_PROPS = SpecificActionType<
  "UPDATE_WORKSPACES_ALL_PROPS",
  WorkspacesPatchType
>;

export type UPDATE_WORKSPACES_STATE = SpecificActionType<
  "UPDATE_WORKSPACES_STATE",
  WorkspacesStateType
>;

export type UPDATE_WORKSPACE = SpecificActionType<
  "UPDATE_WORKSPACE",
  {
    original: WorkspaceType;
    update: WorkspaceUpdateType;
  }
>;

export type UPDATE_CURRENT_COMPOSITE_REPLIES_UPDATE_OR_CREATE_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER =
  SpecificActionType<
    "UPDATE_CURRENT_COMPOSITE_REPLIES_UPDATE_OR_CREATE_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER",
    {
      state: MaterialCompositeRepliesStateType;
      workspaceMaterialId: number;
      workspaceMaterialReplyId: number;
    }
  >;

type WorkspaceQueryDataType = {
  q?: string;
  templates?: "LIST_ALL" | "ONLY_TEMPLATES" | "ONLY_WORKSPACES";
  firstResult?: number;
  maxResults?: number;
};

/**
 * SelectItem
 */
export interface SelectItem {
  id: string | number;
  label: string;
  type?: string;
  disabled?: boolean;
  variables?: {
    identifier?: string | number;
    boolean?: boolean;
  };
}

/**
 * workspaceStudentsQueryDataType
 */
export interface workspaceStudentsQueryDataType {
  q: string | null;
  firstResult?: number | null;
  maxResults?: number | null;
  active?: boolean;
}

/**
 * UpdateCurrentWorkspaceInterimEvaluationRequestsTrigger
 */
export interface UpdateCurrentWorkspaceInterimEvaluationRequestsTrigger {
  (data?: {
    requestData: WorkspaceInterimEvaluationRequest;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * Updates current workspace interim evaluation requests list in redux state.
 * If requestData doesn't exist in the list, it will be pushed to the list.
 * If requestData exists in the list, it will be updated.
 * @param data data
 */
const updateCurrentWorkspaceInterimEvaluationRequests: UpdateCurrentWorkspaceInterimEvaluationRequestsTrigger =
  function loadUserWorkspacesFromServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const { requestData, success } = data || {};
      const { currentWorkspace } = getState().workspaces;

      if (!currentWorkspace) {
        return;
      }

      const { interimEvaluationRequests } = currentWorkspace;

      const { id } = requestData;

      const newWorkspaceInterimEvaluationRequests = interimEvaluationRequests;

      const index = interimEvaluationRequests.findIndex(
        (request) => request.id === id
      );

      if (index === -1) {
        newWorkspaceInterimEvaluationRequests.push(requestData);
      } else {
        newWorkspaceInterimEvaluationRequests[index] = requestData;
      }
      dispatch({
        type: "UPDATE_CURRENT_WORKSPACE_INTERIM_EVALUATION_REQUESTS",
        payload: newWorkspaceInterimEvaluationRequests,
      });
      if (success) {
        success();
      }
    };
  };

/**
 * LoadTemplatesFromServerTriggerType
 */
export interface LoadTemplatesFromServerTriggerType {
  (query?: string): AnyActionType;
}

/**
 * loadTemplatesFromServer
 * @param query query
 */
const loadTemplatesFromServer: LoadTemplatesFromServerTriggerType =
  function loadTemplatesFromServer(query?: string) {
    const data: WorkspaceQueryDataType = {
      templates: "ONLY_TEMPLATES",
      maxResults: 5,
    };

    if (query) {
      data.q = query;
    }

    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_ORGANIZATION_TEMPLATES",
          payload: <WorkspaceListType>(
            ((await promisify(
              mApi().organizationWorkspaceManagement.workspaces.read(data),
              "callback"
            )()) || 0)
          ),
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", { context: "templates" }),
            "error"
          )
        );
      }
    };
  };

/**
 * LoadUserWorkspacesFromServerTriggerType
 */
export interface LoadUserWorkspacesFromServerTriggerType {
  (): AnyActionType;
}

/**
 * loadUserWorkspacesFromServer
 */
const loadUserWorkspacesFromServer: LoadUserWorkspacesFromServerTriggerType =
  function loadUserWorkspacesFromServer() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const userId = getState().status.userId;
      try {
        dispatch({
          type: "UPDATE_USER_WORKSPACES",
          payload: <WorkspaceListType>(
            ((await promisify(
              mApi().workspace.workspaces.read({ userId: userId }),
              "callback"
            )()) || 0)
          ),
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", { count: 0, ns: "workspace" }),
            "error"
          )
        );
      }
    };
  };

/**
 * LoadLastWorkspaceFromServerTriggerType
 */
export interface LoadLastWorkspaceFromServerTriggerType {
  (): AnyActionType;
}

/**
 * loadLastWorkspaceFromServer
 */
const loadLastWorkspaceFromServer: LoadLastWorkspaceFromServerTriggerType =
  function loadLastWorkspaceFromServer() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_LAST_WORKSPACE",
          payload: <WorkspaceMaterialReferenceType>(
            JSON.parse(
              (
                (await promisify(
                  mApi().user.property.read("last-workspace"),
                  "callback"
                )()) as any
              ).value
            )
          ),
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              context: "latest",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * UpdateLastWorkspaceTriggerType
 */
export interface UpdateLastWorkspaceTriggerType {
  (newReference: WorkspaceMaterialReferenceType): AnyActionType;
}

/**
 * updateLastWorkspace
 * @param newReference newReference
 */
const updateLastWorkspace: UpdateLastWorkspaceTriggerType =
  function updateLastWorkspace(newReference) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>
    ) => {
      try {
        await promisify(
          mApi().user.property.create({
            key: "last-workspace",
            value: JSON.stringify(newReference),
          }),
          "callback"
        )();
        dispatch({
          type: "UPDATE_LAST_WORKSPACE",
          payload: newReference,
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
      }
    };
  };

/**
 * SetCurrentWorkspaceTriggerType
 */
export interface SetCurrentWorkspaceTriggerType {
  (data?: {
    workspaceId: number;
    refreshActivity?: boolean;
    success?: (workspace: WorkspaceType) => void;
    fail?: () => void;
    loadDetails?: boolean;
  }): AnyActionType;
}

/**
 * SetAvailableCurriculumsTriggerType
 */
export interface SetAvailableCurriculumsTriggerType {
  (): AnyActionType;
}

/**
 * UpdateCurrentWorkspaceImagesB64TriggerType
 */
export interface UpdateCurrentWorkspaceImagesB64TriggerType {
  (data?: {
    delete?: boolean;
    originalB64?: string;
    croppedB64?: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * LoadCurrentWorkspaceUserGroupPermissionsTriggerType
 */
export interface LoadCurrentWorkspaceUserGroupPermissionsTriggerType {
  (): AnyActionType;
}

/**
 * UpdateCurrentWorkspaceUserGroupPermissionTriggerType
 */
export interface UpdateCurrentWorkspaceUserGroupPermissionTriggerType {
  (data?: {
    original: WorkspacePermissionsType;
    update: WorkspacePermissionsType;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateWorkspaceEditModeStateTriggerType
 */
export interface UpdateWorkspaceEditModeStateTriggerType {
  (
    data: Partial<WorkspaceEditModeStateType>,
    recoverActiveFromLocalStorage?: boolean
  ): AnyActionType;
}

/**
 * LoadMoreWorkspacesFromServerTriggerType
 */
export interface LoadMoreWorkspacesFromServerTriggerType {
  (): AnyActionType;
}

/**
 * setCurrentWorkspace
 * @param data data
 */
const setCurrentWorkspace: SetCurrentWorkspaceTriggerType =
  function setCurrentWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const state = getState();

      const current: WorkspaceType = state.workspaces.currentWorkspace;
      if (
        current &&
        current.id === data.workspaceId &&
        !data.refreshActivity &&
        !data.loadDetails
      ) {
        data.success && data.success(current);
        return;
      }

      try {
        let workspace: WorkspaceType =
          state.workspaces.userWorkspaces.find(
            (w) => w.id === data.workspaceId
          ) ||
          state.workspaces.availableWorkspaces.find(
            (w) => w.id === data.workspaceId
          );
        if (current && current.id === data.workspaceId) {
          //if I just make it be current it will be buggy
          workspace = { ...current };
        }

        /* let assesments: WorkspaceStudentAssessmentsType; */
        let assessmentRequests: WorkspaceAssessmentRequestType[];
        let interimEvaluationRequests: WorkspaceInterimEvaluationRequest[];
        let activity: WorkspaceActivityType;
        let additionalInfo: WorkspaceAdditionalInfoType;
        let contentDescription: MaterialContentNodeType;
        let producers: WorkspaceProducerType[];
        let isCourseMember: boolean;
        let journals: WorkspaceJournalsType;
        let details: WorkspaceDetailsType;
        let chatStatus: WorkspaceChatStatusType;
        const status = state.status;

        [
          workspace,
          // eslint-disable-next-line prefer-const
          assessmentRequests,
          // eslint-disable-next-line prefer-const
          interimEvaluationRequests,
          // eslint-disable-next-line prefer-const
          activity,
          // eslint-disable-next-line prefer-const
          additionalInfo,
          // eslint-disable-next-line prefer-const
          contentDescription,
          // eslint-disable-next-line prefer-const
          producers,
          // eslint-disable-next-line prefer-const
          isCourseMember,
          // eslint-disable-next-line prefer-const
          journals,
          // eslint-disable-next-line prefer-const
          details,
          // eslint-disable-next-line prefer-const
          chatStatus,
        ] = (await Promise.all([
          reuseExistantValue(true, workspace, () =>
            promisify(
              mApi().workspace.workspaces.cacheClear().read(data.workspaceId),
              "callback"
            )()
          ),

          reuseExistantValue(
            status.permissions.WORKSPACE_REQUEST_WORKSPACE_ASSESSMENT,
            workspace && workspace.assessmentRequests,
            () =>
              promisify(
                mApi()
                  .assessmentrequest.workspace.assessmentRequests.cacheClear()
                  .read(data.workspaceId, {
                    studentIdentifier: state.status.userSchoolDataIdentifier,
                  }),
                "callback"
              )()
          ),

          status.loggedIn
            ? reuseExistantValue(
                true,
                workspace && workspace.interimEvaluationRequests,
                () =>
                  promisify(
                    mApi().evaluation.workspace.interimEvaluationRequests.read(
                      data.workspaceId
                    ),
                    "callback"
                  )()
              )
            : null,

          status.loggedIn
            ? // The way refresh works is by never giving an existant value to the reuse existant value function that way it will think that there's no value
              // And rerequest
              reuseExistantValue(
                true,
                typeof data.refreshActivity !== "undefined" &&
                  data.refreshActivity
                  ? null
                  : workspace && workspace.activity,
                () =>
                  promisify(
                    mApi()
                      .evaluation.workspaces.students.activity.cacheClear()
                      .read(
                        data.workspaceId,
                        state.status.userSchoolDataIdentifier
                      ),
                    "callback"
                  )()
              )
            : null,

          reuseExistantValue(true, workspace && workspace.additionalInfo, () =>
            promisify(
              mApi()
                .workspace.workspaces.additionalInfo.cacheClear()
                .read(data.workspaceId),
              "callback"
            )()
          ),

          reuseExistantValue(
            true,
            workspace && workspace.contentDescription,
            () =>
              promisify(
                mApi()
                  .workspace.workspaces.description.cacheClear()
                  .read(data.workspaceId),
                "callback"
              )()
          ),

          reuseExistantValue(true, workspace && workspace.producers, () =>
            promisify(
              mApi()
                .workspace.workspaces.materialProducers.cacheClear()
                .read(data.workspaceId),
              "callback"
            )()
          ),

          state.status.loggedIn
            ? reuseExistantValue(
                true,
                workspace &&
                  typeof workspace.isCourseMember !== "undefined" &&
                  workspace.isCourseMember,
                () =>
                  promisify(
                    mApi().workspace.workspaces.amIMember.read(
                      data.workspaceId
                    ),
                    "callback"
                  )()
              )
            : false,

          reuseExistantValue(true, workspace && workspace.journals, () => null),

          data.loadDetails || (workspace && workspace.details)
            ? reuseExistantValue(true, workspace && workspace.details, () =>
                promisify(
                  mApi().workspace.workspaces.details.read(data.workspaceId),
                  "callback"
                )()
              )
            : null,

          state.status.loggedIn
            ? reuseExistantValue(true, workspace && workspace.chatStatus, () =>
                promisify(
                  mApi().chat.workspaceChatSettings.read(data.workspaceId),
                  "callback"
                )()
              )
            : null,
        ])) as any;

        workspace.assessmentRequests = assessmentRequests;
        workspace.interimEvaluationRequests = interimEvaluationRequests;
        workspace.activity = activity;
        workspace.additionalInfo = additionalInfo;
        workspace.contentDescription = contentDescription;
        workspace.producers = producers;
        workspace.isCourseMember = isCourseMember;
        workspace.journals = journals;
        workspace.details = details;
        workspace.chatStatus = chatStatus;

        dispatch({
          type: "SET_CURRENT_WORKSPACE",
          payload: workspace,
        });

        data.success && data.success(workspace);
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", { count: 0, ns: "workspace" }),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * setAvailableCurriculums
 * @returns Promise<void>
 */
const setAvailableCurriculums: SetAvailableCurriculumsTriggerType =
  function setAvailableCurriculums() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const curriculums = <WorkspaceCurriculumFilterListType>(
          await promisify(mApi().coursepicker.curriculums.read(), "callback")()
        );

        dispatch({
          type: "UPDATE_AVAILABLE_CURRICULUMS",
          payload: curriculums,
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.sendError", {
              context: "evaluationRequests",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * UpdateCurrentWorkspaceActivityTriggerType
 */
export interface UpdateCurrentWorkspaceActivityTriggerType {
  (data: { success?: () => void; fail?: () => void }): AnyActionType;
}

/**
 * This is a thunk action creator that returns a thunk function
 *
 * @param data data
 * @returns a thunk function
 */
const updateCurrentWorkspaceActivity: UpdateCurrentWorkspaceActivityTriggerType =
  function updateCurrentWorkspaceActivity(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.status.loggedIn) {
        try {
          const activity = <WorkspaceActivityType>(
            await promisify(
              mApi()
                .evaluation.workspaces.students.activity.cacheClear()
                .read(
                  state.workspaces.currentWorkspace.id,
                  state.status.userSchoolDataIdentifier
                ),
              "callback"
            )()
          );

          dispatch({
            type: "UPDATE_CURRENT_WORKSPACE_ACTIVITY",
            payload: activity,
          });
        } catch (err) {
          dispatch(
            actions.displayNotification(
              i18n.t("notifications.loadError", {
                context: "activity",
              }),
              "error"
            )
          );
        }
      }
    };
  };

/**
 * UpdateCurrentWorkspaceAssessmentRequestTriggerType
 */
export interface UpdateCurrentWorkspaceAssessmentRequestTriggerType {
  (data: { success?: () => void; fail?: () => void }): AnyActionType;
}

/**
 * This is a thunk action creator for updateCurrentWorkspaceAssessmentRequest
 *
 * @param data data
 * @returns a thunk function
 */
const updateCurrentWorkspaceAssessmentRequest: UpdateCurrentWorkspaceAssessmentRequestTriggerType =
  function updateCurrentWorkspaceAssessmentRequest(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.status.loggedIn) {
        try {
          const assessmentRequests = <WorkspaceAssessmentRequestType[]>(
            await promisify(
              mApi()
                .assessmentrequest.workspace.assessmentRequests.cacheClear()
                .read(state.workspaces.currentWorkspace.id, {
                  studentIdentifier: state.status.userSchoolDataIdentifier,
                }),
              "callback"
            )()
          );

          dispatch({
            type: "UPDATE_CURRENT_WORKSPACE_ASESSMENT_REQUESTS",
            payload: assessmentRequests,
          });
        } catch (err) {
          dispatch(
            actions.displayNotification(
              i18n.t("notifications.loadError", {
                context: "evaluationRequests",
              }),
              "error"
            )
          );
        }
      }
    };
  };

/**
 * RequestAssessmentAtWorkspaceTriggerType
 */
export interface RequestAssessmentAtWorkspaceTriggerType {
  (data: {
    workspace: WorkspaceType;
    text: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * requestAssessmentAtWorkspace
 * @param data data
 */
/**
 * requestAssessmentAtWorkspace
 * @param data data
 */
export interface RequestAssessmentAtWorkspaceTriggerType {
  (data: {
    workspace: WorkspaceType;
    text: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}
/**
 * requestAssessmentAtWorkspace
 * @param data data
 */
const requestAssessmentAtWorkspace: RequestAssessmentAtWorkspaceTriggerType =
  function requestAssessmentAtWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const assessmentRequest: WorkspaceAssessmentRequestType = <
          WorkspaceAssessmentRequestType
        >await promisify(
          mApi().assessmentrequest.workspace.assessmentRequests.create(
            data.workspace.id,
            {
              requestText: data.text,
            }
          ),
          "callback"
        )();

        /**
         * First finding current "assessmentState state" and depending what state it is assign new state
         * Will be changed when module specific evaluation assessment request functionality is implemented
         */
        let newAssessmentState =
          data.workspace.activity.assessmentState[0].state;

        if (newAssessmentState === "unassessed") {
          newAssessmentState = "pending";
        } else if (newAssessmentState == "pass") {
          newAssessmentState = "pending_pass";
        } else if (newAssessmentState == "fail") {
          newAssessmentState = "pending_fail";
        } else {
          newAssessmentState = "pending";
        }

        /**
         * Must be done for now. To update activity when assessmentRequest is being made.
         * In future changing state locally is better options one combination workspace module specific
         * request are implemented
         */
        dispatch(updateCurrentWorkspaceActivity({}));

        /**
         * Same here
         */
        dispatch(updateCurrentWorkspaceAssessmentRequest({}));

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.sendSuccess", {
              context: "evaluationRequests",
            }),
            "success"
          )
        );
        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.sendError", {
              context: "evaluationRequests",
            }),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * CancelAssessmentAtWorkspaceTriggerType
 */
export interface CancelAssessmentAtWorkspaceTriggerType {
  (data: {
    workspace: WorkspaceType;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * cancelAssessmentAtWorkspace
 * @param data data
 */
const cancelAssessmentAtWorkspace: CancelAssessmentAtWorkspaceTriggerType =
  function cancelAssessmentAtWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const assessmentRequest: WorkspaceAssessmentRequestType =
          data.workspace.assessmentRequests[
            data.workspace.assessmentRequests.length - 1
          ];
        if (!assessmentRequest) {
          dispatch(
            actions.displayNotification(
              i18n.t("notifications.cancelError", {
                context: "evaluationRequests",
              }),
              "error"
            )
          );
          data.fail && data.fail();
          return;
        }
        await promisify(
          mApi().assessmentrequest.workspace.assessmentRequests.del(
            data.workspace.id,
            assessmentRequest.id
          ),
          "callback"
        )();

        /**
         * First finding current "assessmentState state" and depending what state it is assign new state
         * Will be changed when module specific evaluation assessment request functionality is implemented
         */
        let newAssessmentState =
          data.workspace.activity.assessmentState[0].state;

        if (newAssessmentState == "pending") {
          newAssessmentState = "unassessed";
        } else if (newAssessmentState == "pending_pass") {
          newAssessmentState = "pass";
        } else if (newAssessmentState == "pending_fail") {
          newAssessmentState = "fail";
        }

        /**
         * Must be done for now. To update activity when assessmentRequest is being made.
         * In future changing state locally is better options one combination workspace module specific
         * request are implemented
         */
        dispatch(updateCurrentWorkspaceActivity({}));

        /**
         * Same here
         */
        dispatch(updateCurrentWorkspaceAssessmentRequest({}));

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.sendSuccess", {
              context: "evaluationRequestsCancel",
            }),
            "success"
          )
        );
        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.cancelError", {
              context: "evaluationRequests",
            }),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * LoadWorkspacesFromServerTriggerType
 */
export interface LoadWorkspacesFromServerTriggerType {
  (
    filters: WorkspacesActiveFiltersType,
    organizationWorkspaces: boolean,
    refresh: boolean
  ): AnyActionType;
}

/**
 * SignupIntoWorkspaceTriggerType
 */
export interface SignupIntoWorkspaceTriggerType {
  (data: {
    success: () => void;
    fail: () => void;
    workspace: WorkspaceSignUpDetails;
    message: string;
  }): AnyActionType;
}

/**
 * UpdateAssignmentStateTriggerType
 */
export interface UpdateAssignmentStateTriggerType {
  (
    successState: MaterialCompositeRepliesStateType,
    avoidServerCall: boolean,
    workspaceId: number,
    workspaceMaterialId: number,
    existantReplyId?: number,
    successMessage?: string,
    callback?: () => void
  ): AnyActionType;
}

/**
 * LoadUserWorkspaceEducationFiltersFromServerTriggerType
 */
export interface LoadUserWorkspaceEducationFiltersFromServerTriggerType {
  (loadOrganizationWorkspaces: boolean): AnyActionType;
}

/**
 * setFiltersTriggerType
 */
export interface setFiltersTriggerType {
  (
    loadOrganizationWorkspaceFilters: boolean,
    filters: WorkspaceStateFilterListType
  ): AnyActionType;
}

/**
 * LoadUserWorkspaceCurriculumFiltersFromServerTriggerType
 */
export interface LoadUserWorkspaceCurriculumFiltersFromServerTriggerType {
  (
    loadOrganizationWorkspaceFilters: boolean,
    callback?: (curriculums: WorkspaceCurriculumFilterListType) => void
  ): AnyActionType;
}

/**
 * UpdateWorkspaceTriggerType
 */
export interface UpdateWorkspaceTriggerType {
  (data: {
    workspace: WorkspaceType;
    update: WorkspaceUpdateType;
    activeFilters?: WorkspacesActiveFiltersType;
    addStudents?: SelectItem[];
    addTeachers?: SelectItem[];
    removeStudents?: SelectItem[];
    removeTeachers?: SelectItem[];
    success?: () => void;
    progress?: (state?: UpdateWorkspaceStateType) => any;
    executeOnSuccess?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * LoadUsersOfWorkspaceTriggerType
 */
export interface LoadUsersOfWorkspaceTriggerType {
  (data: {
    workspace: WorkspaceType;
    payload?: {
      q: string;
      active?: boolean;
      firstResult?: number;
      maxResults?: number;
    };
    success?: (
      students: WorkspaceStudentListType | WorkspaceStaffListType
    ) => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * ToggleActiveStateOfStudentOfWorkspaceTriggerType
 */
export interface ToggleActiveStateOfStudentOfWorkspaceTriggerType {
  (data: {
    workspace: WorkspaceType;
    student: ShortWorkspaceUserWithActiveStatusType;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * loadWorkspacesFromServer
 * @param filters filters
 * @param organizationWorkspaces organizationWorkspaces
 * @param refresh refresh
 */
const loadWorkspacesFromServer: LoadWorkspacesFromServerTriggerType =
  function loadWorkspacesFromServer(filters, organizationWorkspaces, refresh) {
    return loadWorkspacesHelper.bind(
      this,
      filters,
      true,
      refresh,
      organizationWorkspaces
    );
  };

/**
 * loadMoreWorkspacesFromServer
 */
const loadMoreWorkspacesFromServer: LoadMoreWorkspacesFromServerTriggerType =
  function loadMoreWorkspacesFromServer() {
    return loadWorkspacesHelper.bind(this, null, false, false, false);
  };

/**
 * setWorkspaceStateFilters
 * @param loadOrganizationWorkspaceFilters loadOrganizationWorkspaceFilters
 * @param filters filters
 */
const setWorkspaceStateFilters: setFiltersTriggerType =
  function setWorkspaceStateFilters(loadOrganizationWorkspaceFilters, filters) {
    return (dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>) => {
      if (loadOrganizationWorkspaceFilters) {
        return dispatch({
          type: "UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_STATE_TYPES",
          payload: filters,
        });
      } else {
        return dispatch({
          type: "UPDATE_WORKSPACES_AVAILABLE_FILTERS_STATE_TYPES",
          payload: filters,
        });
      }
    };
  };

/**
 * loadOrganizationWorkspaceFilters
 * @param loadOrganizationWorkspaceFilters loadOrganizationWorkspaceFilters
 */
const loadUserWorkspaceEducationFiltersFromServer: LoadUserWorkspaceEducationFiltersFromServerTriggerType =
  function loadUserWorkspaceEducationFiltersFromServer(
    loadOrganizationWorkspaceFilters
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        if (!loadOrganizationWorkspaceFilters) {
          dispatch({
            type: "UPDATE_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES",
            payload: <WorkspaceEducationFilterListType>(
              await promisify(
                mApi().workspace.educationTypes.read(),
                "callback"
              )()
            ),
          });
        } else {
          dispatch({
            type: "UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES",
            payload: <WorkspaceEducationFilterListType>(
              await promisify(
                mApi().workspace.educationTypes.read(),
                "callback"
              )()
            ),
          });
        }
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              context: "educationFilters",
              ns: "workspace",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * loadUserWorkspaceCurriculumFiltersFromServer
 * @param loadOrganizationWorkspaceFilters loadOrganizationWorkspaceFilters
 * @param callback callback
 */
const loadUserWorkspaceCurriculumFiltersFromServer: LoadUserWorkspaceCurriculumFiltersFromServerTriggerType =
  function loadUserWorkspaceCurriculumFiltersFromServer(
    loadOrganizationWorkspaceFilters,
    callback
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const curriculums = <WorkspaceCurriculumFilterListType>(
          await promisify(mApi().coursepicker.curriculums.read(), "callback")()
        );
        if (!loadOrganizationWorkspaceFilters) {
          dispatch({
            type: "UPDATE_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS",
            payload: curriculums,
          });
        } else {
          dispatch({
            type: "UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS",
            payload: curriculums,
          });
        }
        callback && callback(curriculums);
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              context: "curriculumFilters",
              ns: "workspace",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * signupIntoWorkspace
 * @param data data
 */
const signupIntoWorkspace: SignupIntoWorkspaceTriggerType =
  function signupIntoWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        await promisify(
          mApi().coursepicker.workspaces.signup.create(data.workspace.id, {
            message: data.message,
          }),
          "callback"
        )();
        window.location.href = `${getState().status.contextPath}/workspace/${
          data.workspace.urlName
        }`;
        data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.sendError", { context: "signUp" }),
            "error"
          )
        );
        data.fail();
      }
    };
  };

/**
 * updateWorkspace
 * @param data data
 */
const updateWorkspace: UpdateWorkspaceTriggerType = function updateWorkspace(
  data
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const actualOriginal: WorkspaceType = { ...data.workspace };
    delete actualOriginal["activity"];
    delete actualOriginal["studentActivity"];
    delete actualOriginal["forumStatistics"];
    delete actualOriginal["studentAssessments"];
    delete actualOriginal["activityStatistics"];
    delete actualOriginal["assessmentRequests"];
    delete actualOriginal["interimEvaluationRequests"];
    delete actualOriginal["additionalInfo"];
    delete actualOriginal["staffMembers"];
    delete actualOriginal["students"];
    delete actualOriginal["details"];
    delete actualOriginal["producers"];
    delete actualOriginal["contentDescription"];
    delete actualOriginal["isCourseMember"];
    delete actualOriginal["journals"];
    delete actualOriginal["activityLogs"];
    delete actualOriginal["permissions"];
    delete actualOriginal["chatStatus"];
    delete actualOriginal["inactiveStudents"];

    try {
      const newDetails = data.update.details;
      const newPermissions = data.update.permissions;
      const appliedProducers = data.update.producers;
      const unchangedPermissions: WorkspacePermissionsType[] = [];
      const currentWorkspace: WorkspaceType =
        getState().workspaces.currentWorkspace;
      const newChatStatus = data.update.chatStatus;

      // I left the workspace image out of this, because it never is in the application state anyway
      // These need to be removed from the object for the basic stuff to not fail
      delete data.update["details"];
      delete data.update["permissions"];
      delete data.update["producers"];
      delete data.update["chatStatus"];

      if (data.update) {
        await promisify(
          mApi().workspace.workspaces.update(
            data.workspace.id,
            Object.assign(actualOriginal, data.update)
          ),
          "callback"
        )();
      }

      // Then the details - if any

      if (newDetails) {
        await promisify(
          mApi().workspace.workspaces.details.update(
            data.workspace.id,
            newDetails
          ),
          "callback"
        )();

        // Add details back to the update object
        data.update.details = newDetails;

        // Details affect additionalInfo, so I guess we load that too. It's not a "single source of truth" when there's duplicates in the model, is it?

        const additionalInfo = <WorkspaceAdditionalInfoType>(
          await promisify(
            mApi()
              .workspace.workspaces.additionalInfo.cacheClear()
              .read(currentWorkspace.id),
            "callback"
          )()
        );

        data.update.additionalInfo = additionalInfo;
      }

      // Update workspace chat status (enabled/disabled)
      if (newChatStatus) {
        await promisify(
          mApi().chat.workspaceChatSettings.update(data.workspace.id, {
            chatStatus: newChatStatus,
            workspaceEntityId: data.workspace.id,
          }),
          "callback"
        )();

        // Add chat status back to the update object
        data.update.chatStatus = newChatStatus;
      }

      // Then permissions - if any
      if (newPermissions) {
        // Lets weed out the unchanged permissions for later
        data.workspace.permissions.map((permission) => {
          if (
            !newPermissions.find(
              (p) => p.userGroupEntityId === permission.userGroupEntityId
            )
          ) {
            unchangedPermissions.push(permission);
          }
        });
        await Promise.all(
          newPermissions.map((permission) => {
            const originalPermission = currentWorkspace.permissions.find(
              (p) => p.userGroupEntityId === permission.userGroupEntityId
            );
            promisify(
              mApi().workspace.workspaces.signupGroups.update(
                currentWorkspace.id,
                originalPermission.userGroupEntityId,
                permission
              ),
              "callback"
            )();
          })
        );

        // Here we have to combine the new permissions with old ones for dispatch, because otherwise there will be missing options in the app state

        // TODO: this mixes up the order of the checkboxes, maybe reload them or sort them here.

        data.update.permissions = unchangedPermissions.concat(newPermissions);
      }

      // Then producers
      if (appliedProducers) {
        const existingProducers = currentWorkspace.producers;
        const workspaceProducersToAdd =
          existingProducers.length == 0
            ? appliedProducers
            : appliedProducers.filter((producer) => {
                if (!producer.id) {
                  return producer;
                }
              });

        const workspaceProducersToDelete = existingProducers.filter(
          (producer) => {
            if (producer.id) {
              return !appliedProducers.find(
                (keepProducer) => keepProducer.id === producer.id
              );
            }
          }
        );

        await Promise.all(
          workspaceProducersToAdd
            .map((p) =>
              promisify(
                mApi().workspace.workspaces.materialProducers.create(
                  currentWorkspace.id,
                  p
                ),
                "callback"
              )()
            )
            .concat(
              workspaceProducersToDelete.map((p) =>
                promisify(
                  mApi().workspace.workspaces.materialProducers.del(
                    currentWorkspace.id,
                    p.id
                  ),
                  "callback"
                )()
              )
            )
        );

        // For some reason the results of the request don't give the new workspace producers
        // it's a mess but whatever

        data.update.producers = <Array<WorkspaceProducerType>>(
          await promisify(
            mApi()
              .workspace.workspaces.materialProducers.cacheClear()
              .read(currentWorkspace.id),
            "callback"
          )()
        );
      }

      // All saved and stitched together again, dispatch to state

      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: {
          original: data.workspace,
          update: data.update,
        },
      });

      data.success && data.success();
    } catch (err) {
      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: {
          original: data.workspace,
          update: actualOriginal,
        },
      });

      if (!(err instanceof MApiError)) {
        throw err;
      }

      dispatch(
        displayNotification(
          i18n.t("notifications.updateError", {
            context: "settings",
          }),
          "error"
        )
      );

      data.fail && data.fail();
    }
  };
};

/**
 * loadStaffMembersOfWorkspace
 * @param data data
 */
const loadStaffMembersOfWorkspace: LoadUsersOfWorkspaceTriggerType =
  function loadStaffMembersOfWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const staffMembers = <WorkspaceStaffListType>await promisify(
          mApi().user.staffMembers.read({
            workspaceEntityId: data.workspace.id,
            properties:
              "profile-phone,profile-appointmentCalendar,profile-extraInfo,profile-whatsapp,profile-vacation-start,profile-vacation-end",
            firstResult: data.payload ? data.payload.firstResult : 0,
            maxResults: data.payload ? data.payload.maxResults : 10,
          }),
          "callback"
        )();

        const update: WorkspaceUpdateType = {
          staffMembers,
        };

        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            original: data.workspace,
            update,
          },
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              context: "teachers",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * loadStudentsOfWorkspace
 * @param data data
 */
const loadStudentsOfWorkspace: LoadUsersOfWorkspaceTriggerType =
  function loadStudentsOfWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const payload: workspaceStudentsQueryDataType = {
          q: data.payload && data.payload.q ? data.payload.q : "",
        };

        if (data.payload && data.payload.firstResult >= 0) {
          payload.firstResult = data.payload.firstResult;
        }

        if (data.payload && data.payload.maxResults) {
          payload.maxResults = data.payload.maxResults;
        }

        if (data.payload && data.payload.active !== undefined) {
          payload.active = data.payload.active;
        }

        const students = <WorkspaceStudentListType>(
          await promisify(
            mApi().workspace.workspaces.students.read(
              data.workspace.id,
              payload
            ),
            "callback"
          )()
        );

        let update: WorkspaceUpdateType = {
          students,
        };

        if (
          data.payload &&
          data.payload.active !== undefined &&
          !data.payload.active
        ) {
          update = {
            inactiveStudents: students,
          };
        }

        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            original: data.workspace,
            update,
          },
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              context: "students",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * toggleActiveStateOfStudentOfWorkspace
 * @param data data
 */
const toggleActiveStateOfStudentOfWorkspace: ToggleActiveStateOfStudentOfWorkspaceTriggerType =
  function toggleActiveStateOfStudentOfWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const oldStudents = data.workspace.students;
      try {
        const newStudent: ShortWorkspaceUserWithActiveStatusType = {
          ...data.student,
          active: !data.student.active,
        };
        const newStudents =
          data.workspace.students &&
          data.workspace.students.results.map((student) => {
            if (
              student.workspaceUserEntityId === newStudent.workspaceUserEntityId
            ) {
              return newStudent;
            }
            return student;
          });

        const payload: WorkspaceStudentListType = {
          ...data.workspace.students,
          results: newStudents,
        };

        await promisify(
          mApi().workspace.workspaces.students.update(
            data.workspace.id,
            newStudent.workspaceUserEntityId,
            {
              workspaceUserEntityId: newStudent.workspaceUserEntityId,
              active: newStudent.active,
            }
          ),
          "callback"
        )();

        if (newStudents) {
          dispatch({
            type: "UPDATE_WORKSPACE",
            payload: {
              original: data.workspace,
              update: {
                students: payload,
              },
            },
          });
        }

        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        if (oldStudents) {
          dispatch({
            type: "UPDATE_WORKSPACE",
            payload: {
              original: data.workspace,
              update: {
                students: oldStudents,
              },
            },
          });
        }
        data.fail && data.fail();

        dispatch(
          displayNotification(
            i18n.t("notifications.updateError", {
              context: "student",
            }),
            "error"
          )
        );
      }
    };
  };

//Updates the evaluated assignment state, and either updates an existant composite reply or creates a new one as incomplete,
//that is no answers
/**
 * updateAssignmentState
 * @param successState successState
 * @param avoidServerCall avoidServerCall
 * @param workspaceId workspaceId
 * @param workspaceMaterialId workspaceMaterialId
 * @param existantReplyId existantReplyId
 * @param successMessage successMessage
 * @param callback callback
 */
const updateAssignmentState: UpdateAssignmentStateTriggerType =
  function updateAssignmentState(
    successState,
    avoidServerCall,
    workspaceId,
    workspaceMaterialId,
    existantReplyId,
    successMessage,
    callback
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        let replyId: number = existantReplyId;
        if (!avoidServerCall) {
          const replyGenerated: any = await promisify(
            existantReplyId
              ? mApi().workspace.workspaces.materials.replies.update(
                  workspaceId,
                  workspaceMaterialId,
                  existantReplyId,
                  {
                    state: successState,
                  }
                )
              : mApi().workspace.workspaces.materials.replies.create(
                  workspaceId,
                  workspaceMaterialId,
                  {
                    state: successState,
                  }
                ),
            "callback"
          )();
          replyId = replyGenerated ? replyGenerated.id : existantReplyId;
        }
        if (!replyId) {
          const result: Array<{ id: number; state: string }> = (await promisify(
            mApi().workspace.workspaces.materials.replies.read(
              workspaceId,
              workspaceMaterialId
            ),
            "callback"
          )()) as Array<{ id: number; state: string }>;
          if (result[0] && result[0].id) {
            replyId = result[0].id;
          }
        }

        dispatch({
          type: "UPDATE_CURRENT_COMPOSITE_REPLIES_UPDATE_OR_CREATE_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER",
          payload: {
            workspaceMaterialReplyId: replyId,
            state: successState,
            workspaceMaterialId,
          },
        });

        callback && callback();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.updateError", {
              context: "answers",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * LoadWorkspaceDetailsInCurrentWorkspaceTriggerType
 */
export interface LoadWorkspaceDetailsInCurrentWorkspaceTriggerType {
  (): AnyActionType;
}

/**
 * UpdateWorkspaceDetailsForCurrentWorkspaceTriggerType
 */
export interface UpdateWorkspaceDetailsForCurrentWorkspaceTriggerType {
  (data: {
    newDetails: WorkspaceDetailsType;
    success: () => void;
    fail: () => void;
  }): AnyActionType;
}

/**
 * LoadWorkspaceChatStatusTriggerType
 */
export interface LoadWorkspaceChatStatusTriggerType {
  (): AnyActionType;
}

/**
 * UpdateWorkspaceProducersForCurrentWorkspaceTriggerType
 */
export interface UpdateWorkspaceProducersForCurrentWorkspaceTriggerType {
  (data: {
    appliedProducers: Array<WorkspaceProducerType>;
    success: () => void;
    fail: () => void;
  }): AnyActionType;
}

/**
 * LoadWorkspaceTypesTriggerType
 */
export interface LoadWorkspaceTypesTriggerType {
  (): AnyActionType;
}

/**
 * DeleteCurrentWorkspaceImageTriggerType
 */
export interface DeleteCurrentWorkspaceImageTriggerType {
  (): AnyActionType;
}

export type CopyCurrentWorkspaceStepType =
  | "initial-copy"
  | "change-date"
  | "copy-areas"
  | "copy-materials"
  | "copy-background-picture"
  | "done";

/**
 * CopyCurrentWorkspaceTriggerType
 */
export interface CopyCurrentWorkspaceTriggerType {
  (data: {
    description: string;
    name: string;
    nameExtension?: string;
    beginDate: string;
    endDate: string;
    copyDiscussionAreas: boolean;
    copyMaterials: "NO" | "CLONE" | "LINK";
    copyBackgroundPicture: boolean;
    success: (
      step: CopyCurrentWorkspaceStepType,
      workspace: WorkspaceType
    ) => void;
    fail: () => void;
  }): AnyActionType;
}

export type CreateWorkspaceStateType =
  | "workspace-create"
  | "add-details"
  | "add-students"
  | "add-teachers"
  | "done";
export type UpdateWorkspaceStateType =
  | "workspace-update"
  | "add-details"
  | "add-students"
  | "remove-students"
  | "add-teachers"
  | "remove-teachers"
  | "done";

/**
 * loadWorkspaceChatStatus
 */
const loadWorkspaceChatStatus: LoadWorkspaceChatStatusTriggerType =
  function loadWorkspaceChatStatus() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const chatStatus: WorkspaceChatStatusType = <WorkspaceChatStatusType>(
          await promisify(
            mApi().chat.workspaceChatSettings.read(
              getState().workspaces.currentWorkspace.id
            ),
            "callback"
          )()
        );

        const currentWorkspace: WorkspaceType =
          getState().workspaces.currentWorkspace;

        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            original: currentWorkspace,
            update: { chatStatus },
          },
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              context: "chatSettings",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * loadWorkspaceDetailsInCurrentWorkspace
 */
const loadWorkspaceDetailsInCurrentWorkspace: LoadWorkspaceDetailsInCurrentWorkspaceTriggerType =
  function loadWorkspaceDetailsInCurrentWorkspace() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const details: WorkspaceDetailsType = <WorkspaceDetailsType>(
          await promisify(
            mApi().workspace.workspaces.details.read(
              getState().workspaces.currentWorkspace.id
            ),
            "callback"
          )()
        );
        const currentWorkspace: WorkspaceType =
          getState().workspaces.currentWorkspace;

        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            original: currentWorkspace,
            update: {
              details,
            },
          },
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              complex: "nameDetails",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * updateWorkspaceDetailsForCurrentWorkspace
 * @param data data
 */
const updateWorkspaceDetailsForCurrentWorkspace: UpdateWorkspaceDetailsForCurrentWorkspaceTriggerType =
  function updateWorkspaceDetailsForCurrentWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const state: StateType = getState();

        await promisify(
          mApi().workspace.workspaces.details.update(
            state.workspaces.currentWorkspace.id,
            data.newDetails
          ),
          "callback"
        )();

        const currentWorkspace: WorkspaceType =
          getState().workspaces.currentWorkspace;

        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            original: currentWorkspace,
            update: {
              details: data.newDetails,
            },
          },
        });

        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.updateError", {
              context: "nameDetails",
            }),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * updateWorkspaceProducersForCurrentWorkspace
 * @param data data
 */
const updateWorkspaceProducersForCurrentWorkspace: UpdateWorkspaceProducersForCurrentWorkspaceTriggerType =
  function updateWorkspaceProducersForCurrentWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const state: StateType = getState();
        const existingProducers = state.workspaces.currentWorkspace.producers;

        const workspaceProducersToAdd =
          existingProducers.length == 0
            ? data.appliedProducers
            : data.appliedProducers.filter((producer) => {
                if (!producer.id) {
                  return producer;
                }
              });

        const workspaceProducersToDelete = existingProducers.filter(
          (producer) => {
            if (producer.id) {
              return !data.appliedProducers.find(
                (keepProducer) => keepProducer.id === producer.id
              );
            }
          }
        );

        await Promise.all(
          workspaceProducersToAdd
            .map((p) =>
              promisify(
                mApi().workspace.workspaces.materialProducers.create(
                  state.workspaces.currentWorkspace.id,
                  p
                ),
                "callback"
              )()
            )
            .concat(
              workspaceProducersToDelete.map((p) =>
                promisify(
                  mApi().workspace.workspaces.materialProducers.del(
                    state.workspaces.currentWorkspace.id,
                    p.id
                  ),
                  "callback"
                )()
              )
            )
        );

        // For some reason the results of the request don't give the new workspace producers
        // it's a mess but whatever
        const newActualWorkspaceProducers: Array<WorkspaceProducerType> = <
          Array<WorkspaceProducerType>
        >await promisify(
          mApi()
            .workspace.workspaces.materialProducers.cacheClear()
            .read(state.workspaces.currentWorkspace.id),
          "callback"
        )();

        const currentWorkspace: WorkspaceType =
          getState().workspaces.currentWorkspace;

        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            original: currentWorkspace,
            update: {
              producers: newActualWorkspaceProducers,
            },
          },
        });

        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.updateError", {
              context: "producers",
            }),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * loadWorkspaceTypes
 */
const loadWorkspaceTypes: LoadWorkspaceTypesTriggerType =
  function loadWorkspaceTypes() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const workspaceTypes: Array<WorkspaceTypeType> = <
          Array<WorkspaceTypeType>
        >await promisify(mApi().workspace.workspaceTypes.read(), "callback")();

        dispatch({
          type: "UPDATE_WORKSPACES_ALL_PROPS",
          payload: {
            types: workspaceTypes,
          },
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              context: "types",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * deleteCurrentWorkspaceImage
 */
const deleteCurrentWorkspaceImage: DeleteCurrentWorkspaceImageTriggerType =
  function deleteCurrentWorkspaceImage() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const state: StateType = getState();
        await Promise.all([
          promisify(
            mApi().workspace.workspaces.workspacefile.del(
              state.workspaces.currentWorkspace.id,
              "workspace-frontpage-image-cropped"
            ),
            "callback"
          )(),
          promisify(
            mApi().workspace.workspaces.del(
              state.workspaces.currentWorkspace.id,
              "workspace-frontpage-image-original"
            ),
            "callback"
          )(),
        ]);

        const currentWorkspace: WorkspaceType =
          getState().workspaces.currentWorkspace;

        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            original: currentWorkspace,
            update: {
              hasCustomImage: false,
            },
          },
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.removeError", {
              context: "coverImage",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * copyCurrentWorkspace
 * @param data data
 */
const copyCurrentWorkspace: CopyCurrentWorkspaceTriggerType =
  function copyCurrentWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const currentWorkspace: WorkspaceType =
          getState().workspaces.currentWorkspace;
        const cloneWorkspace: WorkspaceType = <WorkspaceType>await promisify(
          mApi().workspace.workspaces.create(
            {
              name: data.name,
              nameExtension: data.nameExtension,
              description: data.description,
            },
            {
              sourceWorkspaceEntityId: currentWorkspace.id,
            }
          ),
          "callback"
        )();

        data.success && data.success("initial-copy", cloneWorkspace);

        if (data.copyDiscussionAreas) {
          await promisify(
            mApi().workspace.workspaces.forumAreas.create(
              cloneWorkspace.id,
              {},
              { sourceWorkspaceEntityId: currentWorkspace.id }
            ),
            "callback"
          )();
          data.success && data.success("copy-areas", cloneWorkspace);
        }

        if (data.copyMaterials !== "NO") {
          await promisify(
            mApi().workspace.workspaces.materials.create(
              cloneWorkspace.id,
              {},
              {
                sourceWorkspaceEntityId: currentWorkspace.id,
                targetWorkspaceEntityId: cloneWorkspace.id,
                copyOnlyChildren: true,
                cloneMaterials: data.copyMaterials === "CLONE",
              }
            ),
            "callback"
          )();
          data.success && data.success("copy-materials", cloneWorkspace);
        }

        cloneWorkspace.details = <WorkspaceDetailsType>(
          await promisify(
            mApi().workspace.workspaces.details.read(cloneWorkspace.id),
            "callback"
          )()
        );

        cloneWorkspace.details = <WorkspaceDetailsType>await promisify(
          mApi().workspace.workspaces.details.update(cloneWorkspace.id, {
            ...cloneWorkspace.details,
            beginDate: data.beginDate,
            endDate: data.endDate,
          }),
          "callback"
        )();

        data.success && data.success("change-date", cloneWorkspace);

        if (data.copyBackgroundPicture) {
          await promisify(
            mApi().workspace.workspaces.workspacefilecopy.create(
              currentWorkspace.id,
              cloneWorkspace.id
            ),
            "callback"
          )();
          data.success &&
            data.success("copy-background-picture", cloneWorkspace);
        }

        data.success && data.success("done", cloneWorkspace);
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.copyError", {
              ns: "workspace",
            }),
            "error"
          )
        );

        data.fail && data.fail();
      }
    };
  };

/**
 * updateCurrentWorkspaceImagesB64
 * @param data data
 */
const updateCurrentWorkspaceImagesB64: UpdateCurrentWorkspaceImagesB64TriggerType =
  function updateCurrentWorkspaceImagesB64(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const currentWorkspace: WorkspaceType =
          getState().workspaces.currentWorkspace;
        const mimeTypeRegex = /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/;
        const mimeTypeOriginal =
          data.originalB64 && data.originalB64.match(mimeTypeRegex)[1];
        const mimeTypeCropped =
          data.croppedB64 && data.croppedB64.match(mimeTypeRegex)[1];

        if (data.delete) {
          await promisify(
            mApi().workspace.workspaces.workspacefile.del(
              currentWorkspace.id,
              "workspace-frontpage-image-cropped"
            ),
            "callback"
          )();
        } else if (data.croppedB64) {
          await promisify(
            mApi().workspace.workspaces.workspacefile.create(
              currentWorkspace.id,
              {
                fileIdentifier: "workspace-frontpage-image-cropped",
                contentType: mimeTypeCropped,
                base64Data: data.croppedB64,
              }
            ),
            "callback"
          )();
        }

        if (data.delete) {
          await promisify(
            mApi().workspace.workspaces.workspacefile.del(
              currentWorkspace.id,
              "workspace-frontpage-image-original"
            ),
            "callback"
          )();
        } else if (data.originalB64) {
          await promisify(
            mApi().workspace.workspaces.workspacefile.create(
              currentWorkspace.id,
              {
                fileIdentifier: "workspace-frontpage-image-original",
                contentType: mimeTypeOriginal,
                base64Data: data.originalB64,
              }
            ),
            "callback"
          )();
        }

        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.updateError", {
              context: "coverImage",
            }),
            "error"
          )
        );

        data.fail && data.fail();
      }
    };
  };

/**
 * loadCurrentWorkspaceUserGroupPermissions
 */
const loadCurrentWorkspaceUserGroupPermissions: LoadCurrentWorkspaceUserGroupPermissionsTriggerType =
  function loadCurrentWorkspaceUserGroupPermissions() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const currentWorkspace: WorkspaceType =
          getState().workspaces.currentWorkspace;
        const permissions: WorkspacePermissionsType[] = <
          WorkspacePermissionsType[]
        >await promisify(
          mApi().workspace.workspaces.signupGroups.read(
            getState().workspaces.currentWorkspace.id
          ),
          "callback"
        )();

        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            original: currentWorkspace,
            update: {
              permissions,
            },
          },
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              context: "permissions",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * updateWorkspaceEditModeState
 * @param data data
 * @param restoreActiveFromLocalStorage restoreActiveFromLocalStorage
 */
const updateWorkspaceEditModeState: UpdateWorkspaceEditModeStateTriggerType =
  function updateWorkspaceEditModeState(data, restoreActiveFromLocalStorage) {
    if (restoreActiveFromLocalStorage && typeof data.active !== "undefined") {
      localStorage.setItem("__editmode__active", JSON.stringify(data.active));
    } else if (restoreActiveFromLocalStorage) {
      return {
        type: "UPDATE_WORKSPACES_EDIT_MODE_STATE",
        payload: {
          ...data,
          active: JSON.parse(
            localStorage.getItem("__editmode__active") || "false"
          ),
        },
      };
    }
    return {
      type: "UPDATE_WORKSPACES_EDIT_MODE_STATE",
      payload: data,
    };
  };

export {
  loadUserWorkspaceCurriculumFiltersFromServer,
  loadUserWorkspaceEducationFiltersFromServer,
  setWorkspaceStateFilters,
  loadWorkspacesFromServer,
  loadMoreWorkspacesFromServer,
  signupIntoWorkspace,
  loadUserWorkspacesFromServer,
  loadLastWorkspaceFromServer,
  setCurrentWorkspace,
  requestAssessmentAtWorkspace,
  cancelAssessmentAtWorkspace,
  updateWorkspace,
  loadStaffMembersOfWorkspace,
  loadWorkspaceChatStatus,
  updateAssignmentState,
  updateLastWorkspace,
  loadStudentsOfWorkspace,
  toggleActiveStateOfStudentOfWorkspace,
  loadWorkspaceDetailsInCurrentWorkspace,
  loadWorkspaceTypes,
  deleteCurrentWorkspaceImage,
  copyCurrentWorkspace,
  updateWorkspaceDetailsForCurrentWorkspace,
  updateWorkspaceProducersForCurrentWorkspace,
  updateCurrentWorkspaceImagesB64,
  loadCurrentWorkspaceUserGroupPermissions,
  loadTemplatesFromServer,
  updateWorkspaceEditModeState,
  updateCurrentWorkspaceActivity,
  updateCurrentWorkspaceAssessmentRequest,
  updateCurrentWorkspaceInterimEvaluationRequests,
  setAvailableCurriculums,
};
