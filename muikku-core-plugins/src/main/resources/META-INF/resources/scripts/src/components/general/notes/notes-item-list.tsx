import * as React from "react";
import {
  NotesLocation,
  NotesItemFilters,
  NotesItemRead,
  NotesItemUpdate,
  NotesItemStatus,
} from "~/@types/notes";
import { sortNotesItemsBy } from "./helpers/filters";
import { NotesToolbar } from "./notes";
import NotesItemListFiltters from "./notes-item-list-filtters";
import NotesListItem from "./notes-item-list-item";
import NotesItemListWithoutAnimation from "./notes-list-test";
import { i18nType } from "~/reducers/base/i18n";

/**
 * NotesItemListContentProps
 */
interface NotesItemListContentProps {
  notesItems: NotesItemRead[];
  usePlace: NotesLocation;
  userId: number;
  isLoadingList: boolean;
  onArchiveClick?: (notesItemd: number) => void;
  onReturnArchivedClick?: (notesItemId: number) => void;
  onPinNotesItemClick?: (
    notesItemId: number,
    notesItem: NotesItemUpdate
  ) => void;
  onUpdateNotesItemStatus?: (
    notesItemId: number,
    newStatus: NotesItemStatus
  ) => void;
  onNotesItemSaveUpdateClick?: (
    notesItemId: number,
    updatedNotesItem: NotesItemUpdate,
    onSuccess?: () => void
  ) => void;
  i18n: i18nType;
}

/**
 * Creater NotesItem content container component
 * @param props props
 * @returns JSX.Element
 */
const NotesItemList: React.FC<NotesItemListContentProps> = (props) => {
  const {
    usePlace,
    userId,
    notesItems,
    isLoadingList,
    onArchiveClick,
    onReturnArchivedClick,
    onPinNotesItemClick,
    onUpdateNotesItemStatus,
    onNotesItemSaveUpdateClick,
  } = props;

  const [filters, setFilters] = React.useState<NotesItemFilters>({
    high: false,
    normal: false,
    low: false,
    own: false,
    guider: false,
  });

  /**
   * handleFilttersChange
   * @param updatedFilters name
   */
  const handleFiltersChange = (updatedFilters: NotesItemFilters) => {
    setFilters(updatedFilters);
  };

  const filteredNotesItemList = React.useMemo(
    () => sortNotesItemsBy(notesItems, filters, userId),
    [notesItems, filters, userId]
  );

  return (
    <>
      <NotesToolbar>
        <NotesItemListFiltters
          i18n={props.i18n}
          usePlace={usePlace}
          filters={filters}
          onFilttersChange={handleFiltersChange}
        />
      </NotesToolbar>
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
    </>
  );
};

export default NotesItemList;
