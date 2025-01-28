import * as React from "react";
import { IconButton } from "~/components/general/button";
import Link from "~/components/general/link";
import Dropdown from "~/components/general/dropdown";
import NotesItemEdit from "./notes-item-edit";
import NoteInformationDialog from "./dialogs/note-information-dialog";
import { isOverdue } from "~/helper-functions/dates";
import { useTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";
import {
  Note,
  NoteStatusType,
  UpdateNoteRequest,
  UpdateNoteReceiverRequest,
} from "~/generated/client";
import Avatar from "../avatar";
import { useRecipientsToAvatars } from "./hooks/useRecipientsToAvatars";
/**
 * DropdownItem
 */
interface DropdownItem {
  id: string;
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: any;
}

/**
 * NotesListItemProps
 */
export interface NotesListItemProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  archived: boolean;
  notesItem: Note;
  containerModifier?: string[];
  active?: boolean;
  loggedUserIsCreator?: boolean;
  loggedUserIsOwner?: boolean;
  specificRecipient?: number;
  onArchiveClick?: (notesItemId: number) => void;
  onReturnArchivedClick?: (notesItemId: number) => void;
  onPinNotesItemClick?: (
    noteId: number,
    newReceiverStatus: UpdateNoteReceiverRequest,
    recipientId: number
  ) => void;
  onUpdateNotesItemStatus?: (
    noteId: number,
    newReceiverStatus: UpdateNoteReceiverRequest,
    recipientId: number,
    onSuccess?: () => void
  ) => void;
  onNotesItemSaveUpdateClick?: (
    notesItemId: number,
    updateNoteRequest: UpdateNoteRequest,
    onSuccess?: () => void
  ) => void;
  openInformationToDialog?: boolean;
}

const defaultProps = {
  active: false,
  loggedUserIsCreator: false,
  loggedUserIsOwner: false,
  openInformationToDialog: true,
};

/**
 * NotesListItem
 */
const NotesListItem = React.forwardRef<HTMLDivElement, NotesListItemProps>(
  (props, outerRef) => {
    props = { ...defaultProps, ...props };

    const innerRef = React.useRef<HTMLDivElement>(null);
    const {
      notesItem,
      onArchiveClick,
      onReturnArchivedClick,
      onPinNotesItemClick,
      onUpdateNotesItemStatus,
      onNotesItemSaveUpdateClick,
      loggedUserIsCreator,
      loggedUserIsOwner,
      active,
      archived,
      openInformationToDialog,
      containerModifier,
      specificRecipient,
      ...restProps
    } = props;

    const {
      id,
      title,
      priority,
      creatorName,
      description,
      startDate,
      dueDate,
      recipients,
      multiUserNote,
    } = notesItem;

    const avatars = useRecipientsToAvatars(recipients);
    const { t } = useTranslation("tasks");
    const overdue = isOverdue(dueDate);
    const updatedModifiers = [];
    const recipientId = specificRecipient
      ? specificRecipient
      : recipients[0].recipient;
    const currentRecipient = recipients.find(
      (r) => r.recipient === recipientId
    );

    // Editing is forbidden
    // if the note is multi-user and there is a specific recipient selected
    const editForbidden = !!specificRecipient && multiUserNote;

    React.useImperativeHandle(
      outerRef,
      () => innerRef.current && innerRef.current,
      []
    );

    if (containerModifier && containerModifier.length > 0) {
      updatedModifiers.push(containerModifier);
    }

    /**
     * Handles notesItem pin click
     * @param e mouse event
     */
    const handleNotesItemPinClick = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      e.stopPropagation();

      const newReceiverStatus: UpdateNoteReceiverRequest = {
        ...currentRecipient,
        pinned: !currentRecipient.pinned,
      };
      if (onUpdateNotesItemStatus) {
        onUpdateNotesItemStatus(id, newReceiverStatus, recipientId);
      }
    };

    /**
     * Handles notesItem delete click
     * @param e mouse event
     */
    const handleNotesItemArchiveClick = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      e.stopPropagation();

      if (onArchiveClick) {
        innerRef.current.classList.add("state-DELETE");

        setTimeout(() => {
          onArchiveClick(id);
        }, 250);
      }
    };

    /**
     * Handles notesItem delete click
     * @param e mouse event
     */
    const handleNotesItemReturnArchiveClick = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      e.stopPropagation();

      if (onReturnArchivedClick) {
        innerRef.current.classList.add("state-DELETE");

        setTimeout(() => {
          onReturnArchivedClick(id);
        }, 250);
      }
    };

    /**
     * handleUpdateNotesItemStatusClick
     * @param newStatus newStatus
     */
    const handleUpdateNotesItemStatusClick = (newStatus: NoteStatusType) => {
      const newReceiverStatus: UpdateNoteReceiverRequest = {
        ...currentRecipient,
        status: newStatus,
      };
      if (onUpdateNotesItemStatus) {
        onUpdateNotesItemStatus(id, newReceiverStatus, recipientId);

        if (innerRef.current) {
          innerRef.current.focus();
        }
      }
    };

    if (innerRef && innerRef.current && innerRef.current.classList) {
      if (active) {
        innerRef.current.classList.add("state-ACTIVE");
      } else {
        innerRef.current.classList.contains("state-ACTIVE") &&
          innerRef.current.classList.remove("state-ACTIVE");
      }
    }

    if (priority) {
      switch (priority) {
        case "HIGH":
          updatedModifiers.push("high");
          break;

        case "NORMAL":
          updatedModifiers.push("normal");
          break;

        case "LOW":
          updatedModifiers.push("low");
          break;

        default:
          break;
      }
    }

    if (overdue && currentRecipient?.status !== "APPROVED") {
      updatedModifiers.push("overdue");
    }

    /**
     * createHtmlMarkup
     * @param htmlString string that contains html
     */
    const createHtmlMarkup = (htmlString: string) => ({
      __html: htmlString,
    });

    /**
     * Renders dates. Date or date range string
     *
     * @returns JSX.Element
     */
    const renderDates = () => {
      let dateOrDateRange = undefined;

      if (startDate && dueDate) {
        dateOrDateRange = (
          <span className="notes__item-dates-date-range">
            <span className="notes__item-dates-text">{t("labels.active")}</span>
            <span className="notes__item-dates-date">
              {localize.date(startDate)} - {localize.date(dueDate)}
            </span>
          </span>
        );
      } else if (startDate) {
        dateOrDateRange = (
          <span className="notes__item-dates-date-range">
            <span className="notes__item-dates-text">{t("labels.active")}</span>
            <span className="notes__item-dates-date">
              {localize.date(startDate)}
            </span>
            <span className="notes__item-dates-indicator icon-long-arrow-right"></span>
          </span>
        );
      } else if (dueDate) {
        dateOrDateRange = (
          <span className="notes__item-dates-date-range">
            <span className="notes__item-dates-text">{t("labels.active")}</span>
            <span className="notes__item-dates-indicator icon-long-arrow-right"></span>
            <span className="notes__item-dates-date">
              {localize.date(dueDate)}
            </span>
          </span>
        );
      }

      return dateOrDateRange ? dateOrDateRange : null;
    };

    /**
     * renderStatus
     */
    const renderStatus = () => {
      const statuses: JSX.Element[] = [];
      const { status } = currentRecipient;
      if (overdue && status !== "APPROVED") {
        statuses.push(
          <div
            key="note-overdue"
            className="notes__item-status notes__item-status--overdue"
          >
            {t("labels.status", { context: "overdue" })}
          </div>
        );
      }

      switch (status) {
        case "ONGOING":
          statuses.push(
            <div
              key="note-ongoing"
              className="notes__item-status notes__item-status--ongoing"
            >
              {t("labels.status", { context: "ongoing" })}
            </div>
          );
          break;
        case "APPROVAL_PENDING":
          statuses.push(
            <div
              key="note-pending"
              className="notes__item-status notes__item-status--pending"
            >
              {t("labels.status", { context: "pending" })}
            </div>
          );
          break;
        case "APPROVED":
          statuses.push(
            <div
              key="note-approved"
              className="notes__item-status notes__item-status--done"
            >
              <span className="notes__item-status-indicator icon-check"></span>
              {t("labels.status", { context: "done" })}
            </div>
          );
          break;
        default:
          break;
      }

      return statuses;
    };

    /**
     * renderUpdateStatus
     */
    const renderUpdateStatus = () => {
      let items: DropdownItem[] = [];

      if (archived) {
        return;
      }

      if (loggedUserIsOwner) {
        const { status } = currentRecipient;
        if (status === "ONGOING") {
          items = [
            {
              id: "task-item-send",
              text: t("actions.send"),
              // eslint-disable-next-line jsdoc/require-jsdoc
              onClick: () =>
                handleUpdateNotesItemStatusClick("APPROVAL_PENDING"),
            },
          ];

          if (loggedUserIsCreator) {
            items = [
              {
                id: "task-item-done",
                text: t("actions.done"),
                // eslint-disable-next-line jsdoc/require-jsdoc
                onClick: () => handleUpdateNotesItemStatusClick("APPROVED"),
              },
            ];
          }
        }
        if (status === "APPROVAL_PENDING") {
          items = [
            {
              id: "task-item-cancel",
              text: t("actions.cancel"),
              // eslint-disable-next-line jsdoc/require-jsdoc
              onClick: () => handleUpdateNotesItemStatusClick("ONGOING"),
            },
          ];
        }

        if (status === "APPROVED") {
          items = [
            {
              id: "task-item-incomplete",
              text: t("actions.incomplete"),
              // eslint-disable-next-line jsdoc/require-jsdoc
              onClick: () => handleUpdateNotesItemStatusClick("ONGOING"),
            },
          ];
        }
      } else if (loggedUserIsCreator && !loggedUserIsOwner) {
        // This must display all of the recipients statuses if this is not a selected recipient
        const { status } = currentRecipient;

        if (status === "ONGOING") {
          return;
        }
        if (status === "APPROVAL_PENDING") {
          items = [
            {
              id: "task-item-approve",
              text: t("actions.approve"),
              // eslint-disable-next-line jsdoc/require-jsdoc
              onClick: () => handleUpdateNotesItemStatusClick("APPROVED"),
            },
            {
              id: "task-item-incomplete",
              text: t("actions.incomplete"),
              // eslint-disable-next-line jsdoc/require-jsdoc
              onClick: () => handleUpdateNotesItemStatusClick("ONGOING"),
            },
          ];
        }
        if (status === "APPROVED") {
          items = [
            {
              id: "task-item-incomplete",
              text: t("actions.incomplete"),
              // eslint-disable-next-line jsdoc/require-jsdoc
              onClick: () =>
                handleUpdateNotesItemStatusClick("APPROVAL_PENDING"),
            },
          ];
        }
      }

      /**
       * Renders item
       * @param item item
       * @param onClose onClose
       */
      const renderItem = (item: DropdownItem, onClose: () => void) => (
        <Link
          key={item.id}
          className={`link link--full link--tasks-dropdown`}
          onClick={() => {
            onClose();
            item.onClick();
          }}
        >
          <span>{item.text}</span>
        </Link>
      );

      return (
        <Dropdown
          items={items.map(
            (item) => (closeDropdown: () => void) =>
              renderItem(item, closeDropdown)
          )}
        >
          <div tabIndex={0}>
            <IconButton
              icon="more_vert"
              buttonModifiers={["notes-action", "notes-more"]}
            />
          </div>
        </Dropdown>
      );
    };

    return (
      <div
        {...restProps}
        ref={innerRef}
        className={`notes__item ${
          updatedModifiers.length
            ? updatedModifiers.map((m) => `notes__item--${m}`).join(" ")
            : ""
        }`}
      >
        <div className="notes__item-hero">
          {loggedUserIsCreator && (
            <div className="notes__item-decoration">
              <span
                className={`
                  "notes__item-icon" + ${
                    multiUserNote ? "icon-users" : "icon-user"
                  }`}
              />
            </div>
          )}
          <div className="notes__item-actions">
            {loggedUserIsCreator &&
              onNotesItemSaveUpdateClick &&
              !editForbidden && (
                <NotesItemEdit
                  recipientId={specificRecipient}
                  selectedNotesItem={notesItem}
                  onNotesItemSaveUpdateClick={onNotesItemSaveUpdateClick}
                >
                  <IconButton
                    icon="pencil"
                    buttonModifiers={["notes-action", "notes-edit"]}
                    aria-label={t("wcag.editNote")}
                  />
                </NotesItemEdit>
              )}

            {loggedUserIsOwner && onPinNotesItemClick && (
              <IconButton
                onClick={handleNotesItemPinClick}
                icon={currentRecipient.pinned ? "star-full" : "star-empty"}
                buttonModifiers={["notes-action", "notes-pin"]}
              />
            )}

            {loggedUserIsCreator && archived && onReturnArchivedClick && (
              <IconButton
                onClick={handleNotesItemReturnArchiveClick}
                icon="undo"
                buttonModifiers={["notes-action", "notes-unarchive"]}
                aria-label={t("wcag.archiveUndo")}
              />
            )}

            {loggedUserIsCreator && !archived && onArchiveClick && (
              <IconButton
                onClick={handleNotesItemArchiveClick}
                icon="trash"
                buttonModifiers={["notes-action", "notes-archive"]}
                aria-label={t("wcag.archive")}
              />
            )}
            {specificRecipient && renderUpdateStatus()}
          </div>
        </div>

        <div className="notes__item-dates">{renderDates()}</div>
        <div
          className={`notes__item-header ${
            openInformationToDialog ? "notes__item-header--open-details" : ""
          }`}
        >
          {openInformationToDialog ? (
            <NoteInformationDialog
              notesItem={notesItem}
              archived={archived}
              loggedUserIsCreator={loggedUserIsCreator}
              loggedUserIsOwner={loggedUserIsOwner}
              onPinNotesItemClick={onPinNotesItemClick}
              onArchiveClick={onArchiveClick}
              onUpdateNotesItemStatus={onUpdateNotesItemStatus}
              onReturnArchivedClick={onReturnArchivedClick}
              onNotesItemSaveUpdateClick={onNotesItemSaveUpdateClick}
            >
              <span
                role="button"
                aria-label={t("wcag.showDetails")}
                tabIndex={0}
              >
                {title}
              </span>
            </NoteInformationDialog>
          ) : (
            <span>{title}</span>
          )}
        </div>

        {description ? (
          <div
            className="notes__item-body"
            dangerouslySetInnerHTML={createHtmlMarkup(description)}
          />
        ) : null}
        {!specificRecipient && (
          <div className="notes__item-recipients">
            {avatars.map((avatar) => (
              <Avatar key={avatar.id} {...avatar} size="xsmall"></Avatar>
            ))}
          </div>
        )}
        <div className="notes__item-author">
          {!loggedUserIsCreator ? creatorName : null}
        </div>
        <div className="notes__item-footer">
          {specificRecipient && renderStatus()}
        </div>
      </div>
    );
  }
);

NotesListItem.displayName = "NotesListItem";

export default React.memo(NotesListItem);
