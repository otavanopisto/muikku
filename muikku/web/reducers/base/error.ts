import { ActionType } from "~/actions";

/**
 * ErrorType
 */
export interface ErrorType {
  title: string;
  description: string;
}

/**
 * error
 * @param state state
 * @param action action
 */
export default function error(
  state: ErrorType = {
    title: null,
    description: null,
  },
  action: ActionType
): ErrorType {
  if (action.type === "UPDATE_ERROR") {
    return action.payload;
  }
  return state;
}
