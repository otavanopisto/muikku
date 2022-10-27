import * as React from "react";
import { NotesItemRead, NotesItemStatus } from "~/@types/notes";
import { isOverdue } from "~/helper-functions/dates";
import * as moment from "moment";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/note.scss";
/**
 * NoteProps
 */
interface NoteProps {
  modifier?: string;
  onStatusUpdate: (id: number, status: NotesItemStatus) => void;
  note: NotesItemRead;
  i18n: i18nType;
}

/**
 * NoteProps
 * @param props NoteProps
 * @returns JSX.Element
 */
export const Note: React.FC<NoteProps> = (props) => {
  const { modifier, note, i18n, onStatusUpdate } = props;
  const overdue = isOverdue(note.dueDate);
  const [showDescription, setShowDescription] = React.useState(false);

  const toggleShowDescription = () => {
    setShowDescription(!showDescription);
  };

  const handleStatusChange = () => {
    if (note.creator === note.owner) {
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
              {i18n.text.get(
                "plugin.records.tasks.status.overdue",
                moment(note.dueDate).format("l")
              )}
            </span>
          ) : (
            moment(note.dueDate).format("l")
          )}
        </span>
      </div>
      {showDescription ? (
        <>
          <div
            className="note__description"
            dangerouslySetInnerHTML={{ __html: note.description }}
          ></div>
          <div className="note__footer">
            <div onClick={handleStatusChange}>UpdateStatus</div>
            <div>EditNote</div>
          </div>
        </>
      ) : null}
    </div>
  );
};
