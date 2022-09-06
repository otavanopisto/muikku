import { ActionType } from "../../../actions/index";
import { MaterialCompositeRepliesType } from "../../workspaces/index";
import {
  EvaluationWorkspace,
  EvaluationStateType,
  EvaluationGradeSystem,
  AssessmentRequest,
  EvaluationSort,
  EvaluationAssigmentData,
  EvaluationEvent,
  EvaluationStudyDiaryEvent,
  EvaluationBasePriceById,
  EvaluationFilters,
} from "../../../@types/evaluation";
import { Reducer } from "redux";

/**
 * EvaluationStateAndData
 */
interface EvaluationStateAndData<T> {
  state: EvaluationStateType;
  data?: T;
}

/**
 * Interface for evaluation redux state
 */
export interface EvaluationState {
  status: EvaluationStateType;
  importantRequests: number[];
  unimportantRequests: number[];
  evaluationGradeSystem: EvaluationGradeSystem[];
  evaluationRequests: EvaluationStateAndData<AssessmentRequest[]>;
  evaluationWorkspaces: EvaluationWorkspace[];
  selectedWorkspaceId?: number;
  evaluationSearch: string;
  evaluationSort?: EvaluationSort;
  evaluationFilters: EvaluationFilters;
  evaluationSelectedAssessmentId?: AssessmentRequest;
  evaluationAssessmentEvents?: EvaluationStateAndData<EvaluationEvent[]>;
  evaluationDiaryEntries?: EvaluationStateAndData<EvaluationStudyDiaryEvent[]>;
  evaluationCurrentStudentAssigments?: EvaluationStateAndData<EvaluationAssigmentData>;
  evaluationCompositeReplies?: EvaluationStateAndData<
    MaterialCompositeRepliesType[]
  >;
  openedAssignmentEvaluationId?: number;
  evaluationBilledPrice?: number;
  needsReloadEvaluationRequests: boolean;
  basePrice: EvaluationStateAndData<EvaluationBasePriceById>;
}

/**
 * Initial state
 */
export const initialState: EvaluationState = {
  status: "LOADING",
  importantRequests: [],
  unimportantRequests: [],
  evaluationGradeSystem: [],
  evaluationRequests: {
    state: "LOADING",
    data: undefined,
  },
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
  evaluationAssessmentEvents: {
    state: "LOADING",
    data: undefined,
  },
  evaluationSelectedAssessmentId: undefined,
  evaluationCurrentStudentAssigments: { state: "LOADING", data: undefined },
  openedAssignmentEvaluationId: undefined,
  evaluationBilledPrice: undefined,
  evaluationDiaryEntries: {
    state: "LOADING",
    data: undefined,
  },
  evaluationCompositeReplies: { state: "LOADING", data: undefined },
  needsReloadEvaluationRequests: false,
  basePrice: {
    state: "LOADING",
    data: undefined,
  },
};

/**
 * Reducer function for evaluation
 *
 * @param state state
 * @param action action
 * @returns State of evaluation
 */
export const evaluations: Reducer<EvaluationState> = (
  state = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_EVALUATION_STATE":
      return {
        ...state,
        status: action.payload,
      };

    case "SET_IMPORTANT_ASSESSMENTS":
      return {
        ...state,
        importantRequests: action.payload.value
          ? action.payload.value.split(",").map((item) => parseInt(item))
          : [],
      };

    case "SET_UNIMPORTANT_ASSESSMENTS":
      return {
        ...state,
        unimportantRequests: action.payload.value
          ? action.payload.value.split(",").map((item) => parseInt(item))
          : [],
      };

    case "SET_EVALUATION_WORKSPACES":
      return {
        ...state,
        evaluationWorkspaces: action.payload,
      };

    case "SET_EVALUATION_GRADE_SYSTEM":
      return {
        ...state,
        evaluationGradeSystem: action.payload,
      };

    case "SET_EVALUATION_SELECTED_WORKSPACE":
      return {
        ...state,
        selectedWorkspaceId: action.payload,
        evaluationFilters:
          action.payload === undefined
            ? initialState.evaluationFilters
            : state.evaluationFilters,
      };

    case "UPDATE_EVALUATION_SEARCH":
      return {
        ...state,
        evaluationSearch: action.payload,
      };

    case "SET_EVALUATION_SORT_FUNCTION":
      return {
        ...state,
        evaluationSort: action.payload,
      };

    case "SET_EVALUATION_FILTERS":
      return {
        ...state,
        evaluationFilters: action.payload,
      };

    case "UPDATE_EVALUATION_IMPORTANCE":
      return {
        ...state,
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
      };

    case "UPDATE_EVALUATION_SELECTED_ASSESSMENT":
      return {
        ...state,
        evaluationSelectedAssessmentId: action.payload,
      };

    case "UPDATE_OPENED_ASSIGNMENTS_EVALUATION":
      return {
        ...state,
        openedAssignmentEvaluationId: action.payload,
      };

    case "SET_EVALUATION_BILLED_PRICE":
      return {
        ...state,
        openedAssignmentEvaluationId: action.payload,
      };

    case "SET_EVALUATION_COMPOSITE_REPLIES":
      return {
        ...state,
        evaluationCompositeReplies: {
          state: state.evaluationCompositeReplies.state,
          data: action.payload,
        },
      };

    case "UPDATE_EVALUATION_COMPOSITE_REPLIES_STATE":
      return {
        ...state,
        evaluationCompositeReplies: {
          state: action.payload,
          data: state.evaluationCompositeReplies.data,
        },
      };

    case "SET_EVALUATION_SELECTED_ASSESSMENT_EVENTS":
      return {
        ...state,
        evaluationAssessmentEvents: {
          state: state.evaluationAssessmentEvents.state,
          data: action.payload,
        },
      };

    case "UPDATE_EVALUATION_CURRENT_EVENTS_STATE":
      return {
        ...state,
        evaluationAssessmentEvents: {
          state: action.payload,
          data: state.evaluationAssessmentEvents.data,
        },
      };

    case "SET_EVALUATION_SELECTED_ASSESSMENT_STUDY_DIARY_EVENTS":
      return {
        ...state,
        evaluationDiaryEntries: {
          state: state.evaluationDiaryEntries.state,
          data: action.payload,
        },
      };

    case "UPDATE_CURRENT_SELECTED_EVALUATION_DIARY_DATA_STATE":
      return {
        ...state,
        evaluationDiaryEntries: {
          state: action.payload,
          data: state.evaluationDiaryEntries.data,
        },
      };

    case "SET_EVALUATION_SELECTED_ASSESSMENT_ASSIGNMENTS":
      return {
        ...state,
        evaluationCurrentStudentAssigments: {
          state: state.evaluationCurrentStudentAssigments.state,
          data: action.payload,
        },
      };

    case "UPDATE_EVALUATION_SELECTED_ASSESSMENT_ASSIGNMENTS_STATE":
      return {
        ...state,
        evaluationCurrentStudentAssigments: {
          state: action.payload,
          data: state.evaluationCurrentStudentAssigments.data,
        },
      };

    case "SET_EVALUATION_ASESSESSMENTS":
      return {
        ...state,
        evaluationRequests: {
          state: state.evaluationRequests.state,
          data: action.payload,
        },
      };

    case "UPDATE_EVALUATION_REQUESTS_STATE":
      return {
        ...state,
        needsReloadEvaluationRequests: false,
        evaluationRequests: {
          state: action.payload,
          data: state.evaluationRequests.data,
        },
      };

    case "UPDATE_NEEDS_RELOAD_EVALUATION_REQUESTS":
      return {
        ...state,
        needsReloadEvaluationRequests: action.payload,
      };

    case "SET_BASE_PRICE":
      return {
        ...state,
        basePrice: { state: state.basePrice.state, data: action.payload },
      };

    case "UPDATE_BASE_PRICE_STATE":
      return {
        ...state,
        basePrice: { state: action.payload, data: state.basePrice.data },
      };

    default:
      return state;
  }
};

/**
 * Reducer function for evaluation
 * @param state state
 * @param action action
 * @returns State of evaluation
 */
/* export default function evaluations(state = initialState, action: ActionType) {
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
  } else if (action.type === "UPDATE_OPENED_ASSIGNMENTS_EVALUATION") {
    return Object.assign({}, state, {
      openedAssignmentEvaluationId: action.payload,
    });
  } else if (action.type === "SET_EVALUATION_BILLED_PRICE") {
    return Object.assign({}, state, {
      openedAssignmentEvaluationId: action.payload,
    });
  } else if (action.type === "SET_EVALUATION_COMPOSITE_REPLIES") {
    return Object.assign({}, state, {
      evaluationCompositeReplies: {
        state: state.evaluationCompositeReplies.state,
        data: action.payload,
      },
    });
  } else if (action.type === "UPDATE_EVALUATION_COMPOSITE_REPLIES_STATE") {
    return Object.assign({}, state, {
      evaluationCompositeReplies: {
        state: action.payload,
        data: state.evaluationCompositeReplies.data,
      },
    });
  } else if (action.type === "SET_EVALUATION_SELECTED_ASSESSMENT_EVENTS") {
    return Object.assign({}, state, {
      evaluationAssessmentEvents: {
        state: state.evaluationAssessmentEvents.state,
        data: action.payload,
      },
    });
  } else if (action.type === "UPDATE_EVALUATION_CURRENT_EVENTS_STATE") {
    return Object.assign({}, state, {
      evaluationAssessmentEvents: {
        state: action.payload,
        data: state.evaluationAssessmentEvents.data,
      },
    });
  } else if (
    action.type === "SET_EVALUATION_SELECTED_ASSESSMENT_STUDY_DIARY_EVENTS"
  ) {
    return Object.assign({}, state, {
      evaluationDiaryEntries: {
        state: state.evaluationDiaryEntries.state,
        data: action.payload,
      },
    });
  } else if (
    action.type === "UPDATE_CURRENT_SELECTED_EVALUATION_DIARY_DATA_STATE"
  ) {
    return Object.assign({}, state, {
      evaluationDiaryEntries: {
        state: action.payload,
        data: state.evaluationDiaryEntries.data,
      },
    });
  } else if (action.type === "SET_EVALUATION_SELECTED_ASSESSMENT_ASSIGNMENTS") {
    return Object.assign({}, state, {
      evaluationCurrentStudentAssigments: {
        state: state.evaluationCurrentStudentAssigments.state,
        data: action.payload,
      },
    });
  } else if (
    action.type === "UPDATE_EVALUATION_SELECTED_ASSESSMENT_ASSIGNMENTS_STATE"
  ) {
    return Object.assign({}, state, {
      evaluationCurrentStudentAssigments: {
        state: action.payload,
        data: state.evaluationCurrentStudentAssigments.data,
      },
    });
  } else if (action.type === "SET_EVALUATION_ASESSESSMENTS") {
    return Object.assign({}, state, {
      evaluationRequests: {
        state: state.evaluationRequests.state,
        data: action.payload,
      },
    });
  } else if (action.type === "UPDATE_EVALUATION_REQUESTS_STATE") {
    return Object.assign({}, state, {
      needsReloadEvaluationRequests: false,
      evaluationRequests: {
        state: action.payload,
        data: state.evaluationRequests.data,
      },
    });
  } else if (action.type === "UPDATE_NEEDS_RELOAD_EVALUATION_REQUESTS") {
    return Object.assign({}, state, {
      needsReloadEvaluationRequests: action.payload,
    });
  } else if (action.type === "SET_BASE_PRICE") {
    return Object.assign({}, state, {
      basePrice: { state: state.basePrice.state, data: action.payload },
    });
  } else if (action.type === "UPDATE_BASE_PRICE_STATE") {
    return Object.assign({}, state, {
      basePrice: { state: action.payload, data: state.basePrice.data },
    });
  }
  return state;
} */
