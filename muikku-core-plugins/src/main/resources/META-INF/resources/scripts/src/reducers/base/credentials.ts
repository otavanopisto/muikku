import { ActionType } from "~/actions";

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
 * credentials
 * @param state state
 * @param action action
 */
export default function credentials(
  state: CredentialsType = {
    secret: "",
    username: "",
    state: "LOADING",
  },
  action: ActionType
): CredentialsType {
  if (action.type === "LOAD_CREDENTIALS") {
    return Object.assign({}, state, action.payload);
  } else if (action.type === "CREDENTIALS_STATE") {
    const newState: CredentialsStateType = action.payload;
    return Object.assign({}, state, { state: newState });
  }

  return state;
}
