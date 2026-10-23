import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { userAtom } from "./auth";
import { getNotesApi, isMApiError, isResponseError } from "~/api";
import type {
  UpdateNoteReceiverRequest,
  NoteStatusType,
  Note,
} from "~/generated/client";
import { FRONTPAGE_TASKS_QUERY_KEY, queryClient } from "~/src/queryClient";

const notesApi = getNotesApi();

const recipientQueryFunction = async (
  userId: number,
  status?: NoteStatusType
) => {
  try {
    const notes = await notesApi.getNotesByRecipient({
      recipientId: userId,
    });
    if (status) {
      return notes.filter(
        (note) =>
          note.recipients.find((recipient) => recipient.recipientId === userId)
            ?.status === status
      );
    }
    return notes;
  } catch (error) {
    if (!isMApiError(error)) throw error;
    if (isResponseError(error)) throw new Error(error.message);
    throw new Error("Failed to load notes ");
  }
};

export const frontpageTasksRecipientQueryAtom = atomWithQuery((get) => {
  const userId = get(userAtom)?.id;

  if (!userId) {
    throw new Error("User ID is required");
  }
  return {
    queryKey: [...FRONTPAGE_TASKS_QUERY_KEY, userId],
    queryFn: () => recipientQueryFunction(userId, "ONGOING"),
  };
});

export const updateFrontpageTaskStatusAtom = atom(
  null,
  async (_get, _set, userId: number, task: Note, status: NoteStatusType) => {
    try {
      const updateRequest: UpdateNoteReceiverRequest = {
        status,
        pinned:
          task.recipients.find((recipient) => recipient.recipientId === userId)
            ?.pinned ?? false,
      };

      if (!task.id) {
        throw new Error("Task ID is required");
      }

      const recipient = await notesApi.updateNoteReceiver({
        noteId: task.id,
        recipientId: userId,
        updateNoteReceiverRequest: updateRequest,
      });

      queryClient.setQueryData(
        [...FRONTPAGE_TASKS_QUERY_KEY, userId],
        (tasks: Note[] | undefined) => {
          if (!tasks) return tasks;
          return tasks
            .map((t) =>
              t.id === task.id
                ? {
                    ...t,
                    recipients: t.recipients.map((item) =>
                      item.recipientId === userId ? recipient : item
                    ),
                  }
                : t
            )
            .filter(
              (ft) =>
                ft.recipients.find((item) => item.recipientId === userId)
                  ?.status === "ONGOING"
            );
        }
      );
    } catch (error) {
      if (!isMApiError(error)) throw error;
      if (isResponseError(error)) throw new Error(error.message);
      throw new Error("Failed to update task status");
    }
  }
);

// DATA ATOMS

export const frontpageTasksRecipientDataAtom = atom(
  (get) => get(frontpageTasksRecipientQueryAtom).data
);
