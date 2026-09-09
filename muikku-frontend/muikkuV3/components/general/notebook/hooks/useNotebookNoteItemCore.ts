import * as React from "react";
import { NotebookNote } from "~/generated/client";
import { useDispatch, useSelector } from "react-redux";
import {
  beginNotebookV2NoteDelete,
  cancelNotebookV2NoteDelete,
  deleteNotebookV2Entry,
  setNotebookV2ActiveItem,
} from "~/actions/notebook/notebookV2";
import {
  resolveWorkspaceMaterialIdForActiveItem,
  scrollToMaterialHighlightItem,
} from "../helpers/notebook-active-item";
import { isNotebookDraftId } from "../helpers/notebook-drafts";
import { isNotebookNoteDeletable } from "../helpers/notebook-display";
import { StateType } from "~/reducers";
import { isNotebookNoteDeleting } from "~/reducers/notebook/notebookV2";

type UseNotebookNoteItemCoreArgs = {
  note: NotebookNote;
  isDraft?: boolean;
};

/**
 * useNotebookNoteItemCore
 * @param args args
 */
export function useNotebookNoteItemCore(args: UseNotebookNoteItemCoreArgs) {
  const { note, isDraft: isDraftProp } = args;
  const dispatch = useDispatch();

  const activeItemId = useSelector(
    (state: StateType) => state.notebookV2.activeItemId
  );
  const noteUiById = useSelector(
    (state: StateType) => state.notebookV2.noteUiById
  );
  const notes = useSelector((state: StateType) => state.notebookV2.notes);
  const drafts = useSelector((state: StateType) => state.notebookV2.drafts);

  const isDraft = isDraftProp ?? isNotebookDraftId(note.id);
  const deleteActive = isNotebookNoteDeleting(noteUiById, note.id);

  const canDelete = isNotebookNoteDeletable(note) && !isDraft;

  /**
   * Begin delete confirmation UI.
   */
  const beginDelete = React.useCallback(() => {
    dispatch(beginNotebookV2NoteDelete(note.id));
  }, [dispatch, note.id]);

  /**
   * Cancel delete confirmation UI.
   */
  const cancelDelete = React.useCallback(() => {
    dispatch(cancelNotebookV2NoteDelete(note.id));
  }, [dispatch, note.id]);

  /**
   * Toggle delete confirmation UI. Scroll to material highlight if it exists.
   */
  const toggleDelete = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.stopPropagation();
      if (deleteActive) {
        dispatch(cancelNotebookV2NoteDelete(note.id));
        return;
      }
      const workspaceMaterialId = resolveWorkspaceMaterialIdForActiveItem(
        note.id,
        notes,
        drafts
      );

      dispatch(beginNotebookV2NoteDelete(note.id));

      if (workspaceMaterialId != null) {
        // Scroll to material highlight
        scrollToMaterialHighlightItem(workspaceMaterialId, note.id);
      }
    },
    [deleteActive, dispatch, note.id, notes, drafts]
  );

  /**
   * Handles the delete confirm action.
   */
  const handleDeleteConfirm = React.useCallback(() => {
    dispatch(
      deleteNotebookV2Entry({
        noteId: note.id,
      })
    );
  }, [dispatch, note.id]);

  /**
   * Handles the activate action. Scroll to material highlight if it exists.
   */
  const handleActivate = React.useCallback(() => {
    dispatch(setNotebookV2ActiveItem(note.id));

    const workspaceMaterialId = resolveWorkspaceMaterialIdForActiveItem(
      note.id,
      notes,
      drafts
    );

    if (workspaceMaterialId != null) {
      // Scroll to material highlight
      scrollToMaterialHighlightItem(workspaceMaterialId, note.id);
    }
  }, [dispatch, drafts, note.id, notes]);

  return {
    activeItemId,
    isDraft,
    deleteActive,
    beginDelete,
    cancelDelete,
    toggleDelete,
    canDelete,
    handleDeleteConfirm,
    handleActivate,
  };
}
