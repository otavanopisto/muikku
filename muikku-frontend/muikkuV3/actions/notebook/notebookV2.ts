import { Action, Dispatch } from "redux";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { NotebookNote } from "~/generated/client";
import { ReducerStatusType } from "~/reducers/types";
import {
  createMockWorkspaceNotebookNote,
  getMockNotebookNotesByWorkspace,
  removeMockNotebookNote,
  upsertMockNotebookNote,
  reorderMockWorkspaceNotesForWorkspace,
  createMockContextNote,
  createMockContextHighlight,
  createMockWorkspaceMaterialNotebookNote,
} from "~/mock/notebook-notes-store";
import { isNotebookNoteEditable } from "~/components/general/notebook/helpers/notebook-display";
import { displayNotification } from "../base/notifications";
import i18n from "~/locales/i18n";
import {
  nextNotebookDraftClientId,
  NotebookContextNoteDraft,
  NotebookMaterialNoteDraft,
  NotebookWorkspaceNoteDraft,
} from "~/components/general/notebook/helpers/notebook-drafts";

export type NOTEBOOK_V2_UPDATE_STATE = SpecificActionType<
  "NOTEBOOK_V2_UPDATE_STATE",
  ReducerStatusType
>;

export type NOTEBOOK_V2_LOAD_ENTRIES = SpecificActionType<
  "NOTEBOOK_V2_LOAD_ENTRIES",
  NotebookNote[]
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
  (dragIndex: number, hoverIndex: number): AnyActionType;
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

/**
 * ReloadNotebookV2EntriesForCurrentWorkspace
 * @param dispatch dispatch
 * @param getState getState
 */
function reloadNotebookV2EntriesForCurrentWorkspace(
  dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
  getState: () => StateType
) {
  const workspaceId = getState().workspaces.currentWorkspace?.id;
  const entries = workspaceId
    ? getMockNotebookNotesByWorkspace(workspaceId)
    : [];

  dispatch({ type: "NOTEBOOK_V2_LOAD_ENTRIES", payload: entries });
}

/**
 * LoadNotebookV2Entries
 */
const loadNotebookV2Entries: LoadNotebookV2Entries =
  function loadNotebookV2Entries() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      dispatch({ type: "NOTEBOOK_V2_UPDATE_STATE", payload: "LOADING" });
      reloadNotebookV2EntriesForCurrentWorkspace(dispatch, getState);
      dispatch({ type: "NOTEBOOK_V2_UPDATE_STATE", payload: "READY" });
    };
  };

/**
 * SaveNewNotebookV2Entry
 * @param data data
 */
const saveNewNotebookV2Entry: SaveNewNotebookV2Entry =
  function saveNewNotebookV2Entry(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const workspaceId = state.workspaces.currentWorkspace?.id;

      if (!workspaceId) {
        data.fail?.();
        return;
      }

      createMockWorkspaceNotebookNote({
        owner: String(state.status.userId),
        workspaceEntityId: workspaceId,
        title: data.title,
        text: data.text,
      });

      reloadNotebookV2EntriesForCurrentWorkspace(dispatch, getState);

      dispatch(
        displayNotification(
          i18n.t("notifications.saveSuccess", { ns: "notebook" }),
          "success"
        )
      );

      data.success?.();
    };
  };

/**
 * UpdateEditedNotebookV2Entry
 * @param data data
 */
const updateEditedNotebookV2Entry: UpdateEditedNotebookV2Entry =
  function updateEditedNotebookV2Entry(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      if (!isNotebookNoteEditable(data.editedEntry)) {
        dispatch(
          displayNotification(
            i18n.t("notifications.updateError", {
              ns: "notebook",
              context: "note",
            }),
            "error"
          )
        );
        data.fail?.();
        return;
      }

      upsertMockNotebookNote(data.editedEntry);
      reloadNotebookV2EntriesForCurrentWorkspace(dispatch, getState);
      data.success?.();
    };
  };

/**
 * DeleteNotebookV2Entry
 * @param data data
 */
const deleteNotebookV2Entry: DeleteNotebookV2Entry =
  function deleteNotebookV2Entry(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      removeMockNotebookNote(data.noteId);
      reloadNotebookV2EntriesForCurrentWorkspace(dispatch, getState);
      if (getState().notebookV2.activeItemId === data.noteId) {
        dispatch({ type: "NOTEBOOK_V2_CLEAR_ACTIVE_ITEM", payload: undefined });
      }
      data.success?.();
    };
  };

/**
 * Reorder workspace notes within the workspace section (mock store).
 * dragIndex / hoverIndex are indices in the workspace-notes list only.
 * @param dragIndex - Index of the note to drag
 * @param hoverIndex - Index to hover over
 * @returns AnyActionType
 */
const updateNotebookV2WorkspaceNotesOrder: UpdateNotebookV2WorkspaceNotesOrder =
  function updateNotebookV2WorkspaceNotesOrder(dragIndex, hoverIndex) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const workspaceId = getState().workspaces.currentWorkspace?.id;
      if (!workspaceId) {
        return;
      }
      reorderMockWorkspaceNotesForWorkspace(workspaceId, dragIndex, hoverIndex);
      reloadNotebookV2EntriesForCurrentWorkspace(dispatch, getState);
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
      createMockContextHighlight({
        owner: String(state.status.userId),
        workspaceEntityId: workspaceId,
        workspaceMaterialId: data.workspaceMaterialId,
        text: data.text.trim(),
        start: data.start,
        end: data.end,
        index: data.index,
      });
      reloadNotebookV2EntriesForCurrentWorkspace(dispatch, getState);
      dispatch(
        displayNotification(
          i18n.t("notifications.saveSuccess", { ns: "notebook" }),
          "success"
        )
      );
      data.success?.();
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
      createMockContextNote({
        owner: String(state.status.userId),
        workspaceEntityId: workspaceId,
        workspaceMaterialId: data.workspaceMaterialId,
        title,
        text: "<p></p>", // empty body; user edits in notebook
        start: data.start,
        end: data.end,
        index: data.index,
      });
      reloadNotebookV2EntriesForCurrentWorkspace(dispatch, getState);
      dispatch(
        displayNotification(
          i18n.t("notifications.saveSuccess", { ns: "notebook" }),
          "success"
        )
      );
      data.success?.();
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
      createMockWorkspaceNotebookNote({
        owner: String(state.status.userId),
        workspaceEntityId: workspaceId,
        title: data.title,
        text: data.text,
      });
      dispatch({ type: "NOTEBOOK_V2_CANCEL_DRAFT", payload: data.clientId });
      reloadNotebookV2EntriesForCurrentWorkspace(dispatch, getState);
      dispatch(
        displayNotification(
          i18n.t("notifications.saveSuccess", { ns: "notebook" }),
          "success"
        )
      );
      data.success?.();
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
      createMockWorkspaceMaterialNotebookNote({
        owner: String(state.status.userId),
        workspaceEntityId: workspaceId,
        workspaceMaterialId: draftEntry.workspaceMaterialId,
        title: data.title,
        text: data.text,
      });
      dispatch({ type: "NOTEBOOK_V2_CANCEL_DRAFT", payload: data.clientId });
      reloadNotebookV2EntriesForCurrentWorkspace(dispatch, getState);
      dispatch(
        displayNotification(
          i18n.t("notifications.saveSuccess", { ns: "notebook" }),
          "success"
        )
      );
      data.success?.();
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
      createMockContextNote({
        owner: String(state.status.userId),
        workspaceEntityId: workspaceId,
        workspaceMaterialId: draft.workspaceMaterialId,
        title: data.title,
        text: data.text,
        start: draft.start,
        end: draft.end,
        index: draft.index,
      });
      dispatch({ type: "NOTEBOOK_V2_CANCEL_DRAFT", payload: data.clientId });
      dispatch({ type: "NOTEBOOK_V2_CLEAR_ACTIVE_ITEM", payload: undefined });
      reloadNotebookV2EntriesForCurrentWorkspace(dispatch, getState);
      dispatch(
        displayNotification(
          i18n.t("notifications.saveSuccess", { ns: "notebook" }),
          "success"
        )
      );
      data.success?.();
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
