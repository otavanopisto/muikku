import * as React from "react";
import { StatusType } from "~/reducers/base/status";
import { useTranslation } from "react-i18next";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { Note, NoteStatusType, Role, UpdateNoteRequest } from "~/generated/client";
import MApi from "~/api/api";
import { Role } from "~/generated/client"

const notesApi = MApi.getNotesApi();

/**
 * A hook for getting notes with status "ONGOING" and functions to manipulate them
 * @param status user status for user
 * @param displayNotification notification thunk
 * @returns an array of notes and functions to update and change status
 */
export const useOnGoingNotes = (
  status: StatusType,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [notes, setNotes] = React.useState(<Note[]>[]);
  const { userId, roles } = status;
  const { t } = useTranslation("tasks");

  React.useEffect(() => {
    // This is for students only hook, if you call it as someone else, no loading should happen
    if (roles ? roles.includes(Role.Student) : false) {
      return;
    }

    /**
     * loads Notes
     */
    const loadNotes = async () => {
      try {
        const notesItems = await notesApi.getNotes({
          ownerId: userId,
        });

        setNotes(notesItems.filter((note) => note.status === "ONGOING"));
      } catch (err) {
        displayNotification(
          t("notifications.loadError", { error: err }),
          "error"
        );
      }
    };
    loadNotes();
  }, [userId, roles, displayNotification, t]);

  /**
   * changenotesItemStatus
   * @param noteId notesItemId
   * @param newStatus newStatus
   */
  const updateNoteStatus = async (
    noteId: number,
    newStatus: NoteStatusType
  ) => {
    try {
      const indexOfNotesItem = notes.findIndex((j) => j.id === noteId);

      const notesItemToUpdate = notes[indexOfNotesItem];

      notesItemToUpdate.status = newStatus;

      // Updating
      await notesApi.updateNote({
        noteId,
        updateNoteRequest: notesItemToUpdate,
      });

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
   * @param updateNoteRequest update data
   * @param onSuccess onSuccess
   */
  const updateNote = async (
    noteId: number,
    updateNoteRequest: UpdateNoteRequest,
    onSuccess?: () => void
  ) => {
    try {
      // Updating and getting updated notesItem
      const updatedNotesItem = await notesApi.updateNote({
        noteId,
        updateNoteRequest,
      });

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
    updateNoteStatus: (noteId: number, newStatus: NoteStatusType) => {
      updateNoteStatus(noteId, newStatus);
    },
    /**
     * updateNote
     * @param noteId noteId
     * @param updateNoteRequest updateNoteRequest
     * @param onSuccess onSuccess
     */
    updateNote: (
      noteId: number,
      updateNoteRequest: UpdateNoteRequest,
      onSuccess?: () => void
    ) => {
      updateNote(noteId, updateNoteRequest, onSuccess);
    },
  };
};
