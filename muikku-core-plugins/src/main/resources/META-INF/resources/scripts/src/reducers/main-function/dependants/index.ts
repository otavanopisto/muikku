import { ActionType } from "~/actions";
import { Reducer } from "redux";
import {
  UserGuardiansDependant,
  UserGuardiansDependantWorkspace,
} from "~/generated/client/models";
import { UserStatusType } from "../users";
import { LoadingState } from "~/@types/shared";

/**
 * Dependant interface
 */
export interface Dependant extends UserGuardiansDependant {
  workspaces?: UserGuardiansDependantWorkspace[];
  worspacesStatus: LoadingState;
}

/**
 * Dependant workspace payload type
 */
export interface DependantWokspacePayloadType {
  workspaces: UserGuardiansDependantWorkspace[];
  identifier: string;
}

/**
 * Dependant workspace status payload type
 */
export interface DependantWokspaceStatePayloadType {
  state: LoadingState;
  identifier: string;
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
export const dependants: Reducer<DependantsState, ActionType> = (
  state = initializeDependantState,
  action
) => {
  switch (action.type) {
    case "DEPENDANTS_UPDATE":
      return {
        ...state,
        list: action.payload,
      };
    case "DEPENDANT_WORKSPACES_UPDATE": {
      const updatedDependants = state.list.map((dependant) => {
        if (dependant.identifier === action.payload.identifier) {
          return {
            ...dependant,
            workspaces: action.payload.workspaces,
          };
        }
        return dependant;
      });
      return {
        ...state,
        list: updatedDependants,
      };
    }
    case "DEPENDANTS_STATUS_UPDATE":
      return {
        ...state,
        state: action.payload,
      };
    case "DEPENDANT_WORKSPACES_STATUS_UPDATE": {
      const updatedDependants = state.list.map((dependant) => {
        if (dependant.identifier === action.payload.identifier) {
          return {
            ...dependant,
            worspacesStatus: action.payload.state,
          };
        }
        return dependant;
      });
      return {
        ...state,
        list: updatedDependants,
      };
    }

    default:
      return state;
  }
};
