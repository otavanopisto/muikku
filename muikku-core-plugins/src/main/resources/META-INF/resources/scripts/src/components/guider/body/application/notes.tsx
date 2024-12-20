import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  loadNotes,
  updateNote,
  toggleNoteArchive,
} from "~/actions/main-function/guider";
import { StateType } from "~/reducers";
import NotesItemList from "~/components/general/notes/notes-item-list";
import { NotesLocation, NotesItemFilters } from "~/@types/notes";
import { UpdateNoteRequest } from "~/generated/client";
import { GuiderContext } from "../../context";
import { UseFilterNotes } from "~/components/guider/hooks/useFilterNotes";
import { number } from "@amcharts/amcharts4/core";

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

  const updateNotesItemStatus = () => {};

  /**
   * onArchiveClick function
   * @param noteId noteId
   */
  const onArchiveClick = (noteId: number) => {
    dispatch(toggleNoteArchive(noteId));
  };

  const onNotesItemSaveUpdateClick = (
    noteId: number,
    request: UpdateNoteRequest,
    onSucces?: () => void
  ) => {
    dispatch(updateNote(noteId, request, onSucces));
  };

  return (
    <div>
      <div>
        {loadingState === "LOADING" && <div className="loader-empty"></div>}
        {loadingState === "ERROR" && <p>Errr</p>}
        {loadingState === "READY" && (
          <>
            <h2>Tehtävät</h2>
            {notes.length === 0 ? (
              <p>Ei merkintöjä</p>
            ) : (
              <NotesItemList
                usePlace={"guider"}
                filters={filters}
                isLoadingList={false}
                userId={status.userId}
                notesItems={notes}
                onArchiveClick={onArchiveClick}
                onReturnArchivedClick={onArchiveClick}
                onNotesItemSaveUpdateClick={onNotesItemSaveUpdateClick}
                onUpdateNotesItemStatus={updateNotesItemStatus}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GuiderNotes;
