import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { sleep } from "~/helper-functions/shared";
import {
  NotesItemCreate,
  NotesItemRead,
  NotesItemUpdate,
  UseNotesItem,
} from "~/@types/notes";
import promisify from "~/util/promisify";
import mApi from "~/lib/mApi";
import { NotesItemPriority, NotesItemStatus } from "~/@types/notes";
import { i18nType } from "~/reducers/base/i18n";

/**
 * initialState
 */
const initialState: UseNotesItem = {
  isLoadingList: true,
  isUpdatingList: false,
  notesItemList: [],
  notesArchivedItemList: [],
};

/**
 * Custom hook notesItems list
 *
 * @param studentId "userId"
 * @param i18n i18n
 * @param displayNotification displayNotification
 * @returns notesItems lists and methods to create, update, pin, archive and return archived notesItems
 */
export const useNotesItem = (
  studentId: number,
  i18n: i18nType,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [notesItems, setNotesItem] = React.useState<UseNotesItem>(initialState);
  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    /**
     * loadNotesItemListData
     */
    const loadNotesItemListData = async () => {
      setNotesItem((notesItem) => ({ ...notesItem, isLoadingList: true }));

      try {
        // Sleeper to delay data fetching if it happens faster than 1s
        const sleepPromise = await sleep(1000);

        // Loaded notesItem list
        const [loadedNotesItemList, loadedArchivedNotesItemList] =
          await Promise.all([
            (async () => {
              const notesItems = (await promisify(
                mApi().notes.owner.read(studentId, { listArchived: false }),
                "callback"
              )()) as NotesItemRead[];

              return notesItems;
            })(),
            (async () => {
              const NotesItemsArchived = (await promisify(
                mApi().notes.owner.read(studentId, { listArchived: true }),
                "callback"
              )()) as NotesItemRead[];

              return NotesItemsArchived;
            })(),
            sleepPromise,
          ]);

        if (componentMounted.current) {
          setNotesItem((notesItems) => ({
            ...notesItems,
            isLoadingList: false,
            notesItemList: setToDefaultSortingOrder(loadedNotesItemList),
            notesArchivedItemList: setToDefaultSortingOrder(
              loadedArchivedNotesItemList
            ),
          }));
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(
            i18n.text.get("plugin.records.notes.notification.load.error", err),
            "error"
          );
          setNotesItem((notesItems) => ({
            ...notesItems,
            isLoadingList: false,
          }));
        }
      }
    };

    loadNotesItemListData();
  }, [displayNotification, studentId, i18n]);

  React.useEffect(
    () => () => {
      componentMounted.current = false;
    },
    []
  );

  /**
   * Sort notesItem list by default order
   *
   * @param notesItemList notesItemList
   * @returns Sorted notesItems list in default priority order
   */
  const setToDefaultSortingOrder = (notesItemList: NotesItemRead[]) => {
    // Default sort order
    const order: string[] = [
      NotesItemPriority.HIGH,
      NotesItemPriority.NORMAL,
      NotesItemPriority.LOW,
    ];

    return notesItemList.sort(
      (a, b) => order.indexOf(a.priority) - order.indexOf(b.priority)
    );
  };

  /**
   * Creates notesItem
   *
   * @param newNotesItem newNotesItem
   * @param onSuccess onSuccess
   */
  const createNotesItem = async (
    newNotesItem: NotesItemCreate,
    onSuccess?: () => void
  ) => {
    setNotesItem((notesItems) => ({ ...notesItems, isUpdatingList: true }));

    try {
      // Creating and getting created notesItem
      const createdNotesItem = <NotesItemRead>(
        await promisify(mApi().notes.note.create(newNotesItem), "callback")()
      );

      if (createdNotesItem.isArchived) {
        // Initializing list
        const updatedArchivedNotesItemList = [
          ...notesItems.notesArchivedItemList,
        ];

        // Update list
        updatedArchivedNotesItemList.push(createdNotesItem);

        setNotesItem((notesItems) => ({
          ...notesItems,
          notesArchivedItemList: setToDefaultSortingOrder(
            updatedArchivedNotesItemList
          ),
          isUpdatingList: false,
        }));

        displayNotification(
          i18n.text.get("plugin.records.notes.notification.create.success"),
          "success"
        );
      } else {
        // Initializing list
        const updatedNotesItemList = [...notesItems.notesItemList];

        // Update list
        updatedNotesItemList.push(createdNotesItem);

        setNotesItem((notesItem) => ({
          ...notesItem,
          notesItemList: setToDefaultSortingOrder(updatedNotesItemList),
          isUpdatingList: false,
        }));

        onSuccess && onSuccess();

        displayNotification(
          i18n.text.get("plugin.records.notes.notification.create.success"),
          "success"
        );
      }
    } catch (err) {
      displayNotification(
        i18n.text.get("plugin.records.notes.notification.create.error", err),
        "error"
      );
      setNotesItem((notesItem) => ({
        ...notesItem,
        isUpdatingList: false,
      }));
    }
  };

  /**
   * Updates one notesItems data
   *
   * @param notesItemId notesItemId
   * @param notesItemToBeUpdated updatedNotesItem
   * @param onSuccess onSuccess
   */
  const updateNotesItem = async (
    notesItemId: number,
    notesItemToBeUpdated: NotesItemUpdate,
    onSuccess?: () => void
  ) => {
    setNotesItem((notesItems) => ({ ...notesItems, isUpdatingList: true }));

    try {
      // Updating and getting updated notesItem
      const updatedNotesItem = <NotesItemRead>(
        await promisify(
          mApi().notes.note.update(notesItemId, notesItemToBeUpdated),
          "callback"
        )()
      );

      // Initializing list
      const updatedNotesItemList = [...notesItems.notesItemList];

      // Finding index of notesItem which got updated
      const indexOfOldNote = updatedNotesItemList.findIndex(
        (j) => j.id === notesItemId
      );

      // Splice it out and replace with updated one
      updatedNotesItemList.splice(indexOfOldNote, 1, updatedNotesItem);

      setNotesItem((notesItems) => ({
        ...notesItems,
        notesItemList: setToDefaultSortingOrder(updatedNotesItemList),
        isUpdatingList: false,
      }));

      onSuccess && onSuccess();

      displayNotification(
        i18n.text.get("plugin.records.notes.notification.edit.success"),
        "success"
      );
    } catch (err) {
      displayNotification(
        i18n.text.get("plugin.records.notes.notification.edit.error", err),
        "error"
      );
      setNotesItem((notesItems) => ({
        ...notesItems,
        isUpdatingList: false,
      }));
    }
  };

  /**
   * Pins noteItem. Same as update but only pinned value changes
   *
   * @param notesItemId noteItemId
   * @param notesItem updatedNoteItem
   * @param onSuccess onSuccess
   */
  const pinNotesItem = async (
    notesItemId: number,
    notesItem: NotesItemUpdate,
    onSuccess?: () => void
  ) => {
    setNotesItem((notesItems) => ({ ...notesItems, isUpdatingList: true }));

    // Creating notesItem object where pinned property has changed
    const notesItemToPin = {
      ...notesItem,
      pinned: !notesItem.pinned,
    };

    try {
      // Updating and getting updated noteItem
      const updatedNotesItem = <NotesItemRead>(
        await promisify(
          mApi().notes.note.update(notesItemId, notesItemToPin),
          "callback"
        )()
      );

      // Initializing list
      const updatedNotesItemList = [...notesItems.notesItemList];

      // Finding index of notesItem which got updated
      const indexOfOldNote = updatedNotesItemList.findIndex(
        (j) => j.id === notesItemId
      );

      // Splice it out and replace with updated one
      updatedNotesItemList.splice(indexOfOldNote, 1, updatedNotesItem);

      setNotesItem((notesItems) => ({
        ...notesItems,
        notesItemList: setToDefaultSortingOrder(updatedNotesItemList),
        isUpdatingList: false,
      }));

      onSuccess && onSuccess();
    } catch (err) {
      displayNotification(
        i18n.text.get("plugin.records.notes.notification.pinn.error", err),
        "error"
      );
      setNotesItem((notesItems) => ({
        ...notesItems,
        isUpdatingList: false,
      }));
    }
  };

  /**
   * Archives one notesItem
   *
   * @param notesItemId notesItemId
   * @param onSuccess onSuccess
   */
  const archiveNotesItem = async (
    notesItemId: number,
    onSuccess?: () => void
  ) => {
    setNotesItem((notesItems) => ({ ...notesItems, isUpdatingList: true }));

    try {
      // Updating and getting updated notesItem
      const updatedNotesItem = <NotesItemRead>(
        await promisify(
          mApi().notes.note.toggleArchived.update(notesItemId),
          "callback"
        )()
      );

      // Initializing list
      const updatedNotesItemList = [...notesItems.notesItemList];
      const updatedNotesArchivedItemList = [
        ...notesItems.notesArchivedItemList,
      ];

      // Finding index of notesItem that was just updated
      const indexOfOldNote = updatedNotesItemList.findIndex(
        (j) => j.id === notesItemId
      );

      // Update lists by removing and adding updated notesItem
      updatedNotesItemList.splice(indexOfOldNote, 1);
      updatedNotesArchivedItemList.push(updatedNotesItem);

      setNotesItem((notesItems) => ({
        ...notesItems,
        notesItemList: setToDefaultSortingOrder(updatedNotesItemList),
        notesArchivedItemList: setToDefaultSortingOrder(
          updatedNotesArchivedItemList
        ),
        isUpdatingList: false,
      }));

      onSuccess && onSuccess();

      displayNotification(
        i18n.text.get("plugin.records.notes.notification.archive.success"),
        "success"
      );
    } catch (err) {
      displayNotification(
        i18n.text.get("plugin.records.notes.notification.archive.error", err),
        "error"
      );
      setNotesItem((notesItems) => ({
        ...notesItems,
        isUpdatingList: false,
      }));
    }
  };

  /**
   * Returns archived notesItems from archived list
   *
   * @param notesItemId notesItemId
   * @param onSuccess onSuccess
   */
  const returnArchivedNotesItem = async (
    notesItemId: number,
    onSuccess?: () => void
  ) => {
    setNotesItem((notesItems) => ({ ...notesItems, isUpdatingList: true }));

    try {
      // Updating and getting updated notesItem
      const updatedNotesItem = <NotesItemRead>(
        await promisify(
          mApi().notes.note.toggleArchived.update(notesItemId),
          "callback"
        )()
      );

      // Initializing list
      const updatedNotesItemList = [...notesItems.notesItemList];
      const updatedNotesArchivedItemList = [
        ...notesItems.notesArchivedItemList,
      ];

      // Finding index of notesItem that was just updated
      const indexOfOldNote = updatedNotesArchivedItemList.findIndex(
        (j) => j.id === notesItemId
      );

      // Update lists by removing and adding updated notesItem
      updatedNotesItemList.push(updatedNotesItem);
      updatedNotesArchivedItemList.splice(indexOfOldNote, 1);

      setNotesItem((notesItems) => ({
        ...notesItems,
        notesItemList: setToDefaultSortingOrder(updatedNotesItemList),
        notesArchivedItemList: setToDefaultSortingOrder(
          updatedNotesArchivedItemList
        ),
        isUpdatingList: false,
      }));

      onSuccess && onSuccess();

      displayNotification(
        i18n.text.get("plugin.records.notes.notification.unarchive.success"),
        "success"
      );
    } catch (err) {
      displayNotification(
        i18n.text.get("plugin.records.notes.notification.unarchive.error", err),
        "error"
      );
      setNotesItem((notesItems) => ({
        ...notesItems,
        isUpdatingList: false,
      }));
    }
  };

  /**
   * changenotesItemStatus
   * @param notesItemId notesItemId
   * @param newStatus newStatus
   * @param onSuccess onSuccess
   */
  const updateNotesItemStatus = async (
    notesItemId: number,
    newStatus: NotesItemStatus,
    onSuccess?: () => void
  ) => {
    try {
      const indexOfNotesItem = notesItems.notesItemList.findIndex(
        (j) => j.id === notesItemId
      );

      const notesItemToUpdate = notesItems.notesItemList[indexOfNotesItem];

      notesItemToUpdate.status = newStatus;

      // Updating and getting updated journal
      const updatedNotesItem = <NotesItemRead>(
        await promisify(
          mApi().notes.note.update(notesItemId, notesItemToUpdate),
          "callback"
        )()
      );

      // Initializing list
      const updatedNotesItemList = [...notesItems.notesItemList];

      updatedNotesItemList.splice(indexOfNotesItem, 1, updatedNotesItem);

      setNotesItem((notesItems) => ({
        ...notesItems,
        notesItemList: setToDefaultSortingOrder(updatedNotesItemList),
        isUpdatingList: false,
      }));

      displayNotification(
        i18n.text.get("plugin.records.notes.notification.status.success"),
        "success"
      );
    } catch (err) {
      displayNotification(
        i18n.text.get("plugin.records.notes.notification.status.error", err),
        "error"
      );
      setNotesItem((notesItems) => ({
        ...notesItems,
        isUpdatingList: false,
      }));
    }
  };

  return {
    notesItems,
    /**
     * createNotesItem
     * @param newNotesItem newNotesItem
     * @param onSuccess onSuccess
     */
    createNotesItem: (newNotesItem: NotesItemCreate, onSuccess?: () => void) =>
      createNotesItem(newNotesItem, onSuccess),

    /**
     * updateNotesItem
     * @param notesItemId notesItemId
     * @param updatedNotesItem updatedNotesItem
     * @param onSuccess onSuccess
     */
    updateNotesItem: (
      notesItemId: number,
      updatedNotesItem: NotesItemUpdate,
      onSuccess?: () => void
    ) => updateNotesItem(notesItemId, updatedNotesItem, onSuccess),

    /**
     * archiveNotesItem
     * @param notesItemId journalId
     * @param onSuccess onSuccess
     */
    archiveNotesItem: (notesItemId: number, onSuccess?: () => void) =>
      archiveNotesItem(notesItemId, onSuccess),

    /**
     * returnArchivedNotesItem
     * @param notesItemId notesItemId
     * @param onSuccess onSuccess
     */
    returnArchivedNotesItem: (notesItemId: number, onSuccess?: () => void) =>
      returnArchivedNotesItem(notesItemId, onSuccess),

    /**
     * pinNotesItem
     * @param notesItemId notesItemId
     * @param notesItem notesItem
     * @param onSuccess onSuccess
     */
    pinNotesItem: (
      notesItemId: number,
      notesItem: NotesItemUpdate,
      onSuccess?: () => void
    ) => pinNotesItem(notesItemId, notesItem, onSuccess),

    /**
     * updateNotesItemStatus
     * @param notesItemId notesItemId
     * @param notesItemStatus notesItemStatus
     * @param onSuccess onSuccess
     */
    updateNotesItemStatus: (
      notesItemId: number,
      notesItemStatus: NotesItemStatus,
      onSuccess?: () => void
    ) => updateNotesItemStatus(notesItemId, notesItemStatus, onSuccess),
  };
};
