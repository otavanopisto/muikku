import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { loadNotes, updateNote } from "~/actions/main-function/guider";
import { StateType } from "~/reducers";
import NotesItemList from "~/components/general/notes/notes-item-list";
import { NotesLocation, NotesItemFilters } from "~/@types/notes";
import { UpdateNoteRequest } from "~/generated/client";
import { GuiderContext } from "../../context";
import { UseFilterNotes } from "~/components/guider/hooks/useFilterNotes";

/**
 * GuiderStudentsProps
 */
interface GuiderNotesProps {}

/**
 * GuiderStudents
 */
const GuiderNotes = (props: GuiderNotesProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { status, guider } = useSelector((state: StateType) => state);
  const loadingState = guider.notes.state;
  const { filters } = React.useContext(GuiderContext);
  const notes = UseFilterNotes(guider.notes.list, filters);

  // TODO: this needs and implementation
  const [noteFilters, setNoteFilters] = React.useState<NotesItemFilters>({
    high: false,
    normal: false,
    low: false,
    own: false,
    guider: false,
  });

  React.useEffect(() => {
    dispatch(loadNotes(status.userId, false));
  }, [dispatch, status]);

  React.useEffect(() => {}, [notes]);

  const pinNotesItem = () => {};
  const updateNotesItemStatus = () => {};
  const onArchiveClick = () => {};
  const onReturnArchivedClick = () => {};

  const onNotesItemSaveUpdateClick = (
    noteId: number,
    request: UpdateNoteRequest
  ) => {
    dispatch(updateNote(noteId, request));
  };

  return (
    <div className="notes--full-height">
      {loadingState === "LOADING" && <div className="loader-empty" />}
      {loadingState === "ERROR" && <div className="loader-error" />}
      {loadingState === "READY" && (
        <>
          <h2 className="notes__title">{t("labels.tasks", { ns: "tasks" })}</h2>
          {notes.length === 0 ? (
            <div className="empty">
              <span>
                {t("content.empty", { ns: "tasks", context: "tasks" })}
              </span>
            </div>
          ) : (
            <NotesItemList
              usePlace={"guider"}
              filters={filters}
              isLoadingList={false}
              userId={status.userId}
              notesItems={notes}
              onArchiveClick={onArchiveClick}
              onNotesItemSaveUpdateClick={onNotesItemSaveUpdateClick}
              onPinNotesItemClick={pinNotesItem}
              onUpdateNotesItemStatus={updateNotesItemStatus}
            />
          )}
        </>
      )}
    </div>
  );
};

export default GuiderNotes;
