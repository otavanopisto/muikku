import * as React from "react";
import { JournalNoteRead, JournalNoteUpdate } from "~/@types/journal-center";
import { IconButton } from "~/components/general/button";
import * as moment from "moment";

/**
 * JournalListProps
 */
interface JournalListItemProps {
  journal: JournalNoteRead;
  active?: boolean;
  loggedUserIsOwner?: boolean;
  onDeleteClick?: (journalId: number) => void;
  onEditClick?: (journalId: number) => void;
  onPinJournalClick: (journalId: number, journal: JournalNoteUpdate) => void;
  onJournalClick?: (journalId: number) => void;
}

const defaultProps = {
  active: false,
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
      onDeleteClick,
      onPinJournalClick,
      loggedUserIsOwner,
      active,
    } = props;

    const { id, title, priority, creatorName, description, pinned, dueDate } =
      journal;

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
    const handleJournalDeleteClick = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      e.stopPropagation();

      if (onDeleteClick) {
        myRef.current.classList.add("state-DELETE");

        setTimeout(() => {
          onDeleteClick(id);
        }, 250);
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
          <div
            style={{
              width: "100%",
              display: "flex",
              flexGrow: 1,
              justifyContent: "flex-end",
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <div>
              {loggedUserIsOwner && onEditClick ? (
                <IconButton
                  onClick={handleJournalOpenInEditModeClick(id)}
                  icon="pencil"
                />
              ) : null}

              <IconButton
                style={{ backgroundColor: pinned && "blue" }}
                onClick={handleJournalPinClick}
                icon="pin"
              />

              {loggedUserIsOwner && onDeleteClick ? (
                <IconButton onClick={handleJournalDeleteClick} icon="trash" />
              ) : null}
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
            <div className="block-edit" style={{ margin: "0 10px" }}>
              <IconButton icon="envelope" buttonModifiers="journal-central" />
            </div>
            <div
              className="block-data"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                className="block-data-header"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <h3
                  style={{
                    marginRight: "5px",
                    whiteSpace: "nowrap",
                    width: "300px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    margin: "5px 0",
                  }}
                >
                  {title}{" "}
                </h3>
                {dueDate ? (
                  <div>Suorita {moment(dueDate).format("l")} mennessä</div>
                ) : null}
              </div>
              {description ? (
                <div
                  className="block-data-text"
                  style={{
                    whiteSpace: "nowrap",
                    width: "200px",
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
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexGrow: 1,
              justifyContent: "end",
              alignItems: "end",
              padding: "5px",
              fontStyle: "italic",
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
          >
            - {loggedUserIsOwner ? "Minä" : creatorName}
          </div>
        </div>
      </div>
    );
  }
);

JournalListItem.displayName = "JournalListItem";

export default JournalListItem;
