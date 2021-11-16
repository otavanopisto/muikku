import { ActionType } from "~/actions";
import { PurchaseType } from "./profile";


export type CeepostStateStatusType = "LOADING" | "ERROR" | "READY";

export interface CeeposState {
  state: CeepostStateStatusType;
  purchase: PurchaseType;
}

export default function ceepos(
  state: CeeposState = {
    state: "LOADING",
    purchase: null,
  },
  action: ActionType
): CeeposState {
  if (action.type === "UPDATE_CEEPOS_STATE") {
    return Object.assign({}, state, {
      state: <CeepostStateStatusType>action.payload,
    });
  } else if (action.type === "UPDATE_CEEPOS_PURCHASE") {
    return Object.assign({}, state, {
      purchase: action.payload,
    });
  }

  return state;
}
