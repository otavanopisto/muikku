import { ActionType } from "actions";
import { Reducer } from "redux";

/**
 * OrganizationSummaryWorkspaceDataType
 */
export interface OrganizationSummaryWorkspaceDataType {
  unpublishedCount: number;
  publishedCount: number;
}

/**
 * OrganizationSummaryStudentsDataType
 */
export interface OrganizationSummaryStudentsDataType {
  activeStudents: number;
  inactiveStudents: number;
}

/**
 * OrganizationSummaryContactDataType
 */
export interface OrganizationSummaryContactDataType {
  id: number;
  type: string;
  name: string;
  phone: string;
  email: string;
}

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
  students: OrganizationSummaryStudentsDataType;
  workspaces: OrganizationSummaryWorkspaceDataType;
  contacts: Array<OrganizationSummaryContactDataType>;
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

/**
 * organizationSummary
 * @param state state
 * @param action action
 */
/* export default function organizationSummary(
  state: OrganizationSummaryType = {
    status: "WAITING",
    students: null,
    workspaces: null,
    contacts: [],
  },
  action: ActionType
): OrganizationSummaryType {
  if (action.type === "UPDATE_SUMMARY_STATUS") {
    return Object.assign({}, state, {
      status: action.payload,
    });
  } else if (action.type === "LOAD_ORGANIZATION_CONTACTS") {
    return Object.assign({}, state, {
      contacts: action.payload,
    });
  } else if (action.type === "LOAD_WORKSPACE_SUMMARY") {
    return Object.assign({}, state, {
      workspaces: action.payload,
    });
  } else if (action.type === "LOAD_STUDENT_SUMMARY") {
    return Object.assign({}, state, {
      students: action.payload,
    });
  }
  return state;
} */
