import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { sleep } from "~/helper-functions/shared";
import { UseNotesItem } from "~/@types/notes";
import { useTranslation } from "react-i18next";
import MApi from "~/api/api";
import {
  Note,
  NotePriorityType,
  NoteStatusType,
  CreateNoteRequest,
  UpdateNoteRequest,
} from "~/generated/client";

/**
 * initialState
 */
const initialState: UseNotesItem = {
  isLoadingList: true,
  isUpdatingList: false,
  notesItemList: [],
  notesArchivedItemList: [],
};

const notesApi = MApi.getNotesApi();

/**
 * Custom hook notesItems list
 *
 * @param studentId "userId"
 * @param displayNotification displayNotification
 * @returns notesItems lists and methods to create, update, pin, archive and return archived notesItems
 */
export const useNotesItem = (
  studentId: number,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [notesItems, setNotesItem] = React.useState<UseNotesItem>(initialState);
  const componentMounted = React.useRef(true);
  const { t } = useTranslation("tasks");

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
              const notesItems = await notesApi.getNotesByRecipient({
                recipientId: studentId,
              });
              return notesItems;
            })(),
            (async () => {
              const notesItemsArchived = await notesApi.getNotesByRecipient({
                recipientId: studentId,
                listArchived: true,
              });

              return notesItemsArchived;
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
            t("notifications.loadError", { error: err }),
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
  }, [displayNotification, studentId, t]);

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
  const setToDefaultSortingOrder = (notesItemList: Note[]) => {
    // Default sort order
    const order: NotePriorityType[] = ["HIGH", "NORMAL", "LOW"];

    return notesItemList.sort(
      (a, b) => order.indexOf(a.priority) - order.indexOf(b.priority)
    );
  };

  /**
   * Creates notesItem
   *
   * @param createNoteRequest newNotesItem
   * @param onSuccess onSuccess
   */
  const createNotesItem = async (
    createNoteRequest: CreateNoteRequest,
    onSuccess?: () => void
  ) => {
    setNotesItem((notesItems) => ({ ...notesItems, isUpdatingList: true }));

    try {
      // Creating and getting created notesItem
      const createdNotesItem = await notesApi.createNote({
        createNoteRequest,
      });

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

        displayNotification(t("notifications.createSuccess"), "success");
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

        displayNotification(t("notifications.createSuccess"), "success");
      }
    } catch (err) {
      displayNotification(
        t("notifications.createError", { error: err }),
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
   * @param updateNoteRequest updatedNotesItem
   * @param onSuccess onSuccess
   */
  const updateNotesItem = async (
    notesItemId: number,
    updateNoteRequest: UpdateNoteRequest,
    onSuccess?: () => void
  ) => {
    setNotesItem((notesItems) => ({ ...notesItems, isUpdatingList: true }));

    try {
      // Updating and getting updated notesItem
      const updatedNotesItem = await notesApi.updateNote({
        noteId: notesItemId,
        updateNoteRequest: updateNoteRequest,
      });

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

      displayNotification(t("notifications.updateSuccess"), "success");
    } catch (err) {
      displayNotification(
        t("notifications.updateError", { error: err }),
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
   * @param updateNoteRequest updateNoteRequest
   * @param onSuccess onSuccess
   */
  const pinNotesItem = async (
    notesItemId: number,
    updateNoteRequest: UpdateNoteRequest,
    onSuccess?: () => void
  ) => {
    setNotesItem((notesItems) => ({ ...notesItems, isUpdatingList: true }));

    // Creating notesItem object where pinned property has changed
    const notesItemToPin = {
      ...updateNoteRequest,
      pinned: !updateNoteRequest.pinned,
    };

    try {
      // Updating and getting updated noteItem
      const updatedNotesItem = await notesApi.updateNote({
        noteId: notesItemId,
        updateNoteRequest: notesItemToPin,
      });

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
      displayNotification(t("notifications.pinError", { error: err }), "error");
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
      const updatedNotesItem = await notesApi.toggleNoteArchived({
        noteId: notesItemId,
      });

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

      displayNotification(t("notifications.archiveSuccess"), "success");
    } catch (err) {
      displayNotification(
        t("notifications.archiveError", { error: err }),
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
      const updatedNotesItem = await notesApi.toggleNoteArchived({
        noteId: notesItemId,
      });

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

      displayNotification(t("notifications.unarchiveSuccess"), "success");
    } catch (err) {
      displayNotification(
        t("notifications.unarchiveError", { error: err }),
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
    newStatus: NoteStatusType,
    onSuccess?: () => void
  ) => {
    try {
      const indexOfNotesItem = notesItems.notesItemList.findIndex(
        (j) => j.id === notesItemId
      );

      const notesItemToUpdate = notesItems.notesItemList[indexOfNotesItem];

      notesItemToUpdate.status = newStatus;

      // Updating and getting updated notesItem
      const updatedNotesItem = await notesApi.updateNote({
        noteId: notesItemId,
        updateNoteRequest: notesItemToUpdate,
      });

      // Initializing list
      const updatedNotesItemList = [...notesItems.notesItemList];

      updatedNotesItemList.splice(indexOfNotesItem, 1, updatedNotesItem);

      setNotesItem((notesItems) => ({
        ...notesItems,
        notesItemList: setToDefaultSortingOrder(updatedNotesItemList),
        isUpdatingList: false,
      }));

      displayNotification(
        t("notifications.updateSuccess", { context: "state" }),
        "success"
      );
    } catch (err) {
      displayNotification(
        t("notifications.updateError", { context: "state", error: err }),
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
     * @param createNoteRequest createNoteRequest
     * @param onSuccess onSuccess
     */
    createNotesItem: (
      createNoteRequest: CreateNoteRequest,
      onSuccess?: () => void
    ) => createNotesItem(createNoteRequest, onSuccess),

    /**
     * updateNotesItem
     * @param notesItemId notesItemId
     * @param updateNoteRequest updateNoteRequest
     * @param onSuccess onSuccess
     */
    updateNotesItem: (
      notesItemId: number,
      updateNoteRequest: UpdateNoteRequest,
      onSuccess?: () => void
    ) => updateNotesItem(notesItemId, updateNoteRequest, onSuccess),

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
     * @param updateNoteRequest updateNoteRequest
     * @param onSuccess onSuccess
     */
    pinNotesItem: (
      notesItemId: number,
      updateNoteRequest: UpdateNoteRequest,
      onSuccess?: () => void
    ) => pinNotesItem(notesItemId, updateNoteRequest, onSuccess),

    /**
     * updateNotesItemStatus
     * @param notesItemId notesItemId
     * @param notesItemStatus notesItemStatus
     * @param onSuccess onSuccess
     */
    updateNotesItemStatus: (
      notesItemId: number,
      notesItemStatus: NoteStatusType,
      onSuccess?: () => void
    ) => updateNotesItemStatus(notesItemId, notesItemStatus, onSuccess),
  };
};
