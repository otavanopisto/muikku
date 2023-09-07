import * as React from "react";
import promisify from "~/util/promisify";
import { StatusType } from "~/reducers/base/status";
import mApi from "~/lib/mApi";
import {
  NotesItemRead,
  NotesItemStatus,
  NotesItemUpdate,
} from "~/@types/notes";
import { i18nType } from "~/reducers/base/i18n";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";

/**
 * A hook for getting notes with status "ONGOING" and functions to manipulate them
 * @param status user status for user
 * @param i18n localization
 * @param displayNotification notification thunk
 * @returns an array of notes and functions to update and change status
 */
export const useOnGoingNotes = (
  status: StatusType,
  i18n: i18nType,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [notes, setNotes] = React.useState(<NotesItemRead[]>[]);
  const { userId, role } = status;

  React.useEffect(() => {
    // This is for students only hook, if you call it as someone else, no loading should happen
    if (role !== "STUDENT") {
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
          i18n.text.get("plugin.records.tasks.notification.load.error", err),
          "error"
        );
      }
    };
    loadNotes();
  }, [userId, role, displayNotification, i18n]);

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
        i18n.text.get("plugin.records.tasks.notification.stateUpdate.success"),
        "success"
      );
    } catch (err) {
      displayNotification(
        i18n.text.get(
          "plugin.records.tasks.notification.stateUpdate.error",
          err
        ),
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

      displayNotification(
        i18n.text.get("plugin.records.tasks.notification.edit.success"),
        "success"
      );
    } catch (err) {
      displayNotification(
        i18n.text.get("plugin.records.tasks.notification.edit.error", err),
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
