import { ActionType } from "actions";

export interface OrganizationSummaryWorkspaceDataType {
  unpublishedCount: number,
  publishedCount: number
}

export interface OrganizationSummaryStudentsDataType {
  activeStudents: number,
  inactiveStudents: number
}

export type OrganizationSummaryStatusType = "WAITING" | "LOADING" | "READY" | "ERROR";

export interface OrganizationSummaryType {
  status: OrganizationSummaryStatusType,
  students: OrganizationSummaryStudentsDataType,
  workspaces: OrganizationSummaryWorkspaceDataType
}

export default function organizationSummary(state: OrganizationSummaryType = {
  status: "WAITING",
  students: null,
  workspaces: null,
}, action: ActionType): OrganizationSummaryType {
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
