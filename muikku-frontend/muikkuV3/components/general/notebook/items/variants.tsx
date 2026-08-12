import * as React from "react";
import { IconButton } from "../../button";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";
import {
  getNotebookItemClassName,
  getNotebookNoteBodyHtml,
  getNotebookNoteListTitle,
} from "../helpers/notebook-display";
import { useNotebookEditableNoteItem } from "../hooks/useNotebookEditableNoteItem";
import NotebookItemShell from "./notebook-item-shell";
import {
  MaterialNotebookNote,
  WorkspaceNotebookNote,
} from "../helpers/notebook-layout";
import { NotebookNoteItemProps } from "./notebook-note-item";
import { NotebookNote, NotebookNoteType } from "~/generated/client";
import NotebookItemOrphanBadge from "./notebook-item-orphan-badge";
import { resolveNotebookContextOrphanStatus } from "../helpers/notebook-annotation-status";
import { useNotebookNoteItemCore } from "../hooks/useNotebookNoteItemCore";
import { useNotebookContextHighlightUpgrade } from "../hooks/useNotebookContextHighlightUpgrade";
import NotebookNoteEditor from "../notebook-note-editor";

export type NotebookWorkspaceNoteItemProps = Omit<
  NotebookNoteItemProps,
  "note"
> & {
  note: WorkspaceNotebookNote;
};

/**
 * NotebookWorkspaceNoteItem
 * @param props props
 * @returns NotebookWorkspaceNoteItem
 */
export const NotebookWorkspaceNoteItem = (
  props: NotebookWorkspaceNoteItemProps
) => {
  const { note, open, onToggle, isDraft } = props;
  const { t } = useTranslation("notebook");

  const item = useNotebookEditableNoteItem({
    note,
    open,
    isDraft,
  });

  const extraActions = (
    <>
      {item.canEdit && !item.isEditing && (
        <Dropdown openByHover content={<p>{t("actions.edit")}</p>}>
          <IconButton
            icon="pencil"
            onClick={item.handleEditClick}
            buttonModifiers={["notebook-item-action"]}
          />
        </Dropdown>
      )}
      {item.canDelete && !item.isEditing && (
        <Dropdown
          openByHover
          content={<p>{t("actions.remove", { context: "note" })}</p>}
        >
          <IconButton
            icon="trash"
            onClick={item.toggleDelete}
            buttonModifiers={["notebook-item-action"]}
          />
        </Dropdown>
      )}
    </>
  );

  return (
    <NotebookItemShell
      noteId={note.id}
      active={item.activeItemId === note.id}
      onActivate={item.handleActivate}
      title={item.title}
      bodyHtml={item.bodyHtml}
      open={item.open}
      onToggle={() => onToggle(note.id)}
      itemClassName={getNotebookItemClassName(note)}
      editing={item.isEditing}
      deleting={item.deleteActive}
      extraActions={extraActions}
      draftClientId={item.isDraft ? note.id : undefined}
      editPanel={
        <NotebookNoteEditor
          mode={item.isDraft ? "create" : "edit"}
          initialTitle={item.title}
          initialText={item.bodyHtml}
          onSave={item.handleEditSave}
          onCancel={item.handleEditCancel}
        />
      }
    />
  );
};

export type NotebookMaterialNoteItemProps = Omit<
  NotebookNoteItemProps,
  "note"
> & {
  note: MaterialNotebookNote;
};

/**
 * NotebookMaterialNoteItem
 * @param props props
 * @returns NotebookWorkspaceNoteItem
 */
export const NotebookMaterialNoteItem = (
  props: NotebookMaterialNoteItemProps
) => {
  const { note, open, onToggle, isDraft } = props;
  const { t } = useTranslation("notebook");

  const item = useNotebookEditableNoteItem({
    note,
    open,
    isDraft,
  });

  const extraActions = (
    <>
      {item.canEdit && !item.isEditing && (
        <Dropdown openByHover content={<p>{t("actions.edit")}</p>}>
          <IconButton
            icon="pencil"
            onClick={item.handleEditClick}
            buttonModifiers={["notebook-item-action"]}
          />
        </Dropdown>
      )}
      {item.canDelete && !item.isEditing && (
        <Dropdown
          openByHover
          content={<p>{t("actions.remove", { context: "note" })}</p>}
        >
          <IconButton
            icon="trash"
            onClick={item.toggleDelete}
            buttonModifiers={["notebook-item-action"]}
          />
        </Dropdown>
      )}
    </>
  );

  return (
    <NotebookItemShell
      noteId={note.id}
      active={item.activeItemId === note.id}
      onActivate={item.handleActivate}
      title={item.title}
      bodyHtml={item.bodyHtml}
      open={item.open}
      onToggle={() => onToggle(note.id)}
      itemClassName={getNotebookItemClassName(note)}
      deleting={item.deleteActive}
      extraActions={extraActions}
      draftClientId={item.isDraft ? note.id : undefined}
    />
  );
};

export type NotebookContextNoteItemProps = Omit<
  NotebookNoteItemProps,
  "note"
> & {
  note: Extract<
    NotebookNote,
    { type: typeof NotebookNoteType.WorkspaceMaterialContextNote }
  >;
};

/**
 * NotebookContextNoteItem
 * @param props props
 * @returns NotebookContextNoteItem
 */
export const NotebookContextNoteItem = (
  props: NotebookContextNoteItemProps
) => {
  const { note, open, onToggle, isDraft, materialHtml } = props;
  const { t } = useTranslation("notebook");

  const item = useNotebookEditableNoteItem({
    note,
    open,
    isDraft,
  });

  const orphanStatus = React.useMemo(
    () =>
      item.isDraft
        ? null
        : resolveNotebookContextOrphanStatus(note, materialHtml),
    [item.isDraft, materialHtml, note]
  );
  const titleAdornment = orphanStatus?.isOrphaned ? (
    <NotebookItemOrphanBadge reason={orphanStatus.reason ?? null} />
  ) : null;

  const extraActions = (
    <>
      {item.canEdit && !item.isEditing && (
        <Dropdown openByHover content={<p>{t("actions.edit")}</p>}>
          <IconButton
            icon="pencil"
            onClick={item.handleEditClick}
            buttonModifiers={["notebook-item-action"]}
          />
        </Dropdown>
      )}
      {item.canDelete && !item.isEditing && (
        <Dropdown
          openByHover
          content={<p>{t("actions.remove", { context: "note" })}</p>}
        >
          <IconButton
            icon="trash"
            onClick={item.toggleDelete}
            buttonModifiers={["notebook-item-action"]}
          />
        </Dropdown>
      )}
    </>
  );

  return (
    <NotebookItemShell
      noteId={note.id}
      active={item.activeItemId === note.id}
      orphaned={orphanStatus?.isOrphaned ?? false}
      onActivate={item.handleActivate}
      title={item.title}
      titleAdornment={titleAdornment}
      bodyHtml={item.bodyHtml}
      open={item.open}
      onToggle={() => onToggle(note.id)}
      itemClassName={getNotebookItemClassName(note)}
      deleting={item.deleteActive}
      extraActions={extraActions}
      draftClientId={item.isDraft ? note.id : undefined}
    />
  );
};

export type NotebookContextHighlightItemProps = Omit<
  NotebookNoteItemProps,
  "note"
> & {
  note: Extract<
    NotebookNote,
    { type: typeof NotebookNoteType.WorkspaceMaterialContextHighlight }
  >;
};

/**
 * NotebookContextHighlightItem
 * @param props props
 * @returns NotebookContextHighlightItem
 */
export const NotebookContextHighlightItem = (
  props: NotebookContextHighlightItemProps
) => {
  const { note, open, onToggle, materialHtml, isDraft } = props;
  const { t } = useTranslation("notebook");

  const item = useNotebookNoteItemCore({ note, isDraft });
  const upgrade = useNotebookContextHighlightUpgrade({ note });

  const orphanStatus = React.useMemo(
    () =>
      item.isDraft
        ? null
        : resolveNotebookContextOrphanStatus(note, materialHtml),
    [item.isDraft, materialHtml, note]
  );

  const titleAdornment = orphanStatus?.isOrphaned ? (
    <NotebookItemOrphanBadge reason={orphanStatus.reason ?? null} />
  ) : null;

  const extraActions = (
    <>
      {!upgrade.isUpgrading && !item.deleteActive && (
        <Dropdown openByHover content={<p>{t("actions.upgrade")}</p>}>
          <IconButton
            icon="plus"
            aria-label={t("actions.upgrade")}
            onClick={() => {
              item.cancelDelete();
              upgrade.beginUpgrade();
            }}
            buttonModifiers={["notebook-item-action"]}
          />
        </Dropdown>
      )}
      {item.canDelete && !upgrade.isUpgrading && (
        <Dropdown
          openByHover
          content={<p>{t("actions.remove", { context: "highlight" })}</p>}
        >
          <IconButton
            icon="trash"
            onClick={item.toggleDelete}
            buttonModifiers={["notebook-item-action"]}
          />
        </Dropdown>
      )}
    </>
  );
  return (
    <NotebookItemShell
      noteId={note.id}
      active={item.activeItemId === note.id}
      onActivate={item.handleActivate}
      title={getNotebookNoteListTitle(note)}
      bodyHtml={getNotebookNoteBodyHtml(note)}
      open={open}
      onToggle={() => onToggle(note.id)}
      itemClassName={getNotebookItemClassName(note)}
      editing={upgrade.isUpgrading}
      extraActions={extraActions}
      orphaned={orphanStatus?.isOrphaned ?? false}
      titleAdornment={titleAdornment}
    />
  );
};
