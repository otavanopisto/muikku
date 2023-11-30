import { Dispatch } from "react-redux";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import {
  NoteDefaultLocation,
  ReducerStateType,
} from "~/reducers/notebook/notebook";
import { displayNotification } from "../base/notifications";
import { materialShowOrHideExtraTools } from "../workspaces/material";
import update from "immutability-helper";
import MApi, { isMApiError } from "~/api/api";
import i18n from "~/locales/i18n";
import { CreateWorkspaceNoteRequest, WorkspaceNote } from "~/generated/client";

// Notebook actions

export type NOTEBOOK_UPDATE_STATE = SpecificActionType<
  "NOTEBOOK_UPDATE_STATE",
  ReducerStateType
>;

export type NOTEBOOK_LOAD_ENTRIES = SpecificActionType<
  "NOTEBOOK_LOAD_ENTRIES",
  WorkspaceNote[]
>;

export type NOTEBOOK_UPDATE_ENTRIES = SpecificActionType<
  "NOTEBOOK_UPDATE_ENTRIES",
  WorkspaceNote[]
>;

export type NOTEBOOK_CREATE_ENTRY = SpecificActionType<
  "NOTEBOOK_CREATE_ENTRY",
  WorkspaceNote[]
>;

export type NOTEBOOK_EDIT_ENTRY = SpecificActionType<
  "NOTEBOOK_EDIT_ENTRY",
  WorkspaceNote[]
>;

export type NOTEBOOK_DELETE_ENTRY = SpecificActionType<
  "NOTEBOOK_DELETE_ENTRY",
  WorkspaceNote[]
>;

export type NOTEBOOK_TOGGLE_EDITOR = SpecificActionType<
  "NOTEBOOK_TOGGLE_EDITOR",
  {
    open?: boolean;
    note?: WorkspaceNote;
    cutContent?: string;
    notePosition?: number;
    noteEditorSelectPosition?: boolean;
  } | null
>;

export type NOTEBOOK_UPDATE_SELECTED_POSITION = SpecificActionType<
  "NOTEBOOK_UPDATE_SELECTED_POSITION",
  number
>;

export type NOTEBOOK_SET_CUT_CONTENT = SpecificActionType<
  "NOTEBOOK_SET_CUT_CONTENT",
  string
>;

export type NOTEBOOK_LOAD_DEFAULT_POSITION = SpecificActionType<
  "NOTEBOOK_LOAD_DEFAULT_POSITION",
  NoteDefaultLocation
>;

export type NOTEBOOK_UPDATE_DEFAULT_POSITION = SpecificActionType<
  "NOTEBOOK_UPDATE_DEFAULT_POSITION",
  NoteDefaultLocation
>;

// Notebook trigger types

/**
 * LoadNotebookEntries
 */
export interface LoadNotebookEntries {
  (): AnyActionType;
}

/**
 * UpdateNotebookEntriesOrder
 */
export interface UpdateNotebookEntriesOrder {
  (dragIndex: number, hoverIndex: number, dropped: boolean): AnyActionType;
}

/**
 * CreateNotebookEntry
 */
export interface SaveNewNotebookEntry {
  (data: {
    workspaceEntityId?: number;
    newEntry: CreateWorkspaceNoteRequest;
    defaultPosition?: NoteDefaultLocation;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * EditNotebookEntry
 */
export interface UpdateEditNotebookEntry {
  (data: {
    editedEntry: WorkspaceNote;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * DeleteNotebookEntry
 */
export interface DeleteNotebookEntry {
  (data: {
    workspaceNoteId: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * OpenNotebookEditor
 */
export interface ToggleNotebookEditor {
  (data: {
    open?: boolean;
    note?: WorkspaceNote;
    cutContent?: string;
    notePosition?: number;
    noteEditorSelectPosition?: boolean;
  }): AnyActionType;
}

/**
 * CreateNewFromScratch
 */
export interface CreateNewFromScratch {
  (data: {
    workspaceEntityId?: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateSelectedPosition
 */
export interface UpdateSelectedNotePosition {
  (data: number): AnyActionType;
}

/**
 * CreateNewFromCutContent
 */
export interface CreateNewFromCutContent {
  (data: { cutContent: string }): AnyActionType;
}

/**
 * LoadNotebookDefaultPosition
 */
export interface LoadNotebookDefaultPosition {
  (): AnyActionType;
}

/**
 * Loads notebook entries. If workspaceEntityId is not provided, it will load all
 * entries for the user. If workspaceEntityId is provided, it will load workspace specific entries only
 */
const loadNotebookEntries: LoadNotebookEntries =
  function loadNotebookEntries() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const workspaceNotesApi = MApi.getWorkspaceNotesApi();

      const state = getState();

      const { status, workspaces } = state;

      // Update state
      dispatch({
        type: "NOTEBOOK_UPDATE_STATE",
        payload: "LOADING",
      });

      if (state.notebook.noteDefaultLocation === null) {
        dispatch(loadNotebookDefaultPosition());
      }

      // Load workspace specific entries for user
      if (workspaces.currentWorkspace) {
        try {
          const entries = await workspaceNotesApi.getWorkspaceNotes({
            workspaceId: workspaces.currentWorkspace.id,
            owner: status.userId,
          });

          dispatch({
            type: "NOTEBOOK_LOAD_ENTRIES",
            payload: entries,
          });

          dispatch({
            type: "NOTEBOOK_UPDATE_STATE",
            payload: "READY",
          });
        } catch (err) {
          if (!isMApiError(err)) {
            throw err;
          }

          dispatch({
            type: "NOTEBOOK_UPDATE_STATE",
            payload: "ERROR",
          });

          dispatch(
            displayNotification(
              i18n.t("notifications.loadError", {
                ns: "notebook",
                context: "courseNotes",
              }),
              "error"
            )
          );
        }
      }
      // Load all entries for user
      else {
        try {
          const entries = await workspaceNotesApi.getAllWorkspaceNotes({
            owner: status.userId,
          });

          dispatch({
            type: "NOTEBOOK_LOAD_ENTRIES",
            payload: entries,
          });

          dispatch({
            type: "NOTEBOOK_UPDATE_STATE",
            payload: "READY",
          });
        } catch (err) {
          if (!isMApiError(err)) {
            throw err;
          }

          dispatch({
            type: "NOTEBOOK_UPDATE_STATE",
            payload: "ERROR",
          });

          dispatch(
            displayNotification(
              i18n.t("notifications.loadError", {
                ns: "notebook",
                context: "courseNotes",
              }),
              "error"
            )
          );
        }
      }
    };
  };

/**
 * Update notebook entries order
 *
 * @param dragIndex dragIndex of the entry which is moved
 * @param hoverIndex hoverIndex of the entry which is moved
 * @param dropped if note is dropped to place it is updated to server
 */
const updateNotebookEntriesOrder: UpdateNotebookEntriesOrder =
  function updateNotebookEntriesOrder(dragIndex, hoverIndex, dropped) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const workspaceNotesApi = MApi.getWorkspaceNotesApi();

      const { notes } = getState().notebook;

      // dragged and dropped note
      const dragNote = notes[dragIndex];

      // Updated order...
      let updatedList = update(notes, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, notes[dragIndex]],
        ],
      });

      // update order to server if dragged note is dropped
      // to place
      if (dropped) {
        // Find index of dragged note after update
        // This is also needed to find next sibling note
        // to update order to server
        const draggedNoteIndexAfterUpdate = updatedList.findIndex(
          (note) => note.id === dragNote.id
        );

        // dragged note after update
        const noteToUpdate = updatedList[draggedNoteIndexAfterUpdate];

        // next sibling note after update
        // can be undefined if dragged note is dropped to last place
        const nextSiblingNote = updatedList[draggedNoteIndexAfterUpdate + 1];

        if (noteToUpdate) {
          try {
            await workspaceNotesApi.updateWorkspaceNote({
              id: noteToUpdate.id,
              updateWorkspaceNoteRequest: {
                ...noteToUpdate,
                nextSiblingId: nextSiblingNote ? nextSiblingNote.id : null,
              },
            });
          } catch (err) {
            if (!isMApiError(err)) {
              throw err;
            }

            dispatch({
              type: "NOTEBOOK_UPDATE_STATE",
              payload: "ERROR",
            });

            dispatch(
              displayNotification(
                i18n.t("notifications.updateError", {
                  ns: "notebook",
                  context: "noteOrder",
                }),
                "error"
              )
            );
          }
        }
      }

      // repair updated orders entries nextSiblingIds
      // with correct values. Last entry will have nextSiblingId null.
      updatedList = updatedList.map((entry, index) => ({
        ...entry,
        nextSiblingId:
          updatedList.length - 1 === index ? null : updatedList[index + 1].id,
      }));

      dispatch({
        type: "NOTEBOOK_UPDATE_ENTRIES",
        payload: updatedList,
      });
    };
  };

/**
 * Creates a new notebook entry for the user with the given data
 *
 * @param data data
 */
const saveNewNotebookEntry: SaveNewNotebookEntry =
  function saveNewNotebookEntry(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();
      const userApi = MApi.getUserApi();
      const workspaceNotesApi = MApi.getWorkspaceNotesApi();

      try {
        const dataToSave = {
          ...data.newEntry,
        };

        // If user has set default position for new notes
        if (data.defaultPosition === "TOP") {
          dataToSave.nextSiblingId = state.notebook.notes[0]?.id || null;
        } else {
          dataToSave.nextSiblingId =
            state.notebook.notes[state.notebook.notes.length - 1]?.id || null;
        }

        // If user has selected position for new note from the list
        // Because index can be 0, we need to check if it is not null as 0 is falsy value
        if (
          state.notebook.noteEditedPosition !== null &&
          state.notebook.noteEditedPosition >= 0
        ) {
          dataToSave.nextSiblingId =
            state.notebook.notes[state.notebook.noteEditedPosition].id || null;
        } else if (state.notebook.noteEditedPosition === null) {
          dataToSave.nextSiblingId = null;
        }

        // If user changes default position when creating new note
        // we need to update default position to server
        // Selected new default value is updated anyways even if user has selected position from the list
        if (state.notebook.noteDefaultLocation !== data.defaultPosition) {
          const properties = await userApi.setUserProperty({
            setUserPropertyRequest: {
              key: "note-default-position",
              value: data.defaultPosition,
            },
          });

          dispatch({
            type: "NOTEBOOK_UPDATE_DEFAULT_POSITION",
            payload: properties.value || null,
          });
        }

        const entry = await workspaceNotesApi.createWorkspaceNote({
          createWorkspaceNoteRequest: dataToSave,
        });

        let updatedList = [...state.notebook.notes];

        // Then we need to update notebook entries
        // If note position is null, note is added to the end of the list
        if (
          state.notebook.noteEditedPosition !== null &&
          state.notebook.noteEditedPosition >= 0
        ) {
          // If note position is not null, note is added to the list
          // to the given position
          updatedList.splice(state.notebook.noteEditedPosition, 0, entry);
        } else if (state.notebook.noteEditedPosition === null) {
          updatedList.push(entry);
        } else {
          // If previous conditions are not met, note is added to the top or bottom
          // of the list depending on user's default position
          if (data.defaultPosition === "TOP") {
            updatedList.unshift(entry);
          } else {
            updatedList.push(entry);
          }
        }

        // repair updated orders entries nextSiblingIds
        // with correct values. Last entry will have nextSiblingId null.
        updatedList = updatedList.map((entry, index) => ({
          ...entry,
          nextSiblingId:
            updatedList.length - 1 === index ? null : updatedList[index + 1].id,
        }));

        dispatch({
          type: "NOTEBOOK_CREATE_ENTRY",
          payload: updatedList,
        });

        dispatch(
          displayNotification(
            i18n.t("notifications.saveSuccess", { ns: "notebook" }),
            "success"
          )
        );

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch({
          type: "NOTEBOOK_UPDATE_STATE",
          payload: "ERROR",
        });

        dispatch(
          displayNotification(
            i18n.t("notifications.saveError", {
              ns: "notebook",
              context: "note",
              error: err,
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * Saves edited notebook entry and updates the state
 *
 * @param data data
 */
/**
 * Saves edited notebook entry and updates the state
 *
 * @param data data
 */
const updateEditedNotebookEntry: UpdateEditNotebookEntry =
  function updateEditedNotebookEntry(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();
      const workspaceNotesApi = MApi.getWorkspaceNotesApi();

      try {
        const updatedEntry = await workspaceNotesApi.updateWorkspaceNote({
          id: data.editedEntry.id,
          updateWorkspaceNoteRequest: data.editedEntry,
        });

        const updatedList = [...state.notebook.notes];

        const index = updatedList.findIndex(
          (entry) => entry.id === updatedEntry.id
        );

        updatedList[index] = updatedEntry;

        dispatch({
          type: "NOTEBOOK_EDIT_ENTRY",
          payload: updatedList,
        });

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch({
          type: "NOTEBOOK_UPDATE_STATE",
          payload: "ERROR",
        });

        dispatch(
          displayNotification(
            i18n.t("notifications.updateError", {
              ns: "notebook",
              context: "note",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * Delete notebook entry by id
 *
 * @param data data
 */
const deleteNotebookEntry: DeleteNotebookEntry = function deleteNotebookEntry(
  data
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const state = getState();
    const workpsaceNotesApi = MApi.getWorkspaceNotesApi();

    try {
      await workpsaceNotesApi.archiveWorkspaceNote({
        id: data.workspaceNoteId,
      });

      let updatedList = [...state.notebook.notes];

      const index = updatedList.findIndex(
        (entry) => entry.id === data.workspaceNoteId
      );

      updatedList.splice(index, 1);

      // repair updated orders entries nextSiblingIds
      // with correct values. Last entry will have nextSiblingId null.
      updatedList = updatedList.map((entry, index) => ({
        ...entry,
        nextSiblingId:
          updatedList.length - 1 === index ? null : updatedList[index + 1].id,
      }));

      dispatch({
        type: "NOTEBOOK_DELETE_ENTRY",
        payload: updatedList,
      });
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      dispatch({
        type: "NOTEBOOK_UPDATE_STATE",
        payload: "ERROR",
      });
      dispatch(
        displayNotification(
          i18n.t("notifications.removeError", {
            ns: "notebook",
            context: "note",
          }),
          "error"
        )
      );
    }
  };
};

/**
 * Toggles notebook editor open and closed
 *
 * @param data data
 */
const toggleNotebookEditor: ToggleNotebookEditor =
  function toggleNotebookEditor(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "NOTEBOOK_TOGGLE_EDITOR",
        payload: data,
      });
    };
  };

/**
 * Updates selected note position in editor when creating new or editing existing
 *
 * @param data data
 */
const updateSelectedNotePosition: UpdateSelectedNotePosition =
  function updateSelectedNotePosition(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "NOTEBOOK_UPDATE_SELECTED_POSITION",
        payload: data,
      });
    };
  };

/**
 * Sets editor open with given cut content
 *
 * @param data data
 */
const createNewFromCutContent: CreateNewFromCutContent =
  function createNewFromCutContent(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (!state.workspaces.materialExtraTools.opened) {
        dispatch(materialShowOrHideExtraTools());
      }

      dispatch(
        toggleNotebookEditor({ open: true, cutContent: data.cutContent })
      );
    };
  };

/**
 * Loads default position for creating new notes
 */
const loadNotebookDefaultPosition: LoadNotebookDefaultPosition =
  function loadNotebookDefaultPosition() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();
      const userApi = MApi.getUserApi();

      try {
        const properties = await userApi.getUserProperties({
          userEntityId: state.status.userId,
          properties: "note-default-position",
        });

        dispatch({
          type: "NOTEBOOK_LOAD_DEFAULT_POSITION",
          payload: properties[0].value || null,
        });
      } catch (error) {
        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "notebook",
              context: "defaultLocation",
            }),
            "error"
          )
        );
      }
    };
  };

export {
  loadNotebookEntries,
  updateNotebookEntriesOrder,
  saveNewNotebookEntry,
  updateEditedNotebookEntry,
  deleteNotebookEntry,
  toggleNotebookEditor,
  createNewFromCutContent,
  updateSelectedNotePosition,
};
