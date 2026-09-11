import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Dropdown from "~/components/general/dropdown";
import {
  beginNotebookV2ContextHighlightUpgrade,
  beginNotebookV2NoteDeleteFromMaterial,
} from "~/actions/notebook/notebookV2";
import { isNotebookContextHighlight } from "~/helper-functions/notebook";
import { StateType } from "~/reducers";
import NotebookAnnotationShell from "./notebook-annotation-shell";
import Button from "~/components/general/button";

/**
 * NotebookContextHighlightProps
 */
export interface NotebookContextHighlightProps {
  notebookAnnotationId: number;
  children: React.ReactNode;
}

/**
 * Saved context highlight with activate + actions menu.
 * @param props props
 */
const NotebookContextHighlight = (props: NotebookContextHighlightProps) => {
  const { notebookAnnotationId, children } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation("notebook");

  const note = useSelector((state: StateType) =>
    state.notebookV2.notes?.find((n) => n.id === notebookAnnotationId)
  );

  const highlightNote = note && isNotebookContextHighlight(note) ? note : null;

  /**
   * handleDelete
   * @param closeDropdown closeDropdown
   */
  const handleDelete = (closeDropdown: () => void) => {
    closeDropdown();
    dispatch(beginNotebookV2NoteDeleteFromMaterial(notebookAnnotationId));
  };

  /**
   * handleUpgrade
   * Opens notebook tab upgrade flow via existing action.
   * For now: upgrade with default title/text (or open notebook — refine later).
   * @param closeDropdown closeDropdown
   */
  const handleUpgrade = (closeDropdown: () => void) => {
    closeDropdown();
    if (!highlightNote) {
      return;
    }
    dispatch(beginNotebookV2ContextHighlightUpgrade(notebookAnnotationId));
  };

  const menuItems = highlightNote
    ? [
        (closeDropdown: () => void) => (
          <Button
            key="upgrade"
            icon="note-add"
            iconPosition="left"
            onClick={() => handleUpgrade(closeDropdown)}
          >
            {t("actions.upgrade")}
          </Button>
        ),
        (closeDropdown: () => void) => (
          <Button
            key="delete"
            icon="trash"
            iconPosition="left"
            onClick={() => handleDelete(closeDropdown)}
          >
            {t("actions.remove", { context: "highlight" })}
          </Button>
        ),
      ]
    : undefined;

  // No note found (stale/orphan) → still activate, no menu
  if (!menuItems) {
    return (
      <NotebookAnnotationShell
        notebookAnnotationId={notebookAnnotationId}
        kind="highlight"
      >
        {children}
      </NotebookAnnotationShell>
    );
  }

  return (
    <Dropdown
      modifier="material-highlight"
      items={menuItems}
      openByHover={false}
      closeOnClick={true}
    >
      <NotebookAnnotationShell
        notebookAnnotationId={notebookAnnotationId}
        kind="highlight"
      >
        {children}
      </NotebookAnnotationShell>
    </Dropdown>
  );
};

export default NotebookContextHighlight;
