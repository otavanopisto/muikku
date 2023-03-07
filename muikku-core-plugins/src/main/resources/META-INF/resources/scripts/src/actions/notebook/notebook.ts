import { Dispatch } from "react-redux";
import { AnyActionType, SpecificActionType } from "~/actions";
import mApi from "~/lib/mApi";
import { StateType } from "~/reducers";
import {
  ReducerStateType,
  WorkspaceNote,
  WorkspaceNoteCreatePayload,
} from "~/reducers/notebook/notebook";
import promisify from "~/util/promisify";
import { displayNotification } from "../base/notifications";
import { materialShowOrHideExtraTools } from "../workspaces/material";
import update from "immutability-helper";

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
  { open?: boolean; note?: WorkspaceNote; cutContent?: string } | null
>;

export type NOTEBOOK_SET_CUT_CONTENT = SpecificActionType<
  "NOTEBOOK_SET_CUT_CONTENT",
  string
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
    newEntry: WorkspaceNoteCreatePayload;
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
 * CreateNewFromCutContent
 */
export interface CreateNewFromCutContent {
  (data: { cutContent: string }): AnyActionType;
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
      const state = getState();

      const { status, workspaces } = state;

      // Update state
      dispatch({
        type: "NOTEBOOK_UPDATE_STATE",
        payload: "LOADING",
      });

      // Load workspace specific entries for user
      if (workspaces.currentWorkspace) {
        try {
          const entries = (await promisify(
            mApi().workspacenotes.workspace.owner.read(
              workspaces.currentWorkspace.id,
              status.userId
            ),
            "callback"
          )()) as WorkspaceNote[];

          dispatch({
            type: "NOTEBOOK_LOAD_ENTRIES",
            payload: entries,
          });

          dispatch({
            type: "NOTEBOOK_UPDATE_STATE",
            payload: "READY",
          });
        } catch (err) {
          dispatch({
            type: "NOTEBOOK_UPDATE_STATE",
            payload: "ERROR",
          });

          dispatch(
            displayNotification(
              "Virhe ladattaessa työtilakohtaisia muistiinpanoja",
              "error"
            )
          );
        }
      }
      // Load all entries for user
      else {
        try {
          const entries = (await promisify(
            mApi().workspace.journal.read(status.userId),
            "callback"
          )()) as WorkspaceNote[];

          dispatch({
            type: "NOTEBOOK_LOAD_ENTRIES",
            payload: entries,
          });

          dispatch({
            type: "NOTEBOOK_UPDATE_STATE",
            payload: "READY",
          });
        } catch (err) {
          dispatch({
            type: "NOTEBOOK_UPDATE_STATE",
            payload: "ERROR",
          });

          dispatch(
            displayNotification("Virhe ladattaessa muistiinpanoja", "error")
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
            await promisify(
              mApi().workspacenotes.workspacenote.update({
                ...noteToUpdate,
                nextSiblingId: nextSiblingNote ? nextSiblingNote.id : null,
              }),
              "callback"
            )();
          } catch (err) {
            dispatch({
              type: "NOTEBOOK_UPDATE_STATE",
              payload: "ERROR",
            });

            dispatch(
              displayNotification(
                "Virhe päivittäessä muistiinpanojen järjestystä",
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

      try {
        const entry = (await promisify(
          mApi().workspacenotes.workspacenote.create(data.newEntry),
          "callback"
        )()) as WorkspaceNote;

        let updatedList = [...state.notebook.notes];

        updatedList.push(entry);

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
          displayNotification("Muistiinpano lisätty onnistuneesti", "success")
        );

        data.success && data.success();
      } catch (err) {
        dispatch({
          type: "NOTEBOOK_UPDATE_STATE",
          payload: "ERROR",
        });

        dispatch(
          displayNotification(
            "Virhe uuttaa muistiinpanoa tallentaessa",
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
const updateEditedNotebookEntry: UpdateEditNotebookEntry =
  function updateEditedNotebookEntry(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      try {
        const updatedEntry = (await promisify(
          mApi().workspacenotes.workspacenote.update(data.editedEntry),
          "callback"
        )()) as WorkspaceNote;

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
        dispatch({
          type: "NOTEBOOK_UPDATE_STATE",
          payload: "ERROR",
        });

        dispatch(
          displayNotification("Virhe muistiinpanoa päivittäessä", "error")
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

    try {
      await promisify(
        mApi().workspacenotes.archive.del({ id: data.workspaceNoteId }),
        "callback"
      )();

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
      dispatch({
        type: "NOTEBOOK_UPDATE_STATE",
        payload: "ERROR",
      });

      dispatch(displayNotification("Virhe poistaessa muistiinpanoa", "error"));
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

export {
  loadNotebookEntries,
  updateNotebookEntriesOrder,
  saveNewNotebookEntry,
  updateEditedNotebookEntry,
  deleteNotebookEntry,
  toggleNotebookEditor,
  createNewFromCutContent,
};
