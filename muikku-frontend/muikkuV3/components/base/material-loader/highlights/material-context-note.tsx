import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Dropdown from "~/components/general/dropdown";
import { beginNotebookV2NoteDeleteFromMaterial } from "~/actions/notebook/notebookV2";
import { isNotebookContextNote } from "~/helper-functions/notebook";
import { StateType } from "~/reducers";
import MaterialHighlightShell from "./material-highlight-shell";
import Button from "~/components/general/button";

/**
 * MaterialContextNoteProps
 */
export interface MaterialContextNoteProps {
  highlightId: number;
  children: React.ReactNode;
}

/**
 * Saved context note annotation with activate + delete.
 * @param props props
 */
const MaterialContextNote = (props: MaterialContextNoteProps) => {
  const { highlightId, children } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation("notebook");

  const note = useSelector((state: StateType) =>
    state.notebookV2.notes?.find((n) => n.id === highlightId)
  );

  const contextNote = note && isNotebookContextNote(note) ? note : null;

  /**
   * handleDelete
   * @param closeDropdown closeDropdown
   */
  const handleDelete = (closeDropdown: () => void) => {
    closeDropdown();
    dispatch(beginNotebookV2NoteDeleteFromMaterial(highlightId));
  };

  const menuItems = contextNote
    ? [
        (closeDropdown: () => void) => (
          <Button
            key="delete"
            icon="trash"
            iconPosition="left"
            aria-label={t("actions.remove", { context: "note" })}
            title={t("actions.remove", { context: "note" })}
            onClick={() => handleDelete(closeDropdown)}
          >
            {t("actions.remove", { context: "note" })}
          </Button>
        ),
      ]
    : undefined;

  if (!menuItems) {
    return (
      <MaterialHighlightShell highlightId={highlightId} kind="note">
        {children}
      </MaterialHighlightShell>
    );
  }

  return (
    <Dropdown
      modifier="material-annotation"
      items={menuItems}
      openByHover={false}
      closeOnClick={true}
    >
      <MaterialHighlightShell highlightId={highlightId} kind="note">
        {children}
      </MaterialHighlightShell>
    </Dropdown>
  );
};

export default MaterialContextNote;
