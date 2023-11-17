import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { UserGuardiansDependant } from "~/generated/client/models";
import { UserStatusType } from "../users";

/**
 * Redux state interface.
 * Object that combines the results of the student and staff search
 */
export interface DependantsState {
  list: UserGuardiansDependant[];
  state: UserStatusType;
}

/**
 * initialUserGroupsState
 */
const initializeDependantState: DependantsState = {
  list: [],
  state: "WAIT",
};
/**
 * Reducer function for users
 *
 * @param state state
 * @param action action
 * @returns State of users
 */
export const dependants: Reducer<DependantsState> = (
  state = initializeDependantState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_DEPENDANTS":
      return {
        ...state,
        list: action.payload,
      };
    case "UPDATE_DEPENDANTS_STATUS":
      return {
        ...state,
        state: action.payload,
      };

    default:
      return state;
  }
};
