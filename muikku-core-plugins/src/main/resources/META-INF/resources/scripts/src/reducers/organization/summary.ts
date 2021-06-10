import { ActionType } from "actions";

export interface VOPSRowItemType {
  courseNumber: number,
  description?: string,
  educationSubtype?: string,
  grade: string,
  mandatority: string,
  name: string,
  placeholder: boolean,
  planned: boolean,
  state: string
}

export interface SummaryWorkspaceDataType {
  unpublishedCount: number,
  publishedCount: number
}

export interface SummaryStudentsDataType {
  activeStudents: number,
  inactiveStudents: number
}

export type SummaryStatusType = "IDLE" | "LOADING" | "READY" | "ERROR";

export interface SummaryType {
  status: SummaryStatusType,
  students: SummaryStudentsDataType,
  workspaces: SummaryWorkspaceDataType
}

export default function vops(state: SummaryType = {
  status: "IDLE",
  students: null,
  workspaces: null,
}, action: ActionType): SummaryType {
  if (action.type === "UPDATE_SUMMARY_STATUS") {
    return Object.assign({}, state, {
      status: action.payload
    });
  } else if (action.type === "LOAD_WORKSPACE_SUMMARY") {
    return Object.assign({}, state, {
      workspaces: action.payload
    });
  } else if (action.type === "LOAD_STUDENT_SUMMARY") {
    return Object.assign({}, state, {
      students: action.payload
    });
  }
  return state;
}
