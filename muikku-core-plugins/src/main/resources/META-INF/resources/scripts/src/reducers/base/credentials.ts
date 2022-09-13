import { ActionType } from "~/actions";
import { Reducer } from "redux";

/**
 * CredentialsType
 */
export interface CredentialsType {
  secret: string;
  username: string;
  state?: CredentialsStateType;
}

export type CredentialsStateType = "LOADING" | "READY" | "CHANGED";

/**
 * initialCredentialsState
 */
const initialCredentialsState: CredentialsType = {
  secret: "",
  username: "",
  state: "LOADING",
};

/**
 * Reducer function for credentials
 *
 * @param state state
 * @param action action
 * @returns State of credentials
 */
export const credentials: Reducer<CredentialsType> = (
  state = initialCredentialsState,
  action: ActionType
) => {
  switch (action.type) {
    case "LOAD_CREDENTIALS":
      return { ...state, ...action.payload };

    case "CREDENTIALS_STATE":
      return { ...state, state: action.payload };

    default:
      return state;
  }
};
