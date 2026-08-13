import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import {
  cancelNotebookV2NoteDelete,
  deleteNotebookV2Entry,
} from "~/actions/notebook/notebookV2";
import { StateType } from "~/reducers";
import { NotebookNote } from "~/generated/client";

/**
 * Finds note id currently in deleting UI mode, if any.
 * @param noteUiById noteUiById
 */
function getDeletingNoteId(
  noteUiById: StateType["notebookV2"]["noteUiById"]
): number | null {
  for (const key of Object.keys(noteUiById)) {
    const noteId = Number(key);
    if (noteUiById[noteId]?.kind === "deleting") {
      return noteId;
    }
  }
  return null;
}

/**
 * Finds note by id.
 * @param noteId noteId
 * @param notes notes
 */
function getDeletingNote(
  noteId: number | null,
  notes: NotebookNote[]
): NotebookNote | null {
  for (const note of notes) {
    if (note.id === noteId) {
      return note;
    }
  }
  return null;
}

/**
 * Controlled delete confirmation dialog for notebook notes.
 * Opened from notebook items and material highlight menus via Redux.
 */
const NotebookItemDeleteDialog = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["notebook", "common"]);
  const noteUiById = useSelector(
    (state: StateType) => state.notebookV2.noteUiById
  );
  const notes = useSelector((state: StateType) => state.notebookV2.notes);
  const deletingNoteId = getDeletingNoteId(noteUiById);
  const deletingNote = getDeletingNote(deletingNoteId, notes);
  const isOpen = deletingNoteId != null;
  const [locked, setLocked] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setLocked(false);
    }
  }, [isOpen]);

  /**
   * Handles deleting the note.
   * @param closeDialog closeDialog
   */
  const handleDelete = React.useCallback(
    (closeDialog: () => void) =>
      (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (deletingNoteId == null) {
          return;
        }

        setLocked(true);
        dispatch(
          deleteNotebookV2Entry({
            noteId: deletingNoteId,
            // eslint-disable-next-line jsdoc/require-jsdoc
            success: () => {
              setLocked(false);
              closeDialog();
            },
            // eslint-disable-next-line jsdoc/require-jsdoc
            fail: () => {
              setLocked(false);
            },
          })
        );
      },
    [deletingNoteId, dispatch]
  );

  /**
   * Handles closing the dialog.
   */
  const handleClose = React.useCallback(() => {
    if (deletingNoteId == null || locked) {
      return;
    }
    dispatch(cancelNotebookV2NoteDelete(deletingNoteId));
  }, [deletingNoteId, dispatch, locked]);

  /**
   * Returns title of the dialog based on the note type.
   */
  const titleAndContentByType = () => {
    const defaultResult = {
      title: t("actions.remove", { ns: "notebook" }),
      content: t("content.remove", { ns: "notebook" }),
    };

    if (!deletingNote) {
      return defaultResult;
    }

    switch (deletingNote.type) {
      case "WORKSPACE":
        return {
          title: t("actions.remove", { ns: "notebook" }),
          content: t("content.remove", { ns: "notebook" }),
        };
      case "WORKSPACE_MATERIAL":
        return {
          title: t("actions.remove", { ns: "notebook" }),
          content: t("content.remove", { ns: "notebook" }),
        };
      case "WORKSPACE_MATERIAL_CONTEXT_HIGHLIGHT":
        return {
          title: t("actions.remove", { ns: "notebook" }),
          content: t("content.remove", { ns: "notebook" }),
        };
      case "WORKSPACE_MATERIAL_CONTEXT_NOTE":
        return {
          title: t("actions.remove", { ns: "notebook" }),
          content: t("content.remove", { ns: "notebook" }),
        };
      default:
        return defaultResult;
    }
  };

  /**
   * Content of the dialog.
   */
  const content = () => <div>{titleAndContentByType().content}</div>;

  /**
   * Footer of the dialog.
   * @param closeDialog closeDialog
   */
  const footer = (closeDialog: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["fatal", "standard-ok"]}
        disabled={locked || deletingNoteId == null}
        onClick={handleDelete(closeDialog)}
      >
        {t("actions.remove", { ns: "common" })}
      </Button>
      <Button
        buttonModifiers={["cancel", "standard-cancel"]}
        disabled={locked}
        onClick={closeDialog}
      >
        {t("actions.cancel", { ns: "common" })}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="delete-notebook-note"
      title={titleAndContentByType().title}
      content={content}
      footer={footer}
      isOpen={isOpen}
      onClose={handleClose}
    />
  );
};

export default NotebookItemDeleteDialog;
