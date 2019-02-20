import { ActionType } from "actions";
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';


export type SummaryStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";


export interface SummaryDataType {
  coursesDone: number,
  activity: number,
  returnedExercises: number,
}

export interface SummaryType {
  summary: SummaryDataType
  status: SummaryStatusType
}

export default function summary(state:SummaryType={
  status: "WAIT",
  summary: null
}, action: ActionType):SummaryType{
  if (action.type === "UPDATE_STUDIES_SUMMARY_STATUS"){
    return Object.assign({}, state, {
      status: action.payload
    });
  } else if (action.type === "UPDATE_STUDIES_SUMMARY"){    
    return Object.assign({}, state, {
      summary: action.payload
    });
  }
  return state;
}