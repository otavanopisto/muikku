import { Reducer } from "redux";
import { ActionType } from "~/actions";
import {
  MatriculationEligibility,
  MatriculationEligibilityStatus,
  MatriculationExam,
  MatriculationSubject,
} from "~/generated/client";

/**
 * MatriculationSubjectWithEligibilityStatus
 */
export interface MatriculationSubjectWithEligibilityStatus {
  subjectCode: string;
  code: string;
  eligibility: MatriculationEligibilityStatus;
  requiredCount: number;
  acceptedCount: number;
  loading: boolean;
}

export type ReducerStateType = "LOADING" | "ERROR" | "READY" | "IDLE";

/**
 * HopsBackgroundState
 */
interface HopsBackgroundState {}

/**
 * HopsStudyPlanState
 */
interface HopsStudyPlanState {}

/**
 * hopsMatriculation
 */
interface hopsMatriculation {
  exams: MatriculationExam[] | null;
  subjects: MatriculationSubject[] | null;
  eligibility: MatriculationEligibility | null;
}

/**
 * HopsCareerPlanState
 */
interface HopsCareerPlanState {}

/**
 * NoteBookState
 */
export interface HopsState {
  // HOPS BACKGROUND
  hopsBackgroundStatus: ReducerStateType;
  hopsBackgroundState: HopsBackgroundState;

  // HOPS STUDY PLAN
  hopsStudyPlanStatus: ReducerStateType;
  hopsStudyPlanState: HopsStudyPlanState;

  // HOPS EXAMINATION
  hopsMatriculationStatus: ReducerStateType;
  hopsMatriculation: hopsMatriculation;

  // HOPS CAREER PLAN
  hopsCareerPlanStatus: ReducerStateType;
  hopsCareerPlanState: HopsCareerPlanState;
}

const initialHopsState: HopsState = {
  hopsBackgroundStatus: "IDLE",
  hopsBackgroundState: {},
  hopsStudyPlanStatus: "IDLE",
  hopsStudyPlanState: {},
  hopsMatriculationStatus: "IDLE",
  hopsMatriculation: {
    exams: null,
    subjects: null,
    eligibility: null,
  },
  hopsCareerPlanStatus: "IDLE",
  hopsCareerPlanState: {},
};

/**
 * Reducer function for journals
 *
 * @param state state
 * @param action action
 */
export const hopsNew: Reducer<HopsState> = (
  state = initialHopsState,
  action: ActionType
) => {
  switch (action.type) {
    case "HOPS_MATRICULATION_UPDATE_STATUS":
      return {
        ...state,
        hopsMatriculationStatus: action.payload,
      };

    case "HOPS_MATRICULATION_UPDATE_EXAMS":
      return {
        ...state,
        hopsMatriculation: {
          ...state.hopsMatriculation,
          exams: action.payload,
        },
      };
    case "HOPS_MATRICULATION_UPDATE_SUBJECTS":
      return {
        ...state,
        hopsMatriculation: {
          ...state.hopsMatriculation,
          subjects: action.payload,
        },
      };

    case "HOPS_MATRICULATION_UPDATE_ELIGIBILITY":
      return {
        ...state,
        hopsMatriculation: {
          ...state.hopsMatriculation,
          eligibility: action.payload,
        },
      };

    default:
      return state;
  }
};
