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
import { JournalPriority } from "../../../../../../../@types/journal-center";

/**
 * initialState
 */
const initialState: UseJournals = {
  isLoadingList: true,
  isUpdatingList: false,
  journalsList: [],
};

/**
 * Custom hook journal list
 * @param studentId "userId"
 * @param displayNotification displayNotification
 * @returns journal list
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
        const [loadedJournalList] = await Promise.all([
          (async () => {
            const journals = (await promisify(
              mApi().notes.owner.read(studentId),
              "callback"
            )()) as JournalNoteRead[];

            return journals;
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          /**
           * Default sort order
           */
          const order: string[] = [
            JournalPriority.HIGH,
            JournalPriority.NORMAL,
            JournalPriority.LOW,
          ];

          setJournals((journals) => ({
            ...journals,
            isLoadingList: false,
            journalsList: loadedJournalList.sort(
              (a, b) => order.indexOf(a.priority) - order.indexOf(b.priority)
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
   * createJournal
   * @param newJournal newJournal
   * @param onSuccess onSuccess
   */
  const createJournal = async (
    newJournal: JournalNoteCreate,
    onSuccess?: () => void
  ) => {
    setJournals((journals) => ({ ...journals, isUpdatingList: true }));

    try {
      const createdJournal = <JournalNoteRead>(
        await promisify(mApi().notes.note.create(newJournal), "callback")()
      );

      const updatedJournalList = [...journals.journalsList];

      updatedJournalList.push(createdJournal);

      setJournals((journals) => ({
        ...journals,
        journalsList: updatedJournalList,
        isUpdatingList: false,
      }));

      onSuccess && onSuccess();

      displayNotification(`Lappu luotu onnistuneesti`, "success");
    } catch (err) {
      displayNotification(`Hups errori luonti ${err}`, "error");
      setJournals((journals) => ({
        ...journals,
        isUpdatingList: false,
      }));
    }
  };

  /**
   * updateJournal
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
      const updatedJournal = <JournalNoteRead>(
        await promisify(
          mApi().notes.note.update(journalId, journalToBeUpdated),
          "callback"
        )()
      );

      const updatedJournalList = [...journals.journalsList];

      const indexOfOldNote = updatedJournalList.findIndex(
        (j) => j.id === journalId
      );

      updatedJournalList.splice(indexOfOldNote, 1, updatedJournal);

      setJournals((journals) => ({
        ...journals,
        journalsList: updatedJournalList,
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

    const journalToPin = {
      ...journal,
      pinned: !journal.pinned,
    };

    try {
      const updatedJournal = <JournalNoteRead>(
        await promisify(
          mApi().notes.note.update(journalId, journalToPin),
          "callback"
        )()
      );

      const updatedJournalList = [...journals.journalsList];

      const indexOfOldNote = updatedJournalList.findIndex(
        (j) => j.id === journalId
      );

      updatedJournalList.splice(indexOfOldNote, 1, updatedJournal);

      setJournals((journals) => ({
        ...journals,
        journalsList: updatedJournalList,
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
   * deleteJournal
   * @param journalId journalId
   * @param onSuccess onSuccess
   */
  const deleteJournal = async (journalId: number, onSuccess?: () => void) => {
    setJournals((journals) => ({ ...journals, isUpdatingList: true }));

    try {
      await promisify(mApi().notes.note.del(journalId), "callback")();

      const updatedJournalList = [...journals.journalsList];

      const indexOfOldNote = updatedJournalList.findIndex(
        (j) => j.id === journalId
      );

      updatedJournalList.splice(indexOfOldNote, 1);

      setJournals((journals) => ({
        ...journals,
        journalsList: updatedJournalList,
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
     * deleteJournal
     * @param journalId journalId
     * @param onSuccess onSuccess
     */
    deleteJournal: (journalId: number, onSuccess?: () => void) =>
      deleteJournal(journalId, onSuccess),
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
  };
};
