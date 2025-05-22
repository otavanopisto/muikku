import { Reducer } from "redux";
import { ActionType } from "~/actions";
import { WorkspaceNote } from "~/generated/client";

export type ReducerStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";

export type NoteDefaultLocation = "TOP" | "BOTTOM";

/**
 * NoteBookState
 */
export interface NoteBookState {
  notes?: WorkspaceNote[] | null;
  noteEditorOpen: boolean;
  noteEditorCutContent: string;
  noteEditedPosition?: number;
  noteInTheEditor?: WorkspaceNote | null;
  noteDefaultLocation: NoteDefaultLocation;
  state: ReducerStateType;
}

const initialJournalsState: NoteBookState = {
  notes: null,
  noteEditorOpen: false,
  noteEditorCutContent: null,
  noteInTheEditor: null,
  noteEditedPosition: null,
  noteDefaultLocation: null,
  state: "READY",
};

/**
 * Reducer function for journals
 *
 * @param state state
 * @param action action
 */
export const notebook: Reducer<NoteBookState, ActionType> = (
  state = initialJournalsState,
  action
) => {
  switch (action.type) {
    case "NOTEBOOK_UPDATE_STATE":
      return {
        ...state,
        state: action.payload,
      };

    case "NOTEBOOK_LOAD_ENTRIES":
      return {
        ...state,
        notes: action.payload,
      };

    case "NOTEBOOK_UPDATE_ENTRIES":
      return {
        ...state,
        notes: action.payload,
      };

    case "NOTEBOOK_CREATE_ENTRY":
      return {
        ...state,
        notes: action.payload,
      };

    case "NOTEBOOK_EDIT_ENTRY":
      return {
        ...state,
        notes: action.payload,
      };

    case "NOTEBOOK_DELETE_ENTRY":
      return {
        ...state,
        notes: action.payload,
      };

    case "NOTEBOOK_TOGGLE_EDITOR":
      return {
        ...state,
        noteEditorOpen: action.payload.open,
        noteInTheEditor: action.payload.note,
        noteEditorCutContent: action.payload.cutContent,
        noteEditedPosition: action.payload.notePosition,
        noteEditorSelectPosition: action.payload.noteEditorSelectPosition,
      };

    case "NOTEBOOK_SET_CUT_CONTENT":
      return {
        ...state,
        noteEditorCutContent: action.payload,
      };

    case "NOTEBOOK_LOAD_DEFAULT_POSITION":
      return {
        ...state,
        noteDefaultLocation: action.payload ? action.payload : "BOTTOM",
      };

    case "NOTEBOOK_UPDATE_DEFAULT_POSITION":
      return {
        ...state,
        noteDefaultLocation: action.payload ? action.payload : "BOTTOM",
      };

    case "NOTEBOOK_UPDATE_SELECTED_POSITION":
      return {
        ...state,
        noteEditedPosition:
          action.payload === state.noteEditedPosition ? null : action.payload,
      };

    default:
      return state;
  }
};
