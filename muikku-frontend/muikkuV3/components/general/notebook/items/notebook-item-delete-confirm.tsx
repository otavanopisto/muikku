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
 * Controlled delete confirmation dialog for notebook notes.
 * Opened from notebook items and material highlight menus via Redux.
 */
const NotebookItemDeleteDialog = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["notebook", "common"]);
  const noteUiById = useSelector(
    (state: StateType) => state.notebookV2.noteUiById
  );
  const deletingNoteId = getDeletingNoteId(noteUiById);
  const isOpen = deletingNoteId != null;
  const [locked, setLocked] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setLocked(false);
    }
  }, [isOpen]);

  /**
   * handleClose
   */
  const handleClose = React.useCallback(() => {
    if (deletingNoteId == null || locked) {
      return;
    }
    dispatch(cancelNotebookV2NoteDelete(deletingNoteId));
  }, [deletingNoteId, dispatch, locked]);

  /**
   * content
   */
  const content = () => <div>{t("content.remove", { ns: "notebook" })}</div>;

  /**
   * footer
   * @param closeDialog closeDialog
   */
  const footer = (closeDialog: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["fatal", "standard-ok"]}
        disabled={locked || deletingNoteId == null}
        onClick={() => {
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
        }}
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
      title={t("actions.remove", { ns: "notebook" })}
      content={content}
      footer={footer}
      isOpen={isOpen}
      onClose={handleClose}
    />
  );
};

export default NotebookItemDeleteDialog;
