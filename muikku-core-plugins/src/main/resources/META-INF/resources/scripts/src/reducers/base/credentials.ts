import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { Credentials } from "~/generated/client";

/**
 * CredentialsState
 */
export interface CredentialsState {
  state?: CredentialsStateType;
  credentials: Credentials;
}

export type CredentialsStateType = "LOADING" | "READY" | "CHANGED";

/**
 * initialCredentialsState
 */
const initialCredentialsState: CredentialsState = {
  credentials: {
    username: "",
    password: "",
    secret: "",
  },
  state: "LOADING",
};

/**
 * Reducer function for credentials
 *
 * @param state state
 * @param action action
 * @returns State of credentials
 */
export const credentials: Reducer<CredentialsState> = (
  state = initialCredentialsState,
  action: ActionType
) => {
  switch (action.type) {
    case "LOAD_CREDENTIALS":
      return { ...state, credentials: action.payload };

    case "CREDENTIALS_STATE":
      return { ...state, state: action.payload };

    default:
      return state;
  }
};
