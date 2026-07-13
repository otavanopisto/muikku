import { Action, Dispatch } from "redux";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { NotebookNote, NotebookNoteType } from "~/generated/client";
import { ReducerStatusType } from "~/reducers/types";
import { isNotebookNoteEditable } from "~/components/general/notebook/helpers/notebook-display";
import { displayNotification } from "../base/notifications";
import i18n from "~/locales/i18n";
import {
  nextNotebookDraftClientId,
  NotebookContextNoteDraft,
  NotebookMaterialNoteDraft,
  NotebookWorkspaceNoteDraft,
} from "~/components/general/notebook/helpers/notebook-drafts";
import {
  appendWorkspaceNoteToOrder,
  areWorkspaceNotesOrdersEqual,
  getWorkspaceNotesFromNotes,
  loadWorkspaceNotesOrderProperty,
  reconcileWorkspaceNotesOrder,
  removeWorkspaceNoteFromOrder,
  reorderWorkspaceNotesOrderIds,
  saveWorkspaceNotesOrderProperty,
} from "~/components/general/notebook/helpers/notebook-workspace-order";
import MApi, { isMApiError } from "~/api/api";
import { isNotebookWorkspaceNote } from "~/helper-functions/notebook";

const workspaceNotesApi = MApi.getWorkspaceNotesApi();
const userApi = MApi.getUserApi();

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
 * @param noteId noteId
 * @returns AnyActionType
 */
export interface SetNotebookV2ActiveItem {
  (noteId: number): AnyActionType;
}

/**
 * ClearNotebookV2ActiveItem
 * @returns AnyActionType
 */
export interface ClearNotebookV2ActiveItem {
  (): AnyActionType;
}

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
  const currentNotes = getState().notebookV2.notes ?? [];
  const index = currentNotes.findIndex((entry) => entry.id === note.id);
  if (index < 0) {
    setNotebookV2Notes(dispatch, [...currentNotes, note]);
    return;
  }
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

/**
 * Appends a workspace note to the order and persists the new order.
 * @param dispatch dispatch
 * @param getState getState
 * @param note note
 */
async function appendWorkspaceNoteOrderAndPersist(
  dispatch: NotebookV2Dispatch,
  getState: () => StateType,
  note: NotebookNote
) {
  if (!isNotebookWorkspaceNote(note)) {
    return;
  }
  const workspaceId = getState().workspaces.currentWorkspace?.id;
  if (!workspaceId) {
    return;
  }
  const newOrder = appendWorkspaceNoteToOrder(
    getState().notebookV2.workspaceNotesOrder,
    note.id
  );
  setNotebookV2WorkspaceNotesOrder(dispatch, newOrder);
  await persistWorkspaceNotesOrder(workspaceId, newOrder);
}

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
  const newOrder = removeWorkspaceNoteFromOrder(
    getState().notebookV2.workspaceNotesOrder,
    noteId
  );
  setNotebookV2WorkspaceNotesOrder(dispatch, newOrder);
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
  if (!workspaceId) {
    dispatch({ type: "NOTEBOOK_V2_LOAD_ENTRIES", payload: [] });
    setNotebookV2WorkspaceNotesOrder(dispatch, []);
    return;
  }
  const [entries, storedOrder] = await Promise.all([
    workspaceNotesApi.getWorkspaceNotes({
      workspaceId,
      owner: state.status.userId,
    }),
    loadWorkspaceNotesOrderProperty(userApi, workspaceId),
  ]);
  const workspaceNotes = getWorkspaceNotesFromNotes(entries);
  const orderIds = reconcileWorkspaceNotesOrder(storedOrder, workspaceNotes);
  dispatch({ type: "NOTEBOOK_V2_LOAD_ENTRIES", payload: entries });
  setNotebookV2WorkspaceNotesOrder(dispatch, orderIds);
  if (storedOrder && !areWorkspaceNotesOrdersEqual(storedOrder, orderIds)) {
    await persistWorkspaceNotesOrder(workspaceId, orderIds);
  }
}

/**
 * LoadNotebookV2Entries
 */
const loadNotebookV2Entries: LoadNotebookV2Entries =
  function loadNotebookV2Entries() {
    return async (dispatch, getState) => {
      dispatch({ type: "NOTEBOOK_V2_UPDATE_STATE", payload: "LOADING" });
      try {
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
 * SaveNewNotebookV2Entry
 * @param data data
 */
const saveNewNotebookV2Entry: SaveNewNotebookV2Entry =
  function saveNewNotebookV2Entry(data) {
    return async (dispatch, getState) => {
      const state = getState();
      const workspaceId = state.workspaces.currentWorkspace?.id;
      if (!workspaceId) {
        data.fail?.();
        return;
      }
      try {
        const note = await workspaceNotesApi.createWorkspaceNote({
          createWorkspaceNoteRequest: {
            title: data.title,
            text: data.text,
            workspaceEntityId: workspaceId,
            type: NotebookNoteType.Workspace,
          },
        });
        appendNotebookV2Note(dispatch, getState, note);
        await appendWorkspaceNoteOrderAndPersist(dispatch, getState, note);
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
 * UpdateEditedNotebookV2Entry
 * @param data data
 */
const updateEditedNotebookV2Entry: UpdateEditedNotebookV2Entry =
  function updateEditedNotebookV2Entry(data) {
    return async (dispatch, getState) => {
      if (!isNotebookNoteEditable(data.editedEntry)) {
        notifyNotebookV2Error(dispatch, "notifications.updateError", "note");
        data.fail?.();
        return;
      }
      try {
        const updatedNote = await workspaceNotesApi.updateWorkspaceNote({
          id: data.editedEntry.id,
          notebookNote: data.editedEntry,
        });
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
 * DeleteNotebookV2Entry
 * @param data data
 */
const deleteNotebookV2Entry: DeleteNotebookV2Entry =
  function deleteNotebookV2Entry(data) {
    return async (dispatch, getState) => {
      try {
        await workspaceNotesApi.archiveWorkspaceNote({
          id: data.noteId,
        });

        const deletedNote = getState().notebookV2.notes?.find(
          (note) => note.id === data.noteId
        );

        removeNotebookV2Note(dispatch, getState, data.noteId);

        // Remove from order if it was a workspace note
        if (deletedNote && isNotebookWorkspaceNote(deletedNote)) {
          await removeWorkspaceNoteOrderAndPersist(
            dispatch,
            getState,
            data.noteId
          );
        }

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
 * Reorder workspace notes within the workspace section (mock store).
 * dragIndex / hoverIndex are indices in the workspace-notes list only.
 * @param dragIndex - Index of the note to drag
 * @param hoverIndex - Index to hover over
 * @param persist - Whether to persist the new order
 * @returns AnyActionType
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
      const newOrder = reorderWorkspaceNotesOrderIds(
        currentOrder,
        dragIndex,
        hoverIndex
      );
      setNotebookV2WorkspaceNotesOrder(dispatch, newOrder);
      if (!persist) {
        return;
      }
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
 * @returns AnyActionType
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
 * Saves a new workspace material context note
 * @param data data
 * @returns AnyActionType
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
      const trimmed = data.selectedText.trim();
      const title =
        trimmed.length <= 60 ? trimmed : `${trimmed.slice(0, 57)}...`;
      try {
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
 * BeginNotebookV2WorkspaceDraft
 * @returns AnyActionType
 */
const beginNotebookV2WorkspaceDraft: BeginNotebookV2WorkspaceDraft =
  function beginNotebookV2WorkspaceDraft() {
    return (dispatch, getState) => {
      const state = getState();
      const workspaceId = state.workspaces.currentWorkspace?.id;
      if (!workspaceId) return;
      const clientId = nextNotebookDraftClientId(state.notebookV2.drafts);
      dispatch({
        type: "NOTEBOOK_V2_BEGIN_WORKSPACE_DRAFT",
        payload: {
          clientId,
          workspaceEntityId: workspaceId,
          title: "",
          text: "<p></p>",
        },
      });
    };
  };

/**
 * BeginNotebookV2MaterialNoteDraft
 * @param workspaceMaterialId workspaceMaterialId
 * @returns AnyActionType
 */
const beginNotebookV2MaterialNoteDraft: BeginNotebookV2MaterialNoteDraft =
  function beginNotebookV2MaterialNoteDraft(workspaceMaterialId) {
    return (dispatch, getState) => {
      const state = getState();
      const workspaceId = state.workspaces.currentWorkspace?.id;
      if (!workspaceId) return;
      const clientId = nextNotebookDraftClientId(state.notebookV2.drafts);
      dispatch({
        type: "NOTEBOOK_V2_BEGIN_MATERIAL_DRAFT",
        payload: {
          clientId,
          workspaceEntityId: workspaceId,
          workspaceMaterialId,
          title: "",
          text: "<p></p>",
        },
      });
    };
  };

/**
 * BeginNotebookV2ContextNoteDraft
 * @param data data
 * @returns AnyActionType
 */
const beginNotebookV2ContextNoteDraft: BeginNotebookV2ContextNoteDraft =
  function beginNotebookV2ContextNoteDraft(data) {
    return (dispatch, getState) => {
      const state = getState();
      const workspaceId = state.workspaces.currentWorkspace?.id;
      if (!workspaceId) return;
      const clientId = nextNotebookDraftClientId(state.notebookV2.drafts);
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
 * CancelNotebookV2Draft
 * @param clientId clientId
 * @returns AnyActionType
 */
const cancelNotebookV2Draft: CancelNotebookV2Draft =
  function cancelNotebookV2Draft(clientId) {
    return (dispatch) => {
      dispatch({ type: "NOTEBOOK_V2_CANCEL_DRAFT", payload: clientId });
    };
  };

/**
 * ClearNotebookV2DraftsAll
 * @returns AnyActionType
 */
const clearNotebookV2DraftsAll: ClearNotebookV2DraftsAll =
  function clearNotebookV2DraftsAll() {
    return (dispatch) => {
      dispatch({ type: "NOTEBOOK_V2_DRAFTS_CLEAR_ALL", payload: undefined });
    };
  };

/**
 * ClearNotebookV2FocusDraft
 * @returns AnyActionType
 */
const clearNotebookV2FocusDraft: ClearNotebookV2FocusDraft =
  function clearNotebookV2FocusDraft() {
    return (dispatch) => {
      dispatch({ type: "NOTEBOOK_V2_FOCUS_DRAFT_CLEAR", payload: undefined });
    };
  };

/**
 * ClearNotebookV2NotebookTabRequest
 * @returns AnyActionType
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
 * SaveNotebookV2WorkspaceDraft
 * @param data data
 * @returns AnyActionType
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
        const note = await workspaceNotesApi.createWorkspaceNote({
          createWorkspaceNoteRequest: {
            title: data.title,
            text: data.text,
            workspaceEntityId: workspaceId,
            type: NotebookNoteType.Workspace,
          },
        });
        dispatch({ type: "NOTEBOOK_V2_CANCEL_DRAFT", payload: data.clientId });
        appendNotebookV2Note(dispatch, getState, note);
        await appendWorkspaceNoteOrderAndPersist(dispatch, getState, note);
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
 * SaveNotebookV2MaterialDraft
 * @param data data
 * @returns AnyActionType
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
        const note = await workspaceNotesApi.createWorkspaceNote({
          createWorkspaceNoteRequest: {
            title: data.title,
            text: data.text,
            workspaceEntityId: workspaceId,
            workspaceMaterialId: draftEntry.workspaceMaterialId,
            type: NotebookNoteType.WorkspaceMaterial,
          },
        });
        dispatch({ type: "NOTEBOOK_V2_CANCEL_DRAFT", payload: data.clientId });
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
 * SaveNotebookV2ContextNoteDraft
 * @param data data
 * @returns AnyActionType
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
 * SetNotebookV2ActiveItem
 * @param noteId noteId
 * @returns AnyActionType
 */
const setNotebookV2ActiveItem: SetNotebookV2ActiveItem =
  function setNotebookV2ActiveItem(noteId) {
    return (dispatch) => {
      dispatch({ type: "NOTEBOOK_V2_SET_ACTIVE_ITEM", payload: noteId });
    };
  };

/**
 * ClearNotebookV2ActiveItem
 * @returns AnyActionType
 */
const clearNotebookV2ActiveItem: ClearNotebookV2ActiveItem =
  function clearNotebookV2ActiveItem() {
    return (dispatch) => {
      dispatch({ type: "NOTEBOOK_V2_CLEAR_ACTIVE_ITEM", payload: undefined });
    };
  };

export {
  loadNotebookV2Entries,
  saveNewNotebookV2Entry,
  updateEditedNotebookV2Entry,
  deleteNotebookV2Entry,
  updateNotebookV2WorkspaceNotesOrder,
  saveNewNotebookV2ContextHighlight,
  saveNewNotebookV2ContextNote,
  beginNotebookV2WorkspaceDraft,
  beginNotebookV2MaterialNoteDraft,
  beginNotebookV2ContextNoteDraft,
  cancelNotebookV2Draft,
  clearNotebookV2DraftsAll,
  clearNotebookV2FocusDraft,
  clearNotebookV2NotebookTabRequest,
  saveNotebookV2WorkspaceDraft,
  saveNotebookV2MaterialDraft,
  saveNotebookV2ContextNoteDraft,
  setNotebookV2ActiveItem,
  clearNotebookV2ActiveItem,
};
