import { ActionType } from "~/actions";
import { WorkspacesState } from "./index";
import { Reducer } from "redux";

/**
 * initialOrganizationWorkspacesState
 */
const initialOrganizationWorkspacesState: WorkspacesState = {
  availableWorkspaces: [],
  templateWorkspaces: [],
  currentWorkspace: null,
  settings: null,
  availableFilters: {
    educationTypes: [],
    curriculums: [],
    stateFilters: [],
  },
  state: "LOADING",
  activeFilters: {
    educationFilters: [],
    curriculumFilters: [],
    stateFilters: [],
    query: "",
  },
  hasMore: false,
  toolbarLock: false,
  types: null,
};

/**
 * Reducer function for organizationWorkspaces
 *
 * @param state state
 * @param action action
 * @returns State of organizationWorkspaces
 */
export const organizationWorkspaces: Reducer<WorkspacesState> = (
  state = initialOrganizationWorkspacesState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES":
      return {
        ...state,
        availableFilters: Object.assign({}, state.availableFilters, {
          educationTypes: action.payload,
        }),
      };

    case "UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_STATE_TYPES":
      return {
        ...state,
        availableFilters: Object.assign({}, state.availableFilters, {
          stateFilters: action.payload,
        }),
      };

    case "UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS":
      return {
        ...state,
        availableFilters: Object.assign({}, state.availableFilters, {
          curriculums: action.payload,
        }),
      };

    case "UPDATE_ORGANIZATION_WORKSPACES_ALL_PROPS":
      return Object.assign({}, state, action.payload);

    case "UPDATE_ORGANIZATION_WORKSPACES_ACTIVE_FILTERS":
      return { ...state, activeFilters: action.payload };

    case "UPDATE_ORGANIZATION_WORKSPACES_STATE":
      return { ...state, state: action.payload };

    case "UPDATE_ORGANIZATION_TEMPLATES":
      return { ...state, templateWorkspaces: action.payload };

    case "UPDATE_ORGANIZATION_SELECTED_WORKSPACE": {
      if (
        state.currentWorkspace &&
        state.currentWorkspace.id === action.payload.id
      ) {
        return {
          ...state,
          currentWorkspace: { ...state.currentWorkspace, ...action.payload },
        };
      } else {
        return {
          ...state,
          currentWorkspace: { ...state.currentWorkspace, ...action.payload },
        };
      }
    }

    default:
      return state;
  }
};
