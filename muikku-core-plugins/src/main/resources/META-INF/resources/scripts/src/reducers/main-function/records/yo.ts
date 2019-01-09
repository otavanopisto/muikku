import { ActionType } from "actions";

export type YOStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";

export interface YODataType{
  studyStartDate: string,
  studyTimeEnd: string,
  studyEndDate: string,
}

export interface YOSubjectType {
    matriculationSubjects: YOMatriculationSubjectType[] ,
    matriculationSubjectsLoaded: boolean
}

export interface YOType {
  status: YOStatusType,
  value: YODataType,
  subjects: YOSubjectType
}

export interface YOMatriculationSubjectType {
  code: string,
  subjectCode: string
}



export default function yo(state:YOType={
  status: "WAIT",
  value: null,
  subjects: null
}, action: ActionType):YOType{
  if (action.type === "UPDATE_STUDIES_YO_STATUS"){
    return Object.assign({}, state, {
      status: action.payload
    });
  } else if (action.type === "UPDATE_STUDIES_YO"){
    return Object.assign({}, state, {
      value: action.payload
    });
  } else if (action.type === "UPDATE_STUDIES_YO_SUBJECTS"){
     return Object.assign({}, state, {
       subjects: action.payload
     });       
  }
  return state;
}