import { ActionType } from "~/actions";

export interface CredentialsType {
  secret: string;
  username: string;
  state?: CredentialsStateType;
}

export type CredentialsStateType = "LOADING" | "READY" | "CHANGED";

export default function credentials(
  state: CredentialsType = {
    secret: "",
    username: "",
    state: "LOADING"
  },
  action: ActionType
): CredentialsType {
  if (action.type === "LOAD_CREDENTIALS") {
    return Object.assign({}, state, action.payload);
  } else if (action.type === "CREDENTIALS_STATE") {
    let newState: CredentialsStateType = action.payload;
    return Object.assign({}, state, { state: newState });
  }

  return state;
}
