import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { loadNotes } from "~/actions/main-function/guider";
import { StateType } from "~/reducers";
import NotesItemList from "~/components/general/notes/notes-item-list";

import { NotesLocation, NotesItemFilters } from "~/@types/notes";
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
  const privateNotes = guider.notes.notes.privateNotes;
  const multiUserotes = guider.notes.notes.multiUserNotes;
  const loadingState = guider.notes.state;

  // TODO: this needs and implementation
  const [nonActiveNoteFilters, setNoneActiveNoteFilters] =
    React.useState<NotesItemFilters>({
      high: false,
      normal: false,
      low: false,
      own: false,
      guider: false,
    });

  React.useEffect(() => {
    dispatch(loadNotes(status.userId, false));
  }, [dispatch, status]);

  return (
    <div>
      <h1>Tittel</h1>
      <div>
        {loadingState === "LOADING" && <p>Loadr</p>}
        {loadingState === "ERROR" && <p>Errr</p>}
        {loadingState === "READY" && (
          <>
            <h2>Yksityiset</h2>
            {privateNotes.length === 0 ? (
              <p>Ei merkintöjä</p>
            ) : (
              <NotesItemList
                usePlace={"guider"}
                filters={nonActiveNoteFilters}
                isLoadingList={false}
                userId={status.userId}
                notesItems={privateNotes}
              />
            )}
            <h2>Käyttäjäryhmä</h2>
            {multiUserotes.length === 0 ? (
              <p>Ei merkintöjä</p>
            ) : (
              <NotesItemList
                usePlace={"guider"}
                filters={nonActiveNoteFilters}
                isLoadingList={false}
                userId={status.userId}
                notesItems={multiUserotes}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GuiderNotes;
