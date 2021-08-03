import { EvaluationFilters } from "./../../../@types/evaluation";
import { ActionType } from "../../../actions/index";
import { CurrentRecordType } from "../records/index";
import { EvaluationEvent } from "../../../@types/evaluation";
import { EvaluationSort } from "../../../@types/evaluation";
import {
  EvaluationWorkspace,
  EvaluationStateType,
} from "../../../@types/evaluation";
import {
  EvaluationGradeSystem,
  AssessmentRequest,
} from "../../../@types/evaluation";

/**
 * Interface for evaluation redux state
 */
export interface EvaluationState {
  status: EvaluationStateType;
  importantRequests: number[];
  unimportantRequests: number[];
  evaluationGradeSystem: EvaluationGradeSystem[];
  evaluationRequests: AssessmentRequest[];
  evaluationWorkspaces: EvaluationWorkspace[];
  selectedWorkspaceId?: number;
  evaluationSearch: string;
  evaluationSort?: EvaluationSort;
  evaluationFilters: EvaluationFilters;
  evaluationSelectedAssessmentId?: AssessmentRequest;
  evaluationAssessmentEvents: EvaluationEvent[];
  evaluationCurrentSelectedRecords?: CurrentRecordType;
  openedAssignmentEvaluationId?: number;
  evaluationBilledPrice?: number;
}

/**
 * Initial state
 */
export const initialState: EvaluationState = {
  status: "LOADING",
  importantRequests: [],
  unimportantRequests: [],
  evaluationGradeSystem: [],
  evaluationRequests: [],
  evaluationWorkspaces: [],
  selectedWorkspaceId: undefined,
  evaluationSearch: "",
  evaluationSort: undefined,
  evaluationFilters: {
    evaluated: false,
    notEvaluated: false,
    assessmentRequest: false,
    supplementationRequest: false,
  },
  evaluationAssessmentEvents: [],
  evaluationSelectedAssessmentId: undefined,
  evaluationCurrentSelectedRecords: undefined,
  openedAssignmentEvaluationId: undefined,
  evaluationBilledPrice: undefined,
};

/**
 * Reducer function for evaluation
 * @param state
 * @param action
 * @returns
 */
export default function evaluations(state = initialState, action: ActionType) {
  if (action.type === "UPDATE_EVALUATION_STATE") {
    return Object.assign({}, state, {
      status: action.payload,
    });
  } else if (action.type === "SET_IMPORTANT_ASSESSMENTS") {
    return Object.assign({}, state, {
      importantRequests: action.payload.value
        ? action.payload.value.split(",").map((item) => parseInt(item))
        : [],
    });
  } else if (action.type === "SET_UNIMPORTANT_ASSESSMENTS") {
    return Object.assign({}, state, {
      unimportantRequests: action.payload.value
        ? action.payload.value.split(",").map((item) => parseInt(item))
        : [],
    });
  } else if (action.type === "SET_EVALUATION_ASESSESSMENTS") {
    return Object.assign({}, state, {
      evaluationRequests: action.payload,
    });
  } else if (action.type === "SET_EVALUATION_WORKSPACES") {
    return Object.assign({}, state, {
      evaluationWorkspaces: action.payload,
    });
  } else if (action.type === "SET_EVALUATION_GRADE_SYSTEM") {
    return Object.assign({}, state, {
      evaluationGradeSystem: action.payload,
    });
  } else if (action.type === "SET_EVALUATION_SELECTED_WORKSPACE") {
    return Object.assign({}, state, {
      selectedWorkspaceId: action.payload,
      evaluationFilters:
        action.payload === undefined
          ? initialState.evaluationFilters
          : state.evaluationFilters,
    });
  } else if (action.type === "UPDATE_EVALUATION_SEARCH") {
    return Object.assign({}, state, {
      evaluationSearch: action.payload,
    });
  } else if (action.type === "SET_EVALUATION_SORT_FUNCTION") {
    return Object.assign({}, state, {
      evaluationSort: action.payload,
    });
  } else if (action.type === "SET_EVALUATION_FILTERS") {
    return Object.assign({}, state, {
      evaluationFilters: action.payload,
    });
  } else if (action.type === "UPDATE_EVALUATION_IMPORTANCE") {
    return Object.assign({}, state, {
      importantRequests: action.payload.importantAssessments.value
        ? action.payload.importantAssessments.value
            .split(",")
            .map((item) => parseInt(item))
        : [],
      unimportantRequests: action.payload.unimportantAssessments.value
        ? action.payload.unimportantAssessments.value
            .split(",")
            .map((item) => parseInt(item))
        : [],
    });
  } else if (action.type === "UPDATE_EVALUATION_SELECTED_ASSESSMENT") {
    return Object.assign({}, state, {
      evaluationSelectedAssessmentId: action.payload,
    });
  } else if (action.type === "SET_EVALUATION_SELECTED_ASSESSMENT_EVENTS") {
    return Object.assign({}, state, {
      evaluationAssessmentEvents: action.payload,
    });
  } else if (action.type === "UPDATE_EVALUATION_RECORDS_CURRENT_STUDENT") {
    return Object.assign({}, state, {
      evaluationCurrentSelectedRecords: action.payload,
    });
  } else if (action.type === "UPDATE_OPENED_ASSIGNMENTS_EVALUATION") {
    return Object.assign({}, state, {
      openedAssignmentEvaluationId: action.payload,
    });
  } else if (action.type === "SET_EVALUATION_BILLED_PRICE") {
    return Object.assign({}, state, {
      openedAssignmentEvaluationId: action.payload,
    });
  }
  return state;
}
