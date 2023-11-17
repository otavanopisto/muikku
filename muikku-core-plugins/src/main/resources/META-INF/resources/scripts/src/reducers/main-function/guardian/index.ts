import { ActionType } from "~/actions";
import { Reducer } from "redux";
import {
  UserSearchResult,
  User,
  UserGroup,
  StudyProgramme,
} from "~/generated/client/models";

export type UserStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";

/**
 * Redux state interface.
 * Object that combines the results of the student and staff search
 */
export interface UsersState {
  students?: UserSearchResultWithExtraProperties;
  staff?: UserSearchResultWithExtraProperties;
}
/**
 * Reducer function for users
 *
 * @param state state
 * @param action action
 * @returns State of users
 */
export const organizationUsers: Reducer<UsersState> = (
  state = initializeUsersState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_STUDENT_USERS":
      return {
        ...state,
        students: action.payload,
      };

    default:
      return state;
  }
};
