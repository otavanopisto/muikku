import * as React from "react";
import { NotesLocation, NotesItemFilters } from "~/@types/notes";
import { Note, NoteStatusType, UpdateNoteRequest } from "~/generated/client";
import { sortNotesItemsBy } from "./helpers/filters";
import NotesListItem from "./notes-item-list-item";
import NotesItemListWithoutAnimation from "./notes-list-test";

/**
 * NotesItemListContentProps
 */
interface NotesItemListContentProps {
  notesItems: Note[];
  usePlace: NotesLocation;
  userId: number;
  isLoadingList: boolean;
  filters: NotesItemFilters;
  onArchiveClick?: (notesItemd: number) => void;
  onReturnArchivedClick?: (notesItemId: number) => void;
  onPinNotesItemClick?: (
    notesItemId: number,
    updateNoteRequest: UpdateNoteRequest
  ) => void;
  onUpdateNotesItemStatus?: (
    notesItemId: number,
    newStatus: NoteStatusType
  ) => void;
  onNotesItemSaveUpdateClick?: (
    notesItemId: number,
    updateNoteRequest: UpdateNoteRequest,
    onSuccess?: () => void
  ) => void;
}

/**
 * Creater NotesItem content container component
 * @param props props
 * @returns JSX.Element
 */
const NotesItemList: React.FC<NotesItemListContentProps> = (props) => {
  const {
    filters,
    userId,
    notesItems,
    isLoadingList,
    onArchiveClick,
    onReturnArchivedClick,
    onPinNotesItemClick,
    onUpdateNotesItemStatus,
    onNotesItemSaveUpdateClick,
  } = props;

  const filteredNotesItemList = React.useMemo(
    () => sortNotesItemsBy(notesItems, filters, userId),
    [notesItems, filters, userId]
  );

  return (
    <div className="notes__content">
      <NotesItemListWithoutAnimation isLoadingList={isLoadingList}>
        {filteredNotesItemList.map((j) => (
          <NotesListItem
            key={j.id}
            ref={React.createRef()}
            notesItem={j}
            archived={j.isArchived}
            loggedUserIsCreator={j.creator === userId}
            loggedUserIsOwner={j.owner === userId}
            onPinNotesItemClick={onPinNotesItemClick}
            onArchiveClick={onArchiveClick}
            onUpdateNotesItemStatus={onUpdateNotesItemStatus}
            onReturnArchivedClick={onReturnArchivedClick}
            onNotesItemSaveUpdateClick={onNotesItemSaveUpdateClick}
          />
        ))}
      </NotesItemListWithoutAnimation>
    </div>
  );
};

export default NotesItemList;
