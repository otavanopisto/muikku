import * as React from "react";
import { useDispatch } from "react-redux";
import {
  getContextHighlightUpgradeEditorDefaults,
  ContextHighlightNote,
} from "../helpers/notebook-context-upgrade";
import { upgradeNotebookV2ContextHighlight } from "~/actions/notebook/notebookV2";

type UseNotebookContextHighlightUpgradeArgs = {
  note: ContextHighlightNote;
  onExitUpgradeMode: () => void;
};

/**
 * Use notebook context highlight upgrade.
 * @param args args
 */
export function useNotebookContextHighlightUpgrade(
  args: UseNotebookContextHighlightUpgradeArgs
) {
  const { note, onExitUpgradeMode } = args;
  const dispatch = useDispatch();

  const [isUpgrading, setIsUpgrading] = React.useState(false);

  const editorDefaults = React.useMemo(
    () => getContextHighlightUpgradeEditorDefaults(note),
    [note]
  );

  const beginUpgrade = React.useCallback(() => {
    setIsUpgrading(true);
  }, []);

  const cancelUpgrade = React.useCallback(() => {
    setIsUpgrading(false);
    onExitUpgradeMode();
  }, [onExitUpgradeMode]);

  const saveUpgrade = React.useCallback(
    (title: string, text: string) => {
      dispatch(
        upgradeNotebookV2ContextHighlight({
          highlightId: note.id,
          title,
          text,
          // eslint-disable-next-line jsdoc/require-jsdoc
          success: () => {
            setIsUpgrading(false);
            onExitUpgradeMode();
          },
          // eslint-disable-next-line jsdoc/require-jsdoc
          fail: () => {
            // Stay in upgrade mode so user can retry or cancel
          },
        })
      );
    },
    [dispatch, note.id, onExitUpgradeMode]
  );

  return {
    isUpgrading,
    editorDefaults,
    beginUpgrade,
    cancelUpgrade,
    saveUpgrade,
  };
}
