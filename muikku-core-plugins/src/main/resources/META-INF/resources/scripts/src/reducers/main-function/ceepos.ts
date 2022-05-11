import { ActionType } from "~/actions";
import { PurchaseType } from "./profile";
import { Reducer } from "redux";

export type CeeposStateStatusType = "LOADING" | "ERROR" | "READY";
export type CeeposPayStatusCodeType = string;

/**
 * CeeposState
 */
export interface CeeposState {
  state: CeeposStateStatusType;
  payStatusMessage: CeeposPayStatusCodeType;
  purchase: PurchaseType;
}

/**
 * initialCeeposState
 */
const initialCeeposState: CeeposState = {
  state: "LOADING",
  payStatusMessage: null,
  purchase: null,
};

/**
 * Reducer function for ceepos
 *
 * @param state state
 * @param action action
 * @returns State of ceepos
 */
export const ceepos: Reducer<CeeposState> = (
  state = initialCeeposState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_CEEPOS_STATE":
      return {
        ...state,
        state: action.payload,
      };

    case "UPDATE_CEEPOS_PURCHASE":
      return {
        ...state,
        purchase: action.payload,
      };

    case "UPDATE_CEEPOS_PAY_STATUS":
      return {
        ...state,
        payStatusMessage: action.payload,
      };

    default:
      return state;
  }
};

/* export default function ceepos(
  state: CeeposState = {
    state: "LOADING",
    payStatusMessage: null,
    purchase: null,
  },
  action: ActionType
): CeeposState {
  if (action.type === "UPDATE_CEEPOS_STATE") {
    return Object.assign({}, state, {
      state: <CeeposStateStatusType>action.payload,
    });
  } else if (action.type === "UPDATE_CEEPOS_PURCHASE") {
    return Object.assign({}, state, {
      purchase: action.payload,
    });
  } else if (action.type === "UPDATE_CEEPOS_PAY_STATUS") {
    return Object.assign({}, state, {
      payStatusMessage: action.payload,
    });
  }

  return state;
} */
