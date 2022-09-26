import { ActionType } from "~/actions";
import { Reducer } from "redux";

/**
 * Reducer function for reducer
 *
 * @param state state
 * @param action action
 * @returns State of reducer
 */
export const title: Reducer<string> = (state = "", action: ActionType) => {
  switch (action.type) {
    case "UPDATE_TITLE": {
      const newValue: string = action.payload;
      document.title = "Muikku - " + newValue;

      return newValue;
    }

    default:
      return state;
  }
};
