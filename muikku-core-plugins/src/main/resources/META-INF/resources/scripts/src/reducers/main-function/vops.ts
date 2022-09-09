import { ActionType } from "actions";
import { Reducer } from "redux";

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
 * initialVopsState
 */
const initialVopsState: VOPSType = {
  status: "WAIT",
  value: null,
};

/**
 * Reducer function for vops
 *
 * @param state state
 * @param action action
 * @returns State of vops
 */
export const vops: Reducer<VOPSType> = (
  state = initialVopsState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_VOPS_STATUS":
      return { ...state, status: action.payload };

    case "UPDATE_VOPS":
      return { ...state, value: action.payload };

    default:
      return state;
  }
};
