import { Action, Dispatch } from "redux";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { NotebookNote, NotebookNoteType } from "~/generated/client";
import { ReducerStatusType } from "~/reducers/types";
import {
  isNotebookNoteEditable,
  isNotebookNoteDeletable,
} from "~/components/general/notebook/helpers/notebook-display";
import { displayNotification } from "../base/notifications";
import i18n from "~/locales/i18n";
import {
  nextNotebookDraftClientId,
  NotebookContextNoteDraft,
  NotebookMaterialNoteDraft,
  NotebookWorkspaceNoteDraft,
} from "~/components/general/notebook/helpers/notebook-drafts";
import {
  areWorkspaceNotesOrdersEqual,
  getWorkspaceNotesFromNotes,
  insertWorkspaceNoteIdAtPosition,
  loadWorkspaceNotesOrderProperty,
  reconcileWorkspaceNotesOrder,
  removeWorkspaceNoteFromOrder,
  reorderWorkspaceNotesOrderIds,
  saveWorkspaceNotesOrderProperty,
} from "~/components/general/notebook/helpers/notebook-workspace-order";
import MApi, { isMApiError } from "~/api/api";
import { isNotebookWorkspaceNote } from "~/helper-functions/notebook";
import {
  buildUpgradedContextNote,
  isContextHighlightNote,
} from "~/components/general/notebook/helpers/notebook-context-upgrade";
import { NotebookNoteUiMode } from "~/reducers/notebook/notebookV2";

const workspaceNotesApi = MApi.getWorkspaceNotesApi();
const userApi = MApi.getUserApi();

// ACTION TYPES

export type NOTEBOOK_V2_UPDATE_STATE = SpecificActionType<
  "NOTEBOOK_V2_UPDATE_STATE",
  ReducerStatusType
>;

export type NOTEBOOK_V2_LOAD_ENTRIES = SpecificActionType<
  "NOTEBOOK_V2_LOAD_ENTRIES",
  NotebookNote[]
>;

export type NOTEBOOK_V2_SET_WORKSPACE_NOTES_ORDER = SpecificActionType<
  "NOTEBOOK_V2_SET_WORKSPACE_NOTES_ORDER",
  number[]
>;

export type NOTEBOOK_V2_BEGIN_WORKSPACE_DRAFT = SpecificActionType<
  "NOTEBOOK_V2_BEGIN_WORKSPACE_DRAFT",
  NotebookWorkspaceNoteDraft
>;
export type NOTEBOOK_V2_BEGIN_MATERIAL_DRAFT = SpecificActionType<
  "NOTEBOOK_V2_BEGIN_MATERIAL_DRAFT",
  NotebookMaterialNoteDraft
>;
export type NOTEBOOK_V2_BEGIN_CONTEXT_NOTE_DRAFT = SpecificActionType<
  "NOTEBOOK_V2_BEGIN_CONTEXT_NOTE_DRAFT",
  { draft: NotebookContextNoteDraft; openNotebookTab?: boolean }
>;
export type NOTEBOOK_V2_CANCEL_DRAFT = SpecificActionType<
  "NOTEBOOK_V2_CANCEL_DRAFT",
  number
>;
export type NOTEBOOK_V2_SET_WORKSPACE_DRAFT_POSITION = SpecificActionType<
  "NOTEBOOK_V2_SET_WORKSPACE_DRAFT_POSITION",
  number | null
>;
export type NOTEBOOK_V2_DRAFTS_CLEAR_ALL = SpecificActionType<
  "NOTEBOOK_V2_DRAFTS_CLEAR_ALL",
  void
>;
export type NOTEBOOK_V2_FOCUS_DRAFT_CLEAR = SpecificActionType<
  "NOTEBOOK_V2_FOCUS_DRAFT_CLEAR",
  void
>;
export type NOTEBOOK_V2_UI_CLEAR_NOTEBOOK_TAB_REQUEST = SpecificActionType<
  "NOTEBOOK_V2_UI_CLEAR_NOTEBOOK_TAB_REQUEST",
  void
>;
export type NOTEBOOK_V2_SET_ACTIVE_ITEM = SpecificActionType<
  "NOTEBOOK_V2_SET_ACTIVE_ITEM",
  number
>;
export type NOTEBOOK_V2_CLEAR_ACTIVE_ITEM = SpecificActionType<
  "NOTEBOOK_V2_CLEAR_ACTIVE_ITEM",
  void
>;
export type NOTEBOOK_V2_SET_NOTE_UI = SpecificActionType<
  "NOTEBOOK_V2_SET_NOTE_UI",
  { noteId: number; mode: NotebookNoteUiMode }
>;
export type NOTEBOOK_V2_CLEAR_NOTE_UI = SpecificActionType<
  "NOTEBOOK_V2_CLEAR_NOTE_UI",
  number
>;
export type NOTEBOOK_V2_CLEAR_ALL_NOTE_UI = SpecificActionType<
  "NOTEBOOK_V2_CLEAR_ALL_NOTE_UI",
  void
>;
export type NOTEBOOK_V2_FOCUS_NOTE = SpecificActionType<
  "NOTEBOOK_V2_FOCUS_NOTE",
  number
>;
export type NOTEBOOK_V2_FOCUS_NOTE_CLEAR = SpecificActionType<
  "NOTEBOOK_V2_FOCUS_NOTE_CLEAR",
  void
>;
export type NOTEBOOK_V2_OPEN_NOTEBOOK_TAB_REQUEST = SpecificActionType<
  "NOTEBOOK_V2_OPEN_NOTEBOOK_TAB_REQUEST",
  void
>;

// ACTION CREATOR INTERFACES

/**
 * LoadNotebookV2Entries
 */
export interface LoadNotebookV2Entries {
  (): AnyActionType;
}

/**
 * SaveNewNotebookV2Entry
 */
export interface SaveNewNotebookV2Entry {
  (data: {
    title: string;
    text: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateEditedNotebookV2Entry
 */
export interface UpdateEditedNotebookV2Entry {
  (data: {
    editedEntry: NotebookNote;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * DeleteNotebookV2Entry
 */
export interface DeleteNotebookV2Entry {
  (data: {
    noteId: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateNotebookV2WorkspaceNotesOrder
 */
export interface UpdateNotebookV2WorkspaceNotesOrder {
  (dragIndex: number, hoverIndex: number, persist?: boolean): AnyActionType;
}

/**
 * SaveNewNotebookV2ContextHighlight
 */
export interface SaveNewNotebookV2ContextHighlight {
  (data: {
    workspaceMaterialId: number;
    text: string;
    start: string;
    end: string;
    index: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * SaveNewNotebookV2ContextNote
 */
export interface SaveNewNotebookV2ContextNote {
  (data: {
    workspaceMaterialId: number;
    selectedText: string;
    start: string;
    end: string;
    index: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * BeginNotebookV2WorkspaceDraft
 */
export interface BeginNotebookV2WorkspaceDraft {
  (): AnyActionType;
}

/**
 * BeginNotebookV2MaterialNoteDraft
 */
export interface BeginNotebookV2MaterialNoteDraft {
  (workspaceMaterialId: number): AnyActionType;
}

/**
 * BeginNotebookV2ContextNoteDraft
 */
export interface BeginNotebookV2ContextNoteDraft {
  (data: {
    workspaceMaterialId: number;
    selectedText: string;
    start: string;
    end: string;
    index: number;
    openNotebookTab?: boolean;
  }): AnyActionType;
}

/**
 * CancelNotebookV2Draft
 */
export interface CancelNotebookV2Draft {
  (clientId: number): AnyActionType;
}

/**
 * SaveNotebookV2WorkspaceDraft
 */
export interface SaveNotebookV2WorkspaceDraft {
  (data: {
    clientId: number;
    title: string;
    text: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * SaveNotebookV2MaterialDraft
 */
export interface SaveNotebookV2MaterialDraft {
  (data: {
    clientId: number;
    title: string;
    text: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * SaveNotebookV2ContextNoteDraft
 */
export interface SaveNotebookV2ContextNoteDraft {
  (data: {
    clientId: number;
    title: string;
    text: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * ClearNotebookV2DraftsAll
 */
export interface ClearNotebookV2DraftsAll {
  (): AnyActionType;
}

/**
 * ClearNotebookV2FocusDraft
 */
export interface ClearNotebookV2FocusDraft {
  (): AnyActionType;
}

/**
 * ClearNotebookV2NotebookTabRequest
 */
export interface ClearNotebookV2NotebookTabRequest {
  (): AnyActionType;
}

/**
 * SetNotebookV2ActiveItem
 */
export interface SetNotebookV2ActiveItem {
  (noteId: number): AnyActionType;
}

/**
 * ClearNotebookV2ActiveItem
 */
export interface ClearNotebookV2ActiveItem {
  (): AnyActionType;
}

/**
 * SetNotebookV2WorkspaceDraftPosition
 */
export interface SetNotebookV2WorkspaceDraftPosition {
  (position: number | null): AnyActionType;
}

/**
 * UpgradeNotebookV2ContextHighlight
 */
export interface UpgradeNotebookV2ContextHighlight {
  (data: {
    highlightId: number;
    title: string;
    text: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * BeginNotebookV2ContextHighlightUpgrade
 */
export interface BeginNotebookV2ContextHighlightUpgrade {
  (highlightId: number): AnyActionType;
}

/**
 * CancelNotebookV2ContextHighlightUpgrade
 */
export interface CancelNotebookV2ContextHighlightUpgrade {
  (highlightId: number): AnyActionType;
}

/**
 * BeginNotebookV2NoteDelete
 */
export interface BeginNotebookV2NoteDelete {
  (noteId: number): AnyActionType;
}

/**
 * CancelNotebookV2NoteDelete
 */
export interface CancelNotebookV2NoteDelete {
  (noteId: number): AnyActionType;
}

/**
 * ClearNotebookV2FocusNote
 */
export interface ClearNotebookV2FocusNote {
  (): AnyActionType;
}

/**
 * BeginNotebookV2NoteDeleteFromMaterial
 */
export interface BeginNotebookV2NoteDeleteFromMaterial {
  (noteId: number): AnyActionType;
}

// SMALL Helper functions

type NotebookV2Dispatch = (
  arg: AnyActionType
) => Dispatch<Action<AnyActionType>>;

/**
 * Shows a notebook V2 error notification and sets reducer state to ERROR.
 * @param dispatch dispatch
 * @param messageKey messageKey
 * @param context context
 */
function notifyNotebookV2Error(
  dispatch: NotebookV2Dispatch,
  messageKey:
    | "notifications.loadError"
    | "notifications.saveError"
    | "notifications.updateError"
    | "notifications.removeError",
  context?: string
) {
  dispatch({ type: "NOTEBOOK_V2_UPDATE_STATE", payload: "ERROR" });
  dispatch(
    displayNotification(
      i18n.t(messageKey, { ns: "notebook", context }),
      "error"
    )
  );
}

/**
 * Replaces the notebook V2 notes array in the store.
 * @param dispatch dispatch
 * @param notes notes
 */
function setNotebookV2Notes(
  dispatch: NotebookV2Dispatch,
  notes: NotebookNote[]
) {
  dispatch({ type: "NOTEBOOK_V2_LOAD_ENTRIES", payload: notes });
}

/**
 * Appends a newly created note to the store.
 * @param dispatch dispatch
 * @param getState getState
 * @param note note
 */
function appendNotebookV2Note(
  dispatch: NotebookV2Dispatch,
  getState: () => StateType,
  note: NotebookNote
) {
  const currentNotes = getState().notebookV2.notes ?? [];
  setNotebookV2Notes(dispatch, [...currentNotes, note]);
}

/**
 * Replaces an existing note in the store (by id).
 * @param dispatch dispatch
 * @param getState getState
 * @param note note
 */
function replaceNotebookV2Note(
  dispatch: NotebookV2Dispatch,
  getState: () => StateType,
  note: NotebookNote
) {
  // Get the current notes
  const currentNotes = getState().notebookV2.notes ?? [];
  // Find the index of the note in the current notes
  const index = currentNotes.findIndex((entry) => entry.id === note.id);
  if (index < 0) {
    setNotebookV2Notes(dispatch, [...currentNotes, note]);
    return;
  }
  // Create a new array with the updated note
  const updatedNotes = [...currentNotes];
  updatedNotes[index] = note;
  setNotebookV2Notes(dispatch, updatedNotes);
}

/**
 * Removes a note from the store by id.
 * @param dispatch dispatch
 * @param getState getState
 * @param noteId noteId
 */
function removeNotebookV2Note(
  dispatch: NotebookV2Dispatch,
  getState: () => StateType,
  noteId: number
) {
  const currentNotes = getState().notebookV2.notes ?? [];
  setNotebookV2Notes(
    dispatch,
    currentNotes.filter((note) => note.id !== noteId)
  );
}

/**
 * Sets the workspace notes order.
 * @param dispatch dispatch
 * @param orderIds orderIds
 */
function setNotebookV2WorkspaceNotesOrder(
  dispatch: NotebookV2Dispatch,
  orderIds: number[]
) {
  dispatch({
    type: "NOTEBOOK_V2_SET_WORKSPACE_NOTES_ORDER",
    payload: orderIds,
  });
}

/**
 * Persists the workspace notes order.
 * @param workspaceEntityId workspaceEntityId
 * @param orderIds orderIds
 * @returns Promise<void>
 */
async function persistWorkspaceNotesOrder(
  workspaceEntityId: number,
  orderIds: number[]
) {
  await saveWorkspaceNotesOrderProperty(userApi, workspaceEntityId, orderIds);
}

// ACTION CREATORS

/**
 * Removes a workspace note from the order and persists the new order.
 * @param dispatch dispatch
 * @param getState getState
 * @param noteId noteId
 */
async function removeWorkspaceNoteOrderAndPersist(
  dispatch: NotebookV2Dispatch,
  getState: () => StateType,
  noteId: number
) {
  const workspaceId = getState().workspaces.currentWorkspace?.id;
  if (!workspaceId) {
    return;
  }
  // Remove the note from the workspace notes order
  const newOrder = removeWorkspaceNoteFromOrder(
    getState().notebookV2.workspaceNotesOrder,
    noteId
  );
  // Set the workspace notes order
  setNotebookV2WorkspaceNotesOrder(dispatch, newOrder);
  // Persist the workspace notes order
  await persistWorkspaceNotesOrder(workspaceId, newOrder);
}

/**
 * Fetches all notebook notes for the current workspace from the API.
 * Used for initial load only — mutations should patch the store locally.
 * @param dispatch dispatch
 * @param getState getState
 */
async function reloadNotebookV2EntriesForCurrentWorkspace(
  dispatch: NotebookV2Dispatch,
  getState: () => StateType
) {
  const state = getState();
  const workspaceId = state.workspaces.currentWorkspace?.id;
  // If no workspace id, set the notes and workspace notes order to empty
  if (!workspaceId) {
    dispatch({ type: "NOTEBOOK_V2_LOAD_ENTRIES", payload: [] });
    setNotebookV2WorkspaceNotesOrder(dispatch, []);
    return;
  }
  // Get the notebook entries and the stored workspace notes order
  const [entries, storedOrder] = await Promise.all([
    workspaceNotesApi.getWorkspaceNotes({
      workspaceId,
      owner: state.status.userId,
    }),
    loadWorkspaceNotesOrderProperty(userApi, workspaceId),
  ]);
  // Get the workspace notes from the entries
  const workspaceNotes = getWorkspaceNotesFromNotes(entries);
  // Reconcile the workspace notes order
  const orderIds = reconcileWorkspaceNotesOrder(storedOrder, workspaceNotes);
  dispatch({ type: "NOTEBOOK_V2_LOAD_ENTRIES", payload: entries });
  setNotebookV2WorkspaceNotesOrder(dispatch, orderIds);
  // If the stored workspace notes order is different from the reconciled workspace notes order, persist the new order
  if (storedOrder && !areWorkspaceNotesOrdersEqual(storedOrder, orderIds)) {
    await persistWorkspaceNotesOrder(workspaceId, orderIds);
  }
}

/**
 * Loads the notebook entries.
 */
const loadNotebookV2Entries: LoadNotebookV2Entries =
  function loadNotebookV2Entries() {
    return async (dispatch, getState) => {
      // Update the state to loading
      dispatch({ type: "NOTEBOOK_V2_UPDATE_STATE", payload: "LOADING" });
      try {
        // Reload the notebook entries for the current workspace
        await reloadNotebookV2EntriesForCurrentWorkspace(dispatch, getState);
        dispatch({ type: "NOTEBOOK_V2_UPDATE_STATE", payload: "READY" });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        notifyNotebookV2Error(
          dispatch,
          "notifications.loadError",
          "courseNotes"
        );
      }
    };
  };

/**
 * Updates the edited notebook entry.
 * @param data data
 */
const updateEditedNotebookV2Entry: UpdateEditedNotebookV2Entry =
  function updateEditedNotebookV2Entry(data) {
    return async (dispatch, getState) => {
      // Check if the note is editable
      if (!isNotebookNoteEditable(data.editedEntry)) {
        // Display the notification
        notifyNotebookV2Error(dispatch, "notifications.updateError", "note");
        data.fail?.();
        return;
      }
      try {
        // Update the note
        const updatedNote = await workspaceNotesApi.updateWorkspaceNote({
          id: data.editedEntry.id,
          notebookNote: data.editedEntry,
        });
        // Replace the note in the store
        replaceNotebookV2Note(dispatch, getState, updatedNote);
        data.success?.();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        notifyNotebookV2Error(dispatch, "notifications.updateError", "note");
        data.fail?.();
      }
    };
  };

/**
 * Deletes the notebook entry.
 * @param data data
 */
const deleteNotebookV2Entry: DeleteNotebookV2Entry =
  function deleteNotebookV2Entry(data) {
    return async (dispatch, getState) => {
      try {
        // Archive the note
        await workspaceNotesApi.archiveWorkspaceNote({
          id: data.noteId,
        });

        // Find the deleted note
        const deletedNote = getState().notebookV2.notes?.find(
          (note) => note.id === data.noteId
        );

        // Remove the note from the store
        removeNotebookV2Note(dispatch, getState, data.noteId);

        // Remove from order if it was a workspace note
        if (deletedNote && isNotebookWorkspaceNote(deletedNote)) {
          await removeWorkspaceNoteOrderAndPersist(
            dispatch,
            getState,
            data.noteId
          );
        }

        dispatch({
          type: "NOTEBOOK_V2_CLEAR_NOTE_UI",
          payload: data.noteId,
        });

        // Clear the active item if it was the deleted note
        if (getState().notebookV2.activeItemId === data.noteId) {
          dispatch({
            type: "NOTEBOOK_V2_CLEAR_ACTIVE_ITEM",
            payload: undefined,
          });
        }
        data.success?.();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        notifyNotebookV2Error(dispatch, "notifications.removeError", "note");
        data.fail?.();
      }
    };
  };

/**
 * Reorder workspace notes within the workspace section.
 * dragIndex / hoverIndex are indices in the workspace-notes list only.
 * @param dragIndex - Index of the note to drag
 * @param hoverIndex - Index to hover over
 * @param persist - Whether to persist the new order
 */
const updateNotebookV2WorkspaceNotesOrder: UpdateNotebookV2WorkspaceNotesOrder =
  function updateNotebookV2WorkspaceNotesOrder(
    dragIndex,
    hoverIndex,
    persist = false
  ) {
    return async (dispatch, getState) => {
      const state = getState();
      const workspaceId = state.workspaces.currentWorkspace?.id;
      const currentOrder = state.notebookV2.workspaceNotesOrder;
      if (!workspaceId || !currentOrder.length) {
        return;
      }

      // Reorder the workspace notes order ids
      const newOrder = reorderWorkspaceNotesOrderIds(
        currentOrder,
        dragIndex,
        hoverIndex
      );
      // Set the workspace notes order
      setNotebookV2WorkspaceNotesOrder(dispatch, newOrder);
      // If not persisting, abort
      if (!persist) {
        return;
      }

      // Persist the workspace notes order
      try {
        await persistWorkspaceNotesOrder(workspaceId, newOrder);
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        notifyNotebookV2Error(
          dispatch,
          "notifications.updateError",
          "noteOrder"
        );
      }
    };
  };

/**
 * Saves a new workspace material context highlight
 * @param data data
 */
const saveNewNotebookV2ContextHighlight: SaveNewNotebookV2ContextHighlight =
  function saveNewNotebookV2ContextHighlight(data) {
    return async (dispatch, getState) => {
      const state = getState();
      const workspaceId = state.workspaces.currentWorkspace?.id;
      if (!workspaceId) {
        data.fail?.();
        return;
      }
      try {
        // Create the note
        const note = await workspaceNotesApi.createWorkspaceNote({
          createWorkspaceNoteRequest: {
            title: "",
            text: data.text.trim(),
            workspaceEntityId: workspaceId,
            workspaceMaterialId: data.workspaceMaterialId,
            type: NotebookNoteType.WorkspaceMaterialContextHighlight,
            start: data.start,
            end: data.end,
            index: data.index,
          },
        });
        // Append the note
        appendNotebookV2Note(dispatch, getState, note);
        // Display the notification
        dispatch(
          displayNotification(
            i18n.t("notifications.saveSuccess", { ns: "notebook" }),
            "success"
          )
        );
        data.success?.();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        notifyNotebookV2Error(dispatch, "notifications.saveError", "note");
        data.fail?.();
      }
    };
  };

/**
 * Saves a new workspace material context note
 * @param data data
 */
const saveNewNotebookV2ContextNote: SaveNewNotebookV2ContextNote =
  function saveNewNotebookV2ContextNote(data) {
    return async (dispatch, getState) => {
      const state = getState();
      const workspaceId = state.workspaces.currentWorkspace?.id;
      if (!workspaceId) {
        data.fail?.();
        return;
      }
      // Trim the selected text
      const trimmed = data.selectedText.trim();

      // Generate the title from the selected text
      // If the selected text is longer than 60 characters, truncate it and add "..."
      const title =
        trimmed.length <= 60 ? trimmed : `${trimmed.slice(0, 57)}...`;
      try {
        // Create the note
        const note = await workspaceNotesApi.createWorkspaceNote({
          createWorkspaceNoteRequest: {
            title,
            text: "<p></p>",
            workspaceEntityId: workspaceId,
            workspaceMaterialId: data.workspaceMaterialId,
            type: NotebookNoteType.WorkspaceMaterialContextNote,
            start: data.start,
            end: data.end,
            index: data.index,
          },
        });
        // Append the note
        appendNotebookV2Note(dispatch, getState, note);
        // Display the notification
        dispatch(
          displayNotification(
            i18n.t("notifications.saveSuccess", { ns: "notebook" }),
            "success"
          )
        );
        data.success?.();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        notifyNotebookV2Error(dispatch, "notifications.saveError", "note");
        data.fail?.();
      }
    };
  };

/**
 * Begins the workspace draft.
 */
const beginNotebookV2WorkspaceDraft: BeginNotebookV2WorkspaceDraft =
  function beginNotebookV2WorkspaceDraft() {
    return (dispatch, getState) => {
      const state = getState();
      const workspaceId = state.workspaces.currentWorkspace?.id;
      if (!workspaceId) return;
      // Get temporary client id for the draft
      const clientId = nextNotebookDraftClientId(state.notebookV2.drafts);

      // Begin the workspace draft
      dispatch({
        type: "NOTEBOOK_V2_BEGIN_WORKSPACE_DRAFT",
        payload: {
          clientId,
          position: null,
          workspaceEntityId: workspaceId,
          title: "",
          text: "<p></p>",
        },
      });
    };
  };

/**
 * Begins the material note draft.
 * @param workspaceMaterialId workspaceMaterialId
 */
const beginNotebookV2MaterialNoteDraft: BeginNotebookV2MaterialNoteDraft =
  function beginNotebookV2MaterialNoteDraft(workspaceMaterialId) {
    return (dispatch, getState) => {
      const state = getState();
      const workspaceId = state.workspaces.currentWorkspace?.id;
      if (!workspaceId) return;
      // Get temporary client id for the draft
      const clientId = nextNotebookDraftClientId(state.notebookV2.drafts);

      // Begin the material note draft
      dispatch({
        type: "NOTEBOOK_V2_BEGIN_MATERIAL_DRAFT",
        payload: {
          clientId,
          workspaceEntityId: workspaceId,
          workspaceMaterialId,
          title: "",
          text: "<p></p>",
          openNotebookTab: true,
        },
      });
    };
  };

/**
 * Begins the context note draft.
 * @param data data
 */
const beginNotebookV2ContextNoteDraft: BeginNotebookV2ContextNoteDraft =
  function beginNotebookV2ContextNoteDraft(data) {
    return (dispatch, getState) => {
      const state = getState();
      const workspaceId = state.workspaces.currentWorkspace?.id;
      if (!workspaceId) return;
      // Get temporary client id for the draft
      const clientId = nextNotebookDraftClientId(state.notebookV2.drafts);

      // Begin the context note draft
      dispatch({
        type: "NOTEBOOK_V2_BEGIN_CONTEXT_NOTE_DRAFT",
        payload: {
          draft: {
            clientId,
            workspaceEntityId: workspaceId,
            workspaceMaterialId: data.workspaceMaterialId,
            selectedText: data.selectedText,
            start: data.start,
            end: data.end,
            index: data.index,
            text: `<blockquote><p>${data.selectedText}</p></blockquote>`,
          },
          openNotebookTab: data.openNotebookTab ?? true,
        },
      });
    };
  };

/**
 * Cancels the draft.
 * @param clientId clientId
 */
const cancelNotebookV2Draft: CancelNotebookV2Draft =
  function cancelNotebookV2Draft(clientId) {
    return (dispatch) => {
      dispatch({ type: "NOTEBOOK_V2_CANCEL_DRAFT", payload: clientId });
    };
  };

/**
 * Clears all drafts.
 */
const clearNotebookV2DraftsAll: ClearNotebookV2DraftsAll =
  function clearNotebookV2DraftsAll() {
    return (dispatch) => {
      dispatch({ type: "NOTEBOOK_V2_DRAFTS_CLEAR_ALL", payload: undefined });
    };
  };

/**
 * Clears the focus draft.
 */
const clearNotebookV2FocusDraft: ClearNotebookV2FocusDraft =
  function clearNotebookV2FocusDraft() {
    return (dispatch) => {
      dispatch({ type: "NOTEBOOK_V2_FOCUS_DRAFT_CLEAR", payload: undefined });
    };
  };

/**
 * Clears the notebook tab request.
 */
const clearNotebookV2NotebookTabRequest: ClearNotebookV2NotebookTabRequest =
  function clearNotebookV2NotebookTabRequest() {
    return (dispatch) => {
      dispatch({
        type: "NOTEBOOK_V2_UI_CLEAR_NOTEBOOK_TAB_REQUEST",
        payload: undefined,
      });
    };
  };

/**
 * Saves the workspace draft.
 * @param data data
 */
const saveNotebookV2WorkspaceDraft: SaveNotebookV2WorkspaceDraft =
  function saveNotebookV2WorkspaceDraft(data) {
    return async (dispatch, getState) => {
      const state = getState();
      const draft = state.notebookV2.drafts.workspaceNote;
      const workspaceId = state.workspaces.currentWorkspace?.id;
      if (!draft || draft.clientId !== data.clientId || !workspaceId) {
        data.fail?.();
        return;
      }
      try {
        // Create the note
        const note = await workspaceNotesApi.createWorkspaceNote({
          createWorkspaceNoteRequest: {
            title: data.title,
            text: data.text,
            workspaceEntityId: workspaceId,
            type: NotebookNoteType.Workspace,
          },
        });
        // Cancel the draft
        dispatch({ type: "NOTEBOOK_V2_CANCEL_DRAFT", payload: data.clientId });
        // Append the note
        appendNotebookV2Note(dispatch, getState, note);

        // Update the workspace notes order
        const currentOrder = getState().notebookV2.workspaceNotesOrder;
        const insertPosition = draft.position ?? currentOrder.length;
        const newOrder = insertWorkspaceNoteIdAtPosition(
          currentOrder,
          note.id,
          insertPosition
        );
        // Set and persist the workspace notes order
        setNotebookV2WorkspaceNotesOrder(dispatch, newOrder);
        await persistWorkspaceNotesOrder(workspaceId, newOrder);
        // Display the notification
        dispatch(
          displayNotification(
            i18n.t("notifications.saveSuccess", { ns: "notebook" }),
            "success"
          )
        );
        data.success?.();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        notifyNotebookV2Error(dispatch, "notifications.saveError", "note");
        data.fail?.();
      }
    };
  };

/**
 * Saves the material draft.
 * @param data data
 */
const saveNotebookV2MaterialDraft: SaveNotebookV2MaterialDraft =
  function saveNotebookV2MaterialDraft(data) {
    return async (dispatch, getState) => {
      const state = getState();
      const workspaceId = state.workspaces.currentWorkspace?.id;
      const draftEntry = Object.values(
        state.notebookV2.drafts.materialNotes
      ).find((d) => d.clientId === data.clientId);
      if (!draftEntry || !workspaceId) {
        data.fail?.();
        return;
      }
      try {
        // Create the note
        const note = await workspaceNotesApi.createWorkspaceNote({
          createWorkspaceNoteRequest: {
            title: data.title,
            text: data.text,
            workspaceEntityId: workspaceId,
            workspaceMaterialId: draftEntry.workspaceMaterialId,
            type: NotebookNoteType.WorkspaceMaterial,
          },
        });
        // Cancel the draft
        dispatch({ type: "NOTEBOOK_V2_CANCEL_DRAFT", payload: data.clientId });
        // Append the note
        appendNotebookV2Note(dispatch, getState, note);
        // Display the notification
        dispatch(
          displayNotification(
            i18n.t("notifications.saveSuccess", { ns: "notebook" }),
            "success"
          )
        );
        data.success?.();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        notifyNotebookV2Error(dispatch, "notifications.saveError", "note");
        data.fail?.();
      }
    };
  };

/**
 * Saves the context note draft.
 * @param data data
 */
const saveNotebookV2ContextNoteDraft: SaveNotebookV2ContextNoteDraft =
  function saveNotebookV2ContextNoteDraft(data) {
    return async (dispatch, getState) => {
      const state = getState();
      const workspaceId = state.workspaces.currentWorkspace?.id;
      const draft = state.notebookV2.drafts.contextNotes.find(
        (d) => d.clientId === data.clientId
      );
      if (!draft || !workspaceId) {
        data.fail?.();
        return;
      }
      try {
        const note = await workspaceNotesApi.createWorkspaceNote({
          createWorkspaceNoteRequest: {
            title: data.title,
            text: data.text,
            workspaceEntityId: workspaceId,
            workspaceMaterialId: draft.workspaceMaterialId,
            type: NotebookNoteType.WorkspaceMaterialContextNote,
            start: draft.start,
            end: draft.end,
            index: draft.index,
          },
        });
        dispatch({ type: "NOTEBOOK_V2_CANCEL_DRAFT", payload: data.clientId });
        dispatch({ type: "NOTEBOOK_V2_CLEAR_ACTIVE_ITEM", payload: undefined });
        appendNotebookV2Note(dispatch, getState, note);
        dispatch(
          displayNotification(
            i18n.t("notifications.saveSuccess", { ns: "notebook" }),
            "success"
          )
        );
        data.success?.();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        notifyNotebookV2Error(dispatch, "notifications.saveError", "note");
        data.fail?.();
      }
    };
  };

/**
 * Sets the active item.
 * @param noteId noteId
 */
const setNotebookV2ActiveItem: SetNotebookV2ActiveItem =
  function setNotebookV2ActiveItem(noteId) {
    return (dispatch) => {
      dispatch({ type: "NOTEBOOK_V2_SET_ACTIVE_ITEM", payload: noteId });
    };
  };

/**
 * Clears the active item.
 */
const clearNotebookV2ActiveItem: ClearNotebookV2ActiveItem =
  function clearNotebookV2ActiveItem() {
    return (dispatch) => {
      dispatch({ type: "NOTEBOOK_V2_CLEAR_ACTIVE_ITEM", payload: undefined });
    };
  };

/**
 * Sets the workspace draft position.
 * @param position position
 */
const setNotebookV2WorkspaceDraftPosition: SetNotebookV2WorkspaceDraftPosition =
  function setNotebookV2WorkspaceDraftPosition(position) {
    return (dispatch) => {
      dispatch({
        type: "NOTEBOOK_V2_SET_WORKSPACE_DRAFT_POSITION",
        payload: position,
      });
    };
  };

/**
 * Begin context highlight upgrade in notebook UI.
 * @param highlightId highlightId
 */
const beginNotebookV2ContextHighlightUpgrade: BeginNotebookV2ContextHighlightUpgrade =
  function beginNotebookV2ContextHighlightUpgrade(highlightId) {
    return (dispatch, getState) => {
      const state = getState();
      const notes = state.notebookV2.notes ?? [];
      const highlight = notes.find((n) => n.id === highlightId);
      if (!highlight || !isContextHighlightNote(highlight)) {
        return;
      }
      if (state.notebookV2.activeItemId !== highlightId) {
        dispatch({
          type: "NOTEBOOK_V2_SET_ACTIVE_ITEM",
          payload: highlightId,
        });
      }
      dispatch({
        type: "NOTEBOOK_V2_SET_NOTE_UI",
        payload: { noteId: highlightId, mode: { kind: "upgrading" } },
      });
      dispatch({ type: "NOTEBOOK_V2_FOCUS_NOTE", payload: highlightId });
      // Open notebook tab (same flag drafts use)
      dispatch({
        type: "NOTEBOOK_V2_OPEN_NOTEBOOK_TAB_REQUEST",
        payload: undefined,
      });
    };
  };

/**
 * Cancel context highlight upgrade UI.
 * @param highlightId highlightId
 */
const cancelNotebookV2ContextHighlightUpgrade: CancelNotebookV2ContextHighlightUpgrade =
  function cancelNotebookV2ContextHighlightUpgrade(highlightId) {
    return (dispatch) => {
      dispatch({ type: "NOTEBOOK_V2_CLEAR_NOTE_UI", payload: highlightId });
    };
  };

/**
 * Begin delete confirmation UI for a saved note.
 * @param noteId noteId
 */
const beginNotebookV2NoteDelete: BeginNotebookV2NoteDelete =
  function beginNotebookV2NoteDelete(noteId) {
    return (dispatch, getState) => {
      const notes = getState().notebookV2.notes ?? [];
      const note = notes.find((n) => n.id === noteId);
      if (!note || !isNotebookNoteDeletable(note)) {
        return;
      }
      dispatch({
        type: "NOTEBOOK_V2_SET_NOTE_UI",
        payload: { noteId, mode: { kind: "deleting" } },
      });
    };
  };

/**
 * Cancel delete confirmation UI for a note.
 * @param noteId noteId
 */
const cancelNotebookV2NoteDelete: CancelNotebookV2NoteDelete =
  function cancelNotebookV2NoteDelete(noteId) {
    return (dispatch) => {
      dispatch({ type: "NOTEBOOK_V2_CLEAR_NOTE_UI", payload: noteId });
    };
  };

/**
 * Clears saved-note focus scroll target.
 */
const clearNotebookV2FocusNote: ClearNotebookV2FocusNote =
  function clearNotebookV2FocusNote() {
    return (dispatch) => {
      dispatch({ type: "NOTEBOOK_V2_FOCUS_NOTE_CLEAR", payload: undefined });
    };
  };

/**
 * Upgrade notebook V2 context highlight.
 * @param data data
 */
const upgradeNotebookV2ContextHighlight: UpgradeNotebookV2ContextHighlight =
  function upgradeNotebookV2ContextHighlight(data) {
    return async (dispatch, getState) => {
      const notes = getState().notebookV2.notes ?? [];
      const highlight = notes.find((n) => n.id === data.highlightId);

      if (!highlight || !isContextHighlightNote(highlight)) {
        data.fail?.();
        return;
      }

      const upgradedNote = buildUpgradedContextNote(
        highlight,
        data.title,
        data.text
      );

      /* if (!NOTEBOOK_V2_CONTEXT_HIGHLIGHT_UPGRADE_API_ENABLED) {
        dispatch(
          displayNotification(
            i18n.t("notifications.upgradeUnavailable", { ns: "notebook" }),
            "info"
          )
        );
        data.fail?.();
        return;
      } */

      try {
        // Update the note
        const saved = await workspaceNotesApi.updateWorkspaceNote({
          id: upgradedNote.id,
          notebookNote: upgradedNote,
        });

        // Replace the note
        replaceNotebookV2Note(dispatch, getState, saved);
        dispatch({
          type: "NOTEBOOK_V2_CLEAR_NOTE_UI",
          payload: data.highlightId,
        });
        dispatch({ type: "NOTEBOOK_V2_SET_ACTIVE_ITEM", payload: saved.id });

        dispatch(
          displayNotification(
            i18n.t("notifications.saveSuccess", { ns: "notebook" }),
            "success"
          )
        );

        data.success?.();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        notifyNotebookV2Error(dispatch, "notifications.saveError", "note");
        data.fail?.();
      }
    };
  };

/**
 * Begin delete confirmation in notebook from material highlight menu.
 * @param noteId noteId
 */
const beginNotebookV2NoteDeleteFromMaterial: BeginNotebookV2NoteDeleteFromMaterial =
  function beginNotebookV2NoteDeleteFromMaterial(noteId) {
    return (dispatch, getState) => {
      const notes = getState().notebookV2.notes ?? [];
      const note = notes.find((n) => n.id === noteId);
      if (!note || !isNotebookNoteDeletable(note)) {
        return;
      }
      if (getState().notebookV2.activeItemId !== noteId) {
        dispatch({
          type: "NOTEBOOK_V2_SET_ACTIVE_ITEM",
          payload: noteId,
        });
      }
      dispatch({
        type: "NOTEBOOK_V2_SET_NOTE_UI",
        payload: { noteId, mode: { kind: "deleting" } },
      });
    };
  };

export {
  // Load & persisted note mutations
  loadNotebookV2Entries,
  updateEditedNotebookV2Entry,
  deleteNotebookV2Entry,
  updateNotebookV2WorkspaceNotesOrder,

  // Material: immediate create (selection menu → API)
  saveNewNotebookV2ContextHighlight,
  saveNewNotebookV2ContextNote,

  // Drafts: begin → save → cancel / layout
  beginNotebookV2WorkspaceDraft,
  beginNotebookV2MaterialNoteDraft,
  beginNotebookV2ContextNoteDraft,
  saveNotebookV2WorkspaceDraft,
  saveNotebookV2MaterialDraft,
  saveNotebookV2ContextNoteDraft,
  cancelNotebookV2Draft,
  setNotebookV2WorkspaceDraftPosition,
  clearNotebookV2DraftsAll,

  // Selection (notebook ↔ material)
  setNotebookV2ActiveItem,
  clearNotebookV2ActiveItem,

  // Shell navigation (scroll / tab — consumed after dispatch)
  clearNotebookV2FocusDraft,
  clearNotebookV2FocusNote,
  clearNotebookV2NotebookTabRequest,

  // Saved note UI: context highlight upgrade
  beginNotebookV2ContextHighlightUpgrade,
  cancelNotebookV2ContextHighlightUpgrade,
  upgradeNotebookV2ContextHighlight,

  // Saved note UI: delete confirm
  beginNotebookV2NoteDelete,
  cancelNotebookV2NoteDelete,
  beginNotebookV2NoteDeleteFromMaterial,
};
