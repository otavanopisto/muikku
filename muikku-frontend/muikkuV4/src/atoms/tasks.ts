import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { userAtom } from "./auth";
import { getNotesApi } from "~/api";
import type {
  UpdateNoteReceiverRequest,
  UpdateNoteRequest,
  NoteStatusType,
  Note,
} from "~/generated/client";
import { FRONTPAGE_TASKS_QUERY_KEY, queryClient } from "~/src/queryClient";
import i18n from "~/src/locales/i18n";
import { handleApiError } from "./helpers/error";

const { t } = i18n;
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
    handleApiError(error, t("errors.load", { ns: "tasks" }));
  }
};

export const frontpageTasksRecipientQueryAtom = atomWithQuery((get) => {
  const userId = get(userAtom)?.id;

  if (!userId) {
    throw new Error(t("errors.userIdentifierRequired"));
  }
  return {
    queryKey: [...FRONTPAGE_TASKS_QUERY_KEY, userId],
    queryFn: async () => {
      try {
        return await recipientQueryFunction(userId, "ONGOING");
      } catch (error) {
        handleApiError(error, t("errors.load", { ns: "tasks" }));
      }
    },
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
        throw new Error(t("errors.taskIdRequired", { ns: "tasks" }));
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
      handleApiError(error, t("errors.updateTaskStatus", { ns: "tasks" }));
    }
  }
);

export const updateFrontpageTaskAtom = atom(
  null,
  async (_get, _set, taskId: number, request: UpdateNoteRequest) => {
    try {
      const userId = _get(userAtom)?.id;

      if (!userId) {
        throw new Error("User ID is required");
      }

      const task = await notesApi.updateNote({
        noteId: taskId,
        updateNoteRequest: request,
      });

      queryClient.setQueryData(
        [...FRONTPAGE_TASKS_QUERY_KEY, userId],
        (tasks: Note[] | undefined) => {
          if (!tasks) return tasks;
          return tasks.map((t) => (t.id === taskId ? task : t));
        }
      );
    } catch (error) {
      handleApiError(error, t("errors.updateTask", { ns: "tasks" }));
    }
  }
);

// DATA ATOMS

export const frontpageTasksRecipientDataAtom = atom(
  (get) => get(frontpageTasksRecipientQueryAtom).data
);
