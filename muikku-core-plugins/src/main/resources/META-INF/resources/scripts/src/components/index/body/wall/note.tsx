import * as React from "react";
import AnimateHeight from "react-animate-height";
import { isOverdue } from "~/helper-functions/dates";
import * as moment from "moment";
import { useTranslation } from "react-i18next";
import NotesItemEdit from "~/components/general/notes/notes-item-edit";
import Link from "~/components/general/link";
import "~/sass/elements/note.scss";
import { Note, NoteStatusType, UpdateNoteRequest } from "~/generated/client";
/**
 * NoteProps
 */
interface NoteProps {
  modifier?: string;
  isCreator: boolean;
  onStatusUpdate: (id: number, status: NoteStatusType) => void;
  onUpdate: (id: number, update: UpdateNoteRequest) => void;
  note: Note;
}

/**
 * A simple note componet for panel use
 * @param props NoteProps
 * @returns JSX.Element
 */
export const NoteComponent: React.FC<NoteProps> = (props) => {
  const { modifier, note, isCreator, onStatusUpdate, onUpdate } = props;
  const { t } = useTranslation("tasks");
  const overdue = isOverdue(note.dueDate);
  const [showDescription, setShowDescription] = React.useState(false);

  const updateButtonLocale = isCreator ? "actions.approve" : "actions.send";

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
      onStatusUpdate(note.id, "APPROVED");
    } else {
      onStatusUpdate(note.id, "APPROVAL_PENDING");
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
              {t("labels.status", { context: "overdue" })}
            </span>
          ) : null}
          {note.dueDate ? (
            <span>{moment(note.dueDate).format("l")}</span>
          ) : null}
        </span>
      </div>
      <AnimateHeight height={showDescription ? "auto" : 0}>
        <div
          className="note__description"
          dangerouslySetInnerHTML={{ __html: note.description }}
        ></div>
        <div className="note__footer">
          <Link className="link link--index" onClick={handleStatusChange}>
            {t(updateButtonLocale)}
          </Link>
          {isCreator && (
            <NotesItemEdit
              selectedNotesItem={note}
              onNotesItemSaveUpdateClick={onUpdate}
            >
              <Link className="link link--index">{t("labels.edit")}</Link>
            </NotesItemEdit>
          )}
        </div>
      </AnimateHeight>
    </div>
  );
};
