import { ActionType } from "actions";

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
 * hops
 * @param state state
 * @param action action
 */
export default function hops(
  state: HOPSType = {
    status: "WAIT",
    eligibility: null,
    value: null,
  },
  action: ActionType
): HOPSType {
  if (action.type === "UPDATE_HOPS_STATUS") {
    return Object.assign({}, state, {
      status: action.payload,
    });
  } else if (action.type === "UPDATE_HOPS") {
    return Object.assign({}, state, {
      value: action.payload,
    });
  } else if (action.type === "UPDATE_HOPS_ELIGIBILITY") {
    return Object.assign({}, state, {
      eligibility: action.payload,
    });
  } else if (action.type === "SET_HOPS_PHASE") {
    return Object.assign({}, state, {
      hopsPhase: action.payload,
    });
  }
  return state;
}
