import { ActionType } from "~/actions";
import { Reducer } from "redux";
import {
  UserGuardiansDependant,
  UserGuardiansDependantWorkspace,
} from "~/generated/client/models";
import { LoadingState } from "~/@types/shared";

export type ReducerStateType = "LOADING" | "ERROR" | "READY" | "IDLE";

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
 * Current dependant interface
 */
export interface CurrentDependant {
  dependant: UserGuardiansDependant;
}

/**
 * Key value pair of dependant identifier and its workspaces and status
 */
export type WorkspacesByDependantIdentifier = Record<
  string,
  {
    workspaces: UserGuardiansDependantWorkspace[];
    status: ReducerStateType;
  }
>;

/**
 * Redux state interface.
 * Object that combines the results of the student and staff search
 */
export interface GuardianState {
  dependantsStatus: ReducerStateType;
  dependants: UserGuardiansDependant[];
  currentDependantIdentifier: string | null;
  currentDependantStatus: ReducerStateType;
  currentDependant: CurrentDependant | null;
  workspacesByDependantIdentifier: WorkspacesByDependantIdentifier;
}

/**
 * initialUserGroupsState
 */
const initializeGuardianState: GuardianState = {
  dependantsStatus: "IDLE",
  dependants: [],
  currentDependantIdentifier: null,
  currentDependantStatus: "IDLE",
  currentDependant: null,
  workspacesByDependantIdentifier: {},
};

/**
 * Reducer function for users
 *
 * @param state state
 * @param action action
 * @returns State of users
 */
export const guardian: Reducer<GuardianState> = (
  state = initializeGuardianState,
  action: ActionType
) => {
  switch (action.type) {
    case "GUARDIAN_UPDATE_DEPENDANTS_STATUS":
      return {
        ...state,
        dependantsStatus: action.payload,
      };
    case "GUARDIAN_UPDATE_DEPENDANTS":
      return {
        ...state,
        dependants: action.payload,
      };

    case "GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_STATUS":
      return {
        ...state,
        workspacesByDependantIdentifier: {
          ...state.workspacesByDependantIdentifier,
          [action.payload.identifier]: {
            workspaces:
              state.workspacesByDependantIdentifier[action.payload.identifier]
                ?.workspaces || [],
            status: action.payload.status,
          },
        },
      };
    case "GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_WORKSPACES":
      return {
        ...state,
        workspacesByDependantIdentifier: {
          ...state.workspacesByDependantIdentifier,
          [action.payload.identifier]: {
            ...state.workspacesByDependantIdentifier[action.payload.identifier],
            workspaces: action.payload.workspaces,
          },
        },
      };

    default:
      return state;
  }
};
