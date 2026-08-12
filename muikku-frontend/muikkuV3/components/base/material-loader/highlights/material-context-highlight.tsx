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
import MaterialHighlightShell from "./material-highlight-shell";
import Button from "~/components/general/button";

/**
 * MaterialContextHighlightProps
 */
export interface MaterialContextHighlightProps {
  highlightId: number;
  children: React.ReactNode;
}

/**
 * Saved context highlight with activate + actions menu.
 * @param props props
 */
const MaterialContextHighlight = (props: MaterialContextHighlightProps) => {
  const { highlightId, children } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation("notebook");

  const note = useSelector((state: StateType) =>
    state.notebookV2.notes?.find((n) => n.id === highlightId)
  );

  const highlightNote = note && isNotebookContextHighlight(note) ? note : null;

  /**
   * handleDelete
   * @param closeDropdown closeDropdown
   */
  const handleDelete = (closeDropdown: () => void) => {
    closeDropdown();
    dispatch(beginNotebookV2NoteDeleteFromMaterial(highlightId));
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
    dispatch(beginNotebookV2ContextHighlightUpgrade(highlightId));
  };

  const menuItems = highlightNote
    ? [
        (closeDropdown: () => void) => (
          <Button
            key="upgrade"
            icon="plus"
            iconPosition="left"
            aria-label={t("actions.upgrade")}
            title={t("actions.upgrade")}
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
            aria-label={t("actions.remove", { context: "highlight" })}
            title={t("actions.remove", { context: "highlight" })}
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
      <MaterialHighlightShell highlightId={highlightId} kind="highlight">
        {children}
      </MaterialHighlightShell>
    );
  }

  return (
    <Dropdown
      modifier="material-highlight"
      items={menuItems}
      openByHover={false}
      closeOnClick={true}
    >
      <MaterialHighlightShell highlightId={highlightId} kind="highlight">
        {children}
      </MaterialHighlightShell>
    </Dropdown>
  );
};

export default MaterialContextHighlight;
