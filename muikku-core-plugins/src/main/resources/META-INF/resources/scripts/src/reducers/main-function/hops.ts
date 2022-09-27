import { ActionType } from "actions";
import { Reducer } from "redux";

export type HOPSStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";

/**
 * HOPSDataType
 */
export interface HOPSDataType {
  goalSecondarySchoolDegree: "yes" | "no" | "maybe";
  goalMatriculationExam: "yes" | "no" | "maybe";
  vocationalYears: string; // defined as a string, but this is actually a number
  goalJustMatriculationExam: "yes" | "no"; //yo
  justTransferCredits: string; // disguised number
  transferCreditYears: string; // disguised number
  completionYears: string; // disguised number
  mathSyllabus: "MAA" | "MAB";
  finnish: "AI" | "S2";
  swedish: boolean;
  english: boolean;
  german: boolean;
  french: boolean;
  italian: boolean;
  spanish: boolean;
  science: "BI" | "FY" | "KE" | "GE";
  religion: "UE" | "ET" | "UX";
  additionalInfo?: string;
  studentMatriculationSubjects: string[];
  optedIn: boolean;
}

/**
 * HOPSEligibilityType
 */
export interface HOPSEligibilityType {
  upperSecondarySchoolCurriculum: boolean;
}

/**
 * HOPSType
 */
export interface HOPSType {
  hopsPhase?: string;
  eligibility: HOPSEligibilityType;
  status: HOPSStatusType;
  value: HOPSDataType;
}

/**
 * initialHopsState
 */
const initialHopsState: HOPSType = {
  status: "WAIT",
  eligibility: null,
  value: null,
};

/**
 * Reducer function for hops
 *
 * @param state state
 * @param action action
 * @returns State of hops
 */
export const hops: Reducer<HOPSType> = (
  state = initialHopsState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_HOPS_STATUS":
      return { ...state, status: action.payload };

    case "SET_HOPS_PHASE":
      return { ...state, hopsPhase: action.payload };

    case "UPDATE_HOPS":
      return { ...state, value: action.payload };

    case "UPDATE_HOPS_ELIGIBILITY":
      return { ...state, eligibility: action.payload };

    default:
      return state;
  }
};
