import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getContextHighlightUpgradeEditorDefaults,
  ContextHighlightNote,
} from "../helpers/notebook-context-upgrade";
import {
  cancelNotebookV2ContextHighlightUpgrade,
  upgradeNotebookV2ContextHighlight,
} from "~/actions/notebook/notebookV2";
import { StateType } from "~/reducers";
import { isNotebookNoteUpgrading } from "~/reducers/notebook/notebookV2";

type UseNotebookContextHighlightUpgradeArgs = {
  note: ContextHighlightNote;
};

/**
 * Use notebook context highlight upgrade.
 * @param args args
 */
export function useNotebookContextHighlightUpgrade(
  args: UseNotebookContextHighlightUpgradeArgs
) {
  const { note } = args;
  const dispatch = useDispatch();

  const noteUiById = useSelector(
    (state: StateType) => state.notebookV2.noteUiById
  );

  const isUpgrading = isNotebookNoteUpgrading(noteUiById, note.id);

  const editorDefaults = React.useMemo(
    () => getContextHighlightUpgradeEditorDefaults(note),
    [note]
  );

  /**
   * Begin upgrade.
   */
  const beginUpgrade = React.useCallback(() => {
    dispatch({
      type: "NOTEBOOK_V2_SET_NOTE_UI",
      payload: { noteId: note.id, mode: { kind: "upgrading" } },
    });
  }, [dispatch, note.id]);

  /**
   * Cancel upgrade.
   */
  const cancelUpgrade = React.useCallback(() => {
    dispatch(cancelNotebookV2ContextHighlightUpgrade(note.id));
  }, [dispatch, note.id]);

  /**
   * Save upgrade.
   * @param title title
   * @param text text
   */
  const saveUpgrade = React.useCallback(
    (title: string, text: string) => {
      dispatch(
        upgradeNotebookV2ContextHighlight({
          highlightId: note.id,
          title,
          text,
        })
      );
    },
    [dispatch, note.id]
  );

  return {
    isUpgrading,
    editorDefaults,
    beginUpgrade,
    cancelUpgrade,
    saveUpgrade,
  };
}
