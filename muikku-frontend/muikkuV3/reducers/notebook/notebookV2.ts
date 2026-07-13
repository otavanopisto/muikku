import { Reducer } from "redux";
import { ActionType } from "~/actions";
import { NotebookNote } from "~/generated/client";
import { ReducerStatusType } from "~/reducers/types";
import {
  EMPTY_NOTEBOOK_V2_DRAFTS,
  NotebookV2DraftsState,
  removeDraftByClientId,
} from "~/components/general/notebook/helpers/notebook-drafts";

/**
 * NoteBookV2State
 */
export interface NoteBookV2State {
  notes: NotebookNote[] | null;
  workspaceNotesOrder: number[];
  state: ReducerStatusType;
  drafts: NotebookV2DraftsState;
  focusDraftClientId: number | null;
  openNotebookTabRequest: boolean;
  activeItemId: number | null;
}

const initialState: NoteBookV2State = {
  notes: null,
  workspaceNotesOrder: [],
  state: "IDLE",
  drafts: EMPTY_NOTEBOOK_V2_DRAFTS,
  focusDraftClientId: null,
  openNotebookTabRequest: false,
  activeItemId: null,
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
            [action.payload.workspaceMaterialId]: action.payload,
          },
        },
      };

    case "NOTEBOOK_V2_BEGIN_CONTEXT_NOTE_DRAFT":
      return {
        ...state,
        drafts: {
          ...state.drafts,
          contextNotes: [...state.drafts.contextNotes, action.payload.draft],
        },
        focusDraftClientId: action.payload.draft.clientId,
        openNotebookTabRequest: action.payload.openNotebookTab ?? false,
      };

    case "NOTEBOOK_V2_CANCEL_DRAFT":
      return {
        ...state,
        drafts: removeDraftByClientId(state.drafts, action.payload),
        focusDraftClientId:
          state.focusDraftClientId === action.payload
            ? null
            : state.focusDraftClientId,
        activeItemId:
          state.activeItemId === action.payload ? null : state.activeItemId,
      };

    case "NOTEBOOK_V2_DRAFTS_CLEAR_ALL":
      return {
        ...state,
        drafts: EMPTY_NOTEBOOK_V2_DRAFTS,
        focusDraftClientId: null,
        openNotebookTabRequest: false,
        activeItemId: null,
      };

    case "NOTEBOOK_V2_FOCUS_DRAFT_CLEAR":
      return {
        ...state,
        focusDraftClientId: null,
      };

    case "NOTEBOOK_V2_UI_CLEAR_NOTEBOOK_TAB_REQUEST":
      return {
        ...state,
        openNotebookTabRequest: false,
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

    default:
      return state;
  }
};
