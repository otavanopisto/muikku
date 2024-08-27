/* eslint-disable @typescript-eslint/no-explicit-any */
import actions, { displayNotification } from "../base/notifications";
import {
  WorkspaceMaterialReferenceType,
  WorkspaceDataType,
  WorkspacesActiveFiltersType,
  WorkspacesStateType,
  WorkspacesStatePatch,
  WorkspaceUpdateType,
  WorkspaceSignUpDetails,
  MaterialContentNodeWithIdAndLogic,
  WorkspaceEditModeStateType,
  WorkspaceStateFilterType,
} from "~/reducers/workspaces";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import {
  loadWorkspacesHelper,
  reuseExistantValue,
} from "~/actions/workspaces/helpers";
import { Dispatch } from "react-redux";
import MApi, { isMApiError } from "~/api/api";
import {
  InterimEvaluationRequest,
  WorkspaceActivity,
  WorkspaceAssessmentStateType,
  AssessmentRequest,
  WorkspaceAdditionalInfo,
  WorkspaceDetails,
  WorkspaceMaterialProducer,
  Curriculum,
  WorkspaceStudent,
  UserStaffSearchResult,
  WorkspaceStudentSearchResult,
  GetWorkspaceStudentsRequest,
  MaterialReply,
  MaterialCompositeReplyStateType,
  EducationType,
  WorkspaceSettings,
} from "~/generated/client";
import i18n from "~/locales/i18n";

export type UPDATE_AVAILABLE_CURRICULUMS = SpecificActionType<
  "UPDATE_AVAILABLE_CURRICULUMS",
  Curriculum[]
>;

export type UPDATE_USER_WORKSPACES = SpecificActionType<
  "UPDATE_USER_WORKSPACES",
  WorkspaceDataType[]
>;

export type UPDATE_LAST_WORKSPACES = SpecificActionType<
  "UPDATE_LAST_WORKSPACES",
  WorkspaceMaterialReferenceType[]
>;

export type SET_CURRENT_WORKSPACE = SpecificActionType<
  "SET_CURRENT_WORKSPACE",
  WorkspaceDataType
>;

export type UPDATE_CURRENT_WORKSPACE_ACTIVITY = SpecificActionType<
  "UPDATE_CURRENT_WORKSPACE_ACTIVITY",
  WorkspaceActivity
>;

export type UPDATE_CURRENT_WORKSPACE_ASESSMENT_REQUESTS = SpecificActionType<
  "UPDATE_CURRENT_WORKSPACE_ASESSMENT_REQUESTS",
  AssessmentRequest[]
>;

export type UPDATE_CURRENT_WORKSPACE_INTERIM_EVALUATION_REQUESTS =
  SpecificActionType<
    "UPDATE_CURRENT_WORKSPACE_INTERIM_EVALUATION_REQUESTS",
    InterimEvaluationRequest[]
  >;

export type UPDATE_WORKSPACE_ASSESSMENT_STATE = SpecificActionType<
  "UPDATE_WORKSPACE_ASSESSMENT_STATE",
  {
    workspace: WorkspaceDataType;
    newState: WorkspaceAssessmentStateType;
    newDate: string;
    newAssessmentRequest?: AssessmentRequest;
    oldAssessmentRequestToDelete?: AssessmentRequest;
  }
>;

export type UPDATE_WORKSPACES_EDIT_MODE_STATE = SpecificActionType<
  "UPDATE_WORKSPACES_EDIT_MODE_STATE",
  Partial<WorkspaceEditModeStateType>
>;

export type UPDATE_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES =
  SpecificActionType<
    "UPDATE_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES",
    EducationType[]
  >;

export type UPDATE_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS =
  SpecificActionType<
    "UPDATE_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS",
    Curriculum[]
  >;

export type UPDATE_WORKSPACES_AVAILABLE_FILTERS_STATE_TYPES =
  SpecificActionType<
    "UPDATE_WORKSPACES_AVAILABLE_FILTERS_STATE_TYPES",
    WorkspaceStateFilterType[]
  >;

export type UPDATE_WORKSPACES_ACTIVE_FILTERS = SpecificActionType<
  "UPDATE_WORKSPACES_ACTIVE_FILTERS",
  WorkspacesActiveFiltersType
>;

export type UPDATE_WORKSPACES_ALL_PROPS = SpecificActionType<
  "UPDATE_WORKSPACES_ALL_PROPS",
  WorkspacesStatePatch
>;

export type UPDATE_WORKSPACES_STATE = SpecificActionType<
  "UPDATE_WORKSPACES_STATE",
  WorkspacesStateType
>;

export type UPDATE_WORKSPACE = SpecificActionType<
  "UPDATE_WORKSPACE",
  {
    original: WorkspaceDataType;
    update: WorkspaceUpdateType;
  }
>;

export type UPDATE_WORKSPACE_SETTINGS = SpecificActionType<
  "UPDATE_WORKSPACE_SETTINGS",
  WorkspaceSettings
>;

export type UPDATE_CURRENT_COMPOSITE_REPLIES_UPDATE_OR_CREATE_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER =
  SpecificActionType<
    "UPDATE_CURRENT_COMPOSITE_REPLIES_UPDATE_OR_CREATE_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER",
    {
      state: MaterialCompositeReplyStateType;
      workspaceMaterialId: number;
      workspaceMaterialReplyId: number;
    }
  >;

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
 * UpdateCurrentWorkspaceInterimEvaluationRequestsTrigger
 */
export interface UpdateCurrentWorkspaceInterimEvaluationRequestsTrigger {
  (data?: {
    requestData: InterimEvaluationRequest;
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
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const organizationApi = MApi.getOrganizationApi();

      try {
        const organizationWorkspaces =
          (await organizationApi.getOrganizationWorkspaces({
            templates: "ONLY_TEMPLATES",
            maxResults: 5,
            q: query || "",
          })) as WorkspaceDataType[];

        dispatch({
          type: "UPDATE_ORGANIZATION_TEMPLATES",
          payload: organizationWorkspaces,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "workspace",
              context: "templates",
            }),
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
      const workspaceApi = MApi.getWorkspaceApi();

      const userId = getState().status.userId;
      try {
        const workspaces = (await workspaceApi.getWorkspaces({
          userId: userId,
        })) as WorkspaceDataType[];

        dispatch({
          type: "UPDATE_USER_WORKSPACES",
          payload: workspaces,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "workspace",
              context: "workspaces",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * LoadLastWorkspacesFromServerTriggerType
 */
export interface LoadLastWorkspacesFromServerTriggerType {
  (): AnyActionType;
}

/**
 * loadLastWorkspacesFromServer
 */
const loadLastWorkspacesFromServer: LoadLastWorkspacesFromServerTriggerType =
  function loadLastWorkspacesFromServer() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const userApi = MApi.getUserApi();

      try {
        const lastWorkspaces = JSON.parse(
          (
            await userApi.getUserProperty({
              key: "last-workspaces",
            })
          ).value
        ) as WorkspaceMaterialReferenceType[];

        dispatch({
          type: "UPDATE_LAST_WORKSPACES",
          payload: lastWorkspaces,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "workspace",
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
const updateLastWorkspaces: UpdateLastWorkspaceTriggerType =
  function updateLastWorkspace(newReference) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const userApi = MApi.getUserApi();

      try {
        // Make a deep copy of the current state of last workspaces
        // Because lastWorkspaces can be null if the user has no last workspaces
        // in this case we need to create an empty array instead
        const lastWorkspaces =
          (JSON.parse(
            JSON.stringify(getState().workspaces.lastWorkspaces)
          ) as WorkspaceMaterialReferenceType[]) || [];

        // Location for the newReference according to workspaceId
        const existingReferenceLocation = lastWorkspaces.findIndex(
          (lw) => lw.workspaceId === newReference.workspaceId
        );
        // If there is a reference with the same workspaceId, we remove the old one
        if (existingReferenceLocation !== -1) {
          lastWorkspaces.splice(existingReferenceLocation, 1);
        }

        // If there still are 3 entries, we remove the last one
        if (lastWorkspaces.length === 3) {
          lastWorkspaces.pop();
        }

        // Place the new reference on the top of the array
        lastWorkspaces.unshift(newReference);

        await userApi.setUserProperty({
          setUserPropertyRequest: {
            key: "last-workspaces",
            value: JSON.stringify(lastWorkspaces),
          },
        });

        dispatch({
          type: "UPDATE_LAST_WORKSPACES",
          payload: lastWorkspaces,
        });
      } catch (err) {
        if (!isMApiError(err)) {
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
    success?: (workspace: WorkspaceDataType) => void;
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
 * LoadCUrrentWorkspaceSignupMessageTriggerType
 */
export interface LoadCurrentWorkspaceSignupMessageTriggerType {
  (): AnyActionType;
}

/**
 * LoadCurrentWorkspaceUserGroupPermissionsTriggerType
 */
export interface LoadCurrentWorkspaceUserGroupPermissionsTriggerType {
  (): AnyActionType;
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
      const workspaceApi = MApi.getWorkspaceApi();
      const assessmentRequestApi = MApi.getAssessmentApi();
      const evaluationApi = MApi.getEvaluationApi();

      const current = state.workspaces.currentWorkspace;
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
        let workspace =
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

        let assessmentRequests: AssessmentRequest[];
        let interimEvaluationRequests: InterimEvaluationRequest[];
        let activity: WorkspaceActivity;
        let additionalInfo: WorkspaceAdditionalInfo;
        let contentDescription: MaterialContentNodeWithIdAndLogic;
        let producers: WorkspaceMaterialProducer[];
        let isCourseMember: boolean;
        let details: WorkspaceDetails;
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
          details,
        ] = (await Promise.all([
          reuseExistantValue(true, workspace, () =>
            workspaceApi.getWorkspace({
              workspaceId: data.workspaceId,
            })
          ),

          reuseExistantValue(
            status.permissions.WORKSPACE_REQUEST_WORKSPACE_ASSESSMENT,
            workspace && workspace.assessmentRequests,
            () =>
              assessmentRequestApi.getWorkspaceAssessmentRequests({
                workspaceEntityId: data.workspaceId,
                studentIdentifier: state.status.userSchoolDataIdentifier,
              })
          ),

          status.loggedIn
            ? reuseExistantValue(
                true,
                workspace && workspace.interimEvaluationRequests,
                () =>
                  evaluationApi.getWorkspaceInterimEvaluationRequests({
                    workspaceId: data.workspaceId,
                  })
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
                  evaluationApi.getWorkspaceStudentActivity({
                    workspaceId: data.workspaceId,
                    studentEntityId: state.status.userSchoolDataIdentifier,
                  })
              )
            : null,

          reuseExistantValue(true, workspace && workspace.additionalInfo, () =>
            workspaceApi.getWorkspaceAdditionalInfo({
              workspaceId: data.workspaceId,
            })
          ),

          reuseExistantValue(
            true,
            workspace && workspace.contentDescription,
            () =>
              workspaceApi.getWorkspaceDescription({
                workspaceId: data.workspaceId,
              })
          ),

          reuseExistantValue(true, workspace && workspace.producers, () =>
            workspaceApi.getWorkspaceMaterialProducers({
              workspaceEntityId: data.workspaceId,
            })
          ),

          state.status.loggedIn
            ? reuseExistantValue(
                true,
                workspace &&
                  typeof workspace.isCourseMember !== "undefined" &&
                  workspace.isCourseMember,
                () =>
                  workspaceApi.amIMember({
                    workspaceEntityId: data.workspaceId,
                  })
              )
            : false,

          data.loadDetails || (workspace && workspace.details)
            ? reuseExistantValue(true, workspace && workspace.details, () =>
                workspaceApi.getWorkspaceDetails({
                  workspaceId: data.workspaceId,
                })
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
        workspace.details = details;

        dispatch({
          type: "SET_CURRENT_WORKSPACE",
          payload: workspace,
        });

        data.success && data.success(workspace);
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "workspace",
              context: "workspaces",
            }),
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
      const coursepickerApi = MApi.getCoursepickerApi();

      try {
        const curriculums = await coursepickerApi.getCoursepickerCurriculums();

        dispatch({
          type: "UPDATE_AVAILABLE_CURRICULUMS",
          payload: curriculums,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.sendError", {
              ns: "workspace",
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
      const evaluationApi = MApi.getEvaluationApi();

      if (state.status.loggedIn) {
        try {
          const activity = await evaluationApi.getWorkspaceStudentActivity({
            workspaceId: state.workspaces.currentWorkspace.id,
            studentEntityId: state.status.userSchoolDataIdentifier,
          });

          dispatch({
            type: "UPDATE_CURRENT_WORKSPACE_ACTIVITY",
            payload: activity,
          });
        } catch (err) {
          dispatch(
            actions.displayNotification(
              i18n.t("notifications.loadError", {
                ns: "workspace",
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
      const assessmentRequestApi = MApi.getAssessmentApi();

      if (state.status.loggedIn) {
        try {
          const assessmentRequests =
            await assessmentRequestApi.getWorkspaceAssessmentRequests({
              workspaceEntityId: state.workspaces.currentWorkspace.id,
              studentIdentifier: state.status.userSchoolDataIdentifier,
            });

          dispatch({
            type: "UPDATE_CURRENT_WORKSPACE_ASESSMENT_REQUESTS",
            payload: assessmentRequests,
          });
        } catch (err) {
          if (!isMApiError(err)) {
            throw err;
          }

          dispatch(
            actions.displayNotification(
              i18n.t("notifications.loadError", {
                ns: "workspace",
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
    workspace: WorkspaceDataType;
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
    workspace: WorkspaceDataType;
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
      const assessmentRequestApi = MApi.getAssessmentApi();

      try {
        await assessmentRequestApi.createWorkspaceAssessmentRequest({
          workspaceEntityId: data.workspace.id,
          createWorkspaceAssessmentRequestRequest: {
            requestText: data.text,
          },
        });

        // First finding current "assessmentState state" and depending what state it is assign new state
        // Will be changed when module specific evaluation assessment request functionality is implemented
        let newAssessmentState =
          data.workspace.activity.assessmentStates[0].state;

        if (newAssessmentState === "unassessed") {
          newAssessmentState = "pending";
        } else if (newAssessmentState == "pass") {
          newAssessmentState = "pending_pass";
        } else if (newAssessmentState == "fail") {
          newAssessmentState = "pending_fail";
        } else {
          newAssessmentState = "pending";
        }

        // Must be done for now. To update activity when assessmentRequest is being made.
        // In future changing state locally is better options one combination workspace module specific
        // request are implemented
        dispatch(updateCurrentWorkspaceActivity({}));

        // Same here
        dispatch(updateCurrentWorkspaceAssessmentRequest({}));

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.sendSuccess", {
              ns: "workspace",
              context: "evaluationRequests",
            }),
            "success"
          )
        );
        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.sendError", {
              ns: "workspace",
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
    workspace: WorkspaceDataType;
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
      const assessmentRequestApi = MApi.getAssessmentApi();

      try {
        const assessmentRequest: AssessmentRequest =
          data.workspace.assessmentRequests[
            data.workspace.assessmentRequests.length - 1
          ];
        if (!assessmentRequest) {
          dispatch(
            actions.displayNotification(
              i18n.t("notifications.cancelError", {
                ns: "workspace",
                context: "evaluationRequests",
              }),
              "error"
            )
          );
          data.fail && data.fail();
          return;
        }

        await assessmentRequestApi.deleteWorkspaceAssessmentRequest({
          workspaceEntityId: data.workspace.id,
          assessmentRequestId: assessmentRequest.id,
        });

        // First finding current "assessmentState state" and depending what state it is assign new state
        // Will be changed when module specific evaluation assessment request functionality is implemented
        let newAssessmentState =
          data.workspace.activity.assessmentStates[0].state;

        if (newAssessmentState == "pending") {
          newAssessmentState = "unassessed";
        } else if (newAssessmentState == "pending_pass") {
          newAssessmentState = "pass";
        } else if (newAssessmentState == "pending_fail") {
          newAssessmentState = "fail";
        }

        // Must be done for now. To update activity when assessmentRequest is being made.
        // In future changing state locally is better options one combination workspace module specific
        // request are implemented
        dispatch(updateCurrentWorkspaceActivity({}));

        // Same here
        dispatch(updateCurrentWorkspaceAssessmentRequest({}));

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.sendSuccess", {
              ns: "workspace",
              context: "evaluationRequestsCancel",
            }),
            "success"
          )
        );
        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.cancelError", {
              ns: "workspace",
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
  }): AnyActionType;
}

/**
 * UpdateAssignmentStateTriggerType
 */
export interface UpdateAssignmentStateTriggerType {
  (
    successState: MaterialCompositeReplyStateType,
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
    filters: WorkspaceStateFilterType[]
  ): AnyActionType;
}

/**
 * LoadUserWorkspaceCurriculumFiltersFromServerTriggerType
 */
export interface LoadUserWorkspaceCurriculumFiltersFromServerTriggerType {
  (
    loadOrganizationWorkspaceFilters: boolean,
    callback?: (curriculums: Curriculum[]) => void
  ): AnyActionType;
}

/**
 * UpdateWorkspaceTriggerType
 */
export interface UpdateWorkspaceTriggerType {
  (data: {
    workspace: WorkspaceDataType;
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
 * UpdateWorkspaceSettingsTriggerType
 */
export interface UpdateWorkspaceSettingsTriggerType {
  (data: {
    workspace: WorkspaceDataType;
    update: WorkspaceSettings;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * LoadUsersOfWorkspaceTriggerType
 */
export interface LoadUsersOfWorkspaceTriggerType {
  (data: {
    workspace: WorkspaceDataType;
    payload?: {
      q: string;
      active?: boolean;
      firstResult?: number;
      maxResults?: number;
    };
    success?: (
      users: WorkspaceStudentSearchResult | UserStaffSearchResult
    ) => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * ToggleActiveStateOfStudentOfWorkspaceTriggerType
 */
export interface ToggleActiveStateOfStudentOfWorkspaceTriggerType {
  (data: {
    workspace: WorkspaceDataType;
    student: WorkspaceStudent;
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
      const coursepickerApi = MApi.getCoursepickerApi();
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        if (!loadOrganizationWorkspaceFilters) {
          const educationTypes =
            await coursepickerApi.getCoursepickerEducationTypes();

          dispatch({
            type: "UPDATE_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES",
            payload: educationTypes,
          });
        } else {
          const educationTypes = await workspaceApi.getEducationTypes();

          dispatch({
            type: "UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES",
            payload: educationTypes,
          });
        }
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "workspace",
              context: "educationFilters",
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
      const coursepickerApi = MApi.getCoursepickerApi();

      try {
        const curriculums = await coursepickerApi.getCoursepickerCurriculums();

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
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "workspace",
              context: "curriculumFilters",
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
      const coursepickerApi = MApi.getCoursepickerApi();

      try {
        await coursepickerApi.workspaceSignUp({
          workspaceId: data.workspace.id,
        });

        window.location.href = `${getState().status.contextPath}/workspace/${
          data.workspace.urlName
        }`;
        data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.sendError", {
              ns: "workspace",
              context: "signUp",
            }),
            "error"
          )
        );
        data.fail();
      }
    };
  };

/**
 * Updates the assignment state of a workspace material.
 * @param data data
 */
const updateWorkspaceSettings: UpdateWorkspaceSettingsTriggerType =
  function updateWorkspaceSettings(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        await workspaceApi.updateWorkspaceSettings({
          updateWorkspaceSettingsRequest: data.update,
          workspaceId: data.workspace.id,
        });
        const workspaceUpdate = data.update;

        delete workspaceUpdate["defaultSignupMessage"];
        delete workspaceUpdate["subjectIdentifier"];
        delete workspaceUpdate["workspaceTypeIdentifier"];
        delete workspaceUpdate["organizationEntityId"];
        delete workspaceUpdate["signupGroups"];
        delete workspaceUpdate["signupMessages"];

        // Update the visible workspace values
        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            original: data.workspace,
            update: workspaceUpdate,
          },
        });
        // Update the settings
        dispatch({
          type: "UPDATE_WORKSPACE_SETTINGS",
          payload: data.update,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.updateError", {
              ns: "workspace",
              context: "settings",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * Updates the assignment state of a workspace material.

 * @param data data
 */
const updateWorkspace: UpdateWorkspaceTriggerType = function updateWorkspace(
  data
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const workspaceApi = MApi.getWorkspaceApi();

    // Note there is a lot of logic related to managing workspace object in this function,
    // mostly because how WorkspaceDataType interface was created, so its not one to one with
    // api endpoints etc...

    const actualOriginal: WorkspaceDataType = { ...data.workspace };
    delete actualOriginal["activity"];
    delete actualOriginal["studentActivity"];
    delete actualOriginal["forumStatistics"];
    delete actualOriginal["assessmentRequests"];
    delete actualOriginal["interimEvaluationRequests"];
    delete actualOriginal["additionalInfo"];
    delete actualOriginal["staffMembers"];
    delete actualOriginal["students"];
    delete actualOriginal["details"];
    delete actualOriginal["producers"];
    delete actualOriginal["contentDescription"];
    delete actualOriginal["isCourseMember"];
    delete actualOriginal["activityLogs"];
    delete actualOriginal["permissions"];
    delete actualOriginal["inactiveStudents"];
    // delete actualOriginal["defaultSignupMessage"];

    try {
      const newDetails = data.update.details;
      const newPermissions = data.update.permissions;
      const appliedProducers = data.update.producers;
      const currentWorkspace = getState().workspaces.currentWorkspace;
      // const newSignupMessage = data.update.defaultSignupMessage;

      // I left the workspace image out of this, because it never is in the application state anyway
      // These need to be removed from the object for the basic stuff to not fail
      delete data.update["details"];
      delete data.update["permissions"];
      delete data.update["producers"];
      // delete data.update["defaultSignupMessage"];

      // First update the workspace
      if (data.update) {
        await workspaceApi.updateWorkspace({
          workspaceId: data.workspace.id,
          body: Object.assign(actualOriginal, data.update),
        });
      }

      // Then the details - if any
      if (newDetails) {
        await workspaceApi.updateWorkspaceDetails({
          workspaceId: data.workspace.id,
          updateWorkspaceDetailsRequest: newDetails,
        });

        // Add details back to the update object
        data.update.details = newDetails;

        // Details affect additionalInfo, so I guess we load that too. It's not a "single source of truth" when there's duplicates in the model, is it?
        const additionalInfo = await workspaceApi.getWorkspaceAdditionalInfo({
          workspaceId: currentWorkspace.id,
        });

        data.update.additionalInfo = additionalInfo;
      }

      // Then signup message - if any
      // if (newSignupMessage) {
      //   await workspaceApi.updateWorkspaceSignupMessage({
      //     workspaceId: data.workspace.id,
      //     updateWorkspaceSignupMessageRequest: newSignupMessage,
      //   });

      //   data.update.defaultSignupMessage = newSignupMessage;
      // }

      // Then permissions - if any
      if (newPermissions) {
        await workspaceApi.updateWorkspaceSignupGroups({
          workspaceEntityId: currentWorkspace.id,
          updateWorkspaceSignupGroupsRequest: {
            workspaceSignupGroups: newPermissions,
          },
        });

        data.update.permissions = newPermissions;
      }

      // Then producers
      if (appliedProducers) {
        const updatedProducersList =
          await workspaceApi.createWorkspaceMaterialProducers({
            workspaceEntityId: currentWorkspace.id,
            requestBody: appliedProducers.map((p) => p.name),
          });

        data.update.producers = updatedProducersList;
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

      if (!isMApiError(err)) {
        throw err;
      }

      dispatch(
        displayNotification(
          i18n.t("notifications.updateError", {
            ns: "workspace",
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
      const userApi = MApi.getUserApi();

      try {
        const staffMembers = await userApi.getStaffMembers({
          workspaceEntityId: data.workspace.id,
          properties:
            "profile-phone,profile-appointmentCalendar,profile-extraInfo,profile-whatsapp,profile-vacation-start,profile-vacation-end",
          firstResult: data.payload ? data.payload.firstResult : 0,
          maxResults: data.payload ? data.payload.maxResults : 10,
        });

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
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "workspace",
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
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        const request: GetWorkspaceStudentsRequest = {
          workspaceEntityId: data.workspace.id,
          q: data.payload && data.payload.q ? data.payload.q : "",
        };

        if (data.payload && data.payload.firstResult >= 0) {
          request.firstResult = data.payload.firstResult;
        }

        if (data.payload && data.payload.maxResults) {
          request.maxResults = data.payload.maxResults;
        }

        if (data.payload && data.payload.active !== undefined) {
          request.active = data.payload.active;
        }

        const students = await workspaceApi.getWorkspaceStudents(request);

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
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "workspace",
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
      const workspaceApi = MApi.getWorkspaceApi();

      const oldStudents = data.workspace.students;
      try {
        const newStudent: WorkspaceStudent = {
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

        const payload = {
          ...data.workspace.students,
          results: newStudents,
        };

        await workspaceApi.updateWorkspaceStudent({
          workspaceEntityId: data.workspace.id,
          studentId: newStudent.workspaceUserEntityId,
          updateWorkspaceStudentRequest: newStudent,
        });

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
        if (!isMApiError(err)) {
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
            i18n.t("notifications.archiveError", {
              ns: "users",
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
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        let replyId: number = existantReplyId;
        if (!avoidServerCall) {
          let replyGenerated: MaterialReply = null;

          if (existantReplyId) {
            replyGenerated = await workspaceApi.updateWorkspaceMaterialReply({
              workspaceEntityId: workspaceId,
              workspaceMaterialId: workspaceMaterialId,
              replyId: existantReplyId,
              updateWorkspaceMaterialReplyRequest: {
                state: successState,
              },
            });
          } else {
            replyGenerated = await workspaceApi.createWorkspaceMaterialReply({
              workspaceEntityId: workspaceId,
              workspaceMaterialId: workspaceMaterialId,
              createWorkspaceMaterialReplyRequest: {
                state: successState,
              },
            });
          }

          replyId = replyGenerated ? replyGenerated.id : existantReplyId;
        }
        if (!replyId) {
          const result = await workspaceApi.getWorkspaceMaterialReplies({
            workspaceEntityId: workspaceId,
            workspaceMaterialId: workspaceMaterialId,
          });

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
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.updateError", {
              ns: "workspace",
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
    newDetails: WorkspaceDetails;
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
    appliedProducers: Array<WorkspaceMaterialProducer>;
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
      workspace: WorkspaceDataType
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
 * loadWorkspaceDetailsInCurrentWorkspace
 */
const loadWorkspaceDetailsInCurrentWorkspace: LoadWorkspaceDetailsInCurrentWorkspaceTriggerType =
  function loadWorkspaceDetailsInCurrentWorkspace() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        const details = await workspaceApi.getWorkspaceDetails({
          workspaceId: getState().workspaces.currentWorkspace.id,
        });

        const currentWorkspace = getState().workspaces.currentWorkspace;

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
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "workspace",
              context: "nameDetails",
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
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        const state = getState();

        await workspaceApi.updateWorkspaceDetails({
          workspaceId: state.workspaces.currentWorkspace.id,
          updateWorkspaceDetailsRequest: data.newDetails,
        });

        const currentWorkspace = getState().workspaces.currentWorkspace;

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
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.updateError", {
              ns: "workspace",
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
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        const state = getState();

        const updatedProducersList =
          await workspaceApi.createWorkspaceMaterialProducers({
            workspaceEntityId: state.workspaces.currentWorkspace.id,
            requestBody: data.appliedProducers.map((p) => p.name),
          });

        const currentWorkspace = getState().workspaces.currentWorkspace;

        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: {
            original: currentWorkspace,
            update: {
              producers: updatedProducersList,
            },
          },
        });

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.updateError", {
              ns: "workspace",
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
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        const workspaceTypes = await workspaceApi.getWorkspaceTypes();

        dispatch({
          type: "UPDATE_WORKSPACES_ALL_PROPS",
          payload: {
            types: workspaceTypes,
          },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "workspace",
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
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        const state = getState();

        await Promise.all([
          workspaceApi.deleteWorkspaceFile({
            workspaceId: state.workspaces.currentWorkspace.id,
            fileIdentifier: "workspace-frontpage-image-cropped",
          }),
          workspaceApi.deleteWorkspaceFile({
            workspaceId: state.workspaces.currentWorkspace.id,
            fileIdentifier: "workspace-frontpage-image-original",
          }),
        ]);

        const currentWorkspace = getState().workspaces.currentWorkspace;

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
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.removeError", {
              ns: "workspace",
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
      const workspaceApi = MApi.getWorkspaceApi();
      const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();

      try {
        const currentWorkspace = getState().workspaces.currentWorkspace;

        const cloneWorkspace = (await workspaceApi.createWorkspace({
          sourceWorkspaceEntityId: currentWorkspace.id,
          createWorkspaceRequest: {
            name: data.name,
            nameExtension: data.nameExtension,
            description: data.description,
          },
        })) as WorkspaceDataType;

        data.success && data.success("initial-copy", cloneWorkspace);

        if (data.copyDiscussionAreas) {
          await workspaceDiscussionApi.createWorkspaceDiscussionArea({
            workspaceentityId: cloneWorkspace.id,
            sourceWorkspaceEntityId: currentWorkspace.id,
          });

          data.success && data.success("copy-areas", cloneWorkspace);
        }

        if (data.copyMaterials !== "NO") {
          await workspaceApi.createWorkspaceMaterial({
            workspaceEntityId: cloneWorkspace.id,
            sourceWorkspaceEntityId: currentWorkspace.id,
            targetWorkspaceEntityId: cloneWorkspace.id,
            copyOnlyChildren: true,
            cloneMaterials: data.copyMaterials === "CLONE",
          });

          data.success && data.success("copy-materials", cloneWorkspace);
        }

        // Get the details again, because they are not included in the clone
        cloneWorkspace.details = await workspaceApi.getWorkspaceDetails({
          workspaceId: cloneWorkspace.id,
        });

        // Update the details to cloned workspace
        cloneWorkspace.details = await workspaceApi.updateWorkspaceDetails({
          workspaceId: cloneWorkspace.id,
          updateWorkspaceDetailsRequest: {
            ...cloneWorkspace.details,
            beginDate: data.beginDate,
            endDate: data.endDate,
          },
        });

        data.success && data.success("change-date", cloneWorkspace);

        if (data.copyBackgroundPicture) {
          await workspaceApi.copyWorkspaceFile({
            workspaceEntityId: currentWorkspace.id,
            toWorkspaceId: cloneWorkspace.id,
          });

          data.success &&
            data.success("copy-background-picture", cloneWorkspace);
        }

        data.success && data.success("done", cloneWorkspace);
      } catch (err) {
        if (!isMApiError(err)) {
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
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        const currentWorkspace = getState().workspaces.currentWorkspace;
        const mimeTypeRegex = /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/;
        const mimeTypeOriginal =
          data.originalB64 && data.originalB64.match(mimeTypeRegex)[1];
        const mimeTypeCropped =
          data.croppedB64 && data.croppedB64.match(mimeTypeRegex)[1];

        if (data.delete) {
          await workspaceApi.deleteWorkspaceFile({
            workspaceId: currentWorkspace.id,
            fileIdentifier: "workspace-frontpage-image-cropped",
          });
        } else if (data.croppedB64) {
          await workspaceApi.createWorkspaceFile({
            workspaceId: currentWorkspace.id,
            createWorkspaceFileRequest: {
              fileIdentifier: "workspace-frontpage-image-cropped",
              contentType: mimeTypeCropped,
              base64Data: data.croppedB64,
            },
          });
        }

        if (data.delete) {
          await workspaceApi.deleteWorkspaceFile({
            workspaceId: currentWorkspace.id,
            fileIdentifier: "workspace-frontpage-image-original",
          });
        } else if (data.originalB64) {
          await workspaceApi.createWorkspaceFile({
            workspaceId: currentWorkspace.id,
            createWorkspaceFileRequest: {
              fileIdentifier: "workspace-frontpage-image-original",
              contentType: mimeTypeOriginal,
              base64Data: data.originalB64,
            },
          });
        }

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.updateError", {
              ns: "workspace",
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
 * loadCurrentWorkspaceSignupMessage
 */
// const loadCurrentWorkspaceSignupMessage: LoadCurrentWorkspaceSignupMessageTriggerType =
//   function loadCurrentWorkspaceSignupMessage() {
//     return async (
//       dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
//       getState: () => StateType
//     ) => {
//       const workspaceApi = MApi.getWorkspaceApi();

//       try {
//         const currentWorkspace = getState().workspaces.currentWorkspace;

//         // Because the signup message is not included in the workspace object, we have to fetch it separately
//         const signupMessage = await workspaceApi.getWorkspaceSignupMessage({
//           workspaceId: currentWorkspace.id,
//         });

//         dispatch({
//           type: "UPDATE_WORKSPACE",
//           payload: {
//             original: currentWorkspace,
//             update: {
//               defaultSignupMessage:
//                 signupMessage.caption === "" || signupMessage.content === ""
//                   ? null
//                   : signupMessage,
//             },
//           },
//         });
//       } catch (err) {
//         if (!isMApiError(err)) {
//           throw err;
//         }

//         dispatch(
//           displayNotification(
//             i18n.t("notifications.loadError", {
//               ns: "workspace",
//               context: "permissions",
//             }),
//             "error"
//           )
//         );
//       }
//     };
//   };

/**
 * loadCurrentWorkspaceUserGroupPermissions
 */
const loadCurrentWorkspaceUserGroupPermissions: LoadCurrentWorkspaceUserGroupPermissionsTriggerType =
  function loadCurrentWorkspaceUserGroupPermissions() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const workspaceApi = MApi.getWorkspaceApi();

      try {
        const currentWorkspace = getState().workspaces.currentWorkspace;

        const permissions = await workspaceApi.getWorkspaceSignupGroups({
          workspaceEntityId: getState().workspaces.currentWorkspace.id,
        });

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
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "workspace",
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
  loadLastWorkspacesFromServer,
  setCurrentWorkspace,
  requestAssessmentAtWorkspace,
  cancelAssessmentAtWorkspace,
  updateWorkspace,
  updateWorkspaceSettings,
  loadStaffMembersOfWorkspace,
  updateAssignmentState,
  updateLastWorkspaces,
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
  // loadCurrentWorkspaceSignupMessage,
};
