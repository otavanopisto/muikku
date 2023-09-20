import { SpecificActionType, AnyActionType } from "../../index";
import {
  EvaluationStateType,
  EvaluationGradeSystem,
  AssignmentEvaluationGradeRequest,
  WorkspaceEvaluationSaveReturn,
  EvaluationBasePriceById,
  EvaluationJournalCommentsByJournal,
} from "../../../@types/evaluation";
import { StateType } from "../../../reducers/index";
import mApi from "~/lib/mApi";
import promisify from "../../../util/promisify";
import { MApiError } from "../../../lib/mApi";
import notificationActions, {
  displayNotification,
} from "~/actions/base/notifications";
import {
  EvaluationAssigmentData,
  EvaluationJournalFeedback,
} from "../../../@types/evaluation";
import { EvaluationEnum, BilledPriceRequest } from "../../../@types/evaluation";
import {
  MaterialCompositeRepliesType,
  WorkspaceInterimEvaluationRequest,
} from "../../../reducers/workspaces/index";
import {
  WorkspaceUserEntity,
  AssignmentEvaluationSaveReturn,
} from "../../../@types/evaluation";
import {
  WorkspaceEvaluationSaveRequest,
  WorkspaceSupplementationSaveRequest,
} from "../../../@types/evaluation";
import { MaterialAssignmentType } from "../../../reducers/workspaces/index";
import { EvaluationStudyDiaryEvent } from "../../../@types/evaluation";
import { Dispatch } from "react-redux";
import {
  UpdateImportanceObject,
  EvaluationEvent,
} from "../../../@types/evaluation";
import {
  EvaluationFilters,
  EvaluationImportance,
} from "../../../@types/evaluation";
import {
  EvaluationWorkspace,
  EvaluationSort,
} from "../../../@types/evaluation";
import {
  AssessmentRequest,
  EvaluationStatus,
} from "../../../@types/evaluation";
import {
  JournalComment,
  JournalCommentCreate,
  JournalCommentDelete,
  JournalCommentUpdate,
} from "~/@types/journal";
import i18n from "~/locales/i18n";

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
  WorkspaceInterimEvaluationRequest[]
>;

export type EVALUATION_REQUESTS_STATE_UPDATE = SpecificActionType<
  "EVALUATION_REQUESTS_STATE_UPDATE",
  EvaluationStateType
>;

export type EVALUATION_REQUESTS_LOAD = SpecificActionType<
  "EVALUATION_REQUESTS_LOAD",
  AssessmentRequest[]
>;

export type EVALUATION_ASSESSMENT_ASSIGNMENTS_STATE_UPDATE = SpecificActionType<
  "EVALUATION_ASSESSMENT_ASSIGNMENTS_STATE_UPDATE",
  EvaluationStateType
>;

export type EVALUATION_BASE_PRICE_LOAD = SpecificActionType<
  "EVALUATION_BASE_PRICE_LOAD",
  EvaluationBasePriceById
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
  EvaluationWorkspace[]
>;

export type EVALUATION_GRADE_SYSTEM_LOAD = SpecificActionType<
  "EVALUATION_GRADE_SYSTEM_LOAD",
  EvaluationGradeSystem[]
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
  MaterialCompositeRepliesType[]
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
  AssessmentRequest
>;

export type EVALUATION_ASSESSMENT_ASSIGNMENTS_LOAD = SpecificActionType<
  "EVALUATION_ASSESSMENT_ASSIGNMENTS_LOAD",
  EvaluationAssigmentData
>;

export type EVALUATION_OPENED_ASSIGNMENT_UPDATE = SpecificActionType<
  "EVALUATION_OPENED_ASSIGNMENT_UPDATE",
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
  EvaluationStudyDiaryEvent[]
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
    updatedJournalEntryList: EvaluationStudyDiaryEvent[];
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
    updatedJournalEntryList: EvaluationStudyDiaryEvent[];
    updatedCommentsList: EvaluationJournalCommentsByJournal;
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
  (data: { workspaceId: number }): AnyActionType;
}

/**
 * UpdateCurrentStudentEvaluationData
 */
export interface UpdateCurrentStudentEvaluationData {
  (data: {
    assigmentSaveReturn: AssignmentEvaluationSaveReturn;
    materialId: number;
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
    assessment: AssessmentRequest;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * LoadEvaluationAssignment
 */
export interface LoadEvaluationAssignment {
  (data: { assessment: AssessmentRequest }): AnyActionType;
}

/**
 * LoadEvaluationJournalEvents
 */
export interface LoadEvaluationJournalEvents {
  (data: { assessment: AssessmentRequest }): AnyActionType;
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
    workspaceEvaluation: WorkspaceEvaluationSaveRequest;
    billingPrice?: string;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateEvaluationEvent
 */
export interface UpdateEvaluationEvent {
  (data: BilledPriceRequest): AnyActionType;
}

/**
 * UpdateWorkspaceSupplementation
 */
export interface UpdateWorkspaceSupplementation {
  (data: {
    type: "new" | "edit";
    workspaceSupplementation: WorkspaceSupplementationSaveRequest;
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
    eventType: EvaluationEnum;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * SaveEvaluationAssignmentGradeEvaluation
 */
export interface SaveEvaluationAssignmentGradeEvaluation {
  (data: {
    workspaceEntityId: number;
    userEntityId: number;
    workspaceMaterialId: number;
    dataToSave: AssignmentEvaluationGradeRequest;
    materialId: number;
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
  (data: { assessment: AssessmentRequest }): AnyActionType;
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
 * UpdateOpenedAssignmentEvaluationId
 */
export interface UpdateOpenedAssignmentEvaluationId {
  (data: { assignmentId?: number }): AnyActionType;
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
    newCommentPayload: JournalCommentCreate;
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
    updatedCommentPayload: JournalCommentUpdate;
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
    deleteCommentPayload: JournalCommentDelete;
    journalEntryId: number;
    workspaceEntityId: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}
// Actions

/**
 * loads evaluation grading system
 */
const loadEvaluationGradingSystemFromServer: LoadEvaluationSystem =
  function loadEvaluationGradingSystemFromServer() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.evaluations.status !== "LOADING") {
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"LOADING",
        });
      }

      let GradingSystems: EvaluationGradeSystem[] = [];

      try {
        GradingSystems = (await promisify(
          mApi().evaluation.compositeGradingScales.read(),
          "callback"
        )()) as EvaluationGradeSystem[];

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
        if (!(err instanceof MApiError)) {
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      dispatch({
        type: "EVALUATION_REQUESTS_STATE_UPDATE",
        payload: <EvaluationStateType>"LOADING",
      });

      let evaluationAssessmentRequests: AssessmentRequest[] = [];

      await mApi().evaluation.compositeAssessmentRequests.cacheClear();

      try {
        if (state.evaluations.selectedWorkspaceId) {
          evaluationAssessmentRequests = (await promisify(
            mApi().evaluation.compositeAssessmentRequests.read({
              workspaceEntityId: state.evaluations.selectedWorkspaceId,
            }),
            "callback"
          )()) as AssessmentRequest[];
        } else if (useFromWorkspace && state.workspaces.currentWorkspace.id) {
          evaluationAssessmentRequests = (await promisify(
            mApi().evaluation.compositeAssessmentRequests.read({
              workspaceEntityId: state.workspaces.currentWorkspace.id,
            }),
            "callback"
          )()) as AssessmentRequest[];
        } else {
          evaluationAssessmentRequests = (await promisify(
            mApi().evaluation.compositeAssessmentRequests.read({}),
            "callback"
          )()) as AssessmentRequest[];
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
        if (!(err instanceof MApiError)) {
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.evaluations.status !== "LOADING") {
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"LOADING",
        });
      }

      let evaluationWorkspaces: EvaluationWorkspace[] = [];

      try {
        evaluationWorkspaces = (await promisify(
          mApi().workspace.workspaces.read({
            userId: state.status.userId,
          }),
          "callback"
        )()) as EvaluationWorkspace[];

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
        if (!(err instanceof MApiError)) {
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.evaluations.status !== "LOADING") {
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"LOADING",
        });
      }

      let evaluationImportantAssessmentRequests: EvaluationStatus;

      try {
        evaluationImportantAssessmentRequests = (await promisify(
          mApi().user.property.read("important-evaluation-requests"),
          "callback"
        )()) as EvaluationStatus;

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
        if (!(err instanceof MApiError)) {
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.evaluations.status !== "LOADING") {
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"LOADING",
        });
      }

      let evaluationUnimportantAssessmentRequests: EvaluationStatus;

      try {
        evaluationUnimportantAssessmentRequests = (await promisify(
          mApi().user.property.read("unimportant-evaluation-requests"),
          "callback"
        )()) as EvaluationStatus;

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
        if (!(err instanceof MApiError)) {
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.evaluations.status !== "LOADING") {
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"LOADING",
        });
      }

      let evaluationSortFunction: EvaluationSort;

      try {
        let sortFunction = "evaluation-default-sort";

        if (state.evaluations.selectedWorkspaceId) {
          sortFunction = "evaluation-workspace-sort";
        }

        evaluationSortFunction = (await promisify(
          mApi().user.property.read(sortFunction),
          "callback"
        )()) as EvaluationSort;

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
        if (!(err instanceof MApiError)) {
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "EVALUATION_ASSESSMENT_EVENTS_STATE_UPDATE",
        payload: <EvaluationStateType>"LOADING",
      });

      let evaluationAssessmentEvents: EvaluationEvent[] = [];

      try {
        evaluationAssessmentEvents = (await promisify(
          mApi().evaluation.workspaceuser.events.read(
            data.assessment.workspaceUserEntityId
          ),
          "callback"
        )()) as EvaluationEvent[];

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
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "evaluation",
              context: "evaluationEvents",
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "EVALUATION_JOURNAL_FEEDBACK_STATE_UPDATE",
        payload: <EvaluationStateType>"LOADING",
      });

      try {
        const journalFeedback = (await promisify(
          mApi().evaluation.workspaces.students.journalfeedback.read(
            data.workspaceEntityId,
            data.userEntityId
          ),
          "callback"
        )()) as EvaluationJournalFeedback | null;

        dispatch({
          type: "EVALUATION_JOURNAL_FEEDBACK_LOAD",
          payload: journalFeedback,
        });

        dispatch({
          type: "EVALUATION_JOURNAL_FEEDBACK_STATE_UPDATE",
          payload: <EvaluationStateType>"READY",
        });
      } catch (err) {
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const journalFeedback = (await promisify(
          mApi().evaluation.workspaces.students.journalfeedback.create(
            data.workspaceEntityId,
            data.userEntityId,
            {
              feedback: data.feedback,
            }
          ),
          "callback"
        )()) as EvaluationJournalFeedback;

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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        await promisify(
          mApi().evaluation.workspaces.students.journalfeedback.del(
            data.workspaceEntityId,
            data.userEntityId,
            data.feedbackId
          ),
          "callback"
        )();

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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "EVALUATION_JOURNAL_STATE_UPDATE",
        payload: <EvaluationStateType>"LOADING",
      });

      let studyDiaryEvents: EvaluationStudyDiaryEvent[] = [];

      try {
        studyDiaryEvents = (await promisify(
          mApi().workspace.workspaces.journal.read(
            data.assessment.workspaceEntityId,
            {
              userEntityId: data.assessment.userEntityId,
              firstResult: 0,
              maxResults: 512,
            }
          ),
          "callback"
        )()) as EvaluationStudyDiaryEvent[] | [];

        const obj: EvaluationJournalCommentsByJournal = studyDiaryEvents.reduce(
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
        if (!(err instanceof MApiError)) {
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
 * Loads billed price information
 * @param data data
 */
const LoadBilledPriceFromServer: LoadBilledPrice =
  function LoadBilledPriceFromServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>
    ) => {
      dispatch({
        type: "EVALUATION_STATE_UPDATE",
        payload: <EvaluationStateType>"LOADING",
      });

      try {
        const basePrice = (await promisify(
          mApi().worklist.basePrice.read({
            workspaceEntityId: data.workspaceEntityId,
          }),
          "callback"
        )()) as number;

        dispatch({
          type: "EVALUATION_BILLED_PRICE_LOAD",
          payload: basePrice > 0 ? basePrice : undefined,
        });

        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"READY",
        });
      } catch (error) {
        dispatch({
          type: "EVALUATION_BILLED_PRICE_LOAD",
          payload: undefined,
        });

        dispatch({
          type: "EVALUATION_STATE_UPDATE",
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "EVALUATION_COMPOSITE_REPLIES_STATE_UPDATE",
        payload: <EvaluationStateType>"LOADING",
      });

      let evaluationCompositeReplies: MaterialCompositeRepliesType[];

      try {
        evaluationCompositeReplies = (await promisify(
          mApi().workspace.workspaces.compositeReplies.read(workspaceId, {
            userEntityId,
          }),
          "callback"
        )()) as MaterialCompositeRepliesType[];

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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.evaluations.status !== "LOADING") {
        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"LOADING",
        });
      }

      let evaluationSortFunction: EvaluationSort;

      try {
        evaluationSortFunction = (await promisify(
          mApi().user.property.create(data.sortFunction),
          "callback"
        )()) as EvaluationSort;

        dispatch({
          type: "EVALUATION_SORT_FUNCTION_CHANGE",
          payload: evaluationSortFunction,
        });

        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"READY",
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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
          await promisify(
            mApi().evaluation.workspaceuser.assessment.create(
              state.evaluations.evaluationSelectedAssessmentId
                .workspaceUserEntityId,
              {
                ...workspaceEvaluation,
              }
            ),
            "callback"
          )().then((data: WorkspaceEvaluationSaveReturn) => {
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
          await promisify(
            mApi().evaluation.workspaceuser.assessment.update(
              state.evaluations.evaluationSelectedAssessmentId
                .workspaceUserEntityId,

              {
                ...workspaceEvaluation,
              }
            ),
            "callback"
          )().then((data: WorkspaceEvaluationSaveReturn) => {
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (type === "new") {
        try {
          await promisify(
            mApi().evaluation.workspaceuser.supplementationrequest.create(
              state.evaluations.evaluationSelectedAssessmentId
                .workspaceUserEntityId,
              {
                ...workspaceSupplementation,
              }
            ),
            "callback"
          )().then(() => {
            dispatch(
              loadEvaluationAssessmentEventsFromServer({
                assessment: state.evaluations.evaluationSelectedAssessmentId,
              })
            );

            onSuccess();
          });
        } catch (error) {
          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.saveError", {
                ns: "evaluation",
                context: "supplementationRequest",
                error: error.message,
              }),
              "error"
            )
          );

          onFail();
        }
      } else {
        try {
          await promisify(
            mApi().evaluation.workspaceuser.supplementationrequest.update(
              state.evaluations.evaluationSelectedAssessmentId
                .workspaceUserEntityId,
              {
                ...workspaceSupplementation,
              }
            ),
            "callback"
          )().then(() => {
            dispatch(
              loadEvaluationAssessmentEventsFromServer({
                assessment: state.evaluations.evaluationSelectedAssessmentId,
              })
            );

            onSuccess();
          });
        } catch (error) {
          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.saveError", {
                ns: "evaluation",
                context: "supplementationRequest",
                error: error.message,
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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
        eventType === EvaluationEnum.EVALUATION_PASS ||
        eventType === EvaluationEnum.EVALUATION_IMPROVED ||
        eventType === EvaluationEnum.EVALUATION_FAIL
      ) {
        try {
          await promisify(
            mApi().evaluation.workspaceuser.workspaceassessment.del(
              state.evaluations.evaluationSelectedAssessmentId
                .workspaceUserEntityId,
              identifier
            ),
            "callback"
          )().then(() => {
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
        } catch (error) {
          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.removeError", {
                ns: "evaluation",
                context: "evaluaton",
                error: error.message,
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
      } else if (eventType === EvaluationEnum.SUPPLEMENTATION_REQUEST) {
        try {
          await promisify(
            mApi().evaluation.workspaceuser.supplementationrequest.del(
              state.evaluations.evaluationSelectedAssessmentId
                .workspaceUserEntityId,
              identifier
            ),
            "callback"
          )().then(() => {
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
        } catch (error) {
          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.removeError", {
                ns: "evaluation",
                context: "supplementationRequest",
                error: error.message,
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
 * @param param0 param0
 * @param param0.workspaceId workspaceId
 */
const loadCurrentStudentAssigmentsData: LoadEvaluationCurrentStudentAssigments =
  function loadCurrentStudentAssigmentsData({ workspaceId }) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "EVALUATION_ASSESSMENT_ASSIGNMENTS_STATE_UPDATE",
        payload: "LOADING",
      });

      try {
        const [assigments] = await Promise.all([
          (async () => {
            const assignmentsInterim =
              <MaterialAssignmentType[]>await promisify(
                mApi().workspace.workspaces.materials.read(workspaceId, {
                  assignmentType: "INTERIM_EVALUATION",
                }),
                "callback"
              )() || [];

            const assignmentsExercise =
              <MaterialAssignmentType[]>await promisify(
                mApi().workspace.workspaces.materials.read(workspaceId, {
                  assignmentType: "EXERCISE",
                }),
                "callback"
              )() || [];

            const assignmentsEvaluated =
              <MaterialAssignmentType[]>await promisify(
                mApi().workspace.workspaces.materials.read(workspaceId, {
                  assignmentType: "EVALUATED",
                }),
                "callback"
              )() || [];

            const assignments = [
              ...assignmentsInterim,
              ...assignmentsEvaluated,
              ...assignmentsExercise,
            ];

            return assignments;
          })(),
        ]);

        dispatch({
          type: "EVALUATION_ASSESSMENT_ASSIGNMENTS_LOAD",
          payload: { assigments },
        });

        dispatch({
          type: "EVALUATION_ASSESSMENT_ASSIGNMENTS_STATE_UPDATE",
          payload: "READY",
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
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
 * Updates one compositereply in compositeReplies list with new coming values from backend
 * @param data data
 */
const updateCurrentStudentCompositeRepliesData: UpdateCurrentStudentEvaluationCompositeRepliesData =
  function updateCurrentStudentEvaluationData(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      /**
       * There is reason why update composite replies state is not changed here. Because
       * we don't wan't to change ui to loading states that would re render materials. It should still have
       * some indicator maybe specificilly to that component which compositereply is updating so there is
       * indicating that tell if something is coming from backend. But currently this is how its working now
       */

      /**
       * Get initial values that needs to be updated
       */
      const updatedCompositeReplies: MaterialCompositeRepliesType[] =
        state.evaluations.evaluationCompositeReplies.data;

      try {
        const updatedCompositeReply = (await promisify(
          mApi().workspace.workspaces.user.workspacematerial.compositeReply.read(
            data.workspaceId,
            data.userEntityId,
            data.workspaceMaterialId
          ),
          "callback"
        )()) as MaterialCompositeRepliesType;

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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      try {
        await promisify(
          mApi().worklist.billedPrice.update(
            {
              ...data,
            },
            {
              workspaceEntityId:
                state.evaluations.evaluationSelectedAssessmentId
                  .workspaceEntityId,
            }
          ),
          "callback"
        )();

        dispatch({
          type: "EVALUATION_STATE_UPDATE",
          payload: <EvaluationStateType>"READY",
        });
      } catch (error) {
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
 * Updates selected assessment
 * @param data data
 */
const updateSelectedAssessment: UpdateEvaluationSelectedAssessment =
  function updateSelectedAssessment(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>
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
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    let updateImportanceObject: UpdateImportanceObject;

    const state = getState();

    if (state.evaluations.status !== "LOADING") {
      dispatch({
        type: "EVALUATION_STATE_UPDATE",
        payload: <EvaluationStateType>"LOADING",
      });
    }

    try {
      const importance = (await promisify(
        mApi().user.property.create({
          key: data.importantAssessments.key,
          value: data.importantAssessments.value,
        }),
        "callback"
      )()) as EvaluationImportance;

      const unimportance = (await promisify(
        mApi().user.property.create({
          key: data.unimportantAssessments.key,
          value: data.unimportantAssessments.value,
        }),
        "callback"
      )()) as EvaluationImportance;

      updateImportanceObject = {
        importantAssessments: importance,
        unimportantAssessments: unimportance,
      };

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
      if (!(err instanceof MApiError)) {
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
 * updateOpenedAssignmentEvaluation
 * @param data data
 */
const updateOpenedAssignmentEvaluation: UpdateOpenedAssignmentEvaluationId =
  function updateOpenedAssignmentEvaluation(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>
    ) => {
      dispatch({
        type: "EVALUATION_OPENED_ASSIGNMENT_UPDATE",
        payload: data.assignmentId,
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        await promisify(
          mApi().evaluation.workspaceuser.evaluationrequestarchive.update(
            workspaceUserEntityId
          ),
          "callback"
        )().then(() => {
          dispatch(loadEvaluationAssessmentRequestsFromServer());
        });
      } catch (error) {
        i18n.t("notifications.loadError", {
          ns: "evaluation",
          context: "gradeSystems",
        });

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.removeError", {
              ns: "evaluation",
              context: "evaluationRequest",
              error: error.message,
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
  function deleteAssessmentRequest({ interimEvaluatiomRequestId }) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        await promisify(
          mApi().evaluation.interimEvaluationRequest.del(
            interimEvaluatiomRequestId
          ),
          "callback"
        )().then(() => {
          notificationActions.displayNotification(
            "Välipalautepyyntö poistettu onnistuneesti",
            "success"
          );

          dispatch(loadEvaluationAssessmentRequestsFromServer());
        });
      } catch (error) {
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.removeError", {
              ns: "evaluation",
              context: "interimRequest",
              error: error.message,
            }),
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
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    try {
      await promisify(
        mApi().workspace.workspaces.students.read(
          workspaceEntityId,
          workspaceUserEntityId
        ),
        "callback"
      )().then(async (workspaceUserEntity: WorkspaceUserEntity) => {
        workspaceUserEntity.active = false;

        await promisify(
          mApi().workspace.workspaces.students.update(
            workspaceEntityId,
            workspaceUserEntityId,
            workspaceUserEntity
          ),
          "callback"
        )().then(() => {
          onSuccess && onSuccess();
        });
      });
    } catch (error) {
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>
    ) => {
      let basePrice: EvaluationBasePriceById | undefined = undefined;

      dispatch({
        type: "EVALUATION_BASE_PRICE_STATE_UPDATE",
        payload: <EvaluationStateType>"LOADING",
      });

      await promisify(
        mApi().worklist.basePrice.cacheClear().read({
          workspaceEntityId: workspaceEntityId,
        }),
        "callback"
      )().then(
        (data) => {
          basePrice = data as EvaluationBasePriceById;
        },
        () => {
          basePrice = undefined;
        }
      );

      dispatch({
        type: "EVALUATION_BASE_PRICE_LOAD",
        payload: basePrice,
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const evaluationJournalComments =
        getState().evaluations.evaluationJournalComments;

      if (
        !evaluationJournalComments.commentsLoaded.includes(data.journalEntryId)
      ) {
        try {
          const journalCommentList = (await promisify(
            mApi().workspace.workspaces.journal.comments.read(
              data.workspaceId,
              data.journalEntryId
            ),
            "callback"
          )()) as JournalComment[];

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
          if (!(err instanceof MApiError)) {
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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
            const newComment = (await promisify(
              mApi().workspace.workspaces.journal.comments.create(
                workspaceEntityId,
                journalEntryId,
                newCommentPayload
              ),
              "callback"
            )()) as JournalComment;

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
        if (!(err instanceof MApiError)) {
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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
            const updatedComment = (await promisify(
              mApi().workspace.workspaces.journal.comments.update(
                workspaceEntityId,
                journalEntryId,
                updatedCommentPayload.id,
                updatedCommentPayload
              ),
              "callback"
            )()) as JournalComment;

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
        if (!(err instanceof MApiError)) {
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const {
        deleteCommentPayload,
        journalEntryId,
        workspaceEntityId,
        fail,
        success,
      } = data;

      const evaluationState = getState().evaluations;

      try {
        const [updated] = await Promise.all([
          (async () => {
            await promisify(
              mApi().workspace.workspaces.journal.comments.del(
                workspaceEntityId,
                journalEntryId,
                deleteCommentPayload.id
              ),
              "callback"
            )();

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
            ].findIndex((c) => c.id === deleteCommentPayload.id);

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
        if (!(err instanceof MApiError)) {
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

export {
  loadEvaluationAssessmentRequestsFromServer,
  loadEvaluationWorkspacesFromServer,
  loadListOfImportantAssessmentIdsFromServer,
  loadListOfUnimportantAssessmentIdsFromServer,
  loadEvaluationGradingSystemFromServer,
  loadEvaluationSortFunctionFromServer,
  LoadBilledPriceFromServer,
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
  updateSelectedAssessment,
  updateCurrentStudentCompositeRepliesData,
  updateOpenedAssignmentEvaluation,
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
};
