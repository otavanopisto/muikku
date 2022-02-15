import {
  JournalFiltters,
  JournalNoteRead,
  JournalPriority,
} from "~/@types/journal-center";

/**
 * Finds deselected items based on two arrays
 * @param currentArray currentArray
 * @returns array of delected sorter strings
 */
export const findDeselectedSorterItems = (currentArray: string[]) => {
  const filtersStrings: string[] = [
    JournalPriority.HIGH,
    JournalPriority.NORMAL,
    JournalPriority.LOW,
  ];

  const deSelectedItems: string[] = [];

  // loop through previous array
  for (let j = 0; j < filtersStrings.length; j++) {
    // look for same thing in new array
    if (currentArray.indexOf(filtersStrings[j]) == -1) {
      deSelectedItems.push(filtersStrings[j]);
    }
  }

  return deSelectedItems.length > 0 ? deSelectedItems : null;
};

/**
 * Sorts journals by pinned status
 * @param journalList journalList
 * @returns two list, pinnend and non pinned lists
 */
export const sortByPinned = (journalList: JournalNoteRead[]) => {
  const pinnedList: JournalNoteRead[] = [];

  const nonPinnedList: JournalNoteRead[] = [];

  journalList.map((j) => {
    if (j.pinned) {
      pinnedList.push(j);
    } else {
      nonPinnedList.push(j);
    }
  });

  return {
    pinnedList,
    nonPinnedList,
  };
};

/**
 * sortByJournalPriority
 * @param journalList journalList
 * @param filters filtters
 * @returns list of journal sorted by priority
 */
export const sortByJournalPriority = (
  journalList: JournalNoteRead[],
  filters: JournalFiltters
) => {
  /**
   * Default order is always follow
   */
  let order: string[] = [
    JournalPriority.HIGH,
    JournalPriority.NORMAL,
    JournalPriority.LOW,
  ];

  /**
   * If any of priority sorters are active default ordering
   * is reseted and build depending what sorters are active
   */
  if (filters.high || filters.normal || filters.low) {
    order = [];

    if (filters.high) {
      order.push(JournalPriority.HIGH);
    }
    if (filters.normal) {
      order.push(JournalPriority.NORMAL);
    }
    if (filters.low) {
      order.push(JournalPriority.LOW);
    }
  }

  /**
   * This finds those deactive priorites sorters and pushes those to ordering array
   * which is needed to correctly sort whole journal list
   */
  const missing = findDeselectedSorterItems(order);

  if (missing && missing.length > 0) {
    for (const miss of missing) {
      order.push(miss);
    }
  }

  return journalList.sort(
    (a, b) => order.indexOf(a.priority) - order.indexOf(b.priority)
  );
};

/**
 * sortByMadeByMe
 * @param journalList journalList
 * @param userId userId
 * @returns journal list sorted by logged user own journals first
 */
export const sortByMadeByMe = (
  journalList: JournalNoteRead[],
  userId: number
) => {
  const madeByMe: JournalNoteRead[] = [];
  const madeByOthers: JournalNoteRead[] = [];

  journalList.map((j) =>
    j.creator === userId ? madeByMe.push(j) : madeByOthers.push(j)
  );

  return [...madeByMe, ...madeByOthers];
};

/**
 * filterByMaker
 * @param journalList journalList
 * @param filters filters
 * @param creator creator
 * @returns list of filtered journals
 */
export const filterByCreator = (
  journalList: JournalNoteRead[],
  filters: JournalFiltters,
  creator: number
): JournalNoteRead[] => {
  const updatedList = journalList.filter((j) => {
    if (
      (filters.own && creator === j.creator) ||
      (filters.guider && creator !== j.creator)
    ) {
      return j;
    }
  });

  return updatedList;
};

/**
 * sortJournalsByPriority
 * @param journalList journalList
 * @param filters filters
 * @param userId userId
 * @returns sorted journal list if there is priorities selected
 */
export const sortJournalsBy = (
  journalList: JournalNoteRead[],
  filters: JournalFiltters,
  userId: number
): JournalNoteRead[] => {
  let { pinnedList, nonPinnedList } = sortByPinned(journalList);

  /**
   * Filters journals by creator
   */
  if (filters.own || filters.guider) {
    pinnedList = filterByCreator(pinnedList, filters, userId);
    nonPinnedList = filterByCreator(nonPinnedList, filters, userId);
  }

  /**
   * Sorts by default priority order or by active priority order
   */
  pinnedList = sortByJournalPriority(pinnedList, filters);
  nonPinnedList = sortByJournalPriority(nonPinnedList, filters);

  /* if (filtters.own) {
      journalListSorted = sortByMadeByMe(journalListSorted);
    } */

  return [...pinnedList, ...nonPinnedList];
};
