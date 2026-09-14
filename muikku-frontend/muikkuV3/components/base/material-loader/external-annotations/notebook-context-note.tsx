import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Dropdown from "~/components/general/dropdown";
import { beginNotebookV2NoteDeleteFromMaterial } from "~/actions/notebook/notebookV2";
import { isNotebookContextNote } from "~/helper-functions/notebook";
import { StateType } from "~/reducers";
import NotebookAnnotationShell from "./notebook-annotation-shell";
import Button from "~/components/general/button";

/**
 * NotebookContextNoteProps
 */
export interface NotebookContextNoteProps {
  notebookAnnotationId: number;
  children: React.ReactNode;
}

/**
 * Saved context note annotation with activate + delete.
 * @param props props
 */
const NotebookContextNote = (props: NotebookContextNoteProps) => {
  const { notebookAnnotationId, children } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation("notebook");

  const note = useSelector((state: StateType) =>
    state.notebookV2.notes?.find((n) => n.id === notebookAnnotationId)
  );

  const contextNote = note && isNotebookContextNote(note) ? note : null;

  /**
   * handleDelete
   * @param closeDropdown closeDropdown
   */
  const handleDelete = (closeDropdown: () => void) => {
    closeDropdown();
    dispatch(beginNotebookV2NoteDeleteFromMaterial(notebookAnnotationId));
  };

  const menuItems = contextNote
    ? [
        (closeDropdown: () => void) => (
          <Button
            key="delete"
            icon="trash"
            iconPosition="left"
            onClick={() => handleDelete(closeDropdown)}
          >
            {t("actions.remove", { context: "note" })}
          </Button>
        ),
      ]
    : undefined;

  if (!menuItems) {
    return (
      <NotebookAnnotationShell
        notebookAnnotationId={notebookAnnotationId}
        kind="note"
      >
        {children}
      </NotebookAnnotationShell>
    );
  }

  return (
    <Dropdown
      modifier="material-annotation"
      items={menuItems}
      openByHover={false}
      closeOnClick={true}
    >
      <NotebookAnnotationShell
        notebookAnnotationId={notebookAnnotationId}
        kind="note"
      >
        {children}
      </NotebookAnnotationShell>
    </Dropdown>
  );
};

export default NotebookContextNote;
