import { ActionType } from "actions";
import { Reducer } from "redux";
import {
  MatriculationEligibility,
  MatriculationEligibilityStatus,
  MatriculationEnrollment,
  MatriculationSubject,
} from "~/generated/client";
export type MatriculationStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";
export type MatriculationSubjectEligibilityStatusType =
  | "WAIT"
  | "LOADING"
  | "READY"
  | "ERROR";

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

/**
 * MatriculationSubjectEligibilityState
 */
export interface MatriculationSubjectEligibilityState {
  subjects: MatriculationSubjectWithEligibilityStatus[];
  status: MatriculationSubjectEligibilityStatusType;
}

/**
 * MatriculationState
 */
export interface MatriculationState {
  status: MatriculationStatusType;
  enrollment: MatriculationEnrollment[];
  subjects: MatriculationSubject[];
  eligibility: MatriculationEligibility;
  eligibilityStatus: MatriculationEligibilityStatus;
}

/**
 * intialState
 */
const initialState: MatriculationState = {
  status: "WAIT",
  enrollment: null,
  subjects: null,
  eligibility: null,
  eligibilityStatus: null,
};

/**
 * Reducer function for yo
 *
 * @param state state
 * @param action action
 * @returns State of yo
 */
export const yo: Reducer<MatriculationState> = (
  state = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_STUDIES_YO_STATUS":
      return {
        ...state,
        status: action.payload,
      };

    case "UPDATE_STUDIES_YO":
      return {
        ...state,
        enrollment: action.payload,
      };

    case "UPDATE_STUDIES_YO_SUBJECTS":
      return {
        ...state,
        subjects: action.payload,
      };

    case "UPDATE_STUDIES_YO_ELIGIBILITY_STATUS":
      return {
        ...state,
        eligibilityStatus: action.payload,
      };

    case "UPDATE_STUDIES_YO_ELIGIBILITY":
      return {
        ...state,
        eligibility: action.payload,
      };

    default:
      return state;
  }
};

/**
 * initialStateEligibilitySubjects
 */
const initialStateEligibilitySubjects: MatriculationSubjectEligibilityState = {
  status: "WAIT",
  subjects: [],
};

/**
 * Reducer function for eligibility subjects
 *
 * @param state state
 * @param action action
 * @returns State of eligibilitySubjects
 */
export const eligibilitySubjects: Reducer<
  MatriculationSubjectEligibilityState
> = (state = initialStateEligibilitySubjects, action: ActionType) => {
  switch (action.type) {
    case "UPDATE_STUDIES_SUBJECT_ELIGIBILITY":
      return {
        ...state,
        subjects: action.payload,
      };

    case "UPDATE_STUDIES_SUBJECT_ELIGIBILITY_STATUS":
      return {
        ...state,
        status: action.payload,
      };

    default:
      return state;
  }
};
