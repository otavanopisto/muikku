import {
  JournalFiltters,
  JournalNoteRead,
  JournalPriority,
} from "~/@types/journal-center";

/**
 * findDeselectedItem
 * @param currentArray currentArray
 */
export const findDeselectedFiltterItems = (currentArray: string[]) => {
  const filttersStrings: string[] = [
    JournalPriority.HIGH,
    JournalPriority.NORMAL,
    JournalPriority.LOW,
  ];

  const deSelectedItems: string[] = [];

  // loop through previous array
  for (let j = 0; j < filttersStrings.length; j++) {
    // look for same thing in new array
    if (currentArray.indexOf(filttersStrings[j]) == -1) {
      deSelectedItems.push(filttersStrings[j]);
    }
  }

  return deSelectedItems.length > 0 ? deSelectedItems : null;
};

/**
 * sortByPinned
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
  const order: string[] = [];

  if (filters.high) {
    order.push(JournalPriority.HIGH);
  }
  if (filters.normal) {
    order.push(JournalPriority.NORMAL);
  }
  if (filters.low) {
    order.push(JournalPriority.LOW);
  }

  const missing = findDeselectedFiltterItems(order);

  if (missing && missing.length > 0) {
    for (const miss of missing) {
      order.push(miss);
    }
  }

  return order.length > 0
    ? journalList.sort(
        (a, b) => order.indexOf(a.priority) - order.indexOf(b.priority)
      )
    : journalList;
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
 * @param userId userId
 * @returns list of filtered journals
 */
export const filterByMaker = (
  journalList: JournalNoteRead[],
  filters: JournalFiltters,
  userId: number
): JournalNoteRead[] => {
  const updatedList = journalList.filter((j) => {
    if (
      (filters.own && userId === j.creator) ||
      (filters.guider && userId !== j.creator)
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

  if (filters.own || filters.guider) {
    pinnedList = filterByMaker(pinnedList, filters, userId);
    nonPinnedList = filterByMaker(nonPinnedList, filters, userId);
  }

  if (filters.high || filters.normal || filters.low) {
    pinnedList = sortByJournalPriority(pinnedList, filters);
    nonPinnedList = sortByJournalPriority(nonPinnedList, filters);
  }

  /* if (filtters.own) {
      journalListSorted = sortByMadeByMe(journalListSorted);
    } */

  return [...pinnedList, ...nonPinnedList];
};
