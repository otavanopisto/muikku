import { ActionType } from "actions";

export type YOStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";

export interface YODataType{
  studyStartDate: string,
  studyTimeEnd: string,
  studyEndDate: string,
}

export interface YOType {
  status: YOStatusType,
  value: YODataType
}

export default function statistics(state:YOType={
  status: "WAIT",
  value: null
}, action: ActionType):YOType{
  if (action.type === "UPDATE_STUDIES_YO_STATUS"){
    return Object.assign({}, state, {
      status: action.payload
    });
  } else if (action.type === "UPDATE_STUDIES_YO"){
    return Object.assign({}, state, {
      value: action.payload
    });
  }
  return state;
}