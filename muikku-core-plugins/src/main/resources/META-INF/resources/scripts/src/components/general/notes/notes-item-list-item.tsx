import * as React from "react";
import {
  NotesItemRead,
  NotesItemUpdate,
  NotesItemStatus,
} from "~/@types/notes";
import Button, { ButtonPill, IconButton } from "~/components/general/button";
import * as moment from "moment";
import Dropdown from "~/components/general/dropdown";
import NotesItemEdit from "./notes-item-edit";

/**
 * NotesListItemProps
 */
interface NotesListItemProps {
  archived: boolean;
  notesItem: NotesItemRead;
  active?: boolean;
  loggedUserIsCreator?: boolean;
  loggedUserIsOwner?: boolean;
  onArchiveClick?: (notesItemId: number) => void;
  onReturnArchivedClick?: (notesItemId: number) => void;
  onPinNotesItemClick?: (
    notesItemId: number,
    notesItem: NotesItemUpdate
  ) => void;
  onUpdateNotesItemStatus?: (
    notesItemId: number,
    newStatus: NotesItemStatus
  ) => void;
  onNotesItemSaveUpdateClick?: (
    notesItemId: number,
    updatedNotesItem: NotesItemUpdate,
    onSuccess?: () => void
  ) => void;
}

const defaultProps = {
  active: false,
  loggedUserIsCreator: false,
  loggedUserIsOwner: false,
};

/**
 * NotesListItem
 */
const NotesListItem = React.forwardRef<HTMLDivElement, NotesListItemProps>(
  (props, ref) => {
    props = { ...defaultProps, ...props };

    const myRef = React.useRef<HTMLDivElement>(null);
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
    } = props;

    const {
      id,
      title,
      priority,
      creatorName,
      description,
      pinned,
      startDate,
      dueDate,
      status,
    } = notesItem;

    const updatedModifiers = [];

    /**
     * Handles notesItem pin click
     * @param e mouse event
     */
    const handleNotesItemPinClick = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      e.stopPropagation();

      onPinNotesItemClick(id, notesItem);
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
        myRef.current.classList.add("state-DELETE");

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
        myRef.current.classList.add("state-DELETE");

        setTimeout(() => {
          onReturnArchivedClick(id);
        }, 250);
      }
    };

    /**
     * handleUpdateNotesItemStatusClick
     * @param newStatus newStatus
     */
    const handleUpdateNotesItemStatusClick =
      (newStatus: NotesItemStatus) =>
      (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.stopPropagation();

        if (onUpdateNotesItemStatus) {
          onUpdateNotesItemStatus(id, newStatus);
        }
      };

    if (myRef && myRef.current && myRef.current.classList) {
      if (active) {
        myRef.current.classList.add("state-ACTIVE");
      } else {
        myRef.current.classList.contains("state-ACTIVE") &&
          myRef.current.classList.remove("state-ACTIVE");
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
            <span className="notes__item-dates-text">Voimassa</span>
            <span className="notes__item-dates-date">
              {moment(startDate).format("l")} - {moment(dueDate).format("l")}
            </span>
          </span>
        );
      } else if (startDate) {
        dateOrDateRange = (
          <span className="notes__item-dates-date-range">
            <span className="notes__item-dates-text">Voimassa</span>
            <span className="notes__item-dates-date">
              {moment(startDate).format("l")}
            </span>
            <span className="notes__item-dates-indicator icon-long-arrow-right"></span>
          </span>
        );
      } else if (dueDate) {
        dateOrDateRange = (
          <span className="notes__item-dates-date-range">
            <span className="notes__item-dates-text">Voimassa</span>
            <span className="notes__item-dates-indicator icon-long-arrow-right"></span>
            <span className="notes__item-dates-date">
              {moment(dueDate).format("l")}
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
      switch (status) {
        case NotesItemStatus.ONGOING:
          return <ButtonPill />;

        case NotesItemStatus.APPROVAL_PENDING:
          return <ButtonPill icon="assessment-pending" />;

        case NotesItemStatus.APPROVED:
          return <ButtonPill />;

        default:
          break;
      }
    };

    /**
     * renderUpdateStatus
     */
    const renderUpdateStatus = () => {
      let content;

      if (archived) {
        return;
      }

      if (loggedUserIsOwner) {
        if (status === NotesItemStatus.ONGOING) {
          content = (
            <div>
              <Button
                onClick={handleUpdateNotesItemStatusClick(
                  NotesItemStatus.APPROVAL_PENDING
                )}
              >
                Pyydä arviointia
              </Button>
            </div>
          );
          if (loggedUserIsCreator) {
            content = (
              <div>
                <Button
                  onClick={handleUpdateNotesItemStatusClick(
                    NotesItemStatus.APPROVED
                  )}
                >
                  Merkkaa tehdyksi
                </Button>
              </div>
            );
          }
        }
        if (status === NotesItemStatus.APPROVAL_PENDING) {
          content = (
            <div>
              <Button
                onClick={handleUpdateNotesItemStatusClick(
                  NotesItemStatus.APPROVAL_PENDING
                )}
              >
                Peruuta pyyntö
              </Button>
            </div>
          );
        }

        if (status === NotesItemStatus.APPROVED) {
          content = (
            <div>
              <Button
                onClick={handleUpdateNotesItemStatusClick(
                  NotesItemStatus.ONGOING
                )}
              >
                Kesken?
              </Button>
            </div>
          );
        }
      } else if (loggedUserIsCreator && !loggedUserIsOwner) {
        if (status === NotesItemStatus.ONGOING) {
          return;
        }
        if (status === NotesItemStatus.APPROVAL_PENDING) {
          content = (
            <div>
              <Button
                onClick={handleUpdateNotesItemStatusClick(
                  NotesItemStatus.APPROVED
                )}
              >
                Hyväksy
              </Button>
              <Button
                onClick={handleUpdateNotesItemStatusClick(
                  NotesItemStatus.ONGOING
                )}
              >
                Peruuta pyyntö
              </Button>
            </div>
          );
        }
        if (status === NotesItemStatus.APPROVED) {
          content = (
            <div>
              <Button
                onClick={handleUpdateNotesItemStatusClick(
                  NotesItemStatus.APPROVAL_PENDING
                )}
              >
                Peruuta arviointi
              </Button>
            </div>
          );
        }
      }

      return (
        <Dropdown content={content}>
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
        ref={myRef}
        className={`notes__item ${
          updatedModifiers.length
            ? updatedModifiers.map((m) => `notes__item--${m}`).join(" ")
            : ""
        }`}
      >
        <div className="notes__item-actions">
          {loggedUserIsCreator && onNotesItemSaveUpdateClick && (
            <NotesItemEdit
              selectedNotesItem={notesItem}
              onNotesItemSaveUpdateClick={onNotesItemSaveUpdateClick}
            >
              <IconButton
                icon="pencil"
                buttonModifiers={["notes-action", "notes-edit"]}
              />
            </NotesItemEdit>
          )}

          {loggedUserIsOwner && onPinNotesItemClick && (
            <IconButton
              onClick={handleNotesItemPinClick}
              icon={notesItem.pinned ? "star-full" : "star-empty"}
              buttonModifiers={["notes-action", "notes-pin"]}
            />
          )}

          {loggedUserIsCreator && onReturnArchivedClick && (
            <IconButton
              onClick={handleNotesItemReturnArchiveClick}
              icon="undo"
              buttonModifiers={["notes-action", "notes-unarchive"]}
            />
          )}

          {loggedUserIsCreator && !archived && onArchiveClick && (
            <IconButton
              onClick={handleNotesItemArchiveClick}
              icon="trash"
              buttonModifiers={["notes-action", "notes-archive"]}
            />
          )}

          {renderUpdateStatus()}
        </div>

        <div className="notes__item-dates">{renderDates()}</div>
        <div className="notes__item-header">{title}</div>
        {description ? (
          <div className="notes__item-body">{description}</div>
        ) : null}
        <div className="notes__item-status">{renderStatus()}</div>
        <div className="notes__item-author">
          {loggedUserIsCreator ? "you made this!" : creatorName}
        </div>
      </div>
    );
  }
);

NotesListItem.displayName = "JournalListItem";

export default React.memo(NotesListItem);
