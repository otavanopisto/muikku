import { SpecificActionType, AnyActionType } from "../../index";
import { StateType } from "../../../reducers/index";
import notificationActions, {
  displayNotification,
} from "~/actions/base/notifications";
import { Dispatch, Action } from "redux";
import {
  UpdateImportanceObject,
  EvaluationAssigmentData,
  EvaluationFilters,
  EvaluationImportance,
  EvaluationSort,
  EvaluationStatus,
  EvaluationStateType,
  EvaluationPrices,
  EvaluationJournalCommentsByJournal,
} from "../../../@types/evaluation";
import { WorkspaceDataType } from "~/reducers/workspaces";
import {
  EvaluationAssessmentRequest,
  EvaluationEvent,
  EvaluationEventType,
  EvaluationGradeScale,
  EvaluationJournalFeedback,
  SaveWorkspaceUserAssessmentRequest,
  SaveWorkspaceUserSupplementationRequestRequest,
  UpdateWorkspaceUserSupplementationRequestRequest,
  UpdateWorkspaceUserAssessmentRequest,
  UpdateWorkspaceNodeAssessmentRequest,
  CreateWorkspaceJournalCommentRequest,
  UpdateWorkspaceJournalCommentRequest,
  WorkspaceJournalEntry,
  MaterialCompositeReply,
  UpdateBilledPriceRequest,
  InterimEvaluationRequest,
  ExamAttendance,
} from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import i18n from "~/locales/i18n";
import { getSmowlApiAccountInfo } from "~/api_smowl/index";

//////State update interfaces
export type EVALUATION_BASE_PRICE_STATE_UPDATE = SpecificActionType<
  "EVALUATION_BASE_PRICE_STATE_UPDATE",
  EvaluationStateType
>;

export type EVALUATION_STATE_UPDATE = SpecificActionType<
  "EVALUATION_STATE_UPDATE",
  EvaluationStateType
>;

export type EVALUATION_COMPOSITE_REPLIES_STATE_UPDATE = SpecificActionType<
  "EVALUATION_COMPOSITE_REPLIES_STATE_UPDATE",
  EvaluationStateType
>;

export type EVALUATION_ASSESSMENT_EVENTS_STATE_UPDATE = SpecificActionType<
  "EVALUATION_ASSESSMENT_EVENTS_STATE_UPDATE",
  EvaluationStateType
>;

export type EVALUATION_ASSESSMENT_EVENTS_LOAD = SpecificActionType<
  "EVALUATION_ASSESSMENT_EVENTS_LOAD",
  EvaluationEvent[]
>;

export type EVALUATION_INTERMIN_REQUESTS_LOAD = SpecificActionType<
  "EVALUATION_INTERMIN_REQUESTS_LOAD",
  InterimEvaluationRequest[]
>;

export type EVALUATION_REQUESTS_STATE_UPDATE = SpecificActionType<
  "EVALUATION_REQUESTS_STATE_UPDATE",
  EvaluationStateType
>;

export type EVALUATION_REQUESTS_LOAD = SpecificActionType<
  "EVALUATION_REQUESTS_LOAD",
  EvaluationAssessmentRequest[]
>;

export type EVALUATION_UDATE_SELECTED_ASSESSMENT_REQUEST = SpecificActionType<
  "EVALUATION_UDATE_SELECTED_ASSESSMENT_REQUEST",
  EvaluationAssessmentRequest
>;

export type EVALUATION_ASSESSMENT_ASSIGNMENTS_STATE_UPDATE = SpecificActionType<
  "EVALUATION_ASSESSMENT_ASSIGNMENTS_STATE_UPDATE",
  EvaluationStateType
>;

export type EVALUATION_BASE_PRICES_LOAD = SpecificActionType<
  "EVALUATION_BASE_PRICES_LOAD",
  EvaluationPrices
>;

export type EVALUATION_IMPORTANT_ASSESSMENTS_LOAD = SpecificActionType<
  "EVALUATION_IMPORTANT_ASSESSMENTS_LOAD",
  EvaluationStatus
>;

export type EVALUATION_UNIMPORTANT_ASSESSMENTS_LOAD = SpecificActionType<
  "EVALUATION_UNIMPORTANT_ASSESSMENTS_LOAD",
  EvaluationStatus
>;

export type EVALUATION_WORKSPACES_LOAD = SpecificActionType<
  "EVALUATION_WORKSPACES_LOAD",
  WorkspaceDataType[]
>;

export type EVALUATION_GRADE_SYSTEM_LOAD = SpecificActionType<
  "EVALUATION_GRADE_SYSTEM_LOAD",
  EvaluationGradeScale[]
>;

export type EVALUATION_BILLED_PRICE_LOAD = SpecificActionType<
  "EVALUATION_BILLED_PRICE_LOAD",
  number
>;

export type EVALUATION_SELECTED_WORKSPACE_CHANGE = SpecificActionType<
  "EVALUATION_SELECTED_WORKSPACE_CHANGE",
  number | undefined
>;

export type EVALUATION_SORT_FUNCTION_CHANGE = SpecificActionType<
  "EVALUATION_SORT_FUNCTION_CHANGE",
  EvaluationSort
>;

export type EVALUATION_FILTERS_CHANGE = SpecificActionType<
  "EVALUATION_FILTERS_CHANGE",
  EvaluationFilters
>;

export type EVALUATION_SEARCH_CHANGE = SpecificActionType<
  "EVALUATION_SEARCH_CHANGE",
  string
>;

export type EVALUATION_COMPOSITE_REPLIES_LOAD = SpecificActionType<
  "EVALUATION_COMPOSITE_REPLIES_LOAD",
  MaterialCompositeReply[]
>;

export type EVALUATION_IMPORTANCE_UPDATE = SpecificActionType<
  "EVALUATION_IMPORTANCE_UPDATE",
  {
    importantAssessments: EvaluationImportance;
    unimportantAssessments: EvaluationImportance;
  }
>;

export type EVALUATION_ASSESSMENT_UPDATE = SpecificActionType<
  "EVALUATION_ASSESSMENT_UPDATE",
  EvaluationAssessmentRequest
>;

export type EVALUATION_ASSESSMENT_ASSIGNMENTS_LOAD = SpecificActionType<
  "EVALUATION_ASSESSMENT_ASSIGNMENTS_LOAD",
  EvaluationAssigmentData
>;

export type EVALUATION_LOCKED_ASSIGNMENTS_UPDATE = SpecificActionType<
  "EVALUATION_LOCKED_ASSIGNMENTS_UPDATE",
  number[]
>;

export type EVALUATION_OPENED_ASSIGNMENT_OR_EXAM_ID_UPDATE = SpecificActionType<
  "EVALUATION_OPENED_ASSIGNMENT_OR_EXAM_ID_UPDATE",
  number
>;

export type EVALUATION_NEEDS_RELOAD_REQUESTS_UPDATE = SpecificActionType<
  "EVALUATION_NEEDS_RELOAD_REQUESTS_UPDATE",
  boolean
>;

// EVALUATION JOURNALS

// EVALUATION JOURNALS FEEDBACK
export type EVALUATION_JOURNAL_FEEDBACK_STATE_UPDATE = SpecificActionType<
  "EVALUATION_JOURNAL_FEEDBACK_STATE_UPDATE",
  EvaluationStateType
>;

export type EVALUATION_JOURNAL_FEEDBACK_LOAD = SpecificActionType<
  "EVALUATION_JOURNAL_FEEDBACK_LOAD",
  EvaluationJournalFeedback
>;

export type EVALUATION_JOURNAL_FEEDBACK_CREATE_OR_UPDATE = SpecificActionType<
  "EVALUATION_JOURNAL_FEEDBACK_CREATE_OR_UPDATE",
  EvaluationJournalFeedback
>;

export type EVALUATION_JOURNAL_FEEDBACK_DELETE = SpecificActionType<
  "EVALUATION_JOURNAL_FEEDBACK_DELETE",
  null
>;

// EVALUATION JOURNAL LIST
export type EVALUATION_JOURNAL_STATE_UPDATE = SpecificActionType<
  "EVALUATION_JOURNAL_STATE_UPDATE",
  EvaluationStateType
>;

export type EVALUATION_JOURNAL_EVENTS_LOAD = SpecificActionType<
  "EVALUATION_JOURNAL_EVENTS_LOAD",
  WorkspaceJournalEntry[]
>;

// EVALUATION JOURNAL COMMENTS

export type EVALUATION_JOURNAL_COMMENTS_INITIALIZED = SpecificActionType<
  "EVALUATION_JOURNAL_COMMENTS_INITIALIZED",
  EvaluationJournalCommentsByJournal
>;

export type EVALUATION_JOURNAL_COMMENTS_LOAD = SpecificActionType<
  "EVALUATION_JOURNAL_COMMENTS_LOAD",
  {
    comments: EvaluationJournalCommentsByJournal;
    commentsLoaded: number[];
  }
>;

export type EVALUATION_JOURNAL_COMMENTS_CREATE = SpecificActionType<
  "EVALUATION_JOURNAL_COMMENTS_CREATE",
  {
    updatedJournalEntryList: WorkspaceJournalEntry[];
    updatedCommentsList: EvaluationJournalCommentsByJournal;
  }
>;

export type EVALUATION_JOURNAL_COMMENTS_UPDATE = SpecificActionType<
  "EVALUATION_JOURNAL_COMMENTS_UPDATE",
  {
    updatedCommentsList: EvaluationJournalCommentsByJournal;
  }
>;

export type EVALUATION_JOURNAL_COMMENTS_DELETE = SpecificActionType<
  "EVALUATION_JOURNAL_COMMENTS_DELETE",
  {
    updatedJournalEntryList: WorkspaceJournalEntry[];
    updatedCommentsList: EvaluationJournalCommentsByJournal;
  }
>;

// EVALUATION EXAMS

export type EVALUATION_EXAMS_STATE_UPDATE = SpecificActionType<
  "EVALUATION_EXAMS_STATE_UPDATE",
  EvaluationStateType
>;

export type EVALUATION_EXAMS_LOAD = SpecificActionType<
  "EVALUATION_EXAMS_LOAD",
  ExamAttendance[]
>;

export type EVALUATION_EXAMS_UPDATE_EXAM_EVALUATION_INFO = SpecificActionType<
  "EVALUATION_EXAMS_UPDATE_EXAM_EVALUATION_INFO",
  ExamAttendance
>;

// SMOWL PROCTORING
export type EVALUATION_EXAMS_SMOWL_PROCTORING_INFO_LOAD = SpecificActionType<
  "EVALUATION_EXAMS_SMOWL_PROCTORING_INFO_LOAD",
  {
    swlAPIKey: string;
    entityName: string;
  }
>;

// Server events
/**
 * LoadEvaluationSystem
 */
export interface LoadEvaluationSystem {
  (): AnyActionType;
}

/**
 * LoadEvaluationAssessmentRequest
 */
export interface LoadEvaluationAssessmentRequest {
  (useFromWorkspace?: boolean): AnyActionType;
}

/**
 * LoadEvaluationWorkspaces
 */
export interface LoadEvaluationWorkspaces {
  (): AnyActionType;
}

/**
 * LoadEvaluationImportantAssessment
 */
export interface LoadEvaluationImportantAssessment {
  (): AnyActionType;
}

/**
 * LoadEvaluationUnimportantAssessment
 */
export interface LoadEvaluationUnimportantAssessment {
  (): AnyActionType;
}

/**
 * LoadEvaluationSortFunction
 */
export interface LoadEvaluationSortFunction {
  (): AnyActionType;
}

/**
 * LoadEvaluationCurrentStudentAssigments
 */
export interface LoadEvaluationCurrentStudentAssigments {
  (data: {
    workspaceId: number;
    workspaceUserEntityId: number;
    userEntityId: number;
  }): AnyActionType;
}

/**
 * ToggleLockedAssigment
 */
export interface ToggleLockedAssigment {
  (data: {
    /**
     * Action to perform
     */
    action: "lock" | "unlock";
    /**
     * Optional specific material ID to lock/unlock
     */
    workspaceMaterialId?: number;
  }): AnyActionType;
}

/**
 * UpdateCurrentStudentEvaluationCompositeRepliesData
 */
export interface UpdateCurrentStudentEvaluationCompositeRepliesData {
  (data: {
    workspaceId: number;
    userEntityId: number;
    workspaceMaterialId: number;
  }): AnyActionType;
}

/**
 * LoadEvaluationAssessmentEvent
 */
export interface LoadEvaluationAssessmentEvent {
  (data: {
    assessment: EvaluationAssessmentRequest;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * LoadEvaluationAssignment
 */
export interface LoadEvaluationAssignment {
  (data: { assessment: EvaluationAssessmentRequest }): AnyActionType;
}

/**
 * LoadEvaluationJournalEvents
 */
export interface LoadEvaluationJournalEvents {
  (data: { assessment: EvaluationAssessmentRequest }): AnyActionType;
}

/**
 * LoadBilledPrice
 */
export interface LoadBilledPrice {
  (data: { workspaceEntityId: number }): AnyActionType;
}

/**
 * LoadEvaluationCompositeReplies
 */
export interface LoadEvaluationCompositeReplies {
  (data: {
    userEntityId: number;
    workspaceId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * LoadBasePrice
 */
export interface LoadBasePrice {
  (data: { workspaceEntityId: number }): AnyActionType;
}

// Other
/**
 * UpdateEvaluationSortFunction
 */
export interface UpdateEvaluationSortFunction {
  (data: { sortFunction: EvaluationSort }): AnyActionType;
}

/**
 * UpdateWorkspaceEvaluation
 */
export interface UpdateWorkspaceEvaluation {
  (data: {
    type: "new" | "edit";
    workspaceEvaluation:
      | SaveWorkspaceUserAssessmentRequest
      | UpdateWorkspaceNodeAssessmentRequest;
    billingPrice?: string;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateEvaluationEvent
 */
export interface UpdateEvaluationEvent {
  (data: UpdateBilledPriceRequest): AnyActionType;
}

/**
 * UpdateWorkspaceSupplementation
 */
export interface UpdateWorkspaceSupplementation {
  (data: {
    type: "new" | "edit";
    workspaceSupplementation:
      | SaveWorkspaceUserSupplementationRequestRequest
      | UpdateWorkspaceUserSupplementationRequestRequest;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * RemoveWorkspaceEvent
 */
export interface RemoveWorkspaceEvent {
  (data: {
    identifier: string;
    eventType: EvaluationEventType;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * DeleteAssessmentRequest
 */
export interface DeleteAssessmentRequest {
  (data: {
    workspaceUserEntityId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * DeleteInterimEvaluationRequest
 */
export interface DeleteInterimEvaluationRequest {
  (data: {
    interimEvaluatiomRequestId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * DeleteSupplementationRequest
 */
export interface DeleteSupplementationRequest {
  (data: {
    workspaceUserEntityId: number;
    supplementationRequestId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * ArchiveStudent
 */
export interface ArchiveStudent {
  (data: {
    workspaceEntityId: number;
    workspaceUserEntityId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * SetEvaluationSelectedWorkspace
 */
export interface SetEvaluationSelectedWorkspace {
  (data: { workspaceId?: number }): AnyActionType;
}

/**
 * SetEvaluationSortFunction
 */
export interface SetEvaluationSortFunction {
  (data: { sortFunction: string }): AnyActionType;
}

/**
 * SetEvaluationFilters
 */
export interface SetEvaluationFilters {
  (data: { evaluationFilters: EvaluationFilters }): AnyActionType;
}

/**
 * UpdateEvaluationSearch
 */
export interface UpdateEvaluationSearch {
  (data: { searchString: string }): AnyActionType;
}

/**
 * UpdateEvaluationSelectedAssessment
 */
export interface UpdateEvaluationSelectedAssessment {
  (data: { assessment: EvaluationAssessmentRequest }): AnyActionType;
}

/**
 * UpdateImportance
 */
export interface UpdateImportance {
  (data: {
    importantAssessments: EvaluationImportance;
    unimportantAssessments: EvaluationImportance;
  }): AnyActionType;
}

/**
 * UpdateOpenedAssignmentOrExamId
 */
export interface UpdateOpenedAssignmentOrExamId {
  (data: { assignmentOrExamId?: number }): AnyActionType;
}

/**
 * UpdateNeedsReloadEvaluationRequests
 */
export interface UpdateNeedsReloadEvaluationRequests {
  (data: { value: boolean }): AnyActionType;
}

/**
 * LoadEvaluationJournalFeedbackFromServerTriggerType
 */
export interface LoadEvaluationJournalFeedbackFromServerTriggerType {
  (data: {
    userEntityId: number;
    workspaceEntityId: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * CreateOrUpdateEvaluationJournalFeedbackTriggerType
 */
export interface CreateOrUpdateEvaluationJournalFeedbackTriggerType {
  (data: {
    userEntityId: number;
    workspaceEntityId: number;
    feedback: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * DeleteEvaluationJournalFeedbackTriggerType
 */
export interface DeleteEvaluationJournalFeedbackTriggerType {
  (data: {
    userEntityId: number;
    workspaceEntityId: number;
    feedbackId: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * LoadWorkspaceJournalCommentsFromServerTriggerType
 */
export interface LoadEvaluationJournalCommentsFromServerTriggerType {
  (data: { workspaceId: number; journalEntryId: number }): AnyActionType;
}

/**
 * CreateWorkspaceJournalCommentInTriggerType
 */
export interface CreateEvaluationJournalCommentTriggerType {
  (data: {
    newCommentPayload: CreateWorkspaceJournalCommentRequest;
    journalEntryId: number;
    workspaceEntityId: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateWorkspaceJournalCommentInTriggerType
 */
export interface UpdateEvaluationJournalCommentTriggerType {
  (data: {
    updatedCommentPayload: UpdateWorkspaceJournalCommentRequest;
    journalEntryId: number;
    workspaceEntityId: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * DeleteWorkspaceJournalCommentInTriggerType
 */
export interface DeleteEvaluationJournalCommentTriggerType {
  (data: {
    commentId: number;
    journalEntryId: number;
    workspaceEntityId: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * LoadEvaluationExamsTriggerType
 */
export interface LoadEvaluationExamsTriggerType {
  (data: {
    workspaceEntityId: number;
    studentEntityId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateEvaluationExamEvaluationInfoTriggerType
 */
export interface UpdateEvaluationExamEvaluationInfoTriggerType {
  (data: {
    workspaceNodeId: number;
    userEntityId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

const evaluationApi = MApi.getEvaluationApi();
const workspaceApi = MApi.getWorkspaceApi();
const userApi = MApi.getUserApi();
const worklistApi = MApi.getWorklistApi();

// Actions

/**
 * loads evaluation grading system
 */
const loadEvaluationGradingSystemFromServer: LoadEvaluationSystem =
  function loadEvaluationGradingSystemFromServer() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.evaluations.status !== "LOADING") {
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"LOADING",
        });
      }

      try {
        const GradingSystems = await evaluationApi.getEvaluationGradingScales();

        dispatch({
          type: "EVALUATION_GRADE_SYSTEM_LOAD",
          payload: GradingSystems,
        });

        if (state.evaluations.status !== "READY") {
          dispatch({
            type: "EVALUATION_STATE_UPDATE",
            payload: <EvaluationStateType>"READY",
          });
        }
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "evaluation",
              context: "gradeSystems",
            }),
            "error"
          )
        );
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * Loads evaluation assessment requests
 * @param useFromWorkspace boolean whether to use currentworkspace id or not
 */
const loadEvaluationAssessmentRequestsFromServer: LoadEvaluationAssessmentRequest =
  function loadEvaluationAssessmentRequestsFromServer(useFromWorkspace) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      dispatch({
        type: "EVALUATION_REQUESTS_STATE_UPDATE",
        payload: <EvaluationStateType>"LOADING",
      });

      let evaluationAssessmentRequests: EvaluationAssessmentRequest[] = [];

      try {
        if (state.evaluations.selectedWorkspaceId) {
          evaluationAssessmentRequests =
            await evaluationApi.getCompositeAssessmentRequests({
              workspaceEntityId: state.evaluations.selectedWorkspaceId,
            });
        } else if (useFromWorkspace && state.workspaces.currentWorkspace.id) {
          evaluationAssessmentRequests =
            await evaluationApi.getCompositeAssessmentRequests({
              workspaceEntityId: state.workspaces.currentWorkspace.id,
            });
        } else {
          evaluationAssessmentRequests =
            await evaluationApi.getCompositeAssessmentRequests();
        }

        dispatch({
          type: "EVALUATION_REQUESTS_LOAD",
          payload: evaluationAssessmentRequests,
        });

        dispatch({
          type: "EVALUATION_REQUESTS_STATE_UPDATE",
          payload: <EvaluationStateType>"READY",
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "evaluation",
              context: "evaluationRequests",
            }),
            "error"
          )
        );
        dispatch({
          type: "EVALUATION_REQUESTS_STATE_UPDATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * Loads workspaces
 */
const loadEvaluationWorkspacesFromServer: LoadEvaluationWorkspaces =
  function loadEvaluationWorkspacesFromServer() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.evaluations.status !== "LOADING") {
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"LOADING",
        });
      }

      try {
        const evaluationWorkspaces = (await workspaceApi.getWorkspaces({
          userId: state.status.userId,
          maxResults: 500,
        })) as WorkspaceDataType[];

        dispatch({
          type: "EVALUATION_WORKSPACES_LOAD",
          payload: evaluationWorkspaces || [],
        });

        if (state.evaluations.status !== "READY") {
          dispatch({
            type: "EVALUATION_STATE_UPDATE",
            payload: <EvaluationStateType>"READY",
          });
        }
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "evaluation",
              context: "workspaces",
            }),
            "error"
          )
        );
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * Loads ids of important assessments string list
 * List comes as string value (Example -> value: "1,2,3,4,5")
 */
const loadListOfImportantAssessmentIdsFromServer: LoadEvaluationImportantAssessment =
  function loadListOfImportantAssessmentIdsFromServer() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.evaluations.status !== "LOADING") {
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"LOADING",
        });
      }

      try {
        const evaluationImportantAssessmentRequests =
          (await userApi.getUserProperty({
            key: "important-evaluation-requests",
          })) as EvaluationStatus;

        dispatch({
          type: "EVALUATION_IMPORTANT_ASSESSMENTS_LOAD",
          payload: evaluationImportantAssessmentRequests,
        });

        if (state.evaluations.status !== "READY") {
          dispatch({
            type: "EVALUATION_STATE_UPDATE",
            payload: <EvaluationStateType>"READY",
          });
        }
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "evaluation",
              context: "importanceRatings",
            }),
            "error"
          )
        );
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * Loads ids of unimportant assessments string list
 * List comes as string value (Example -> value: "1,2,3,4,5")
 */
const loadListOfUnimportantAssessmentIdsFromServer: LoadEvaluationUnimportantAssessment =
  function loadListOfUnimportantAssessmentIdsFromServer() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.evaluations.status !== "LOADING") {
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"LOADING",
        });
      }

      try {
        const evaluationUnimportantAssessmentRequests =
          (await userApi.getUserProperty({
            key: "unimportant-evaluation-requests",
          })) as EvaluationStatus;

        dispatch({
          type: "EVALUATION_UNIMPORTANT_ASSESSMENTS_LOAD",
          payload: evaluationUnimportantAssessmentRequests,
        });

        if (state.evaluations.status !== "READY") {
          dispatch({
            type: "EVALUATION_STATE_UPDATE",
            payload: <EvaluationStateType>"READY",
          });
        }
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "evaluation",
              context: "importanceRatings",
            }),
            "error"
          )
        );
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * Loads sort function value
 */
const loadEvaluationSortFunctionFromServer: LoadEvaluationSortFunction =
  function loadEvaluationSortFunction() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.evaluations.status !== "LOADING") {
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"LOADING",
        });
      }

      try {
        let sortFunction = "evaluation-default-sort";

        if (state.evaluations.selectedWorkspaceId) {
          sortFunction = "evaluation-workspace-sort";
        }

        const evaluationSortFunction = (await userApi.getUserProperty({
          key: sortFunction,
        })) as EvaluationSort;

        dispatch({
          type: "EVALUATION_SORT_FUNCTION_CHANGE",
          payload: evaluationSortFunction,
        });

        if (state.evaluations.status !== "READY") {
          dispatch({
            type: "EVALUATION_STATE_UPDATE",
            payload: <EvaluationStateType>"READY",
          });
        }
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "evaluation",
              context: "sortCategories",
            }),
            "error"
          )
        );
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * Loads assessments evaluation events
 * @param data data
 */
const loadEvaluationAssessmentEventsFromServer: LoadEvaluationAssessmentEvent =
  function loadEvaluationAssessmentEventsFromServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "EVALUATION_ASSESSMENT_EVENTS_STATE_UPDATE",
        payload: <EvaluationStateType>"LOADING",
      });

      try {
        const evaluationAssessmentEvents =
          await evaluationApi.getWorkspaceUserEvaluationEvents({
            workspaceUserEntityId: data.assessment.workspaceUserEntityId,
          });

        dispatch({
          type: "EVALUATION_ASSESSMENT_EVENTS_LOAD",
          payload: evaluationAssessmentEvents,
        });

        dispatch({
          type: "EVALUATION_ASSESSMENT_EVENTS_STATE_UPDATE",
          payload: <EvaluationStateType>"READY",
        });

        data.onSuccess && data.onSuccess();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "evaluation",
              context: "evaluation",
            }),
            "error"
          )
        );
        dispatch({
          type: "EVALUATION_ASSESSMENT_EVENTS_STATE_UPDATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * Loads evaluation journal feed
 *
 * @param data data
 */
const loadEvaluationJournalFeedbackFromServer: LoadEvaluationJournalFeedbackFromServerTriggerType =
  function loadEvaluationJournalFeedbkackFromServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "EVALUATION_JOURNAL_FEEDBACK_STATE_UPDATE",
        payload: <EvaluationStateType>"LOADING",
      });

      try {
        const journalFeedback =
          await evaluationApi.getWorkspaceStudentJournalFeedback({
            workspaceId: data.workspaceEntityId,
            studentEntityId: data.userEntityId,
          });

        dispatch({
          type: "EVALUATION_JOURNAL_FEEDBACK_LOAD",
          payload: journalFeedback,
        });

        dispatch({
          type: "EVALUATION_JOURNAL_FEEDBACK_STATE_UPDATE",
          payload: <EvaluationStateType>"READY",
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "journal",
              context: "feedback",
              error: err.message,
            }),
            "error"
          )
        );

        dispatch({
          type: "EVALUATION_JOURNAL_FEEDBACK_STATE_UPDATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * Creates or updates journal feedback
 * @param data data
 */
const createOrUpdateEvaluationJournalFeedback: CreateOrUpdateEvaluationJournalFeedbackTriggerType =
  function createEvaluationJournalFeedback(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        const journalFeedback =
          await evaluationApi.saveWorkspaceStudentJournalFeedback({
            workspaceId: data.workspaceEntityId,
            studentEntityId: data.userEntityId,
            saveWorkspaceStudentJournalFeedbackRequest: {
              feedback: data.feedback,
            },
          });

        dispatch({
          type: "EVALUATION_JOURNAL_FEEDBACK_CREATE_OR_UPDATE",
          payload: journalFeedback,
        });

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.saveSuccess", {
              context: "feedback",
              ns: "journal",
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
          notificationActions.displayNotification(
            i18n.t("notifications.saveError", {
              ns: "journal",
              context: "feedback",
              error: err.message,
            }),
            "error"
          )
        );

        dispatch({
          type: "EVALUATION_JOURNAL_FEEDBACK_STATE_UPDATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * Deletes evaluation journal feedback
 *
 * @param data data
 */
const deleteEvaluationJournalFeedback: DeleteEvaluationJournalFeedbackTriggerType =
  function deleteEvaluationJournalFeedback(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        await evaluationApi.deleteWorkspaceStudentJournalFeedback({
          workspaceId: data.workspaceEntityId,
          studentEntityId: data.userEntityId,
          journalFeedbackId: data.feedbackId,
        });

        data.success && data.success();

        dispatch({
          type: "EVALUATION_JOURNAL_FEEDBACK_DELETE",
          payload: null,
        });

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.removeSuccess", {
              ns: "journal",
              context: "feedback",
            }),
            "success"
          )
        );
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.removeError", {
              ns: "journal",
              context: "feedback",
              error: err.message,
            }),
            "error"
          )
        );

        dispatch({
          type: "EVALUATION_JOURNAL_FEEDBACK_STATE_UPDATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * Loads opened assessment journal entries/events
 * @param data data
 */
const loadEvaluationSelectedAssessmentJournalEventsFromServer: LoadEvaluationJournalEvents =
  function loadEvaluationSelectedAssessmentJournalEventsFromServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "EVALUATION_JOURNAL_STATE_UPDATE",
        payload: <EvaluationStateType>"LOADING",
      });

      try {
        const studyDiaryEvents = await workspaceApi.getWorkspaceJournals({
          workspaceId: data.assessment.workspaceEntityId,
          userEntityId: data.assessment.userEntityId,
          firstResult: 0,
          maxResults: 512,
        });

        const obj = studyDiaryEvents.reduce<EvaluationJournalCommentsByJournal>(
          (o, key) => ({ ...o, [key.id]: [] }),
          {}
        );

        dispatch({
          type: "EVALUATION_JOURNAL_COMMENTS_INITIALIZED",
          payload: obj,
        });

        dispatch({
          type: "EVALUATION_JOURNAL_EVENTS_LOAD",
          payload: studyDiaryEvents,
        });

        dispatch({
          type: "EVALUATION_JOURNAL_STATE_UPDATE",
          payload: <EvaluationStateType>"READY",
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "journal",
              context: "events",
              error: err.message,
            }),
            "error"
          )
        );
        dispatch({
          type: "EVALUATION_JOURNAL_STATE_UPDATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * Loads composite replies
 * @param data data
 * @param data.userEntityId data.userEntityId
 * @param data.onSuccess data.onSuccess
 * @param data.workspaceId data.workspaceId
 */
const loadEvaluationCompositeRepliesFromServer: LoadEvaluationCompositeReplies =
  function loadEvaluationCompositeRepliesFromServer({
    userEntityId,
    onSuccess,
    workspaceId,
  }) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "EVALUATION_COMPOSITE_REPLIES_STATE_UPDATE",
        payload: <EvaluationStateType>"LOADING",
      });

      try {
        const evaluationCompositeReplies =
          await workspaceApi.getWorkspaceCompositeReplies({
            workspaceEntityId: workspaceId,
            userEntityId,
          });

        dispatch({
          type: "EVALUATION_COMPOSITE_REPLIES_LOAD",
          payload: evaluationCompositeReplies,
        });

        dispatch({
          type: "EVALUATION_COMPOSITE_REPLIES_STATE_UPDATE",
          payload: <EvaluationStateType>"READY",
        });

        onSuccess && onSuccess();
      } catch (err) {
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "evaluation",
              context: "assignmentData",
              error: err.message,
            }),
            "error"
          )
        );

        dispatch({
          type: "EVALUATION_COMPOSITE_REPLIES_STATE_UPDATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * Updates evaluation sort function by saving to it server
 * @param data data
 */
const updateEvaluationSortFunctionToServer: UpdateEvaluationSortFunction =
  function updateEvaluationSortFunctionToServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.evaluations.status !== "LOADING") {
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"LOADING",
        });
      }

      try {
        const evaluationSortFunction = (await userApi.setUserProperty({
          setUserPropertyRequest: {
            key: data.sortFunction.key,
            value: data.sortFunction.value,
          },
        })) as EvaluationSort;

        dispatch({
          type: "EVALUATION_SORT_FUNCTION_CHANGE",
          payload: evaluationSortFunction,
        });

        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"READY",
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.updateError", {
              ns: "evaluation",
              context: "sorting",
              error: err.message,
            }),
            "error"
          )
        );
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * Updates workspace evaluation
 * @param param0 param0
 * @param param0.workspaceEvaluation workspaceEvaluation
 * @param param0.type type
 * @param param0.billingPrice billingPrice
 * @param param0.onSuccess onSuccess
 * @param param0.onFail onFail
 */
const updateWorkspaceEvaluationToServer: UpdateWorkspaceEvaluation =
  function updateWorkspaceEvaluationToServer({
    workspaceEvaluation,
    type,
    billingPrice,
    onSuccess,
    onFail,
  }) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.evaluations.status !== "LOADING") {
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"LOADING",
        });
      }

      if (type === "new") {
        try {
          await evaluationApi
            .saveWorkspaceUserAssessment({
              workspaceUserEntityId:
                state.evaluations.evaluationSelectedAssessmentId
                  .workspaceUserEntityId,
              saveWorkspaceUserAssessmentRequest: {
                ...(workspaceEvaluation as SaveWorkspaceUserAssessmentRequest),
              },
            })
            .then((data) => {
              onSuccess();

              if (billingPrice) {
                dispatch(
                  updateBillingToServer({
                    assessmentIdentifier: data.identifier,
                    price: billingPrice.toString(),
                  })
                );
              }

              // Base price has to be loaded again because combination workspace
              // price changes. This only happens after creating new evaluation
              dispatch(
                loadBasePriceFromServer({
                  workspaceEntityId:
                    state.evaluations.evaluationSelectedAssessmentId
                      .workspaceEntityId,
                })
              );
            });
        } catch (err) {
          if (!isMApiError(err)) {
            throw err;
          }

          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.saveError", {
                ns: "evaluation",
                context: "evaluation",
                error: err.message,
              }),
              "error"
            )
          );

          dispatch({
            type: "EVALUATION_STATE_UPDATE",
            payload: <EvaluationStateType>"ERROR",
          });

          onFail();
        }
      } else {
        try {
          await evaluationApi
            .updateWorkspaceUserAssessment({
              workspaceUserEntityId:
                state.evaluations.evaluationSelectedAssessmentId
                  .workspaceUserEntityId,
              updateWorkspaceUserAssessmentRequest: {
                ...(workspaceEvaluation as UpdateWorkspaceUserAssessmentRequest),
              },
            })
            .then((data) => {
              onSuccess();

              if (billingPrice) {
                dispatch(
                  updateBillingToServer({
                    assessmentIdentifier: data.identifier,
                    price: billingPrice,
                  })
                );
              }
            });
        } catch (err) {
          if (!isMApiError(err)) {
            throw err;
          }

          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.updateError", {
                ns: "evaluation",
                context: "evaluation",
                error: err.message,
              }),
              "error"
            )
          );

          dispatch({
            type: "EVALUATION_STATE_UPDATE",
            payload: <EvaluationStateType>"ERROR",
          });

          onFail();
        }
      }
    };
  };

/**
 * Updates workspace supplementation
 *
 * @param param0 param0
 * @param param0.type type
 * @param param0.workspaceSupplementation workspaceSupplementation
 * @param param0.onSuccess onSuccess
 * @param param0.onFail onFail
 */
const updateWorkspaceSupplementationToServer: UpdateWorkspaceSupplementation =
  function updateWorkspaceSupplementationToServer({
    type,
    workspaceSupplementation,
    onSuccess,
    onFail,
  }) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (type === "new") {
        try {
          await evaluationApi
            .saveWorkspaceUserSupplementationRequest({
              workspaceUserEntityId:
                state.evaluations.evaluationSelectedAssessmentId
                  .workspaceUserEntityId,
              saveWorkspaceUserSupplementationRequestRequest: {
                ...(workspaceSupplementation as SaveWorkspaceUserSupplementationRequestRequest),
              },
            })
            .then(() => {
              dispatch(
                loadEvaluationAssessmentEventsFromServer({
                  assessment: state.evaluations.evaluationSelectedAssessmentId,
                })
              );

              onSuccess();
            });
        } catch (err) {
          if (!isMApiError(err)) {
            throw err;
          }

          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.saveError", {
                ns: "evaluation",
                context: "supplementationRequest",
                error: err.message,
              }),
              "error"
            )
          );

          onFail();
        }
      } else {
        try {
          await evaluationApi
            .updateWorkspaceUserSupplementationRequest({
              workspaceUserEntityId:
                state.evaluations.evaluationSelectedAssessmentId
                  .workspaceUserEntityId,
              updateWorkspaceUserSupplementationRequestRequest: {
                ...(workspaceSupplementation as UpdateWorkspaceUserSupplementationRequestRequest),
              },
            })
            .then(() => {
              dispatch(
                loadEvaluationAssessmentEventsFromServer({
                  assessment: state.evaluations.evaluationSelectedAssessmentId,
                })
              );

              onSuccess();
            });
        } catch (err) {
          if (!isMApiError(err)) {
            throw err;
          }

          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.saveError", {
                ns: "evaluation",
                context: "supplementationRequest",
                error: err.message,
              }),
              "error"
            )
          );

          dispatch({
            type: "EVALUATION_STATE_UPDATE",
            payload: <EvaluationStateType>"ERROR",
          });

          onFail();
        }
      }
    };
  };

/**
 * "Deletes" workpace event
 * @param param0 param0
 * @param param0.identifier identifier
 * @param param0.eventType eventType
 * @param param0.onSuccess onSuccess
 * @param param0.onFail onFail
 */
const removeWorkspaceEventFromServer: RemoveWorkspaceEvent =
  function removeWorkspaceEventFromServer({
    identifier,
    eventType,
    onSuccess,
    onFail,
  }) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.evaluations.status !== "LOADING") {
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"LOADING",
        });
      }

      if (
        eventType === "EVALUATION_PASS" ||
        eventType === "EVALUATION_IMPROVED" ||
        eventType === "EVALUATION_FAIL"
      ) {
        try {
          await evaluationApi
            .deleteWorkspaceUserWorkspaceAssessment({
              workspaceUserEntityId:
                state.evaluations.evaluationSelectedAssessmentId
                  .workspaceUserEntityId,
              workspaceAssessmentIdentifier: identifier,
            })
            .then(() => {
              dispatch(
                loadEvaluationAssessmentEventsFromServer({
                  assessment: state.evaluations.evaluationSelectedAssessmentId,
                })
              );

              // Base price has to be loaded again because combination workspace
              // price changes. This only happens after creating new evaluation
              dispatch(
                loadBasePriceFromServer({
                  workspaceEntityId:
                    state.evaluations.evaluationSelectedAssessmentId
                      .workspaceEntityId,
                })
              );

              dispatch({
                type: "EVALUATION_STATE_UPDATE",
                payload: <EvaluationStateType>"READY",
              });

              onSuccess();
            });
        } catch (err) {
          if (!isMApiError(err)) {
            throw err;
          }

          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.removeError", {
                ns: "evaluation",
                context: "evaluaton",
                error: err.message,
              }),
              "error"
            )
          );

          dispatch({
            type: "EVALUATION_STATE_UPDATE",
            payload: <EvaluationStateType>"ERROR",
          });

          onFail();
        }
      } else if (eventType === "SUPPLEMENTATION_REQUEST") {
        try {
          await evaluationApi
            .deleteWorkspaceUserSupplementationRequest({
              workspaceUserEntityId:
                state.evaluations.evaluationSelectedAssessmentId
                  .workspaceUserEntityId,
              // Note that in case of deleting supplementation request, identifier is tecnhinically type number
              // but EvaluationEvent object has it as string. So we have to parse it to int
              supplementationRequestId: parseInt(identifier),
            })
            .then(() => {
              dispatch(
                loadEvaluationAssessmentEventsFromServer({
                  assessment: state.evaluations.evaluationSelectedAssessmentId,
                })
              );

              // Base price has to be loaded again because combination workspace
              // price changes. This only happens after creating new evaluation
              dispatch(
                loadBasePriceFromServer({
                  workspaceEntityId:
                    state.evaluations.evaluationSelectedAssessmentId
                      .workspaceEntityId,
                })
              );

              dispatch({
                type: "EVALUATION_STATE_UPDATE",
                payload: <EvaluationStateType>"READY",
              });

              onSuccess();
            });
        } catch (err) {
          if (!isMApiError(err)) {
            throw err;
          }

          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.removeError", {
                ns: "evaluation",
                context: "supplementationRequest",
                error: err.message,
              }),
              "error"
            )
          );

          dispatch({
            type: "EVALUATION_STATE_UPDATE",
            payload: <EvaluationStateType>"ERROR",
          });

          onFail();
        }
      }
    };
  };

/**
 * loadCurrentStudentAssigmentsData
 *
 * @param data data
 */
const loadCurrentStudentAssigmentsData: LoadEvaluationCurrentStudentAssigments =
  function loadCurrentStudentAssigmentsData(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const { workspaceId, workspaceUserEntityId, userEntityId } = data;

      dispatch({
        type: "EVALUATION_ASSESSMENT_ASSIGNMENTS_STATE_UPDATE",
        payload: "LOADING",
      });

      try {
        const [assigments, idListOfLockedAssigments] = await Promise.all([
          (async () => {
            const assignmentsInterim = await workspaceApi.getWorkspaceMaterials(
              {
                workspaceEntityId: workspaceId,
                assignmentType: "INTERIM_EVALUATION",
                userEntityId: userEntityId,
              }
            );

            const assignmentsExercise =
              await workspaceApi.getWorkspaceMaterials({
                workspaceEntityId: workspaceId,
                assignmentType: "EXERCISE",
                userEntityId: userEntityId,
              });

            const assignmentsEvaluated =
              await workspaceApi.getWorkspaceMaterials({
                workspaceEntityId: workspaceId,
                assignmentType: "EVALUATED",
                userEntityId: userEntityId,
              });

            const assignments = [
              ...assignmentsInterim,
              ...assignmentsEvaluated,
              ...assignmentsExercise,
            ];

            return assignments;
          })(),
          (async () => {
            const idListOfLockedAssigments =
              await evaluationApi.getEvaluablePagesLocks({
                workspaceUserEntityId,
              });
            return idListOfLockedAssigments;
          })(),
        ]);

        dispatch({
          type: "EVALUATION_ASSESSMENT_ASSIGNMENTS_LOAD",
          payload: { assigments, idListOfLockedAssigments },
        });

        dispatch({
          type: "EVALUATION_ASSESSMENT_ASSIGNMENTS_STATE_UPDATE",
          payload: "READY",
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "evaluation",
              context: "assignmentData",
              error: err.message,
            }),
            "error"
          )
        );

        dispatch({
          type: "EVALUATION_ASSESSMENT_ASSIGNMENTS_STATE_UPDATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * Toggles lock all or specific assignment
 * @param data data
 */
const toggleLockedAssignment: ToggleLockedAssigment =
  function toggleLockedAssignment(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      // Get current list of locked assignments
      const currentLockedAssignments =
        state.evaluations.evaluationCurrentStudentAssigments.data
          ?.idListOfLockedAssigments || [];

      try {
        // If workspaceMaterialId is provided, we're toggling a specific assignment
        if (data.workspaceMaterialId) {
          await evaluationApi.updateEvaluablePageLocks({
            workspaceUserEntityId:
              state.evaluations.evaluationSelectedAssessmentId
                .workspaceUserEntityId,
            evaluationPageLock: {
              workspaceMaterialId: data.workspaceMaterialId,
              locked: data.action === "lock",
            },
          });

          // Update the list of locked assignments
          let newLockedAssignments: number[];
          if (data.action === "lock") {
            // Add to locked list if not already there
            newLockedAssignments = [
              ...currentLockedAssignments,
              data.workspaceMaterialId,
            ];
          } else {
            // Remove from locked list
            newLockedAssignments = currentLockedAssignments.filter(
              (id) => id !== data.workspaceMaterialId
            );
          }

          dispatch({
            type: "EVALUATION_LOCKED_ASSIGNMENTS_UPDATE",
            payload: newLockedAssignments,
          });
        } else {
          // Toggle all assignments
          await evaluationApi.updateEvaluablePageLocks({
            workspaceUserEntityId:
              state.evaluations.evaluationSelectedAssessmentId
                .workspaceUserEntityId,
            evaluationPageLock: {
              locked: data.action === "lock",
            },
          });

          // Get updated list of locked assignments
          const updatedLockedAssignments =
            await evaluationApi.getEvaluablePagesLocks({
              workspaceUserEntityId:
                state.evaluations.evaluationSelectedAssessmentId
                  .workspaceUserEntityId,
            });

          dispatch({
            type: "EVALUATION_LOCKED_ASSIGNMENTS_UPDATE",
            payload: updatedLockedAssignments,
          });
        }
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        if (data.workspaceMaterialId) {
          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.updateError", {
                ns: "evaluation",
                context: "assignmentLocking",
                error: err.message,
              }),
              "error"
            )
          );
        } else {
          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.updateError", {
                ns: "evaluation",
                context: "assignmentAllLocking",
                error: err.message,
              }),
              "error"
            )
          );
        }
      }
    };
  };

/**
 * Updates one compositereply in compositeReplies list with new coming values from backend
 * @param data data
 */
const updateCurrentStudentCompositeRepliesData: UpdateCurrentStudentEvaluationCompositeRepliesData =
  function updateCurrentStudentEvaluationData(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      // There is reason why update composite replies state is not changed here. Because
      // we don't wan't to change ui to loading states that would re render materials. It should still have
      // some indicator maybe specificilly to that component which compositereply is updating so there is
      // indicating that tell if something is coming from backend. But currently this is how its working now

      // Get initial values that needs to be updated
      const updatedCompositeReplies =
        state.evaluations.evaluationCompositeReplies.data;

      try {
        const updatedCompositeReply =
          await workspaceApi.getWorkspaceUserCompositeReply({
            workspaceEntityId: data.workspaceId,
            workspaceMaterialId: data.workspaceMaterialId,
            userEntityId: data.userEntityId,
          });

        const index = updatedCompositeReplies.findIndex(
          (item) =>
            item.workspaceMaterialId ===
            updatedCompositeReply.workspaceMaterialId
        );

        updatedCompositeReplies[index] = {
          ...updatedCompositeReply,
        };

        dispatch({
          type: "EVALUATION_COMPOSITE_REPLIES_LOAD",
          payload: updatedCompositeReplies,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "evaluation",
              context: "assignmentData",
              error: err.message,
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * Change selected workspace id
 * @param data data
 */
const setSelectedWorkspaceId: SetEvaluationSelectedWorkspace =
  function setSelectedWorkspaceId(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>
    ) => {
      dispatch({
        type: "EVALUATION_SELECTED_WORKSPACE_CHANGE",
        payload: data.workspaceId,
      });

      dispatch(loadEvaluationSortFunctionFromServer());

      dispatch(loadEvaluationAssessmentRequestsFromServer());
    };
  };

/**
 * Change evaluation filters
 * @param data data
 */
const setEvaluationFilters: SetEvaluationFilters =
  function setEvaluationFilters(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>
    ) => {
      dispatch({
        type: "EVALUATION_FILTERS_CHANGE",
        payload: data.evaluationFilters,
      });
    };
  };

/**
 * Updates billing price for evaluation
 * @param data data
 */
const updateBillingToServer: UpdateEvaluationEvent =
  function updateBillingToServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      try {
        await worklistApi.updateBilledPrice({
          workspaceEntityId:
            state.evaluations.evaluationSelectedAssessmentId.workspaceEntityId,
          updateBilledPriceRequest: data,
        });

        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"READY",
        });
      } catch (error) {
        if (!isMApiError(error)) {
          throw error;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.updateError", {
              ns: "evaluation",
              context: "pricing",
              error: error.message,
            }),
            "error"
          )
        );

        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * Updates selected assessment and loads events
 * @param data data
 */
const setSelectedAssessmentAndLoadEvents: UpdateEvaluationSelectedAssessment =
  function updateSelectedAssessment(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>
    ) => {
      dispatch({
        type: "EVALUATION_ASSESSMENT_UPDATE",
        payload: data.assessment,
      });

      dispatch(
        loadEvaluationAssessmentEventsFromServer({
          assessment: data.assessment,
        })
      );
    };
  };

/**
 * Changed evaluation search filter
 * @param data data
 */
const updateEvaluationSearch: UpdateEvaluationSearch =
  function updateEvaluationSearch(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>
    ) => {
      dispatch({
        type: "EVALUATION_SEARCH_CHANGE",
        payload: data.searchString,
      });
    };
  };

/**
 * Updates importance
 * @param data data
 */
const updateImportance: UpdateImportance = function updateImportance(data) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    const state = getState();

    if (state.evaluations.status !== "LOADING") {
      dispatch({
        type: "EVALUATION_STATE_UPDATE",
        payload: <EvaluationStateType>"LOADING",
      });
    }

    try {
      const importance = (await userApi.setUserProperty({
        setUserPropertyRequest: {
          key: data.importantAssessments.key,
          value: data.importantAssessments.value,
        },
      })) as EvaluationImportance;

      const unimportance = (await userApi.setUserProperty({
        setUserPropertyRequest: {
          key: data.unimportantAssessments.key,
          value: data.unimportantAssessments.value,
        },
      })) as EvaluationImportance;

      const updateImportanceObject = {
        importantAssessments: importance,
        unimportantAssessments: unimportance,
      } as UpdateImportanceObject;

      dispatch({
        type: "EVALUATION_IMPORTANCE_UPDATE",
        payload: updateImportanceObject,
      });

      if (state.evaluations.status !== "READY") {
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"READY",
        });
      }
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      i18n.t("notifications.loadError", {
        ns: "evaluation",
        context: "gradeSystems",
      });

      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.updateError", {
            ns: "evaluation",
            context: "sorting",
            error: err.message,
          }),
          "error"
        )
      );
      dispatch({
        type: "EVALUATION_STATE_UPDATE",
        payload: <EvaluationStateType>"ERROR",
      });
    }
  };
};

/**
 * updateOpenedAssignmentOrExamId
 * @param data data
 */
const updateOpenedAssignmentOrExamId: UpdateOpenedAssignmentOrExamId =
  function updateOpenedAssignmentOrExamId(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>
    ) => {
      dispatch({
        type: "EVALUATION_OPENED_ASSIGNMENT_OR_EXAM_ID_UPDATE",
        payload: data.assignmentOrExamId,
      });
    };
  };

/**
 * Deletes assessment request
 * @param param0 param0
 * @param param0.workspaceUserEntityId workspaceUserEntityId
 */
const deleteAssessmentRequest: DeleteAssessmentRequest =
  function deleteAssessmentRequest({ workspaceUserEntityId }) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        await evaluationApi
          .archiveWorkspaceUserEvaluationRequest({
            workspaceUserEntityId: workspaceUserEntityId,
          })
          .then(() => {
            dispatch(loadEvaluationAssessmentRequestsFromServer());
          });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        i18n.t("notifications.loadError", {
          ns: "evaluation",
          context: "gradeSystems",
        });

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.removeError", {
              ns: "evaluation",
              context: "evaluationRequest",
              error: err.message,
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * Delete interim evaluation request
 * @param param0 param0
 * @param param0.interimEvaluatiomRequestId interimEvaluatiomRequestId
 */
const deleteInterimEvaluationRequest: DeleteInterimEvaluationRequest =
  function deleteInterimEvaluationRequest({ interimEvaluatiomRequestId }) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        await evaluationApi
          .deleteInterimEvaluationRequest({
            interimEvaluationRequestId: interimEvaluatiomRequestId,
          })
          .then(() => {
            notificationActions.displayNotification(
              "Välipalautepyyntö poistettu onnistuneesti",
              "success"
            );

            dispatch(loadEvaluationAssessmentRequestsFromServer());
          });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.removeError", {
              ns: "evaluation",
              context: "interimRequest",
              error: err.message,
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * Deletes supplementation request
 * @param data data
 */
const deleteSupplementationRequest: DeleteSupplementationRequest =
  function deleteSupplementationRequest(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const { workspaceUserEntityId, supplementationRequestId } = data;

      try {
        await evaluationApi
          .deleteWorkspaceUserSupplementationRequest({
            workspaceUserEntityId,
            supplementationRequestId,
          })
          .then(() => {
            notificationActions.displayNotification(
              "Täydennyspyyntö poistettu onnistuneesti",
              "success"
            );

            dispatch(loadEvaluationAssessmentRequestsFromServer());
          });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            "Virhe poistettaessa täydennyspyyntöä",
            "error"
          )
        );
      }
    };
  };

/**
 * Archives student from workspace
 * @param root0 root0
 * @param root0.workspaceEntityId workspaceEntityId
 * @param root0.workspaceUserEntityId workspaceUserEntityId
 * @param root0.onSuccess onSuccess
 */
const archiveStudent: ArchiveStudent = function archiveStudent({
  workspaceEntityId,
  workspaceUserEntityId,
  onSuccess,
}) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    try {
      const student = await workspaceApi.getWorkspaceStudent({
        workspaceEntityId: workspaceEntityId,
        studentId: workspaceUserEntityId,
      });

      student.active = false;

      await workspaceApi.updateWorkspaceStudent({
        workspaceEntityId: workspaceEntityId,
        studentId: workspaceUserEntityId,
        workspaceStudent: student,
      });

      onSuccess && onSuccess();
    } catch (error) {
      if (!isMApiError(error)) {
        throw error;
      }

      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.removeError", {
            ns: "evaluation",
            context: "student",
            error: error.message,
          }),
          "error"
        )
      );
    }
  };
};

/**
 * Loads base price from server
 *
 * @param root0 root0
 * @param root0.workspaceEntityId workspaceEntityId
 */
const loadBasePriceFromServer: LoadBasePrice =
  function loadBasePriceFromServer({ workspaceEntityId }) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>
    ) => {
      let basePrice: EvaluationPrices | undefined = undefined;

      dispatch({
        type: "EVALUATION_BASE_PRICE_STATE_UPDATE",
        payload: <EvaluationStateType>"LOADING",
      });

      await worklistApi
        .getWorkspacePrices({
          workspaceEntityId: workspaceEntityId,
        })
        .then(
          (rValue) => {
            basePrice = rValue as EvaluationPrices;
          },
          () => {
            basePrice = undefined;
          }
        );

      dispatch({
        type: "EVALUATION_BASE_PRICES_LOAD",
        payload: basePrice as EvaluationPrices,
      });

      dispatch({
        type: "EVALUATION_BASE_PRICE_STATE_UPDATE",
        payload: <EvaluationStateType>"READY",
      });
    };
  };

/**
 * Updated whether evaluation requests are needed to reloaded
 * mostly used when there are changes that demands it
 * @param root0 root0
 * @param root0.value value
 */
const updateNeedsReloadEvaluationRequests: UpdateNeedsReloadEvaluationRequests =
  function updateNeedsReloadEvaluationRequests({ value }) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>
    ) => {
      dispatch({
        type: "EVALUATION_NEEDS_RELOAD_REQUESTS_UPDATE",
        payload: value,
      });
    };
  };

/**
 * Loads evaluation journal comments for one entry
 * @param data data
 */
const loadEvaluationJournalCommentsFromServer: LoadEvaluationJournalCommentsFromServerTriggerType =
  function loadWorkspaceJournalCommentsFromServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const evaluationJournalComments =
        getState().evaluations.evaluationJournalComments;

      if (
        !evaluationJournalComments.commentsLoaded.includes(data.journalEntryId)
      ) {
        try {
          const journalCommentList =
            await workspaceApi.getWorkspaceJournalComments({
              workspaceId: data.workspaceId,
              journalEntryId: data.journalEntryId,
            });

          const updatedComments: EvaluationJournalCommentsByJournal = {
            ...evaluationJournalComments.comments,
          };

          updatedComments[data.journalEntryId] = journalCommentList;

          dispatch({
            type: "EVALUATION_JOURNAL_COMMENTS_LOAD",
            payload: {
              comments: updatedComments,
              commentsLoaded: [
                ...evaluationJournalComments.commentsLoaded,
                data.journalEntryId,
              ],
            },
          });
        } catch (err) {
          if (!isMApiError(err)) {
            throw err;
          }

          dispatch(
            displayNotification(
              i18n.t("notifications.loadError", {
                ns: "journal",
                context: "comments",
                error: err.message,
              }),
              "error"
            )
          );
        }
      }
    };
  };

/**
 * Create journal comment
 * @param data data
 */
const createEvaluationJournalComment: CreateEvaluationJournalCommentTriggerType =
  function createEvaluationJournalComment(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const {
        newCommentPayload,
        journalEntryId,
        workspaceEntityId,
        fail,
        success,
      } = data;

      const evaluationState = getState().evaluations;

      try {
        const [updated] = await Promise.all([
          (async () => {
            // New comment data
            const newComment = await workspaceApi.createWorkspaceJournalComment(
              {
                workspaceId: workspaceEntityId,
                journalEntryId: journalEntryId,
                createWorkspaceJournalCommentRequest: newCommentPayload,
              }
            );

            const updatedJournalIndex =
              evaluationState.evaluationDiaryEntries.data.findIndex(
                (jEntry) => jEntry.id === journalEntryId
              );

            const updatedCommentsList = {
              ...evaluationState.evaluationJournalComments.comments,
            };

            const updatedJournalEntryList = [
              ...evaluationState.evaluationDiaryEntries.data,
            ];

            updatedJournalEntryList[updatedJournalIndex].commentCount++;
            updatedCommentsList[journalEntryId].push(newComment);

            return {
              updatedJournalEntryList,
              updatedCommentsList,
            };
          })(),
        ]);

        success && success();

        dispatch({
          type: "EVALUATION_JOURNAL_COMMENTS_CREATE",
          payload: {
            updatedCommentsList: updated.updatedCommentsList,
            updatedJournalEntryList: updated.updatedJournalEntryList,
          },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.createError", {
              ns: "journal",
              context: "comment",
              error: err.message,
            }),
            "error"
          )
        );
        fail && fail();
      }
    };
  };

/**
 * Updated journal comment
 * @param data data
 */
const updateEvaluationJournalComment: UpdateEvaluationJournalCommentTriggerType =
  function createEvaluationJournalComment(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const {
        updatedCommentPayload,
        journalEntryId,
        workspaceEntityId,
        fail,
        success,
      } = data;

      const evaluationState = getState().evaluations;

      try {
        const [updated] = await Promise.all([
          (async () => {
            // Updated comment data
            const updatedComment =
              await workspaceApi.updateWorkspaceJournalComment({
                workspaceId: workspaceEntityId,
                journalEntryId: journalEntryId,
                journalCommentId: updatedCommentPayload.id,
                updateWorkspaceJournalCommentRequest: updatedCommentPayload,
              });

            const updatedCommentsList = {
              ...evaluationState.evaluationJournalComments.comments,
            };
            const index = updatedCommentsList[journalEntryId].findIndex(
              (c) => c.id === updatedComment.id
            );

            updatedCommentsList[journalEntryId].splice(
              index,
              1,
              updatedComment
            );

            return {
              updatedCommentsList,
            };
          })(),
        ]);

        success && success();

        dispatch({
          type: "EVALUATION_JOURNAL_COMMENTS_UPDATE",
          payload: {
            updatedCommentsList: updated.updatedCommentsList,
          },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.updateError", {
              ns: "journal",
              context: "comment",
              error: err.message,
            }),
            "error"
          )
        );
        fail && fail();
      }
    };
  };

/**
 * Delete journal comment
 * @param data data
 */
const deleteEvaluationJournalComment: DeleteEvaluationJournalCommentTriggerType =
  function createEvaluationJournalComment(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const { commentId, journalEntryId, workspaceEntityId, fail, success } =
        data;

      const evaluationState = getState().evaluations;

      try {
        const [updated] = await Promise.all([
          (async () => {
            await workspaceApi.deleteWorkspaceJournalComment({
              workspaceId: workspaceEntityId,
              journalEntryId: journalEntryId,
              journalCommentId: commentId,
            });

            // Journal index that comment count needs to be updated
            const updatedJournalIndex =
              evaluationState.evaluationDiaryEntries.data.findIndex(
                (jEntry) => jEntry.id === journalEntryId
              );

            // Comment list to update
            const updatedCommentsList = {
              ...evaluationState.evaluationJournalComments.comments,
            };

            const updatedJournalEntryList = [
              ...evaluationState.evaluationDiaryEntries.data,
            ];

            // Find index of deleted comment
            const indexOfDeletedComment = updatedCommentsList[
              journalEntryId
            ].findIndex((c) => c.id === commentId);

            // Splice it out
            updatedCommentsList[journalEntryId].splice(
              indexOfDeletedComment,
              1
            );

            // Update comment count and delete comment from list
            updatedJournalEntryList[updatedJournalIndex].commentCount--;

            return {
              updatedCommentsList,
              updatedJournalEntryList,
            };
          })(),
        ]);

        success && success();

        dispatch({
          type: "EVALUATION_JOURNAL_COMMENTS_DELETE",
          payload: {
            updatedCommentsList: updated.updatedCommentsList,
            updatedJournalEntryList: updated.updatedJournalEntryList,
          },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.removeError", {
              ns: "journal",
              context: "comment",
              error: err.message,
            }),
            "error"
          )
        );
        fail && fail();
      }
    };
  };

/**
 * LoadEvaluationExamsTriggerType
 * @param data data
 */
const loadEvaluationExamsFromServer: LoadEvaluationExamsTriggerType =
  function loadEvaluationExamsFromServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const { workspaceEntityId, studentEntityId, onSuccess, onFail } = data;

      try {
        const exams = await evaluationApi.listStudentExams({
          workspaceEntityId: workspaceEntityId,
          studentEntityId: studentEntityId,
        });

        const smowlApiAccountInfo = await getSmowlApiAccountInfo();

        dispatch({
          type: "EVALUATION_EXAMS_LOAD",
          payload: exams,
        });

        dispatch({
          type: "EVALUATION_EXAMS_SMOWL_PROCTORING_INFO_LOAD",
          payload: smowlApiAccountInfo,
        });

        dispatch({
          type: "EVALUATION_EXAMS_STATE_UPDATE",
          payload: "READY",
        });

        onSuccess && onSuccess();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "exams",
              context: "exams",
              error: err.message,
            }),
            "error"
          )
        );

        onFail && onFail();
      }
    };
  };

/**
 * updateEvaluationExamEvaluationInfo
 * @param data data
 */
const updateEvaluationExamEvaluationInfo: UpdateEvaluationExamEvaluationInfoTriggerType =
  function updateEvaluationExamEvaluationInfo(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const { workspaceNodeId, userEntityId, onFail, onSuccess } = data;

      const state = getState();

      try {
        const updatedEvaluationInfo =
          await evaluationApi.getWorkspaceNodeEvaluationInfo({
            workspaceNodeId: workspaceNodeId,
            userEntityId: userEntityId,
          });

        const updatedExam = state.evaluations.evaluationExams?.data?.find(
          (exam) => exam.folderId === workspaceNodeId
        );

        if (updatedExam) {
          updatedExam.evaluationInfo = updatedEvaluationInfo;
        }

        dispatch({
          type: "EVALUATION_EXAMS_UPDATE_EXAM_EVALUATION_INFO",
          payload: updatedExam,
        });

        onSuccess && onSuccess();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        onFail && onFail();
      }
    };
  };

export {
  loadEvaluationAssessmentRequestsFromServer,
  loadEvaluationWorkspacesFromServer,
  loadListOfImportantAssessmentIdsFromServer,
  loadListOfUnimportantAssessmentIdsFromServer,
  loadEvaluationGradingSystemFromServer,
  loadEvaluationSortFunctionFromServer,
  loadEvaluationCompositeRepliesFromServer,
  updateEvaluationSortFunctionToServer,
  updateWorkspaceEvaluationToServer,
  updateBillingToServer,
  updateWorkspaceSupplementationToServer,
  removeWorkspaceEventFromServer,
  setSelectedWorkspaceId,
  setEvaluationFilters,
  loadCurrentStudentAssigmentsData,
  updateEvaluationSearch,
  updateNeedsReloadEvaluationRequests,
  updateImportance,
  setSelectedAssessmentAndLoadEvents,
  updateCurrentStudentCompositeRepliesData,
  updateOpenedAssignmentOrExamId,
  loadEvaluationAssessmentEventsFromServer,
  loadEvaluationSelectedAssessmentJournalEventsFromServer,
  loadBasePriceFromServer,
  archiveStudent,
  deleteAssessmentRequest,
  deleteInterimEvaluationRequest,
  loadEvaluationJournalCommentsFromServer,
  createEvaluationJournalComment,
  updateEvaluationJournalComment,
  deleteEvaluationJournalComment,
  loadEvaluationJournalFeedbackFromServer,
  createOrUpdateEvaluationJournalFeedback,
  deleteEvaluationJournalFeedback,
  deleteSupplementationRequest,
  toggleLockedAssignment,
  loadEvaluationExamsFromServer,
  updateEvaluationExamEvaluationInfo,
};
