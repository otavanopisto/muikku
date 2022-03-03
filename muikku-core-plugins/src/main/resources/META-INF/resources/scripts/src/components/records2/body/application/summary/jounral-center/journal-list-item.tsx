import * as React from "react";
import {
  JournalNoteRead,
  JournalNoteUpdate,
  JournalStatusType,
} from "~/@types/journal-center";
import Button, { ButtonPill, IconButton } from "~/components/general/button";
import * as moment from "moment";
import Dropdown from "~/components/general/dropdown";

/**
 * JournalListProps
 */
interface JournalListItemProps {
  archived: boolean;
  journal: JournalNoteRead;
  active?: boolean;
  loggedUserIsCreator?: boolean;
  loggedUserIsOwner?: boolean;
  onArchiveClick?: (journalId: number) => void;
  onReturnArchivedClick?: (journalId: number) => void;
  onEditClick?: (journalId: number) => void;
  onPinJournalClick?: (journalId: number, journal: JournalNoteUpdate) => void;
  onJournalClick?: (journalId: number) => void;
  onUpdateJournalStatus?: (
    journalId: number,
    newStatus: JournalStatusType
  ) => void;
}

const defaultProps = {
  active: false,
  loggedUserIsCreator: false,
  loggedUserIsOwner: false,
};

/**
 * JournalListItem
 */
const JournalListItem = React.forwardRef<HTMLDivElement, JournalListItemProps>(
  (props, ref) => {
    props = { ...defaultProps, ...props };

    const myRef = React.useRef<HTMLDivElement>(null);
    const {
      journal,
      onJournalClick,
      onEditClick,
      onArchiveClick,
      onReturnArchivedClick,
      onPinJournalClick,
      onUpdateJournalStatus,
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
    } = journal;

    const updatedModifiers = [];

    /**
     * Handles journal click
     * @param journalId journalId
     */
    const handleJournalClick =
      (journalId: number) =>
      (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        onJournalClick(journalId);
      };

    /**
     * Handles journal click to open it in edit mode
     * @param journalId journalId
     */
    const handleJournalOpenInEditModeClick =
      (journalId: number) =>
      (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.stopPropagation();
        onEditClick(journalId);
      };

    /**
     * Handles journal pin click
     * @param e mouse event
     */
    const handleJournalPinClick = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      e.stopPropagation();

      onPinJournalClick(id, journal);
    };

    /**
     * Handles journal delete click
     * @param e mouse event
     */
    const handleJournalArchiveClick = (
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
     * Handles journal delete click
     * @param e mouse event
     */
    const handleJournalReturnArchiveClick = (
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
     * handleUpdateJournalStatusClick
     * @param newStatus newStatus
     */
    const handleUpdateJournalStatusClick =
      (newStatus: JournalStatusType) =>
      (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.stopPropagation();

        if (onUpdateJournalStatus) {
          onUpdateJournalStatus(id, newStatus);
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
        dateOrDateRange = `Voimassa aikavälillä ${moment(startDate).format(
          "l"
        )} - ${moment(dueDate).format("l")}`;
      } else if (startDate) {
        dateOrDateRange = `Voimassa alkaen ${moment(startDate).format("l")}`;
      } else if (dueDate) {
        dateOrDateRange = `Voimassa ${moment(dueDate).format("l")}`;
      }

      return dateOrDateRange ? <div>{dateOrDateRange}</div> : null;
    };

    /**
     * renderStatus
     */
    const renderStatus = () => {
      switch (status) {
        case JournalStatusType.ONGOING:
          return (
            <ButtonPill style={{ backgroundColor: "grey" }} icon="profile" />
          );

        case JournalStatusType.APPROVAL_PENDING:
          return (
            <ButtonPill
              style={{ backgroundColor: "orange" }}
              icon="assessment-pending"
            />
          );

        case JournalStatusType.APPROVED:
          return (
            <ButtonPill style={{ backgroundColor: "green" }} icon="check" />
          );

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
        if (status === JournalStatusType.ONGOING) {
          content = (
            <div>
              <Button
                onClick={handleUpdateJournalStatusClick(
                  JournalStatusType.APPROVAL_PENDING
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
                  onClick={handleUpdateJournalStatusClick(
                    JournalStatusType.APPROVED
                  )}
                >
                  Merkkaa tehdyksi
                </Button>
              </div>
            );
          }
        }
        if (status === JournalStatusType.APPROVAL_PENDING) {
          content = (
            <div>
              <Button
                onClick={handleUpdateJournalStatusClick(
                  JournalStatusType.APPROVAL_PENDING
                )}
              >
                Peruuta pyyntö
              </Button>
            </div>
          );
        }

        if (status === JournalStatusType.APPROVED) {
          content = (
            <div>
              <Button
                onClick={handleUpdateJournalStatusClick(
                  JournalStatusType.ONGOING
                )}
              >
                Kesken?
              </Button>
            </div>
          );
        }
      } else if (loggedUserIsCreator && !loggedUserIsOwner) {
        if (status === JournalStatusType.ONGOING) {
          return;
        }
        if (status === JournalStatusType.APPROVAL_PENDING) {
          content = (
            <div>
              <Button
                onClick={handleUpdateJournalStatusClick(
                  JournalStatusType.APPROVED
                )}
              >
                Hyväksy
              </Button>
              <Button
                onClick={handleUpdateJournalStatusClick(
                  JournalStatusType.ONGOING
                )}
              >
                Peruuta pyyntö
              </Button>
            </div>
          );
        }
        if (status === JournalStatusType.APPROVED) {
          content = (
            <div>
              <Button
                onClick={handleUpdateJournalStatusClick(
                  JournalStatusType.APPROVAL_PENDING
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
            <IconButton icon="cogs" />
          </div>
        </Dropdown>
      );
    };

    return (
      <div ref={ref} style={{ width: "100%" }} onClick={handleJournalClick(id)}>
        <div
          ref={myRef}
          className={`journal-list-item-content ${
            updatedModifiers.length
              ? updatedModifiers
                  .map((m) => `journal-list-item-content--${m}`)
                  .join(" ")
              : ""
          }`}
        >
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="block-edit" style={{ margin: "0 10px" }}>
                <IconButton icon="envelope" buttonModifiers="journal-central" />
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                paddingRight: "10px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexGrow: 1,
                  justifyContent: "flex-end",
                  top: 0,
                  right: 0,
                }}
              >
                <div style={{ display: "flex" }}>
                  {loggedUserIsCreator && onEditClick && (
                    <IconButton
                      onClick={handleJournalOpenInEditModeClick(id)}
                      icon="pencil"
                    />
                  )}

                  {loggedUserIsOwner && onPinJournalClick && (
                    <IconButton
                      style={{ backgroundColor: pinned && "blue" }}
                      onClick={handleJournalPinClick}
                      icon="pin"
                    />
                  )}

                  {loggedUserIsCreator && onReturnArchivedClick && (
                    <IconButton
                      onClick={handleJournalReturnArchiveClick}
                      icon="books"
                    />
                  )}

                  {loggedUserIsCreator && !archived && onArchiveClick && (
                    <IconButton
                      onClick={handleJournalArchiveClick}
                      icon="trash"
                    />
                  )}

                  {renderUpdateStatus()}
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexGrow: 1,
                  alignItems: "center",
                }}
              >
                <div
                  className="block-data"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "0 5px",
                    }}
                  >
                    <div className="block-data-header">
                      <h3
                        style={{
                          marginRight: "5px",
                          whiteSpace: "nowrap",
                          width: "150px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          margin: "5px 0",
                        }}
                      >
                        {title}
                      </h3>
                      {renderDates()}
                    </div>
                    {description ? (
                      <div
                        className="block-data-text"
                        style={{
                          whiteSpace: "nowrap",
                          width: "150px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          margin: "5px 0",
                          fontStyle: "italic",
                        }}
                      >
                        {description}
                      </div>
                    ) : null}
                  </div>

                  {renderStatus()}
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexGrow: 1,
                  justifyContent: "end",
                  alignItems: "end",
                  padding: "5px 0",
                  fontStyle: "italic",
                  bottom: 0,
                  right: 0,
                }}
              >
                - {loggedUserIsCreator ? "Minä" : creatorName}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

JournalListItem.displayName = "JournalListItem";

export default JournalListItem;
