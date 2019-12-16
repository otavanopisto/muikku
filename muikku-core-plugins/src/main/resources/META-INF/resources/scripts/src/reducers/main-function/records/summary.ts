import { ActionType } from "actions";
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
import { WorkspaceListType, ActivityLogType} from "~/reducers/main-function/workspaces";


export type SummaryStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";

export type SummaryWorkspaceListType = WorkspaceListType;

export interface SummaryDataType {
  eligibilityStatus: number,
  activity: number,
  returnedExercises: number,
  graphData:GraphDataType ,
  coursesDone: number
}

export interface SummaryType {
  summary: SummaryDataType
  status: SummaryStatusType
}

export interface GraphDataType {
  activity: Array<ActivityLogType>,
  workspaces: WorkspaceListType
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