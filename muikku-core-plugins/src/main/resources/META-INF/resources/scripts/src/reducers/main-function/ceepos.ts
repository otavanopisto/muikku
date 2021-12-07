import { ActionType } from "~/actions";
import { PurchaseType } from "./profile";

export type CeeposStateStatusType = "LOADING" | "ERROR" | "READY";
export type CeeposPayStatusCodeType = string;

export interface CeeposState {
  state: CeeposStateStatusType;
  payStatusMessage: CeeposPayStatusCodeType;
  purchase: PurchaseType;
}

export default function ceepos(
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
}
