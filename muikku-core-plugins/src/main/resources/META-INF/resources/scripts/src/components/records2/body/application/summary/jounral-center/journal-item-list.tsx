import * as React from "react";
import {
  JournalCenterUsePlaceType,
  JournalFilters,
  JournalNoteRead,
  JournalNoteUpdate,
  JournalStatusType,
  SelectedJournal,
} from "~/@types/journal-center";
import { sortJournalsBy } from "./helpers/filters";
import { JournalFunctionsBar } from "./journal-center";
import JournalListAnimated from "./journal-item-list-animated";
import JournalListFiltters from "./journal-item-list-filtters";
import JournalListItem from "./journal-item-list-item";

/**
 * JournalContentContainerProps
 */
interface JournalListContentProps {
  journals: JournalNoteRead[];
  usePlace: JournalCenterUsePlaceType;
  userId: number;
  selectedJournal: SelectedJournal;
  isLoadingList: boolean;
  onArchiveClick?: (journalId: number) => void;
  onReturnArchivedClick?: (journalId: number) => void;
  onEditClick?: (journalId: number) => void;
  onPinJournalClick?: (journalId: number, journal: JournalNoteUpdate) => void;
  onJournalClick?: (journalId: number) => void;
  onUpdateJournalStatus?: (
    journalId: number,
    newStatus: JournalStatusType
  ) => void;
}

/**
 * Creater Journal content container component
 * @param props props
 * @returns JSX.Element
 */
const JournalList: React.FC<JournalListContentProps> = (props) => {
  const {
    usePlace,
    userId,
    journals,
    isLoadingList,
    selectedJournal,
    onJournalClick,
    onEditClick,
    onArchiveClick,
    onReturnArchivedClick,
    onPinJournalClick,
    onUpdateJournalStatus,
  } = props;

  const [filters, setFilters] = React.useState<JournalFilters>({
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
  const handleFiltersChange = (updatedFilters: JournalFilters) => {
    setFilters(updatedFilters);
  };

  const filteredJournalList = React.useMemo(
    () => sortJournalsBy(journals, filters, userId),
    [journals, filters, userId]
  );

  return (
    <div className="journal-list-content">
      <JournalFunctionsBar>
        <JournalListFiltters
          usePlace={usePlace}
          filters={filters}
          onFilttersChange={handleFiltersChange}
        />
      </JournalFunctionsBar>

      <JournalListAnimated isLoadingList={isLoadingList}>
        {filteredJournalList.map((j) => (
          <JournalListItem
            key={j.id}
            ref={React.createRef()}
            journal={j}
            active={
              selectedJournal.journal && selectedJournal.journal.id === j.id
            }
            archived={j.isArchived}
            loggedUserIsCreator={j.creator === userId}
            loggedUserIsOwner={j.owner === userId}
            onPinJournalClick={onPinJournalClick}
            onArchiveClick={onArchiveClick}
            onUpdateJournalStatus={onUpdateJournalStatus}
            onEditClick={onEditClick}
            onJournalClick={onJournalClick}
            onReturnArchivedClick={onReturnArchivedClick}
          />
        ))}
      </JournalListAnimated>
    </div>
  );
};

export default JournalList;
