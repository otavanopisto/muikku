import { ActionType } from "~/actions";
import { Reducer } from "redux";

/**
 * ErrorType
 */
export interface ErrorType {
  title: string;
  description: string;
}

/**
 * initialErrorState
 */
const initialErrorState: ErrorType = {
  title: null,
  description: null,
};

/**
 * Reducer function for error
 *
 * @param state state
 * @param action action
 * @returns State of error
 */
export const error: Reducer<ErrorType> = (
  state = initialErrorState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_ERROR":
      return action.payload;

    default:
      return state;
  }
};

/**
 * error
 * @param state state
 * @param action action
 */
/* export default function error(
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
 */
