import { ActionType } from "actions";

export type SummaryStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";

export interface SummaryDataType{
  studyStartDate: string,
  studyTimeEnd: string,
  studyEndDate: string,
}

export interface SummaryType {
  status: SummaryStatusType,
  value: SummaryDataType
}

export default function summary(state:SummaryType={
  status: "WAIT",
  value: null
}, action: ActionType):SummaryType{
  if (action.type === "UPDATE_STUDIES_SUMMARY_STATUS"){
    return Object.assign({}, state, {
      status: action.payload
    });
  } else if (action.type === "UPDATE_STUDIES_SUMMARY"){
    return Object.assign({}, state, {
      value: action.payload
    });
  }
  return state;
}