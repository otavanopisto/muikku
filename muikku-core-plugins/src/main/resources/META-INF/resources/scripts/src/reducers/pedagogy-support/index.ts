import { Reducer } from "redux";
import {
  PedagogyFormData,
  PedagogySupportActionImplemented,
} from "~/@types/pedagogy-form";
import { ActionType } from "~/actions";
import {
  PedagogyForm,
  PedagogyFormAccess,
  PedagogyFormImplementedActions,
  PedagogyFormLocked,
} from "~/generated/client";

export type PedagogyMode = "READ" | "EDIT";

export type ReducerStateType = "LOADING" | "ERROR" | "READY" | "IDLE";

export type ReducerInitializeStatusType =
  | "INITIALIZING"
  | "INITIALIZED"
  | "INITIALIZATION_FAILED"
  | "IDLE";

/**
 * PedagogyEditingState
 */
export interface PedagogyEditingState {
  pedagogyFormData: PedagogyFormData | null;
  changedFields: string[];
  pedagogyFormExtraDetails: string;
  implementedActions: PedagogySupportActionImplemented[];
}

/**
 * PedagogySupportState
 */
export interface PedagogySupportState {
  // Initialization
  initialized: ReducerInitializeStatusType;
  pedagogyLockedStatus: ReducerStateType;
  pedagogyLocked: PedagogyFormLocked | null;

  // Current student context
  currentStudentIdentifier?: string;
  pedagogyStudentType: "COMPULSORY" | "UPPERSECONDARY" | null;

  // Pedagogy Form State
  pedagogyFormStatus: ReducerStateType;
  pedagogyForm: PedagogyForm | null;
  pedagogyFormData: PedagogyFormData | null;
  pedagogyFormExtraDetails: string;

  // Pedagogy Form Access State
  pedagogyFormAccess: Partial<PedagogyFormAccess> | null;

  // Implemented Actions State
  implementedActionsStatus: ReducerStateType;
  implementedActions: PedagogyFormImplementedActions | null;
  implementedActionsFormData: PedagogySupportActionImplemented[];

  // Editing State
  pedagogyMode: PedagogyMode;
  pedagogyEditing: PedagogyEditingState;
}

const initialPedagogySupportState: PedagogySupportState = {
  initialized: "IDLE",
  pedagogyLockedStatus: "IDLE",
  pedagogyLocked: null,
  currentStudentIdentifier: undefined,
  pedagogyStudentType: null,
  pedagogyFormStatus: "IDLE",
  pedagogyForm: null,
  pedagogyFormData: null,
  pedagogyFormExtraDetails: "",
  pedagogyFormAccess: null,
  implementedActionsStatus: "IDLE",
  implementedActions: null,
  implementedActionsFormData: [],
  pedagogyMode: "READ",
  pedagogyEditing: {
    pedagogyFormData: null,
    changedFields: [],
    pedagogyFormExtraDetails: "",
    implementedActions: [],
  },
};

/**
 * Reducer function for hopsNew
 *
 * @param state state
 * @param action action
 */
export const pedagogySupport: Reducer<PedagogySupportState> = (
  state = initialPedagogySupportState,
  action: ActionType
) => {
  switch (action.type) {
    // INITIALIZATION RELATED ACTIONS
    case "PEDAGOGY_SUPPORT_RESET_DATA":
      return {
        ...initialPedagogySupportState,
      };

    case "PEDAGOGY_SUPPORT_UPDATE_INITIALIZE_STATUS":
      return {
        ...state,
        initialized: action.payload,
      };

    case "PEDAGOGY_SUPPORT_UPDATE_STUDENT_TYPE":
      return {
        ...state,
        pedagogyStudentType: action.payload,
      };

    case "PEDAGOGY_SUPPORT_CHANGE_MODE":
      return {
        ...state,
        pedagogyMode: action.payload,
      };

    // EDITING RELATED ACTIONS
    case "PEDAGOGY_SUPPORT_UPDATE_EDITING":
      return {
        ...state,
        pedagogyEditing: {
          ...state.pedagogyEditing,
          ...action.payload,
        },
      };

    case "PEDAGOGY_SUPPORT_SAVE_EDITING":
      return {
        ...state,
        pedagogyEditing: {
          ...state.pedagogyEditing,
          changedFields: [],
        },
      };

    case "PEDAGOGY_SUPPORT_CANCEL_EDITING":
      return {
        ...state,
        pedagogyMode: "READ",
        pedagogyEditing: {
          ...state.pedagogyEditing,
          pedagogyFormData: state.pedagogyFormData,
          changedFields: [],
          pedagogyFormExtraDetails: state.pedagogyFormExtraDetails,
          implementedActions: state.implementedActionsFormData,
        },
      };

    // LOCKED RELATED ACTIONS
    case "PEDAGOGY_SUPPORT_UPDATE_LOCKED_STATUS":
      return {
        ...state,
        pedagogyLockedStatus: action.payload,
      };

    case "PEDAGOGY_SUPPORT_UPDATE_LOCKED":
      return {
        ...state,
        pedagogyLocked: action.payload,
      };

    // CURRENT STUDENT RELATED ACTIONS
    case "PEDAGOGY_SUPPORT_UPDATE_CURRENTSTUDENTIDENTIFIER":
      return {
        ...state,
        currentStudentIdentifier: action.payload,
      };

    // FORM RELATED ACTIONS
    case "PEDAGOGY_SUPPORT_FORM_UPDATE_STATUS":
      return {
        ...state,
        pedagogyFormStatus: action.payload,
      };

    case "PEDAGOGY_SUPPORT_FORM_UPDATE_DATA":
      return {
        ...state,
        pedagogyForm: action.payload,
      };

    case "PEDAGOGY_SUPPORT_FORM_UPDATE_FORM_DATA":
      return {
        ...state,
        pedagogyFormData: action.payload,
        pedagogyEditing: {
          ...state.pedagogyEditing,
          pedagogyFormData: action.payload,
        },
      };

    case "PEDAGOGY_SUPPORT_FORM_UPDATE_ACCESS":
      return {
        ...state,
        pedagogyFormAccess: action.payload,
      };

    // IMPLEMENTED ACTIONS RELATED ACTIONS
    case "PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_STATUS":
      return {
        ...state,
        implementedActionsStatus: action.payload,
      };

    case "PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_DATA":
      return {
        ...state,
        implementedActions: action.payload,
      };

    case "PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_FORM_DATA":
      return {
        ...state,
        implementedActionsFormData: action.payload,
        pedagogyEditing: {
          ...state.pedagogyEditing,
          implementedActions: action.payload,
        },
      };

    default:
      return state;
  }
};
