import * as React from "react";
import {
  JournalCenterUsePlaceType,
  JournalFilters,
  JournalNoteRead,
  JournalNoteUpdate,
  JournalStatusType,
} from "~/@types/journal-center";
import { sortJournalsBy } from "./helpers/filters";
import { JournalFunctionsBar } from "./journal-center";
import JournalListFiltters from "./journal-item-list-filtters";
import JournalListItem from "./journal-item-list-item";
import JournalListWithoutAnimation from "./journal-list-test";

/**
 * JournalContentContainerProps
 */
interface JournalListContentProps {
  journals: JournalNoteRead[];
  usePlace: JournalCenterUsePlaceType;
  userId: number;
  isLoadingList: boolean;
  onArchiveClick?: (journalId: number) => void;
  onReturnArchivedClick?: (journalId: number) => void;
  onPinJournalClick?: (journalId: number, journal: JournalNoteUpdate) => void;
  onUpdateJournalStatus?: (
    journalId: number,
    newStatus: JournalStatusType
  ) => void;
  onJournalSaveUpdateClick?: (
    journalId: number,
    updatedJournal: JournalNoteUpdate,
    onSuccess?: () => void
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
    onArchiveClick,
    onReturnArchivedClick,
    onPinJournalClick,
    onUpdateJournalStatus,
    onJournalSaveUpdateClick,
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

      <JournalListWithoutAnimation isLoadingList={isLoadingList}>
        {filteredJournalList.map((j) => (
          <JournalListItem
            key={j.id}
            ref={React.createRef()}
            journal={j}
            archived={j.isArchived}
            loggedUserIsCreator={j.creator === userId}
            loggedUserIsOwner={j.owner === userId}
            onPinJournalClick={onPinJournalClick}
            onArchiveClick={onArchiveClick}
            onUpdateJournalStatus={onUpdateJournalStatus}
            onReturnArchivedClick={onReturnArchivedClick}
            onJournalSaveUpdateClick={onJournalSaveUpdateClick}
          />
        ))}
      </JournalListWithoutAnimation>
    </div>
  );
};

export default JournalList;
