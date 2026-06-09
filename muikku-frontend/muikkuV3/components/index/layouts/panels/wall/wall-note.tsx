import * as React from "react";
import { useTranslation } from "react-i18next";
import NotesItemEdit from "~/components/general/notes/notes-item-edit";
import Link from "~/components/general/link";
import "~/sass/elements/note.scss";
import { Note, NoteStatusType, UpdateNoteRequest } from "~/generated/client";
import WallItem from "./components/wall-item";

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
const WallNote: React.FC<NoteProps> = (props) => {
  const { modifier, note, isCreator, onStatusUpdate, onUpdate } = props;
  const { t } = useTranslation("tasks");

  const updateButtonLocale = isCreator ? "actions.approve" : "actions.send";

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
    <WallItem
      modifier={modifier}
      isCreator={isCreator}
      state={note.priority}
      title={note.title}
      dueDate={note.dueDate}
    >
      <>
        <div
          className="note__description rich-text"
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
      </>
    </WallItem>
  );
};

export default WallNote;
