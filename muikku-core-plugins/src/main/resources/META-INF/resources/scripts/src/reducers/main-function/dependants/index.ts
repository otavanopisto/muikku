import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { UserGuardiansDependant, UserGuardiansDependantWorkspace } from "~/generated/client/models";
import { UserStatusType } from "../users";


export interface Dependant extends UserGuardiansDependant { 
  workspaces?: UserGuardiansDependantWorkspace[];
}

export interface DependantWokspacePayloadType {
  workspaces: UserGuardiansDependantWorkspace[];
  id: string;
}

/**
 * Redux state interface.
 * Object that combines the results of the student and staff search
 */
export interface DependantsState {
  list: Dependant[];
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
      case "UPDATE_DEPENDANT_WORKSPACES":
      const updatedDependants = state.list.map(dependant => {
        if (dependant.identifier === action.payload.id) {
          return {
            ...dependant,
            workspaces: action.payload.workspaces
          };
        }
        return dependant;
      });
    
      return {
        ...state,
        list: updatedDependants
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
