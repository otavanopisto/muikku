import { ActionType } from "actions";
import { Reducer } from "redux";
import { HopsEligibility, HopsUppersecondary } from "~/generated/client";

export type HOPSStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";

/**
 * HOPSState
 */
export interface HOPSState {
  hopsPhase?: string;
  eligibility: HopsEligibility;
  status: HOPSStatusType;
  value: HopsUppersecondary;
}

/**
 * initialHopsState
 */
const initialHopsState: HOPSState = {
  status: "WAIT",
  eligibility: null,
  value: null,
};

/**
 * Reducer function for hops
 *
 * @param state state
 * @param action action
 * @returns State of hops
 */
export const hops: Reducer<HOPSState> = (
  state = initialHopsState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_HOPS_STATUS":
      return { ...state, status: action.payload };

    case "SET_HOPS_PHASE":
      return { ...state, hopsPhase: action.payload };

    case "UPDATE_HOPS":
      return { ...state, value: action.payload };

    case "UPDATE_HOPS_ELIGIBILITY":
      return { ...state, eligibility: action.payload };

    default:
      return state;
  }
};
