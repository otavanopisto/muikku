import * as React from "react";
import { NotebookNote, NotebookNoteType } from "~/generated/client";
import { useDispatch } from "react-redux";
import {
  cancelNotebookV2Draft,
  saveNotebookV2ContextNoteDraft,
  saveNotebookV2MaterialDraft,
  saveNotebookV2WorkspaceDraft,
  updateEditedNotebookV2Entry,
} from "~/actions/notebook/notebookV2";
import {
  buildEditedNotebookNote,
  getNotebookNoteBodyHtml,
  getNotebookNoteListTitle,
  isNotebookNoteEditable,
} from "../helpers/notebook-display";
import { useNotebookNoteItemCore } from "./useNotebookNoteItemCore";

type UseNotebookEditableNoteItemArgs = {
  note: NotebookNote;
  open: boolean;
  isDraft?: boolean;
};

/**
 * useNotebookEditableNoteItem
 * @param args args
 */
export function useNotebookEditableNoteItem(
  args: UseNotebookEditableNoteItemArgs
) {
  const { note, open, isDraft: isDraftProp } = args;
  const dispatch = useDispatch();

  const core = useNotebookNoteItemCore({ note, isDraft: isDraftProp });

  const [isEditing, setIsEditing] = React.useState(core.isDraft);

  React.useEffect(() => {
    if (core.isDraft) {
      setIsEditing(true);
    }
  }, [core.isDraft]);

  const canEdit = isNotebookNoteEditable(note) && !core.isDraft;

  /**
   * Handles the edit click action.
   */
  const handleEditClick = React.useCallback(() => {
    core.setDeleteActive(false);
    setIsEditing(true);
  }, [core]);

  /**
   * Handles the draft save action.
   */
  const handleDraftSave = React.useCallback(
    (title: string, text: string) => {
      const payload = {
        clientId: note.id,
        title,
        text,
        // eslint-disable-next-line jsdoc/require-jsdoc
        success: () => setIsEditing(false),
      };

      if (note.type === NotebookNoteType.Workspace) {
        dispatch(saveNotebookV2WorkspaceDraft(payload));
        return;
      }
      if (note.type === NotebookNoteType.WorkspaceMaterial) {
        dispatch(saveNotebookV2MaterialDraft(payload));
        return;
      }
      if (note.type === NotebookNoteType.WorkspaceMaterialContextNote) {
        dispatch(saveNotebookV2ContextNoteDraft(payload));
      }
    },
    [dispatch, note.id, note.type]
  );

  /**
   * Handles the edit save action.
   */
  const handleEditSave = React.useCallback(
    (title: string, text: string) => {
      if (core.isDraft) {
        handleDraftSave(title, text);
        return;
      }

      const editedEntry = buildEditedNotebookNote(note, title, text);
      if (!editedEntry) {
        return;
      }

      dispatch(
        updateEditedNotebookV2Entry({
          editedEntry,
          // eslint-disable-next-line jsdoc/require-jsdoc
          success: () => setIsEditing(false),
        })
      );
    },
    [core.isDraft, dispatch, handleDraftSave, note]
  );

  /**
   * Handles the edit cancel action.
   */
  const handleEditCancel = React.useCallback(() => {
    if (core.isDraft) {
      dispatch(cancelNotebookV2Draft(note.id));
      return;
    }
    setIsEditing(false);
  }, [core.isDraft, dispatch, note.id]);

  return {
    ...core,
    open: core.isDraft || isEditing ? true : open,
    isEditing,
    canEdit,
    handleEditClick,
    handleEditSave,
    handleEditCancel,
    title: getNotebookNoteListTitle(note),
    bodyHtml: getNotebookNoteBodyHtml(note),
  };
}
