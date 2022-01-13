import { ActionType } from "actions";

/**
 * VOPSRowItemType
 */
export interface VOPSRowItemType {
  courseNumber: number;
  description?: string;
  educationSubtype?: string;
  grade: string;
  mandatority: string;
  name: string;
  placeholder: boolean;
  planned: boolean;
  state: string;
}

/**
 * VOPSRowType
 */
export interface VOPSRowType {
  subject: string;
  subjectIdentifier: string;
  items: Array<VOPSRowItemType>;
}

/**
 * VOPSDataType
 */
export interface VOPSDataType {
  numMandatoryCourses: number;
  numCourses: number;
  optedIn: boolean;
  rows: Array<VOPSRowType>;
}

export type VOPSStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";

/**
 * VOPSType
 */
export interface VOPSType {
  status: VOPSStatusType;
  value: VOPSDataType;
}

/**
 * vops
 * @param state state
 * @param action action
 */
export default function vops(
  state: VOPSType = {
    status: "WAIT",
    value: null,
  },
  action: ActionType
): VOPSType {
  if (action.type === "UPDATE_VOPS_STATUS") {
    return Object.assign({}, state, {
      status: action.payload,
    });
  } else if (action.type === "UPDATE_VOPS") {
    return Object.assign({}, state, {
      value: action.payload,
    });
  }
  return state;
}
