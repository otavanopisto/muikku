import { ActionType } from "actions";
import { Reducer } from "redux";
import { MatriculationSubject } from "~/generated/client";
export type YOStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";
export type YOEligibilityStatusType = "NOT_ELIGIBLE" | "ELIGIBLE" | "ENROLLED";
export type SubjectEligibilityStatusType =
  | "WAIT"
  | "LOADING"
  | "READY"
  | "ERROR";
export type EligibleStatusType = "ELIGIBLE" | "NOT_ELIGIBLE";
export type SubjectEligibilityListType = Array<SubjectEligibilityType>;

/**
 * SubjectEligibilityType
 */
export interface SubjectEligibilityType {
  subjectCode: string;
  code: string;
  eligibility: EligibleStatusType;
  requiredCount: number;
  acceptedCount: number;
  loading: boolean;
}

/**
 * SubjectEligibilitySubjectsType
 */
export interface SubjectEligibilitySubjectsType {
  subjects: SubjectEligibilityListType;
  status: SubjectEligibilityStatusType;
}

/**
 * YOEnrollmentType
 */
export interface YOEnrollmentType {
  id: number;
  enrolled: boolean;
  enrollmentDate: string;
  eligible: boolean;
  starts: string;
  ends: string;
  compulsoryEducationEligible: boolean;
}

/**
 * YOEligibilityType
 */
export interface YOEligibilityType {
  coursesCompleted: number;
  coursesRequired: number;
  creditPoints: number;
  creditPointsRequired: number;
}

/**
 * YOType
 */
export interface YOType {
  status: YOStatusType;
  enrollment: Array<YOEnrollmentType>;
  subjects: MatriculationSubject[];
  eligibility: YOEligibilityType;
  eligibilityStatus: YOEligibilityStatusType;
}

/**
 * YOMatriculationSubjectType
 */
export interface YOMatriculationSubjectType {
  code: string;
  subjectCode: string;
}

/**
 * intialState
 */
const initialState: YOType = {
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
export const yo: Reducer<YOType> = (
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
const initialStateEligibilitySubjects: SubjectEligibilitySubjectsType = {
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
export const eligibilitySubjects: Reducer<SubjectEligibilitySubjectsType> = (
  state = initialStateEligibilitySubjects,
  action: ActionType
) => {
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
