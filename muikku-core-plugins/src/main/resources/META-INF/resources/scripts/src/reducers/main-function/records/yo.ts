import { ActionType } from "actions";

export type YOStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";
export type YOEligibilityStatusType = "NOT_ELIGIBLE" | "ELIGIBLE" | "ENROLLED";

export interface YOEnrollmentType{
 id: number,
 enrolled: boolean,
 enrollmentDate: string,
 eligible: boolean,
 starts: string,
 ends: string,
}

export interface YOEligibilityType {
  coursesCompleted: number,
  coursesRequired: number
}

export interface YOType {
  status: YOStatusType,
  enrollment: Array<YOEnrollmentType>,
  subjects: Array<YOMatriculationSubjectType>,
  eligibility: YOEligibilityType,
  eligibilityStatus: YOEligibilityStatusType
}

export interface YOMatriculationSubjectType {
  code: string,
  subjectCode: string
}

export default function yo(state:YOType={
  status: "WAIT",
  enrollment: null,
  subjects: null,
  eligibility: null,
  eligibilityStatus: null
}, action: ActionType):YOType{
  if (action.type === "UPDATE_STUDIES_YO_STATUS"){
    return Object.assign({}, state, {
      status: action.payload
    });
  } else if (action.type === "UPDATE_STUDIES_YO"){
    return Object.assign({}, state, {
      enrollment: action.payload
    });
  } else if (action.type === "UPDATE_STUDIES_YO_SUBJECTS"){
     return Object.assign({}, state, {
       subjects: action.payload
     });
  } else if (action.type === "UPDATE_STUDIES_YO_ELIGIBILITY_STATUS"){
     return Object.assign({}, state, {
       eligibilityStatus: action.payload
     });
  } else if (action.type === "UPDATE_STUDIES_YO_ELIGIBILITY"){
     return Object.assign({}, state, {
       eligibility: action.payload
     });
   }
  return state;
}