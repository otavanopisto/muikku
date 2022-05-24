import {
  NotesItemFilters,
  NotesItemRead,
  NotesItemPriority,
} from "~/@types/notes";

/**
 * Finds deselected items based on two arrays
 * @param currentArray currentArray
 * @returns array of delected sorter strings
 */
export const findDeselectedSorterItems = (currentArray: string[]) => {
  const filtersStrings: string[] = [
    NotesItemPriority.HIGH,
    NotesItemPriority.NORMAL,
    NotesItemPriority.LOW,
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
 * Sorts noptesItems by pinned status
 * @param notesItemList journalList
 * @returns two list, pinnend and non pinned lists
 */
export const sortByPinned = (notesItemList: NotesItemRead[]) => {
  const pinnedList: NotesItemRead[] = [];

  const nonPinnedList: NotesItemRead[] = [];

  notesItemList.map((j) => {
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
 * sortByNotesItemPriority
 * @param notesItemList notesItemList
 * @param filters filtters
 * @returns list of notesItem sorted by priority
 */
export const sortByNotesItemPriority = (
  notesItemList: NotesItemRead[],
  filters: NotesItemFilters
) => {
  /**
   * Default order is always follow
   */
  let order: string[] = [
    NotesItemPriority.HIGH,
    NotesItemPriority.NORMAL,
    NotesItemPriority.LOW,
  ];

  /**
   * If any of priority sorters are active default ordering
   * is reseted and build depending what sorters are active
   */
  if (filters.high || filters.normal || filters.low) {
    order = [];

    if (filters.high) {
      order.push(NotesItemPriority.HIGH);
    }
    if (filters.normal) {
      order.push(NotesItemPriority.NORMAL);
    }
    if (filters.low) {
      order.push(NotesItemPriority.LOW);
    }
  }

  /**
   * This finds those deactive priorites sorters and pushes those to ordering array
   * which is needed to correctly sort whole notesItem list
   */
  const missing = findDeselectedSorterItems(order);

  if (missing && missing.length > 0) {
    for (const miss of missing) {
      order.push(miss);
    }
  }

  return notesItemList.sort(
    (a, b) => order.indexOf(a.priority) - order.indexOf(b.priority)
  );
};

/**
 * sortByMadeByMe
 * @param notesItemList notesItemList
 * @param userId userId
 * @returns notesItem list sorted by logged user own notesItems first
 */
export const sortByMadeByMe = (
  notesItemList: NotesItemRead[],
  userId: number
) => {
  const madeByMe: NotesItemRead[] = [];
  const madeByOthers: NotesItemRead[] = [];

  notesItemList.map((j) =>
    j.creator === userId ? madeByMe.push(j) : madeByOthers.push(j)
  );

  return [...madeByMe, ...madeByOthers];
};

/**
 * filterByMaker
 * @param notesItemList notesItemList
 * @param filters filters
 * @param creator creator
 * @returns list of filtered notesItems
 */
export const filterByCreator = (
  notesItemList: NotesItemRead[],
  filters: NotesItemFilters,
  creator: number
): NotesItemRead[] => {
  const updatedList = notesItemList.filter((j) => {
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
 * sortNotesItemsBy
 * @param notesItemList journalList
 * @param filters filters
 * @param userId userId
 * @returns sorted notesItem list if there is priorities selected
 */
export const sortNotesItemsBy = (
  notesItemList: NotesItemRead[],
  filters: NotesItemFilters,
  userId: number
): NotesItemRead[] => {
  let { pinnedList, nonPinnedList } = sortByPinned(notesItemList);

  /**
   * Filters notesItems by creator
   */
  if (filters.own || filters.guider) {
    pinnedList = filterByCreator(pinnedList, filters, userId);
    nonPinnedList = filterByCreator(nonPinnedList, filters, userId);
  }

  /**
   * Sorts by default priority order or by active priority order
   */
  pinnedList = sortByNotesItemPriority(pinnedList, filters);
  nonPinnedList = sortByNotesItemPriority(nonPinnedList, filters);

  /* if (filtters.own) {
      notesItemListSorted = sortByMadeByMe(notesItemListSorted);
    } */

  return [...pinnedList, ...nonPinnedList];
};
