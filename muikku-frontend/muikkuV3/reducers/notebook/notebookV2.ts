import { Reducer } from "redux";
import { ActionType } from "~/actions";
import { NotebookNote } from "~/generated/client";
import { ReducerStatusType } from "~/reducers/types";
import {
  EMPTY_NOTEBOOK_V2_DRAFTS,
  NotebookV2DraftsState,
  removeDraftByClientId,
} from "~/components/general/notebook/helpers/notebook-drafts";

export type NotebookNoteUiMode =
  | { kind: "editing" }
  | { kind: "upgrading" }
  | { kind: "deleting" };

/** Only store non-idle entries; missing id = idle */
export type NotebookNoteUiById = Record<number, NotebookNoteUiMode>;

/**
 * NoteBookV2State
 */
export interface NoteBookV2State {
  notes: NotebookNote[];
  workspaceNotesOrder: number[];
  state: ReducerStatusType;
  drafts: NotebookV2DraftsState;
  focusDraftClientId: number | null;
  activeItemId: number | null;
  noteUiById: NotebookNoteUiById;
}

const initialState: NoteBookV2State = {
  notes: [],
  workspaceNotesOrder: [],
  state: "IDLE",
  drafts: EMPTY_NOTEBOOK_V2_DRAFTS,
  focusDraftClientId: null,
  activeItemId: null,
  noteUiById: {},
};

/**
 * Reducer function for notebook V2
 * @param state - Current state
 * @param action - Action
 * @returns New state
 */
export const notebookV2: Reducer<NoteBookV2State> = (
  state = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case "NOTEBOOK_V2_UPDATE_STATE":
      return { ...state, state: action.payload };

    case "NOTEBOOK_V2_LOAD_ENTRIES":
      return { ...state, notes: action.payload };

    case "NOTEBOOK_V2_SET_WORKSPACE_NOTES_ORDER":
      return { ...state, workspaceNotesOrder: action.payload };

    case "NOTEBOOK_V2_BEGIN_WORKSPACE_DRAFT":
      return {
        ...state,
        drafts: {
          ...state.drafts,
          workspaceNote: action.payload,
        },
      };

    case "NOTEBOOK_V2_BEGIN_MATERIAL_DRAFT":
      return {
        ...state,
        drafts: {
          ...state.drafts,
          materialNotes: {
            ...state.drafts.materialNotes,
            [action.payload.workspaceMaterialId]: {
              clientId: action.payload.clientId,
              workspaceEntityId: action.payload.workspaceEntityId,
              workspaceMaterialId: action.payload.workspaceMaterialId,
              title: action.payload.title,
              text: action.payload.text,
            },
          },
        },
        focusDraftClientId: action.payload.clientId,
      };

    case "NOTEBOOK_V2_BEGIN_CONTEXT_NOTE_DRAFT":
      return {
        ...state,
        drafts: {
          ...state.drafts,
          contextNotes: [...state.drafts.contextNotes, action.payload.draft],
        },
        focusDraftClientId: action.payload.draft.clientId,
      };

    case "NOTEBOOK_V2_CANCEL_DRAFT":
      return clearNoteUiMode(
        {
          ...state,
          drafts: removeDraftByClientId(state.drafts, action.payload),
          focusDraftClientId:
            state.focusDraftClientId === action.payload
              ? null
              : state.focusDraftClientId,
          activeItemId:
            state.activeItemId === action.payload ? null : state.activeItemId,
        },
        action.payload
      );

    case "NOTEBOOK_V2_DRAFTS_CLEAR_ALL":
      return {
        ...state,
        drafts: EMPTY_NOTEBOOK_V2_DRAFTS,
        focusDraftClientId: null,
        activeItemId: null,
        noteUiById: {},
      };

    case "NOTEBOOK_V2_FOCUS_DRAFT_CLEAR":
      return {
        ...state,
        focusDraftClientId: null,
      };

    case "NOTEBOOK_V2_SET_ACTIVE_ITEM":
      return {
        ...state,
        activeItemId:
          state.activeItemId === action.payload ? null : action.payload,
      };
    case "NOTEBOOK_V2_CLEAR_ACTIVE_ITEM":
      return {
        ...state,
        activeItemId: null,
      };

    case "NOTEBOOK_V2_SET_WORKSPACE_DRAFT_POSITION":
      if (!state.drafts.workspaceNote) {
        return state;
      }
      return {
        ...state,
        drafts: {
          ...state.drafts,
          workspaceNote: {
            ...state.drafts.workspaceNote,
            position: action.payload,
          },
        },
      };

    case "NOTEBOOK_V2_SET_NOTE_UI":
      return setNoteUiMode(state, action.payload.noteId, action.payload.mode);
    case "NOTEBOOK_V2_CLEAR_NOTE_UI":
      return clearNoteUiMode(state, action.payload);
    case "NOTEBOOK_V2_CLEAR_ALL_NOTE_UI":
      return { ...state, noteUiById: {} };

    default:
      return state;
  }
};

/**
 * setNoteUiMode
 * @param state state
 * @param noteId noteId
 * @param mode mode
 * @returns NoteBookV2State
 */
export function setNoteUiMode(
  state: NoteBookV2State,
  noteId: number,
  mode: NotebookNoteUiMode | null
): NoteBookV2State {
  const next = { ...state.noteUiById };
  // global single-interaction: clear all others
  for (const id of Object.keys(next)) {
    delete next[Number(id)];
  }
  if (mode) {
    next[noteId] = mode;
  }
  return { ...state, noteUiById: next };
}

/**
 * clearNoteUiMode
 * @param state state
 * @param noteId noteId
 * @returns NoteBookV2State
 */
export function clearNoteUiMode(
  state: NoteBookV2State,
  noteId: number
): NoteBookV2State {
  if (!state.noteUiById[noteId]) {
    return state;
  }
  const next = { ...state.noteUiById };
  delete next[noteId];
  return { ...state, noteUiById: next };
}

/**
 * getNotebookNoteUiMode
 * @param noteUiById noteUiById
 * @param noteId noteId
 * @returns NotebookNoteUiMode["kind"] | "idle"
 */
export function getNotebookNoteUiMode(
  noteUiById: NotebookNoteUiById,
  noteId: number
): NotebookNoteUiMode["kind"] | "idle" {
  return noteUiById[noteId]?.kind ?? "idle";
}

/**
 * isNotebookNoteEditing
 * @param noteUiById noteUiById
 * @param noteId noteId
 * @param isDraft isDraft
 * @returns boolean
 */
export function isNotebookNoteEditing(
  noteUiById: NotebookNoteUiById,
  noteId: number,
  isDraft: boolean
): boolean {
  return isDraft || noteUiById[noteId]?.kind === "editing";
}

/**
 * isNotebookNoteUpgrading
 * @param noteUiById noteUiById
 * @param noteId noteId
 * @returns boolean
 */
export function isNotebookNoteUpgrading(
  noteUiById: NotebookNoteUiById,
  noteId: number
): boolean {
  return noteUiById[noteId]?.kind === "upgrading";
}

/**
 * isNotebookNoteDeleting
 * @param noteUiById noteUiById
 * @param noteId noteId
 * @returns boolean
 */
export function isNotebookNoteDeleting(
  noteUiById: NotebookNoteUiById,
  noteId: number
): boolean {
  return noteUiById[noteId]?.kind === "deleting";
}
