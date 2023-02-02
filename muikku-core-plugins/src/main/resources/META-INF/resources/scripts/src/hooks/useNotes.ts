import * as React from "react";
import promisify from "~/util/promisify";
import { StatusType } from "~/reducers/base/status";
import mApi from "~/lib/mApi";
import {
  NotesItemRead,
  NotesItemStatus,
  NotesItemUpdate,
} from "~/@types/notes";
import { useTranslation } from "react-i18next";
import { Role } from "~/reducers/base/status";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";

/**
 * A hook for getting notes with status "ONGOING" and functions to manipulate them
 * @param status user status for user
 * @param i18nOLD localization
 * @param displayNotification notification thunk
 * @returns an array of notes and functions to update and change status
 */
export const useOnGoingNotes = (
  status: StatusType,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [notes, setNotes] = React.useState(<NotesItemRead[]>[]);
  const { userId, role } = status;
  const { t } = useTranslation("tasks");

  React.useEffect(() => {
    // This is for students only hook, if you call it as someone else, no loading should happen
    if (role !== Role.STUDENT) {
      return;
    }

    /**
     * loads Notes
     */
    const loadNotes = async () => {
      try {
        const notesItems = (await promisify(
          mApi().notes.owner.read(userId, { listArchived: false }),
          "callback"
        )()) as NotesItemRead[];
        setNotes(notesItems.filter((note) => note.status === "ONGOING"));
      } catch (err) {
        displayNotification(
          t("notifications.loadError", { error: err }),
          "error"
        );
      }
    };
    loadNotes();
  }, [userId, role, displayNotification, t]);

  /**
   * changenotesItemStatus
   * @param noteId notesItemId
   * @param newStatus newStatus
   */
  const updateNoteStatus = async (
    noteId: number,
    newStatus: NotesItemStatus
  ) => {
    try {
      const indexOfNotesItem = notes.findIndex((j) => j.id === noteId);

      const notesItemToUpdate = notes[indexOfNotesItem];

      notesItemToUpdate.status = newStatus;

      // Updating

      await promisify(
        mApi().notes.note.update(noteId, notesItemToUpdate),
        "callback"
      )();

      // Initializing list
      const updatedNotesItemList = [...notes];

      // Remove the item that was just updated to something else than "ONGOING"
      updatedNotesItemList.splice(indexOfNotesItem, 1);

      setNotes(updatedNotesItemList);

      displayNotification(
        t("notifications.updateSuccess", { context: "taskState" }),
        "success"
      );
    } catch (err) {
      displayNotification(
        t("notifications.updateError", { context: "taskState", error: err }),
        "error"
      );
    }
  };

  /**
   * Updates one notesItems data
   *
   * @param noteId id of the note to be updated
   * @param update update data
   * @param onSuccess onSuccess
   */
  const updateNote = async (
    noteId: number,
    update: NotesItemUpdate,
    onSuccess?: () => void
  ) => {
    try {
      // Updating and getting updated notesItem
      const updatedNotesItem = <NotesItemRead>(
        await promisify(mApi().notes.note.update(noteId, update), "callback")()
      );

      // Initializing list
      const updatedNotesItemList = [...notes];

      // Finding index of notesItem which got updated
      const indexOfOldNote = updatedNotesItemList.findIndex(
        (j) => j.id === noteId
      );

      // Splice it out and replace with updated one
      updatedNotesItemList.splice(indexOfOldNote, 1, updatedNotesItem);

      setNotes(updatedNotesItemList);

      onSuccess && onSuccess();

      displayNotification(t("notifications.updateSuccess"), "success");
    } catch (err) {
      displayNotification(
        t("notifications.updateError", { error: err }),
        "error"
      );
    }
  };

  return {
    notes,
    /**
     * updateNoteStatus
     * @param noteId note's id
     * @param newStatus new status for noter
     */
    updateNoteStatus: (noteId: number, newStatus: NotesItemStatus) => {
      updateNoteStatus(noteId, newStatus);
    },
    updateNote: (
      noteId: number,
      update: NotesItemUpdate,
      onSuccess?: () => void
    ) => {
      updateNote(noteId, update, onSuccess);
    },
  };
};
