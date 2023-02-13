import { Reducer } from "redux";
import { ActionType } from "~/actions";

export type ReducerStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";

/**
 * WorkspaceNote
 */
export interface WorkspaceNote {
  id: number;
  /**
   * "id" of the owner
   */
  owner: number;
  /**
   * id of the workspace
   */
  workspaceEntityId: number;
  title: string;
  workspaceNote: string;
  /**
   * Backend uses this to determine the order of the notes
   * This is not used in the frontend
   */
  nextSiblingId?: number | null;
}

/**
 * WorkspaceNoteCreatePayload
 */
export interface WorkspaceNoteCreatePayload {
  title: string;
  workspaceNote: string;
  workspaceEntityId: number;
}

/**
 * WorkspaceJournalsType
 */
export interface NoteBookState {
  notes?: WorkspaceNote[] | null;
  noteEditorOpen: boolean;
  noteEditorCutContent: string;
  noteInTheEditor?: WorkspaceNote | null;
  state: ReducerStateType;
}

const initialJournalsState: NoteBookState = {
  notes: null,
  noteEditorOpen: false,
  noteEditorCutContent: null,
  noteInTheEditor: null,
  state: "READY",
};

/**
 * Reducer function for journals
 *
 * @param state state
 * @param action action
 */
export const notebook: Reducer<NoteBookState> = (
  state = initialJournalsState,
  action: ActionType
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
      };

    case "NOTEBOOK_SET_CUT_CONTENT":
      return {
        ...state,
        noteEditorCutContent: action.payload,
      };

    default:
      return state;
  }
};
