import { SpecificActionType, AnyActionType } from "../../index";
import {
  EvaluationStateType,
  EvaluationGradeSystem,
  AssignmentEvaluationGradeRequest,
  AssignmentEvaluationSupplementationRequest,
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
import { EvaluationAssigmentData } from "../../../@types/evaluation";
import { EvaluationEnum, BilledPriceRequest } from "../../../@types/evaluation";
import { MaterialCompositeRepliesType } from "../../../reducers/workspaces/index";
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

//////State update interfaces
export type UPDATE_BASE_PRICE_STATE = SpecificActionType<
  "UPDATE_BASE_PRICE_STATE",
  EvaluationStateType
>;

export type UPDATE_EVALUATION_STATE = SpecificActionType<
  "UPDATE_EVALUATION_STATE",
  EvaluationStateType
>;

export type UPDATE_EVALUATION_COMPOSITE_REPLIES_STATE = SpecificActionType<
  "UPDATE_EVALUATION_COMPOSITE_REPLIES_STATE",
  EvaluationStateType
>;

export type UPDATE_EVALUATION_CURRENT_EVENTS_STATE = SpecificActionType<
  "UPDATE_EVALUATION_CURRENT_EVENTS_STATE",
  EvaluationStateType
>;

export type UPDATE_CURRENT_SELECTED_EVALUATION_DIARY_DATA_STATE =
  SpecificActionType<
    "UPDATE_CURRENT_SELECTED_EVALUATION_DIARY_DATA_STATE",
    EvaluationStateType
  >;

export type UPDATE_EVALUATION_REQUESTS_STATE = SpecificActionType<
  "UPDATE_EVALUATION_REQUESTS_STATE",
  EvaluationStateType
>;

export type UPDATE_EVALUATION_SELECTED_ASSESSMENT_ASSIGNMENTS_STATE =
  SpecificActionType<
    "UPDATE_EVALUATION_SELECTED_ASSESSMENT_ASSIGNMENTS_STATE",
    EvaluationStateType
  >;

export type SET_BASE_PRICE = SpecificActionType<
  "SET_BASE_PRICE",
  EvaluationBasePriceById
>;

export type SET_IMPORTANT_ASSESSMENTS = SpecificActionType<
  "SET_IMPORTANT_ASSESSMENTS",
  EvaluationStatus
>;

export type SET_UNIMPORTANT_ASSESSMENTS = SpecificActionType<
  "SET_UNIMPORTANT_ASSESSMENTS",
  EvaluationStatus
>;

export type SET_EVALUATION_ASESSESSMENTS = SpecificActionType<
  "SET_EVALUATION_ASESSESSMENTS",
  AssessmentRequest[]
>;

export type SET_EVALUATION_WORKSPACES = SpecificActionType<
  "SET_EVALUATION_WORKSPACES",
  EvaluationWorkspace[]
>;

export type SET_EVALUATION_GRADE_SYSTEM = SpecificActionType<
  "SET_EVALUATION_GRADE_SYSTEM",
  EvaluationGradeSystem[]
>;

export type SET_EVALUATION_BILLED_PRICE = SpecificActionType<
  "SET_EVALUATION_BILLED_PRICE",
  number
>;

export type SET_EVALUATION_SELECTED_WORKSPACE = SpecificActionType<
  "SET_EVALUATION_SELECTED_WORKSPACE",
  number | undefined
>;

export type SET_EVALUATION_SORT_FUNCTION = SpecificActionType<
  "SET_EVALUATION_SORT_FUNCTION",
  EvaluationSort
>;

export type SET_EVALUATION_FILTERS = SpecificActionType<
  "SET_EVALUATION_FILTERS",
  EvaluationFilters
>;

export type SET_EVALUATION_COMPOSITE_REPLIES = SpecificActionType<
  "SET_EVALUATION_COMPOSITE_REPLIES",
  MaterialCompositeRepliesType[]
>;

export type SET_EVALUATION_STUDENT_ASSIGMENTS = SpecificActionType<
  "SET_EVALUATION_STUDENT_ASSIGMENTS",
  EvaluationAssigmentData
>;

export type UPDATE_EVALUATION_SEARCH = SpecificActionType<
  "UPDATE_EVALUATION_SEARCH",
  string
>;

export type UPDATE_EVALUATION_IMPORTANCE = SpecificActionType<
  "UPDATE_EVALUATION_IMPORTANCE",
  {
    importantAssessments: EvaluationImportance;
    unimportantAssessments: EvaluationImportance;
  }
>;

export type UPDATE_EVALUATION_SELECTED_ASSESSMENT = SpecificActionType<
  "UPDATE_EVALUATION_SELECTED_ASSESSMENT",
  AssessmentRequest
>;

export type SET_EVALUATION_SELECTED_ASSESSMENT_EVENTS = SpecificActionType<
  "SET_EVALUATION_SELECTED_ASSESSMENT_EVENTS",
  EvaluationEvent[]
>;

export type SET_EVALUATION_SELECTED_ASSESSMENT_ASSIGNMENTS = SpecificActionType<
  "SET_EVALUATION_SELECTED_ASSESSMENT_ASSIGNMENTS",
  EvaluationAssigmentData
>;

export type SET_EVALUATION_SELECTED_ASSESSMENT_STUDY_DIARY_EVENTS =
  SpecificActionType<
    "SET_EVALUATION_SELECTED_ASSESSMENT_STUDY_DIARY_EVENTS",
    EvaluationStudyDiaryEvent[]
  >;

export type UPDATE_OPENED_ASSIGNMENTS_EVALUATION = SpecificActionType<
  "UPDATE_OPENED_ASSIGNMENTS_EVALUATION",
  number
>;

export type UPDATE_NEEDS_RELOAD_EVALUATION_REQUESTS = SpecificActionType<
  "UPDATE_NEEDS_RELOAD_EVALUATION_REQUESTS",
  boolean
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
 * LoadEvaluationStudyDiaryEvent
 */
export interface LoadEvaluationStudyDiaryEvent {
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
 * SaveEvaluationSortFunction
 */
export interface SaveEvaluationSortFunction {
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
 * SaveEvaluationAssignmentSupplementation
 */
export interface SaveEvaluationAssignmentSupplementation {
  (data: {
    workspaceEntityId: number;
    userEntityId: number;
    workspaceMaterialId: number;
    dataToSave: AssignmentEvaluationSupplementationRequest;
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
 * loadEvaluationGradingSystemFromServer
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
          type: "UPDATE_EVALUATION_STATE",
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
          type: "SET_EVALUATION_GRADE_SYSTEM",
          payload: GradingSystems,
        });

        if (state.evaluations.status !== "READY") {
          dispatch({
            type: "UPDATE_EVALUATION_STATE",
            payload: <EvaluationStateType>"READY",
          });
        }
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            state.i18n.text.get(
              "plugin.evaluation.notifications.gradesystem.error",
              err.message
            ),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_EVALUATION_STATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * loadEvaluationAssessmentRequestsFromServer
 * @param useFromWorkspace useFromWorkspace
 */
const loadEvaluationAssessmentRequestsFromServer: LoadEvaluationAssessmentRequest =
  function loadEvaluationAssessmentRequestsFromServer(useFromWorkspace) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      dispatch({
        type: "UPDATE_EVALUATION_REQUESTS_STATE",
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
          type: "SET_EVALUATION_ASESSESSMENTS",
          payload: evaluationAssessmentRequests,
        });

        dispatch({
          type: "UPDATE_EVALUATION_REQUESTS_STATE",
          payload: <EvaluationStateType>"READY",
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            state.i18n.text.get(
              "plugin.evaluation.notifications.evaluationRequest.error",
              err.message
            ),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_EVALUATION_REQUESTS_STATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * loadEvaluationWorkspacesFromServer
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
          type: "UPDATE_EVALUATION_STATE",
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
          type: "SET_EVALUATION_WORKSPACES",
          payload: evaluationWorkspaces || [],
        });

        if (state.evaluations.status !== "READY") {
          dispatch({
            type: "UPDATE_EVALUATION_STATE",
            payload: <EvaluationStateType>"READY",
          });
        }
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            state.i18n.text.get(
              "plugin.evaluation.notifications.workspaces.error",
              err.message
            ),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_EVALUATION_STATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * loadListOfImportantAssessmentIdsFromServer
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
          type: "UPDATE_EVALUATION_STATE",
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
          type: "SET_IMPORTANT_ASSESSMENTS",
          payload: evaluationImportantAssessmentRequests,
        });

        if (state.evaluations.status !== "READY") {
          dispatch({
            type: "UPDATE_EVALUATION_STATE",
            payload: <EvaluationStateType>"READY",
          });
        }
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            state.i18n.text.get(
              "plugin.evaluation.notifications.important.error",
              err.message
            ),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_EVALUATION_STATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * loadListOfImportantAssessmentIdsFromServer
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
          type: "UPDATE_EVALUATION_STATE",
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
          type: "SET_UNIMPORTANT_ASSESSMENTS",
          payload: evaluationUnimportantAssessmentRequests,
        });

        if (state.evaluations.status !== "READY") {
          dispatch({
            type: "UPDATE_EVALUATION_STATE",
            payload: <EvaluationStateType>"READY",
          });
        }
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            state.i18n.text.get(
              "plugin.evaluation.notifications.unimportant.error",
              err.message
            ),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_EVALUATION_STATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * loadEvaluationSortFunctionFromServer
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
          type: "UPDATE_EVALUATION_STATE",
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
          type: "SET_EVALUATION_SORT_FUNCTION",
          payload: evaluationSortFunction,
        });

        if (state.evaluations.status !== "READY") {
          dispatch({
            type: "UPDATE_EVALUATION_STATE",
            payload: <EvaluationStateType>"READY",
          });
        }
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            state.i18n.text.get(
              "plugin.evaluation.notifications.sort.error",
              err.message
            ),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_EVALUATION_STATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * loadEvaluationAssessmentEventsFromServer
 * @param data data
 */
const loadEvaluationAssessmentEventsFromServer: LoadEvaluationAssessmentEvent =
  function loadEvaluationAssessmentEventsFromServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      dispatch({
        type: "UPDATE_EVALUATION_CURRENT_EVENTS_STATE",
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
          type: "SET_EVALUATION_SELECTED_ASSESSMENT_EVENTS",
          payload: evaluationAssessmentEvents,
        });

        dispatch({
          type: "UPDATE_EVALUATION_CURRENT_EVENTS_STATE",
          payload: <EvaluationStateType>"READY",
        });

        data.onSuccess && data.onSuccess();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            state.i18n.text.get(
              "plugin.evaluation.notifications.events.error",
              err.message
            ),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_EVALUATION_CURRENT_EVENTS_STATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * loadEvaluationSelectedAssessmentStudyDiaryEventsFromServer
 * @param data data
 */
const loadEvaluationSelectedAssessmentStudyDiaryEventsFromServer: LoadEvaluationStudyDiaryEvent =
  function loadEvaluationSelectedAssessmentStudyDiaryEventsFromServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      dispatch({
        type: "UPDATE_CURRENT_SELECTED_EVALUATION_DIARY_DATA_STATE",
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
          type: "SET_EVALUATION_SELECTED_ASSESSMENT_STUDY_DIARY_EVENTS",
          payload: studyDiaryEvents,
        });

        dispatch({
          type: "UPDATE_CURRENT_SELECTED_EVALUATION_DIARY_DATA_STATE",
          payload: <EvaluationStateType>"READY",
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            state.i18n.text.get(
              "plugin.evaluation.notifications.diaryEvents.error",
              err.message
            ),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_CURRENT_SELECTED_EVALUATION_DIARY_DATA_STATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * LoadBilledPriceFromServer
 * @param data data
 */
const LoadBilledPriceFromServer: LoadBilledPrice =
  function LoadBilledPriceFromServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>
    ) => {
      dispatch({
        type: "UPDATE_EVALUATION_STATE",
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
          type: "SET_EVALUATION_BILLED_PRICE",
          payload: basePrice > 0 ? basePrice : undefined,
        });

        dispatch({
          type: "UPDATE_EVALUATION_STATE",
          payload: <EvaluationStateType>"READY",
        });
      } catch (error) {
        dispatch({
          type: "SET_EVALUATION_BILLED_PRICE",
          payload: undefined,
        });

        dispatch({
          type: "UPDATE_EVALUATION_STATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * loadEvaluationCompositeRepliesFromServer
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
      const state = getState();

      dispatch({
        type: "UPDATE_EVALUATION_COMPOSITE_REPLIES_STATE",
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
          type: "SET_EVALUATION_COMPOSITE_REPLIES",
          payload: evaluationCompositeReplies,
        });

        dispatch({
          type: "UPDATE_EVALUATION_COMPOSITE_REPLIES_STATE",
          payload: <EvaluationStateType>"READY",
        });

        onSuccess && onSuccess();
      } catch (err) {
        dispatch(
          notificationActions.displayNotification(
            state.i18n.text.get(
              "plugin.evaluation.notifications.assignmentdata.error",
              err.message
            ),
            "error"
          )
        );

        dispatch({
          type: "UPDATE_EVALUATION_COMPOSITE_REPLIES_STATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * saveEvaluationSortFunctionToServer
 * @param data data
 */
const saveEvaluationSortFunctionToServer: SaveEvaluationSortFunction =
  function saveEvaluationSortFunctionToServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.evaluations.status !== "LOADING") {
        dispatch({
          type: "UPDATE_EVALUATION_STATE",
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
          type: "SET_EVALUATION_SORT_FUNCTION",
          payload: evaluationSortFunction,
        });

        dispatch({
          type: "UPDATE_EVALUATION_STATE",
          payload: <EvaluationStateType>"READY",
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            state.i18n.text.get(
              "plugin.evaluation.notifications.saveSort.error",
              err.message
            ),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_EVALUATION_STATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * updateWorkspaceEvaluationToServer
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
          type: "UPDATE_EVALUATION_STATE",
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
              state.i18n.text.get(
                "plugin.evaluation.notifications.createEvaluation.error",
                err.message
              ),
              "error"
            )
          );

          dispatch({
            type: "UPDATE_EVALUATION_STATE",
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
              state.i18n.text.get(
                "plugin.evaluation.notifications.updateEvaluation.error",
                err.message
              ),
              "error"
            )
          );

          dispatch({
            type: "UPDATE_EVALUATION_STATE",
            payload: <EvaluationStateType>"ERROR",
          });

          onFail();
        }
      }
    };
  };

/**
 * updateWorkspaceSupplementation
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
              state.i18n.text.get(
                "plugin.evaluation.notifications.updateSupplementation.error",
                error.message
              ),
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
              state.i18n.text.get(
                "plugin.evaluation.notifications.updateSupplementation.error",
                error.message
              ),
              "error"
            )
          );

          dispatch({
            type: "UPDATE_EVALUATION_STATE",
            payload: <EvaluationStateType>"ERROR",
          });

          onFail();
        }
      }
    };
  };

/**
 * removeWorkspaceEventFromServer
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
          type: "UPDATE_EVALUATION_STATE",
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
              type: "UPDATE_EVALUATION_STATE",
              payload: <EvaluationStateType>"READY",
            });

            onSuccess();
          });
        } catch (error) {
          dispatch(
            notificationActions.displayNotification(
              state.i18n.text.get(
                "plugin.evaluation.notifications.removeEvent.error",
                error.message
              ),
              "error"
            )
          );

          dispatch({
            type: "UPDATE_EVALUATION_STATE",
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
              type: "UPDATE_EVALUATION_STATE",
              payload: <EvaluationStateType>"READY",
            });

            onSuccess();
          });
        } catch (error) {
          dispatch(
            notificationActions.displayNotification(
              state.i18n.text.get(
                "plugin.evaluation.notifications.removeEvent.error",
                error.message
              ),
              "error"
            )
          );

          dispatch({
            type: "UPDATE_EVALUATION_STATE",
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
      const state = getState();

      dispatch({
        type: "UPDATE_EVALUATION_SELECTED_ASSESSMENT_ASSIGNMENTS_STATE",
        payload: "LOADING",
      });

      try {
        const [assigments] = await Promise.all([
          (async () => {
            const assignmentsExcercise =
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
              ...assignmentsEvaluated,
              ...assignmentsExcercise,
            ];

            return assignments;
          })(),
        ]);

        dispatch({
          type: "SET_EVALUATION_SELECTED_ASSESSMENT_ASSIGNMENTS",
          payload: { assigments },
        });

        dispatch({
          type: "UPDATE_EVALUATION_SELECTED_ASSESSMENT_ASSIGNMENTS_STATE",
          payload: "READY",
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            state.i18n.text.get(
              "plugin.evaluation.notifications.assignmentdata.error",
              err.message
            ),
            "error"
          )
        );

        dispatch({
          type: "UPDATE_EVALUATION_SELECTED_ASSESSMENT_ASSIGNMENTS_STATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * updateCurrentStudentCompositeRepliesData
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
          type: "SET_EVALUATION_COMPOSITE_REPLIES",
          payload: updatedCompositeReplies,
        });
      } catch (err) {
        dispatch(
          notificationActions.displayNotification(
            state.i18n.text.get(
              "plugin.evaluation.notifications.assignmentdata.error",
              err.message
            ),
            "error"
          )
        );
      }
    };
  };

/**
 * setSelectedWorkspaceId
 * @param data data
 */
const setSelectedWorkspaceId: SetEvaluationSelectedWorkspace =
  function setSelectedWorkspaceId(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>
    ) => {
      dispatch({
        type: "SET_EVALUATION_SELECTED_WORKSPACE",
        payload: data.workspaceId,
      });

      dispatch(loadEvaluationSortFunctionFromServer());

      dispatch(loadEvaluationAssessmentRequestsFromServer());
    };
  };

/**
 * setEvaluationFilters
 * @param data data
 */
const setEvaluationFilters: SetEvaluationFilters =
  function setEvaluationFilters(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>
    ) => {
      dispatch({
        type: "SET_EVALUATION_FILTERS",
        payload: data.evaluationFilters,
      });
    };
  };

/**
 * updateBillingToServer
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
          type: "UPDATE_EVALUATION_STATE",
          payload: <EvaluationStateType>"READY",
        });
      } catch (error) {
        dispatch(
          notificationActions.displayNotification(
            state.i18n.text.get(
              "plugin.evaluation.notifications.updatepricing.error",
              error.message
            ),
            "error"
          )
        );

        dispatch({
          type: "UPDATE_EVALUATION_STATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * setSelectedAssessmentId
 * @param data data
 */
const updateSelectedAssessment: UpdateEvaluationSelectedAssessment =
  function updateSelectedAssessment(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>
    ) => {
      dispatch({
        type: "UPDATE_EVALUATION_SELECTED_ASSESSMENT",
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
 * updateEvaluationSearch
 * @param data data
 */
const updateEvaluationSearch: UpdateEvaluationSearch =
  function updateEvaluationSearch(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>
    ) => {
      dispatch({
        type: "UPDATE_EVALUATION_SEARCH",
        payload: data.searchString,
      });
    };
  };

/**
 * updateImportance
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
        type: "UPDATE_EVALUATION_STATE",
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
        type: "UPDATE_EVALUATION_IMPORTANCE",
        payload: updateImportanceObject,
      });

      if (state.evaluations.status !== "READY") {
        dispatch({
          type: "UPDATE_EVALUATION_STATE",
          payload: <EvaluationStateType>"READY",
        });
      }
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }

      dispatch(
        notificationActions.displayNotification(
          state.i18n.text.get(
            "plugin.evaluation.notifications.saveImportance.error",
            err.message
          ),
          "error"
        )
      );
      dispatch({
        type: "UPDATE_EVALUATION_STATE",
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
        type: "UPDATE_OPENED_ASSIGNMENTS_EVALUATION",
        payload: data.assignmentId,
      });
    };
  };

/**
 * deleteAssessmentRequest
 * @param param0 param0
 * @param param0.workspaceUserEntityId workspaceUserEntityId
 */
const deleteAssessmentRequest: DeleteAssessmentRequest =
  function deleteAssessmentRequest({ workspaceUserEntityId }) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

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
        dispatch(
          notificationActions.displayNotification(
            state.i18n.text.get(
              "plugin.evaluation.notifications.deleteRequest.error",
              error.message
            ),
            "error"
          )
        );
      }
    };
  };

/**
 * archiveStudent
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
    const state = getState();

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
          state.i18n.text.get(
            "plugin.evaluation.notifications.archiveStudent.error",
            error.message
          ),
          "error"
        )
      );
    }
  };
};

/**
 * loadBasePriceFromServer
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
        type: "UPDATE_BASE_PRICE_STATE",
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
        type: "SET_BASE_PRICE",
        payload: basePrice,
      });

      dispatch({
        type: "UPDATE_BASE_PRICE_STATE",
        payload: <EvaluationStateType>"READY",
      });
    };
  };

/**
 * updateNeedsReloadEvaluationRequests
 * @param root0 root0
 * @param root0.value value
 */
const updateNeedsReloadEvaluationRequests: UpdateNeedsReloadEvaluationRequests =
  function updateNeedsReloadEvaluationRequests({ value }) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>
    ) => {
      dispatch({
        type: "UPDATE_NEEDS_RELOAD_EVALUATION_REQUESTS",
        payload: value,
      });
    };
  };

/**
 * loadWorkspaceJournalCommentsFromServer
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
              getState().i18n.text.get(
                "plugin.evaluation.notifications.loadJournalComments.error",
                err.message
              ),
              "error"
            )
          );
        }
      }
    };
  };

/**
 * createWorkspaceJournalComment
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
            getState().i18n.text.get(
              "plugin.evaluation.notifications.createJournalComments.error",
              err.message
            ),
            "error"
          )
        );
        fail && fail();
      }
    };
  };

/**
 * createWorkspaceJournalComment
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
            getState().i18n.text.get(
              "plugin.evaluation.notifications.updateJournalComments.error",
              err.message
            ),
            "error"
          )
        );
        fail && fail();
      }
    };
  };

/**
 * deleteEvaluationJournalComment
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
            getState().i18n.text.get(
              "plugin.evaluation.notifications.deleteJournalComments.error",
              err.message
            ),
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
  saveEvaluationSortFunctionToServer,
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
  loadEvaluationSelectedAssessmentStudyDiaryEventsFromServer,
  loadBasePriceFromServer,
  archiveStudent,
  deleteAssessmentRequest,
  loadEvaluationJournalCommentsFromServer,
  createEvaluationJournalComment,
  updateEvaluationJournalComment,
  deleteEvaluationJournalComment,
};
