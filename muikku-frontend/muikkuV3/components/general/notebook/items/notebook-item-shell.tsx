import * as React from "react";
import AnimateHeight from "react-animate-height";
import CkeditorContentLoader from "~/components/base/ckeditor-loader/content";
import { IconButton } from "../../button";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";

/**
 * NotebookItemShellProps
 */
export interface NotebookItemShellProps {
  noteId?: number;
  active?: boolean;
  onActivate?: () => void;
  title?: string;
  open: boolean;
  onToggle: () => void;
  itemClassName?: string;
  editing?: boolean;
  deleting?: boolean;
  orphaned?: boolean;
  titleAdornment?: React.ReactNode;
  extraActions?: React.ReactNode;
  deleteConfirm?: React.ReactNode;
  editPanel?: React.ReactNode;
  bodyHtml?: string;
  draftClientId?: number;
}

/**
 * Shared notebook row: header, expand/collapse, body or inline editor.
 * @param props props
 * @returns React.ReactNode
 */
const NotebookItemShell = (props: NotebookItemShellProps) => {
  const {
    noteId,
    active = false,
    onActivate,
    title,
    open,
    titleAdornment,
    onToggle,
    itemClassName,
    editing = false,
    deleting = false,
    orphaned = false,
    extraActions,
    editPanel,
    bodyHtml = "",
    draftClientId,
  } = props;
  const { t } = useTranslation("notebook");

  const itemClasses = [
    "notebook__item",
    itemClassName,
    editing ? "state-EDITING" : "",
    orphaned ? "state-ORPHANED" : "",
    active ? "state-ACTIVE" : "",
    deleting ? "state-DELETING" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const showReadBody = !editing && bodyHtml !== undefined;

  return (
    <div
      className={itemClasses}
      data-notebook-item-id={noteId != null ? String(noteId) : undefined}
      data-notebook-draft-id={
        draftClientId != null ? String(draftClientId) : undefined
      }
      onClick={() => onActivate?.()}
    >
      <div className="notebook__item-header">
        <div className="notebook__item-title">
          {titleAdornment}

          {title && <span className="notebook__item-title-text">{title}</span>}
        </div>
        <div className="notebook__item-actions">
          {!editing && (
            <Dropdown
              openByHover
              content={
                open ? (
                  <p>{t("actions.hideContent")}</p>
                ) : (
                  <p>{t("actions.showContent")}</p>
                )
              }
            >
              <IconButton
                icon="arrow-down"
                onClick={onToggle}
                className={open ? "state-OPEN" : ""}
                buttonModifiers={["notebook-item-action", "note-item-content"]}
              />
            </Dropdown>
          )}
          {extraActions}
        </div>
      </div>

      {editing && editPanel ? (
        <div className="notebook__item-editor">{editPanel}</div>
      ) : (
        showReadBody && (
          <AnimateHeight height={open ? "auto" : 60}>
            <article className="notebook__item-body rich-text">
              <CkeditorContentLoader html={bodyHtml} />
            </article>
          </AnimateHeight>
        )
      )}
    </div>
  );
};

export default NotebookItemShell;
