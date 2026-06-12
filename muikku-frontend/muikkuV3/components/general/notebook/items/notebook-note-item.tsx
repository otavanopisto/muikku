import * as React from "react";
import { NotebookNote, NotebookNoteType } from "~/generated/client";
import { IconButton } from "../../button";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  cancelNotebookV2Draft,
  deleteNotebookV2Entry,
  saveNotebookV2ContextNoteDraft,
  saveNotebookV2MaterialDraft,
  saveNotebookV2WorkspaceDraft,
  updateEditedNotebookV2Entry,
} from "~/actions/notebook/notebookV2";
import {
  buildEditedNotebookNote,
  getNotebookItemClassName,
  getNotebookNoteBodyHtml,
  getNotebookNoteListTitle,
  isNotebookNoteDeletable,
  isNotebookNoteEditable,
} from "../helpers/notebook-display";
import { isNotebookDraftId } from "../helpers/notebook-drafts";
import NotebookItemShell from "./notebook-item-shell";
import NotebookItemDeleteConfirm from "./notebook-item-delete-confirm";
import NotebookNoteEditor from "../notebook-note-editor";
import { resolveNotebookContextOrphanStatus } from "../helpers/notebook-annotation-status";
import NotebookItemOrphanBadge from "./notebook-item-orphan-badge";

/**
 * NotebookNoteItemProps
 */
export interface NotebookNoteItemProps {
  note: NotebookNote;
  open: boolean;
  onToggle: (noteId: number) => void;
  materialHtml?: string;
  isDraft?: boolean;
}

/**
 * NotebookNoteItem
 * @param props props
 * @returns React.ReactNode
 */
const NotebookNoteItem = (props: NotebookNoteItemProps) => {
  const { note, open, onToggle, materialHtml, isDraft: isDraftProp } = props;
  const { t } = useTranslation("notebook");
  const dispatch = useDispatch();

  const isDraft = isDraftProp ?? isNotebookDraftId(note.id);
  const [isEditing, setIsEditing] = React.useState(isDraft);
  const [deleteActive, setDeleteActive] = React.useState(false);

  React.useEffect(() => {
    if (isDraft) {
      setIsEditing(true);
    }
  }, [isDraft]);

  const canEdit = isNotebookNoteEditable(note) && !isDraft;
  const canDelete = isNotebookNoteDeletable(note) && !isDraft;

  const orphanStatus = React.useMemo(
    () =>
      isDraft ? null : resolveNotebookContextOrphanStatus(note, materialHtml),
    [note, materialHtml, isDraft]
  );

  const isOrphaned = orphanStatus?.isOrphaned ?? false;

  const titleAdornment = isOrphaned ? (
    <NotebookItemOrphanBadge reason={orphanStatus?.reason ?? null} />
  ) : null;

  /**
   * Handle edit click
   */
  const handleEditClick = () => {
    setDeleteActive(false);
    setIsEditing(true);
  };

  /**
   * Handle draft save
   * @param title title
   * @param text text
   */
  const handleDraftSave = (title: string, text: string) => {
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
  };

  /**
   * Handle edit save
   * @param title title
   * @param text text
   */
  const handleEditSave = (title: string, text: string) => {
    if (isDraft) {
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
  };

  /**
   * Handle edit cancel
   */
  const handleEditCancel = () => {
    if (isDraft) {
      dispatch(cancelNotebookV2Draft(note.id));
      return;
    }
    setIsEditing(false);
  };

  /**
   * Handle delete confirm
   */
  const handleDeleteConfirm = () => {
    dispatch(
      deleteNotebookV2Entry({
        noteId: note.id,
        // eslint-disable-next-line jsdoc/require-jsdoc
        success: () => setDeleteActive(false),
      })
    );
  };

  const extraActions = (
    <>
      {canEdit && !isEditing && (
        <Dropdown openByHover content={<p>{t("actions.edit")}</p>}>
          <IconButton
            icon="pencil"
            onClick={handleEditClick}
            buttonModifiers={["notebook-item-action"]}
          />
        </Dropdown>
      )}
      {canDelete && !isEditing && (
        <Dropdown openByHover content={<p>{t("actions.remove")}</p>}>
          <IconButton
            icon="trash"
            onClick={() => setDeleteActive(!deleteActive)}
            buttonModifiers={["notebook-item-action"]}
          />
        </Dropdown>
      )}
    </>
  );

  return (
    <NotebookItemShell
      title={getNotebookNoteListTitle(note)}
      bodyHtml={getNotebookNoteBodyHtml(note)}
      open={isDraft || isEditing ? true : open}
      onToggle={() => onToggle(note.id)}
      itemClassName={getNotebookItemClassName(note)}
      editing={isEditing}
      deleting={deleteActive}
      extraActions={extraActions}
      orphaned={isOrphaned}
      titleAdornment={titleAdornment}
      draftClientId={isDraft ? note.id : undefined}
      deleteConfirm={
        <NotebookItemDeleteConfirm
          active={deleteActive}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteActive(false)}
        />
      }
      editPanel={
        <NotebookNoteEditor
          mode={isDraft ? "create" : "edit"}
          initialTitle={getNotebookNoteListTitle(note)}
          initialText={getNotebookNoteBodyHtml(note)}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      }
    />
  );
};

export default NotebookNoteItem;
