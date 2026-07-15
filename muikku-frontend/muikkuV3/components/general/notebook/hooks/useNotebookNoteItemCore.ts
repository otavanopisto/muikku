import * as React from "react";
import { NotebookNote } from "~/generated/client";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteNotebookV2Entry,
  setNotebookV2ActiveItem,
} from "~/actions/notebook/notebookV2";
import {
  resolveWorkspaceMaterialIdForActiveItem,
  scrollToActiveMaterialItem,
  syncActiveMaterialHighlight,
} from "../helpers/notebook-active-item";
import { isNotebookDraftId } from "../helpers/notebook-drafts";
import { isNotebookNoteDeletable } from "../helpers/notebook-display";
import { StateType } from "~/reducers";

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
  const notes = useSelector((state: StateType) => state.notebookV2.notes);
  const drafts = useSelector((state: StateType) => state.notebookV2.drafts);

  const isDraft = isDraftProp ?? isNotebookDraftId(note.id);
  const [deleteActive, setDeleteActive] = React.useState(false);

  const canDelete = isNotebookNoteDeletable(note) && !isDraft;

  /**
   * Handles the delete confirm action.
   */
  const handleDeleteConfirm = React.useCallback(() => {
    dispatch(
      deleteNotebookV2Entry({
        noteId: note.id,
        // eslint-disable-next-line jsdoc/require-jsdoc
        success: () => setDeleteActive(false),
      })
    );
  }, [dispatch, note.id]);

  /**
   * Handles the activate action.
   */
  const handleActivate = React.useCallback(() => {
    const willDeactivate = activeItemId === note.id;
    dispatch(setNotebookV2ActiveItem(note.id));

    if (willDeactivate) {
      syncActiveMaterialHighlight(null);
      return;
    }

    const workspaceMaterialId = resolveWorkspaceMaterialIdForActiveItem(
      note.id,
      notes,
      drafts
    );

    if (workspaceMaterialId != null) {
      scrollToActiveMaterialItem(workspaceMaterialId, note.id);
    }
  }, [activeItemId, dispatch, drafts, note, notes]);

  return {
    activeItemId,
    isDraft,
    deleteActive,
    setDeleteActive,
    canDelete,
    handleDeleteConfirm,
    handleActivate,
  };
}
