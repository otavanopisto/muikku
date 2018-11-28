import { ActionType } from "actions";

export type HOPSStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";

export interface HOPSDataType {
  goalSecondarySchoolDegree: "yes" | "no" | "maybe",
  goalMatriculationExam: "yes" | "no" | "maybe",
  vocationalYears: string,        //string wtf, but this shit is actually a number
  goalJustMatriculationExam: "yes" | "no",  //yo
  justTransferCredits: string,    //another disguised number
  transferCreditYears: string,    //disguides number
  completionYears: string,      //disguised number
  mathSyllabus: "MAA" | "MAB", 
  finnish: "AI" | "S2",
  swedish: boolean,
  english: boolean,
  german: boolean,
  french: boolean,
  italian: boolean,
  spanish: boolean,
  science: "BI" | "FY" | "KE" | "GE",
  religion: "UE" | "ET" | "UX",
  additionalInfo?: string,
  studentMatriculationSubjects: string[],
  optedIn: boolean
}

export interface HOPSType {
  status: HOPSStatusType,
  value: HOPSDataType
}

export default function vops(state:HOPSType={
  status: "WAIT",
  value: null
}, action: ActionType):HOPSType{
  if (action.type === "UPDATE_HOPS_STATUS"){
    return Object.assign({}, state, {
      status: action.payload
    });
  } else if (action.type === "UPDATE_HOPS"){
    return Object.assign({}, state, {
      value: action.payload
    });
  }
  return state;
}