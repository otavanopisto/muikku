import { Reducer } from "redux";
import { ActionType } from "~/actions";
import { WorkspaceType } from "~/reducers/workspaces";
import { ReducerStateType } from "./journals";

/**
 * ActiveWorkspaceState
 */
export interface ActiveWorkspaceState {
  workspaceData: WorkspaceType | null;
  state: ReducerStateType;
}

const initialActiveWorkspaceState: ActiveWorkspaceState = {
  workspaceData: null,
  state: "LOADING",
};

/**
 * Reducer function for journals
 *
 * @param state state
 * @param action action
 */
export const activeWorkspace: Reducer<ActiveWorkspaceState> = (
  state = initialActiveWorkspaceState,
  action: ActionType
) => {
  switch (action.type) {
    case "ACTIVE_WORKSPACE_SET":
      return { ...state, workspaceData: action.payload };

    case "UPDATE_WORKSPACE": {
      let updatedWorkspaceData = state.workspaceData;
      if (
        updatedWorkspaceData &&
        updatedWorkspaceData.id === action.payload.original.id
      ) {
        updatedWorkspaceData = {
          ...updatedWorkspaceData,
          ...action.payload.update,
        };
      }
      return {
        ...state,
        currentWorkspace: updatedWorkspaceData,
      };
    }

    case "ACTIVE_WORKSPACE_UPDATE_ACTIVITY": {
      return {
        ...state,
        workspaceData: {
          ...state.workspaceData,
          activity: action.payload,
        },
      };
    }

    case "ACTIVE_WORKSPACE_UPDATE_ASESSMENT_REQUESTS": {
      return {
        ...state,
        workspaceData: {
          ...state.workspaceData,
          assessmentRequests: action.payload,
        },
      };
    }

    default:
      return state;
  }
};
