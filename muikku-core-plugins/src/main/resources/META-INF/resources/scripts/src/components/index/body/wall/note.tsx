import * as React from "react";
import {
  NotesItemRead,
  NotesItemStatus,
  NotesItemUpdate,
} from "~/@types/notes";
import { isOverdue } from "~/helper-functions/dates";
import * as moment from "moment";
import { i18nType } from "~/reducers/base/i18n";
import NotesItemEdit from "~/components/general/notes/notes-item-edit";
import Button from "~/components/general/button";
import "~/sass/elements/note.scss";
/**
 * NoteProps
 */
interface NoteProps {
  modifier?: string;
  isCreator: boolean;
  onStatusUpdate: (id: number, status: NotesItemStatus) => void;
  onUpdate: (id: number, update: NotesItemUpdate) => void;
  note: NotesItemRead;
  i18n: i18nType;
}

/**
 * A simple note componet for panel use
 * @param props NoteProps
 * @returns JSX.Element
 */
export const Note: React.FC<NoteProps> = (props) => {
  const { modifier, note, i18n, isCreator, onStatusUpdate, onUpdate } = props;
  const overdue = isOverdue(note.dueDate);
  const [showDescription, setShowDescription] = React.useState(false);

  const updateButtonLocale = isCreator
    ? "plugin.records.tasks.action.markAsDone"
    : "plugin.records.tasks.action.requestApproval";

  /**
   * toggles description visibility
   */
  const toggleShowDescription = () => {
    setShowDescription(!showDescription);
  };

  /**
   * Handles status change
   */
  const handleStatusChange = () => {
    if (isCreator) {
      onStatusUpdate(note.id, NotesItemStatus.APPROVED);
    } else {
      onStatusUpdate(note.id, NotesItemStatus.APPROVAL_PENDING);
    }
  };

  return (
    <div
      className={`note ${modifier ? "note--" + modifier : ""} state-${
        note.priority
      } ${overdue ? "state-OVERDUE" : ""}`}
    >
      <div
        onClick={toggleShowDescription}
        className={`note__header ${overdue ? "state-OVERDUE" : ""}`}
      >
        <span className="note__title">{note.title}</span>

        <span
          className="note__date
        "
        >
          {overdue ? (
            <span className="note__overdue-tag">
              {i18n.text.get("plugin.records.tasks.status.overdue")}
            </span>
          ) : null}
          <span>{moment(note.dueDate).format("l")}</span>
        </span>
      </div>
      {showDescription ? (
        <>
          <div
            className="note__description"
            dangerouslySetInnerHTML={{ __html: note.description }}
          ></div>
          <div className="note__footer">
            <Button
              buttonModifiers={["primary-function-content", "frontpage-button"]}
              onClick={handleStatusChange}
            >
              {i18n.text.get(updateButtonLocale)}
            </Button>
            {isCreator && (
              <NotesItemEdit
                selectedNotesItem={note}
                onNotesItemSaveUpdateClick={onUpdate}
              >
                <Button
                  buttonModifiers={[
                    "primary-function-content",
                    "frontpage-button",
                  ]}
                >
                  {i18n.text.get("plugin.records.tasks.editnote.topic")}
                </Button>
              </NotesItemEdit>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};
