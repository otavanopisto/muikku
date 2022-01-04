import { ActionType } from "~/actions";

export interface ErrorType {
  title: string;
  description: string;
}

export default function error(
  state: ErrorType = {
    title: null,
    description: null
  },
  action: ActionType
): ErrorType {
  if (action.type === "UPDATE_ERROR") {
    return action.payload;
  }
  return state;
}
