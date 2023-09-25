import { ActionType } from "actions";
import { Reducer } from "redux";
import {
  OrganizationContact,
  OrganizationStudentsSummary,
  OrganizationWorkspaceSummary,
} from "~/generated/client";

export type OrganizationSummaryStatusType =
  | "WAITING"
  | "LOADING"
  | "READY"
  | "ERROR";

/**
 * OrganizationSummaryType
 */
export interface OrganizationSummaryType {
  status: OrganizationSummaryStatusType;
  students: OrganizationStudentsSummary;
  workspaces: OrganizationWorkspaceSummary;
  contacts: OrganizationContact[];
}

/**
 * initialOrganizationSummaryState
 */
const initialOrganizationSummaryState: OrganizationSummaryType = {
  status: "WAITING",
  students: null,
  workspaces: null,
  contacts: [],
};

/**
 * Reducer function for reducer
 *
 * @param state state
 * @param action action
 * @returns State of reducer
 */
export const organizationSummary: Reducer<OrganizationSummaryType> = (
  state = initialOrganizationSummaryState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_SUMMARY_STATUS":
      return Object.assign({}, state, {
        status: action.payload,
      });

    case "LOAD_ORGANIZATION_CONTACTS":
      return Object.assign({}, state, {
        contacts: action.payload,
      });

    case "LOAD_WORKSPACE_SUMMARY":
      return { ...state, workspaces: action.payload };

    case "LOAD_STUDENT_SUMMARY":
      return { ...state, students: action.payload };

    default:
      return state;
  }
};
