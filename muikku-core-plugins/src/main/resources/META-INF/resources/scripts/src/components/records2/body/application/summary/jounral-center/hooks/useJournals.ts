import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { sleep } from "~/helper-functions/shared";
import {
  JournalNoteCreate,
  JournalNoteRead,
  JournalNoteUpdate,
  UseJournals,
} from "~/@types/journal-center";
import promisify from "~/util/promisify";
import mApi from "~/lib/mApi";
import {
  JournalPriority,
  JournalStatusType,
} from "../../../../../../../@types/journal-center";

/**
 * initialState
 */
const initialState: UseJournals = {
  isLoadingList: true,
  isUpdatingList: false,
  journalsList: [],
  journalsArchivedList: [],
};

/**
 * Custom hook journal list
 *
 * @param studentId "userId"
 * @param displayNotification displayNotification
 * @returns journal lists and methods to create, update, pin, archive and return archived journal
 */
export const useJournals = (
  studentId: number,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [journals, setJournals] = React.useState<UseJournals>(initialState);
  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    /**
     * loadJournalListData
     */
    const loadJournalListData = async () => {
      setJournals((journals) => ({ ...journals, isLoadingList: true }));

      try {
        /**
         * Sleeper to delay data fetching if it happens faster than 1s
         */
        const sleepPromise = await sleep(1000);

        /**
         * Loaded journal list
         */
        const [loadedJournalList, loadedArchivedJournalList] =
          await Promise.all([
            (async () => {
              const journals = (await promisify(
                mApi().notes.owner.read(studentId, { listArchived: false }),
                "callback"
              )()) as JournalNoteRead[];

              return journals;
            })(),
            (async () => {
              const journalsArchived = (await promisify(
                mApi().notes.owner.read(studentId, { listArchived: true }),
                "callback"
              )()) as JournalNoteRead[];

              return journalsArchived;
            })(),
            sleepPromise,
          ]);

        if (componentMounted.current) {
          setJournals((journals) => ({
            ...journals,
            isLoadingList: false,
            journalsList: setToDefaultSortingOrder(loadedJournalList),
            journalsArchivedList: setToDefaultSortingOrder(
              loadedArchivedJournalList
            ),
          }));
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(`Hups errori ${err}`, "error");
          setJournals((journals) => ({
            ...journals,
            isLoadingList: false,
          }));
        }
      }
    };

    loadJournalListData();
  }, [displayNotification, studentId]);

  React.useEffect(
    () => () => {
      componentMounted.current = false;
    },
    []
  );

  /**
   * Sort journal list by default order
   *
   * @param journalList journalList
   * @returns Sorted journal list in default priority order
   */
  const setToDefaultSortingOrder = (journalList: JournalNoteRead[]) => {
    /**
     * Default sort order
     */
    const order: string[] = [
      JournalPriority.HIGH,
      JournalPriority.NORMAL,
      JournalPriority.LOW,
    ];

    return journalList.sort(
      (a, b) => order.indexOf(a.priority) - order.indexOf(b.priority)
    );
  };

  /**
   * Creates journal
   *
   * @param newJournal newJournal
   * @param onSuccess onSuccess
   */
  const createJournal = async (
    newJournal: JournalNoteCreate,
    onSuccess?: () => void
  ) => {
    setJournals((journals) => ({ ...journals, isUpdatingList: true }));

    try {
      /**
       * Creating and getting created journal
       */
      const createdJournal = <JournalNoteRead>(
        await promisify(mApi().notes.note.create(newJournal), "callback")()
      );

      if (createdJournal.isArchived) {
        /**
         * Initializing list
         */
        const updatedArchivedJournalList = [...journals.journalsArchivedList];

        /**
         * Update list
         */
        updatedArchivedJournalList.push(createdJournal);

        setJournals((journals) => ({
          ...journals,
          journalsArchivedList: setToDefaultSortingOrder(
            updatedArchivedJournalList
          ),
          isUpdatingList: false,
        }));

        displayNotification(
          `Lappu luotu onnistuneesti ja siirrety arkistoituihin`,
          "success"
        );
      } else {
        /**
         * Initializing list
         */
        const updatedJournalList = [...journals.journalsList];

        /**
         * Update list
         */
        updatedJournalList.push(createdJournal);

        setJournals((journals) => ({
          ...journals,
          journalsList: setToDefaultSortingOrder(updatedJournalList),
          isUpdatingList: false,
        }));

        onSuccess && onSuccess();

        displayNotification(`Lappu luotu onnistuneesti`, "success");
      }
    } catch (err) {
      displayNotification(`Hups errori luonti ${err}`, "error");
      setJournals((journals) => ({
        ...journals,
        isUpdatingList: false,
      }));
    }
  };

  /**
   * Updates one journal data
   *
   * @param journalId journalId
   * @param journalToBeUpdated updatedJournal
   * @param onSuccess onSuccess
   */
  const updateJournal = async (
    journalId: number,
    journalToBeUpdated: JournalNoteUpdate,
    onSuccess?: () => void
  ) => {
    setJournals((journals) => ({ ...journals, isUpdatingList: true }));

    try {
      /**
       * Updating and getting updated journal
       */
      const updatedJournal = <JournalNoteRead>(
        await promisify(
          mApi().notes.note.update(journalId, journalToBeUpdated),
          "callback"
        )()
      );

      /**
       * Initializing list
       */
      const updatedJournalList = [...journals.journalsList];

      /**
       * Finding index of journal which got updated
       */
      const indexOfOldNote = updatedJournalList.findIndex(
        (j) => j.id === journalId
      );

      /**
       * Splice it out and replace with updated one
       */
      updatedJournalList.splice(indexOfOldNote, 1, updatedJournal);

      setJournals((journals) => ({
        ...journals,
        journalsList: setToDefaultSortingOrder(updatedJournalList),
        isUpdatingList: false,
      }));

      onSuccess && onSuccess();

      displayNotification(`Lappu päivitetty onnistuneesti`, "success");
    } catch (err) {
      displayNotification(`Hups errori päivitys ${err}`, "error");
      setJournals((journals) => ({
        ...journals,
        isUpdatingList: false,
      }));
    }
  };

  /**
   * Pins journal. Same as update but only pinned value changes
   *
   * @param journalId journalId
   * @param journal updatedJournal
   * @param onSuccess onSuccess
   */
  const pinJournal = async (
    journalId: number,
    journal: JournalNoteUpdate,
    onSuccess?: () => void
  ) => {
    setJournals((journals) => ({ ...journals, isUpdatingList: true }));

    /**
     * Creating journal object where pinned property has changed
     */
    const journalToPin = {
      ...journal,
      pinned: !journal.pinned,
    };

    try {
      /**
       * Updating and getting updated journal
       */
      const updatedJournal = <JournalNoteRead>(
        await promisify(
          mApi().notes.note.update(journalId, journalToPin),
          "callback"
        )()
      );

      /**
       * Initializing list
       */
      const updatedJournalList = [...journals.journalsList];

      /**
       * Finding index of journal which got updated
       */
      const indexOfOldNote = updatedJournalList.findIndex(
        (j) => j.id === journalId
      );

      /**
       * Splice it out and replace with updated one
       */
      updatedJournalList.splice(indexOfOldNote, 1, updatedJournal);

      setJournals((journals) => ({
        ...journals,
        journalsList: setToDefaultSortingOrder(updatedJournalList),
        isUpdatingList: false,
      }));

      onSuccess && onSuccess();
    } catch (err) {
      displayNotification(`Hups errori pinnaus ${err}`, "error");
      setJournals((journals) => ({
        ...journals,
        isUpdatingList: false,
      }));
    }
  };

  /**
   * Archives one journal
   *
   * @param journalId journalId
   * @param onSuccess onSuccess
   */
  const archiveJournal = async (journalId: number, onSuccess?: () => void) => {
    setJournals((journals) => ({ ...journals, isUpdatingList: true }));

    try {
      /**
       * Updating and getting updated journal
       */
      const updatedJournal = <JournalNoteRead>(
        await promisify(
          mApi().notes.note.archive.update(journalId),
          "callback"
        )()
      );

      /**
       * Initializing list
       */
      const updatedJournalList = [...journals.journalsList];
      const updatedJournalArchivedList = [...journals.journalsArchivedList];

      /**
       * Finding index of journal that was just updated
       */
      const indexOfOldNote = updatedJournalList.findIndex(
        (j) => j.id === journalId
      );

      /**
       * Update lists by removing and adding updated journal
       */
      updatedJournalList.splice(indexOfOldNote, 1);
      updatedJournalArchivedList.push(updatedJournal);

      setJournals((journals) => ({
        ...journals,
        journalsList: setToDefaultSortingOrder(updatedJournalList),
        journalsArchivedList: setToDefaultSortingOrder(
          updatedJournalArchivedList
        ),
        isUpdatingList: false,
      }));

      onSuccess && onSuccess();

      displayNotification(`Lappu poistettu onnistuneesti`, "success");
    } catch (err) {
      displayNotification(`Hups errori poisto ${err}`, "error");
      setJournals((journals) => ({
        ...journals,
        isUpdatingList: false,
      }));
    }
  };

  /**
   * Returns archived journal from archived list
   *
   * @param journalId journalId
   * @param onSuccess onSuccess
   */
  const returnArchivedJournal = async (
    journalId: number,
    onSuccess?: () => void
  ) => {
    setJournals((journals) => ({ ...journals, isUpdatingList: true }));

    try {
      /**
       * Updating and getting updated journal
       */
      const updatedJournal = <JournalNoteRead>(
        await promisify(
          mApi().notes.note.archive.update(journalId),
          "callback"
        )()
      );

      /**
       * Initializing list
       */
      const updatedJournalsList = [...journals.journalsList];
      const updatedJournalsArchivedList = [...journals.journalsArchivedList];

      /**
       * Finding index of journal that was just updated
       */
      const indexOfOldNote = updatedJournalsArchivedList.findIndex(
        (j) => j.id === journalId
      );

      /**
       * Update lists by removing and adding updated journal
       */
      updatedJournalsList.push(updatedJournal);
      updatedJournalsArchivedList.splice(indexOfOldNote, 1);

      setJournals((journals) => ({
        ...journals,
        journalsList: setToDefaultSortingOrder(updatedJournalsList),
        journalsArchivedList: setToDefaultSortingOrder(
          updatedJournalsArchivedList
        ),
        isUpdatingList: false,
      }));

      onSuccess && onSuccess();

      displayNotification(`Lappu palautettu onnistuneesti`, "success");
    } catch (err) {
      displayNotification(`Hups errori palautus ${err}`, "error");
      setJournals((journals) => ({
        ...journals,
        isUpdatingList: false,
      }));
    }
  };

  /**
   * changeJournalStatus
   * @param journalId journalId
   * @param newStatus newStatus
   * @param onSuccess onSuccess
   */
  const updateJournalStatus = async (
    journalId: number,
    newStatus: JournalStatusType,
    onSuccess?: () => void
  ) => {
    try {
      const indexOfJournal = journals.journalsList.findIndex(
        (j) => j.id === journalId
      );

      const journalToUpdate = journals.journalsList[indexOfJournal];

      journalToUpdate.status = newStatus;

      /**
       * Updating and getting updated journal
       */
      const updatedJournal = <JournalNoteRead>(
        await promisify(
          mApi().notes.note.update(journalId, journalToUpdate),
          "callback"
        )()
      );

      /**
       * Initializing list
       */
      const updatedJournalsList = [...journals.journalsList];

      updatedJournalsList.splice(indexOfJournal, 1, updatedJournal);

      setJournals((journals) => ({
        ...journals,
        journalsList: setToDefaultSortingOrder(updatedJournalsList),
        isUpdatingList: false,
      }));

      displayNotification(`Lappu palautettu onnistuneesti`, "success");
    } catch (err) {
      displayNotification(`Hups errori palautus ${err}`, "error");
      setJournals((journals) => ({
        ...journals,
        isUpdatingList: false,
      }));
    }
  };

  return {
    journals,
    /**
     * createJournal
     * @param newJournal newJournal
     * @param onSuccess onSuccess
     */
    createJournal: (newJournal: JournalNoteCreate, onSuccess?: () => void) =>
      createJournal(newJournal, onSuccess),

    /**
     * updateJournal
     * @param journalId journalId
     * @param updatedJournal updatedJournal
     * @param onSuccess onSuccess
     */
    updateJournal: (
      journalId: number,
      updatedJournal: JournalNoteUpdate,
      onSuccess?: () => void
    ) => updateJournal(journalId, updatedJournal, onSuccess),

    /**
     * archiveJournal
     * @param journalId journalId
     * @param onSuccess onSuccess
     */
    archiveJournal: (journalId: number, onSuccess?: () => void) =>
      archiveJournal(journalId, onSuccess),

    /**
     * returnArchivedJournal
     * @param journalId journalId
     * @param onSuccess onSuccess
     */
    returnArchivedJournal: (journalId: number, onSuccess?: () => void) =>
      returnArchivedJournal(journalId, onSuccess),

    /**
     * pinJournal
     * @param journalId journalId
     * @param journal journal
     * @param onSuccess onSuccess
     */
    pinJournal: (
      journalId: number,
      journal: JournalNoteUpdate,
      onSuccess?: () => void
    ) => pinJournal(journalId, journal, onSuccess),

    /**
     * updateJournalStatus
     * @param journalId journalId
     * @param journalStatus journalStatus
     * @param onSuccess onSuccess
     */
    updateJournalStatus: (
      journalId: number,
      journalStatus: JournalStatusType,
      onSuccess?: () => void
    ) => updateJournalStatus(journalId, journalStatus, onSuccess),
  };
};
