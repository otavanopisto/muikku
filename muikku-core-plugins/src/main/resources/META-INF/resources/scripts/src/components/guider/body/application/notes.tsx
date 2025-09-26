import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  loadNotes,
  updateNote,
  updateRecipientNoteStatus,
  toggleNoteArchive,
} from "~/actions/main-function/guider";
import { StateType } from "~/reducers";
import NotesItemList from "~/components/general/notes/notes-item-list";
import {
  UpdateNoteRequest,
  UpdateNoteReceiverRequest,
} from "~/generated/client";
import { GuiderContext } from "../../context";
import { useFilterNotes } from "~/components/guider/hooks/useFilterNotes";
/**
 * GuiderStudentsProps
 */
interface GuiderNotesProps {}

/**
 * GuiderStudents
 * @param props props
 */
const GuiderNotes = (props: GuiderNotesProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { status, guider } = useSelector((state: StateType) => state);
  const loadingState = guider.notes.state;
  const { filters } = React.useContext(GuiderContext);
  const notes = useFilterNotes(guider.notes.list, filters);

  const defaultFilters = {
    high: false,
    normal: false,
    low: false,
    own: false,
    guider: false,
  };

  React.useEffect(() => {
    dispatch(loadNotes(status.userId, false));
  }, [dispatch, status]);

  /**
   * onArchiveClick function
   * @param noteId noteId
   */
  const onArchiveClick = (noteId: number) => {
    dispatch(toggleNoteArchive(noteId));
  };

  /**
   * onUpdateNotesItemStatus function
   * @param noteId noteId
   * @param recipientId recipientId
   * @param request request
   */
  const onUpdateNotesItemStatus = (
    noteId: number,
    recipientId: number,
    request: UpdateNoteReceiverRequest
  ) => {
    dispatch(updateRecipientNoteStatus(noteId, recipientId, request));
  };

  /**
   * onNotesItemSaveUpdateClick function
   * @param noteId noteId
   * @param request request
   * @param onSuccess onSuccess
   */
  const onNotesItemSaveUpdateClick = (
    noteId: number,
    request: UpdateNoteRequest,
    onSuccess?: () => void
  ) => {
    dispatch(updateNote(noteId, request, onSuccess));
  };

  return (
    <div className="notes--full-height">
      <h2 className="notes__title">{t("labels.tasks", { ns: "tasks" })}</h2>
      {notes.length === 0 ? (
        <div className="empty">
          <span>{t("content.empty", { ns: "tasks", context: "tasks" })}</span>
        </div>
      ) : (
        <NotesItemList
          usePlace={"guider"}
          filters={defaultFilters}
          isLoadingList={loadingState === "LOADING"}
          userId={status.userId}
          notesItems={notes}
          onArchiveClick={onArchiveClick}
          onReturnArchivedClick={onArchiveClick}
          onUpdateNotesItemStatus={onUpdateNotesItemStatus}
          onNotesItemSaveUpdateClick={onNotesItemSaveUpdateClick}
        />
      )}
    </div>
  );
};

export default GuiderNotes;
