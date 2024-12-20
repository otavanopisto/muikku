import * as React from "react";
import { NotesLocation, NotesItemFilters } from "~/@types/notes";
import {
  Note,
  UpdateNoteRequest,
  UpdateNoteReceiverRequest,
} from "~/generated/client";
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
  notesRecipientId?: number;
  isLoadingList: boolean;
  filters: NotesItemFilters;
  onArchiveClick?: (noteId: number) => void;
  onReturnArchivedClick?: (noteId: number) => void;
  onPinNotesItemClick?: (
    noteId: number,
    newReceiverStatus: UpdateNoteReceiverRequest,
    recipientId: number
  ) => void;
  onUpdateNotesItemStatus?: (
    noteId: number,
    newReceiverStatus: UpdateNoteReceiverRequest,
    recipientId: number,
    onSuccess?: () => void
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
    notesRecipientId,
    isLoadingList,
    onArchiveClick,
    onReturnArchivedClick,
    onPinNotesItemClick,
    onUpdateNotesItemStatus,
    onNotesItemSaveUpdateClick,
  } = props;

  const itemRefs = React.useRef<HTMLDivElement[]>([]);
  const itemFocusIndexRef = React.useRef<number>(0);

  const filteredNotesItemList = React.useMemo(
    () => sortNotesItemsBy(notesItems, filters, userId),
    [notesItems, filters, userId]
  );

  /**
   * Handles list key down
   * @param e e
   */
  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      itemFocusIndexRef.current = 0;

      itemRefs.current[itemFocusIndexRef.current]?.setAttribute(
        "tabindex",
        "0"
      );
      itemRefs.current[itemFocusIndexRef.current]?.focus();
    }
  };

  /**
   * Handles list item focus
   * @param index index
   */
  const handleListItemFocus =
    (index: number) => (e: React.FocusEvent<HTMLDivElement>) => {
      if (itemFocusIndexRef.current !== index) {
        itemFocusIndexRef.current = index;
      }
    };

  /**
   * Handles list item key down
   * @param e e
   */
  const handleListItemKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
    }

    // Handle arrow left and right
    // Note that tabIndex is not changed here, because inner element already
    // has some other elements that are focusable by default, it would make
    // focus changing to be unpredictable
    switch (e.key) {
      case "ArrowLeft":
        itemFocusIndexRef.current--;

        if (itemFocusIndexRef.current < 0) {
          itemFocusIndexRef.current = filteredNotesItemList.length - 1;
        }

        itemRefs.current[itemFocusIndexRef.current]?.focus();
        return;

      case "ArrowRight":
        itemFocusIndexRef.current++;

        if (itemFocusIndexRef.current > filteredNotesItemList.length - 1) {
          itemFocusIndexRef.current = 0;
        }

        itemRefs.current[itemFocusIndexRef.current]?.focus();
        return;

      default:
        return;
    }
  };

  return (
    <div tabIndex={0} onKeyDown={handleListKeyDown} className="notes__content">
      <NotesItemListWithoutAnimation isLoadingList={isLoadingList}>
        {filteredNotesItemList.map((j, i) => (
          <NotesListItem
            key={j.id}
            tabIndex={0}
            ref={(ref) => (itemRefs.current[i] = ref)}
            specificRecipient={notesRecipientId}
            notesItem={j}
            archived={j.isArchived}
            onFocus={handleListItemFocus(i)}
            onKeyDown={handleListItemKeyDown}
            loggedUserIsCreator={j.creator === userId}
            loggedUserIsOwner={
              !!j.recipients.find((receiver) => receiver.recipient === userId)
            }
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
