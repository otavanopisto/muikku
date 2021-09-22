import { SpecificActionType, AnyActionType } from "../../index";
import {
  EvaluationStateType,
  EvaluationGradeSystem,
  AssignmentEvaluationGradeRequest,
  AssignmentEvaluationSupplementationRequest,
  WorkspaceEvaluationSaveReturn,
} from "../../../@types/evaluation";
import { StateType } from "../../../reducers/index";
import mApi from "~/lib/mApi";
import promisify from "../../../util/promisify";
import { MApiError } from "../../../lib/mApi";
import notificationActions from "~/actions/base/notifications";
import { CurrentRecordType } from "../../../reducers/main-function/records/index";
import {
  EvaluationEnum,
  BilledPriceRequest,
  EvaluationData,
} from "../../../@types/evaluation";
import { MaterialCompositeRepliesType } from "../../../reducers/workspaces/index";
import { WorkspaceUserEntity } from "../../../@types/evaluation";
import {
  WorkspaceEvaluationSaveRequest,
  WorkspaceSupplementationSaveRequest,
} from "../../../@types/evaluation";
import {
  AllStudentUsersDataType,
  RecordGroupType,
} from "../../../reducers/main-function/records/index";
import {
  WorkspaceType,
  WorkspaceStudentAssessmentStateType,
  WorkspaceStudentActivityType,
  WorkspaceJournalListType,
  MaterialAssignmentType,
  MaterialContentNodeType,
  MaterialEvaluationType,
} from "../../../reducers/workspaces/index";
import {
  EvaluationAssignment,
  EvaluationStudyDiaryEvent,
} from "../../../@types/evaluation";
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

//////State update interfaces
export interface UPDATE_BASE_PRICE_STATE
  extends SpecificActionType<"UPDATE_BASE_PRICE_STATE", EvaluationStateType> {}

export interface UPDATE_EVALUATION_STATE
  extends SpecificActionType<"UPDATE_EVALUATION_STATE", EvaluationStateType> {}

export interface UPDATE_EVALUATION_COMPOSITE_REPLIES_STATE
  extends SpecificActionType<
    "UPDATE_EVALUATION_COMPOSITE_REPLIES_STATE",
    EvaluationStateType
  > {}

export interface UPDATE_CURRENT_SELECTED_EVALUATION_DATA_STATE
  extends SpecificActionType<
    "UPDATE_CURRENT_SELECTED_EVALUATION_DATA_STATE",
    EvaluationStateType
  > {}

export interface UPDATE_EVALUATION_CURRENT_EVENTS_STATE
  extends SpecificActionType<
    "UPDATE_EVALUATION_CURRENT_EVENTS_STATE",
    EvaluationStateType
  > {}

export interface UPDATE_CURRENT_SELECTED_EVALUATION_DIARY_DATA_STATE
  extends SpecificActionType<
    "UPDATE_CURRENT_SELECTED_EVALUATION_DIARY_DATA_STATE",
    EvaluationStateType
  > {}

export interface UPDATE_EVALUATION_REQUESTS_STATE
  extends SpecificActionType<
    "UPDATE_EVALUATION_REQUESTS_STATE",
    EvaluationStateType
  > {}

export interface SET_BASE_PRICE
  extends SpecificActionType<"SET_BASE_PRICE", number> {}

export interface SET_IMPORTANT_ASSESSMENTS
  extends SpecificActionType<"SET_IMPORTANT_ASSESSMENTS", EvaluationStatus> {}

export interface SET_UNIMPORTANT_ASSESSMENTS
  extends SpecificActionType<"SET_UNIMPORTANT_ASSESSMENTS", EvaluationStatus> {}

export interface SET_EVALUATION_ASESSESSMENTS
  extends SpecificActionType<
    "SET_EVALUATION_ASESSESSMENTS",
    AssessmentRequest[]
  > {}

export interface SET_EVALUATION_WORKSPACES
  extends SpecificActionType<
    "SET_EVALUATION_WORKSPACES",
    EvaluationWorkspace[]
  > {}

export interface SET_EVALUATION_GRADE_SYSTEM
  extends SpecificActionType<
    "SET_EVALUATION_GRADE_SYSTEM",
    EvaluationGradeSystem[]
  > {}

export interface SET_EVALUATION_BILLED_PRICE
  extends SpecificActionType<"SET_EVALUATION_BILLED_PRICE", number> {}

export interface SET_EVALUATION_SELECTED_WORKSPACE
  extends SpecificActionType<
    "SET_EVALUATION_SELECTED_WORKSPACE",
    number | undefined
  > {}

export interface SET_EVALUATION_SORT_FUNCTION
  extends SpecificActionType<"SET_EVALUATION_SORT_FUNCTION", EvaluationSort> {}

export interface SET_EVALUATION_FILTERS
  extends SpecificActionType<"SET_EVALUATION_FILTERS", EvaluationFilters> {}

export interface SET_EVALUATION_COMPOSITE_REPLIES
  extends SpecificActionType<
    "SET_EVALUATION_COMPOSITE_REPLIES",
    MaterialCompositeRepliesType[]
  > {}

export interface UPDATE_EVALUATION_SEARCH
  extends SpecificActionType<"UPDATE_EVALUATION_SEARCH", string> {}

export interface UPDATE_EVALUATION_IMPORTANCE
  extends SpecificActionType<
    "UPDATE_EVALUATION_IMPORTANCE",
    {
      importantAssessments: EvaluationImportance;
      unimportantAssessments: EvaluationImportance;
    }
  > {}

export interface UPDATE_EVALUATION_SELECTED_ASSESSMENT
  extends SpecificActionType<
    "UPDATE_EVALUATION_SELECTED_ASSESSMENT",
    AssessmentRequest
  > {}

export interface SET_EVALUATION_SELECTED_ASSESSMENT_EVENTS
  extends SpecificActionType<
    "SET_EVALUATION_SELECTED_ASSESSMENT_EVENTS",
    EvaluationEvent[]
  > {}

export interface SET_EVALUATION_SELECTED_ASSESSMENT_ASSIGNMENTS
  extends SpecificActionType<
    "SET_EVALUATION_SELECTED_ASSESSMENT_ASSIGNMENTS",
    EvaluationAssignment[]
  > {}

export interface SET_EVALUATION_SELECTED_ASSESSMENT_STUDY_DIARY_EVENTS
  extends SpecificActionType<
    "SET_EVALUATION_SELECTED_ASSESSMENT_STUDY_DIARY_EVENTS",
    EvaluationStudyDiaryEvent[]
  > {}

export type UPDATE_EVALUATION_RECORDS_CURRENT_STUDENT = SpecificActionType<
  "UPDATE_EVALUATION_RECORDS_CURRENT_STUDENT",
  EvaluationData
>;

export interface UPDATE_OPENED_ASSIGNMENTS_EVALUATION
  extends SpecificActionType<"UPDATE_OPENED_ASSIGNMENTS_EVALUATION", number> {}

export interface UPDATE_NEEDS_RELOAD_EVALUATION_REQUESTS
  extends SpecificActionType<
    "UPDATE_NEEDS_RELOAD_EVALUATION_REQUESTS",
    boolean
  > {}

// Server events
export interface LoadEvaluationSystem {
  (): AnyActionType;
}

export interface LoadEvaluationAssessmentRequest {
  (useFromWorkspace?: boolean): AnyActionType;
}

export interface LoadEvaluationWorkspaces {
  (): AnyActionType;
}

export interface LoadEvaluationImportantAssessment {
  (): AnyActionType;
}

export interface LoadEvaluationUnimportantAssessment {
  (): AnyActionType;
}

export interface LoadEvaluationSortFunction {
  (): AnyActionType;
}

export interface SetCurrentStudentEvaluationData {
  (data: { userEntityId: number; workspaceId: number }): AnyActionType;
}

export interface LoadEvaluationAssessmentEvent {
  (data: {
    assessment: AssessmentRequest;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

export interface LoadEvaluationAssignment {
  (data: { assessment: AssessmentRequest }): AnyActionType;
}

export interface LoadEvaluationStudyDiaryEvent {
  (data: { assessment: AssessmentRequest }): AnyActionType;
}

export interface LoadBilledPrice {
  (data: { workspaceEntityId: number }): AnyActionType;
}

export interface LoadEvaluationCompositeReplies {
  (data: {
    userEntityId: number;
    workspaceId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

export interface LoadBasePrice {
  (data: { workspaceEntityId: number }): AnyActionType;
}

// Other
export interface SaveEvaluationSortFunction {
  (data: { sortFunction: EvaluationSort }): AnyActionType;
}

export interface UpdateWorkspaceEvaluation {
  (data: {
    type: "new" | "edit";
    workspaceEvaluation: WorkspaceEvaluationSaveRequest;
    billingPrice?: string;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

export interface UpdateEvaluationEvent {
  (data: BilledPriceRequest): AnyActionType;
}

export interface UpdateWorkspaceSupplementation {
  (data: {
    type: "new" | "edit";
    workspaceSupplementation: WorkspaceSupplementationSaveRequest;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

export interface RemoveWorkspaceEvent {
  (data: {
    identifier: string;
    eventType: EvaluationEnum;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

export interface SaveEvaluationAssignmentGradeEvaluation {
  (data: {
    workspaceEntityId: number;
    userEntityId: number;
    workspaceMaterialId: number;
    dataToSave: AssignmentEvaluationGradeRequest;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

export interface SaveEvaluationAssignmentSupplementation {
  (data: {
    workspaceEntityId: number;
    userEntityId: number;
    workspaceMaterialId: number;
    dataToSave: AssignmentEvaluationSupplementationRequest;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

export interface DeleteAssessmentRequest {
  (data: {
    workspaceUserEntityId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

export interface ArchiveStudent {
  (data: {
    workspaceEntityId: number;
    workspaceUserEntityId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

export interface SetEvaluationSelectedWorkspace {
  (data: { workspaceId?: number }): AnyActionType;
}

export interface SetEvaluationSortFunction {
  (data: { sortFunction: string }): AnyActionType;
}

export interface SetEvaluationFilters {
  (data: { evaluationFilters: EvaluationFilters }): AnyActionType;
}

export interface UpdateEvaluationSearch {
  (data: { searchString: string }): AnyActionType;
}

export interface UpdateEvaluationSelectedAssessment {
  (data: { assessment: AssessmentRequest }): AnyActionType;
}

export interface UpdateImportance {
  (data: {
    importantAssessments: EvaluationImportance;
    unimportantAssessments: EvaluationImportance;
  }): AnyActionType;
}

export interface UpdateOpenedAssignmentEvaluationId {
  (data: { assignmentId?: number }): AnyActionType;
}

export interface UpdateNeedsReloadEvaluationRequests {
  (data: { value: boolean }): AnyActionType;
}

// Actions

/**
 * loadEvaluationGradingSystemFromServer
 * @returns
 */
const loadEvaluationGradingSystemFromServer: LoadEvaluationSystem =
  function loadEvaluationGradingSystemFromServer() {
    return async (
      dispatch: (arg: AnyActionType) => any,
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
 * @returns
 */
const loadEvaluationAssessmentRequestsFromServer: LoadEvaluationAssessmentRequest =
  function loadEvaluationAssessmentRequestsFromServer(useFromWorkspace) {
    return async (
      dispatch: (arg: AnyActionType) => any,
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
 * @returns
 */
const loadEvaluationWorkspacesFromServer: LoadEvaluationWorkspaces =
  function loadEvaluationWorkspacesFromServer() {
    return async (
      dispatch: (arg: AnyActionType) => any,
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
 * @returns
 */
const loadListOfImportantAssessmentIdsFromServer: LoadEvaluationImportantAssessment =
  function loadListOfImportantAssessmentIdsFromServer() {
    return async (
      dispatch: (arg: AnyActionType) => any,
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
 * @returns
 */
const loadListOfUnimportantAssessmentIdsFromServer: LoadEvaluationUnimportantAssessment =
  function loadListOfUnimportantAssessmentIdsFromServer() {
    return async (
      dispatch: (arg: AnyActionType) => any,
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
      dispatch: (arg: AnyActionType) => any,
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
 */
const loadEvaluationAssessmentEventsFromServer: LoadEvaluationAssessmentEvent =
  function loadEvaluationAssessmentEventsFromServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
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
 */
const loadEvaluationSelectedAssessmentStudyDiaryEventsFromServer: LoadEvaluationStudyDiaryEvent =
  function loadEvaluationSelectedAssessmentStudyDiaryEventsFromServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
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
 * @param data
 */
const LoadBilledPriceFromServer: LoadBilledPrice =
  function LoadBilledPriceFromServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
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
 * @param data
 */
const loadEvaluationCompositeRepliesFromServer: LoadEvaluationCompositeReplies =
  function loadEvaluationCompositeRepliesFromServer({
    userEntityId,
    onSuccess,
    workspaceId,
  }) {
    return async (
      dispatch: (arg: AnyActionType) => any,
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
 * @returns
 */
const saveEvaluationSortFunctionToServer: SaveEvaluationSortFunction =
  function saveEvaluationSortFunctionToServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
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
 * @param param0
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
      dispatch: (arg: AnyActionType) => any,
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
 * @param param0
 */
const updateWorkspaceSupplementationToServer: UpdateWorkspaceSupplementation =
  function updateWorkspaceSupplementationToServer({
    type,
    workspaceSupplementation,
    onSuccess,
    onFail,
  }) {
    return async (
      dispatch: (arg: AnyActionType) => any,
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
 * @param param0
 */
const removeWorkspaceEventFromServer: RemoveWorkspaceEvent =
  function removeWorkspaceEventFromServer({
    identifier,
    eventType,
    onSuccess,
    onFail,
  }) {
    return async (
      dispatch: (arg: AnyActionType) => any,
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
 * setCurrentStudentEvaluationData
 * @param userEntityId
 * @param userId
 * @param workspaceId
 */
const setCurrentStudentEvaluationData: SetCurrentStudentEvaluationData =
  function setCurrentStudentEvaluationData({ userEntityId, workspaceId }) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const state = getState();

      try {
        dispatch({
          type: "UPDATE_CURRENT_SELECTED_EVALUATION_DATA_STATE",
          payload: <EvaluationStateType>"LOADING",
        });

        let [materials] = await Promise.all([
          (async () => {
            let assignmentsExcercise =
              <Array<MaterialAssignmentType>>await promisify(
                mApi().workspace.workspaces.materials.read(workspaceId, {
                  assignmentType: "EXERCISE",
                }),
                "callback"
              )() || [];

            let assignmentsEvaluated =
              <Array<MaterialAssignmentType>>await promisify(
                mApi().workspace.workspaces.materials.read(workspaceId, {
                  assignmentType: "EVALUATED",
                }),
                "callback"
              )() || [];

            let assignments = [
              ...assignmentsEvaluated,
              ...assignmentsExcercise,
            ];

            let materials: Array<MaterialContentNodeType>;
            let evaluations: Array<MaterialEvaluationType>;
            [materials, evaluations] = <any>await Promise.all([
              Promise.all(
                assignments.map((assignment) => {
                  return promisify(
                    mApi().materials.html.read(assignment.materialId),
                    "callback"
                  )();
                })
              ),
              Promise.all(
                assignments.map((assignment) => {
                  return promisify(
                    mApi().workspace.workspaces.materials.evaluations.read(
                      workspaceId,
                      assignment.id,
                      {
                        userEntityId,
                      }
                    ),
                    "callback"
                  )().then((evaluations: Array<MaterialEvaluationType>) => {
                    return evaluations[0];
                  });
                })
              ),
            ]);

            return materials.map((material, index) => {
              return <MaterialContentNodeType>Object.assign(material, {
                evaluation: evaluations[index],
                assignment: assignments[index],
              });
            });
          })(),
        ]);

        dispatch({
          type: "UPDATE_EVALUATION_RECORDS_CURRENT_STUDENT",
          payload: {
            materials,
          },
        });

        dispatch({
          type: "UPDATE_CURRENT_SELECTED_EVALUATION_DATA_STATE",
          payload: <EvaluationStateType>"READY",
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
          type: "UPDATE_CURRENT_SELECTED_EVALUATION_DATA_STATE",
          payload: <EvaluationStateType>"ERROR",
        });
      }
    };
  };

/**
 * setSelectedWorkspaceId
 * @param data
 */
const setSelectedWorkspaceId: SetEvaluationSelectedWorkspace =
  function setSelectedWorkspaceId(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
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
 * @param data
 */
const setEvaluationFilters: SetEvaluationFilters =
  function setEvaluationFilters(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      dispatch({
        type: "SET_EVALUATION_FILTERS",
        payload: data.evaluationFilters,
      });
    };
  };

/**
 * updateBillingToServer
 */
const updateBillingToServer: UpdateEvaluationEvent =
  function updateBillingToServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
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
 * @param data
 */
const updateSelectedAssessment: UpdateEvaluationSelectedAssessment =
  function updateSelectedAssessment(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
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
 * @param data
 */
const updateEvaluationSearch: UpdateEvaluationSearch =
  function updateEvaluationSearch(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      dispatch({
        type: "UPDATE_EVALUATION_SEARCH",
        payload: data.searchString,
      });
    };
  };

/**
 * updateImportance
 * @param date
 */
const updateImportance: UpdateImportance = function updateImportance(data) {
  return async (
    dispatch: (arg: AnyActionType) => any,
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
 * @param data
 */
const updateOpenedAssignmentEvaluation: UpdateOpenedAssignmentEvaluationId =
  function updateOpenedAssignmentEvaluation(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      dispatch({
        type: "UPDATE_OPENED_ASSIGNMENTS_EVALUATION",
        payload: data.assignmentId,
      });
    };
  };

/**
 * saveAssignmentEvaluationGradeToServer
 */
const saveAssignmentEvaluationGradeToServer: SaveEvaluationAssignmentGradeEvaluation =
  function saveAssignmentEvaluationGradeToServer({
    workspaceEntityId,
    workspaceMaterialId,
    userEntityId,
    dataToSave,
    onSuccess,
  }) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.evaluations.status !== "LOADING") {
        dispatch({
          type: "UPDATE_EVALUATION_STATE",
          payload: <EvaluationStateType>"LOADING",
        });
      }

      try {
        await promisify(
          mApi().evaluation.workspace.user.workspacematerial.assessment.create(
            workspaceEntityId,
            userEntityId,
            workspaceMaterialId,
            {
              ...dataToSave,
            }
          ),
          "callback"
        )().then(async () => {
          await mApi().workspace.workspaces.compositeReplies.cacheClear();

          dispatch(
            setCurrentStudentEvaluationData({
              userEntityId,
              workspaceId: workspaceEntityId,
            })
          );

          dispatch(
            loadEvaluationCompositeRepliesFromServer({
              userEntityId,
              onSuccess,
              workspaceId: workspaceEntityId,
            })
          );
        });
      } catch (error) {
        dispatch(
          notificationActions.displayNotification(
            state.i18n.text.get(
              "plugin.evaluation.notifications.saveAssigmentGrade.error",
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

const saveAssignmentEvaluationSupplementationToServer: SaveEvaluationAssignmentSupplementation =
  function saveAssignmentEvaluationSupplementationToServer({
    workspaceEntityId,
    workspaceMaterialId,
    userEntityId,
    dataToSave,
    onSuccess,
  }) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const state = getState();

      dispatch({
        type: "UPDATE_EVALUATION_STATE",
        payload: <EvaluationStateType>"ERROR",
      });

      try {
        await promisify(
          mApi().evaluation.workspace.user.workspacematerial.supplementationrequest.create(
            workspaceEntityId,
            userEntityId,
            workspaceMaterialId,
            {
              ...dataToSave,
            }
          ),
          "callback"
        )().then(async () => {
          await mApi().workspace.workspaces.compositeReplies.cacheClear();

          dispatch(
            loadEvaluationCompositeRepliesFromServer({
              userEntityId,
              onSuccess,
              workspaceId: workspaceEntityId,
            })
          );
        });
      } catch (error) {
        dispatch(
          notificationActions.displayNotification(
            state.i18n.text.get(
              "plugin.evaluation.notifications.saveAssigmentSupplementation.error",
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
 * deleteAssessmentRequest
 * @param data
 */
const deleteAssessmentRequest: DeleteAssessmentRequest =
  function deleteAssessmentRequest({ workspaceUserEntityId }) {
    return async (
      dispatch: (arg: AnyActionType) => any,
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
 * @param data
 */
const archiveStudent: ArchiveStudent = function archiveStudent({
  workspaceEntityId,
  workspaceUserEntityId,
  onSuccess,
}) {
  return async (
    dispatch: (arg: AnyActionType) => any,
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
 */
const loadBasePriceFromServer: LoadBasePrice =
  function loadBasePriceFromServer({ workspaceEntityId }) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      let basePrice: number | undefined = undefined;

      dispatch({
        type: "UPDATE_BASE_PRICE_STATE",
        payload: <EvaluationStateType>"LOADING",
      });

      await promisify(
        mApi().worklist.basePrice.read({
          workspaceEntityId: workspaceEntityId,
        }),
        "callback"
      )().then(
        (data) => {
          basePrice = data as number;
        },
        (reject) => {
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
 */
const updateNeedsReloadEvaluationRequests: UpdateNeedsReloadEvaluationRequests =
  function updateNeedsReloadEvaluationRequests({ value }) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      dispatch({
        type: "UPDATE_NEEDS_RELOAD_EVALUATION_REQUESTS",
        payload: value,
      });
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
  saveAssignmentEvaluationGradeToServer,
  saveAssignmentEvaluationSupplementationToServer,
  updateWorkspaceEvaluationToServer,
  updateBillingToServer,
  updateWorkspaceSupplementationToServer,
  removeWorkspaceEventFromServer,
  setSelectedWorkspaceId,
  setEvaluationFilters,
  setCurrentStudentEvaluationData,
  updateEvaluationSearch,
  updateNeedsReloadEvaluationRequests,
  updateImportance,
  updateSelectedAssessment,
  updateOpenedAssignmentEvaluation,
  loadEvaluationAssessmentEventsFromServer,
  loadEvaluationSelectedAssessmentStudyDiaryEventsFromServer,
  loadBasePriceFromServer,
  archiveStudent,
  deleteAssessmentRequest,
};
