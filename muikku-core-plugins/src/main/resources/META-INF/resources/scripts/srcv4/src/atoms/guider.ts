import { atom } from "jotai";
import MApi, { isMApiError, isResponseError } from "~/api";
import type { GuiderStudent } from "~/generated/client";

const guiderApi = MApi.getGuiderApi();

// Current student atom
export const currentStudentAtom = atom<{
  currentStudent: GuiderStudent | null;
  currentStudentState: "idle" | "loading" | "ready" | "error";
  errorMessage?: string | null;
  errorCode?: number | null;
}>({
  currentStudent: null,
  currentStudentState: "idle",
});

/**
 * Get current student atom
 */
export const getCurrentStudentAtom = atom(
  null,
  async (get, set, studentId: string) => {
    const previousStudent = get(currentStudentAtom);

    if (
      previousStudent.currentStudentState === "loading" ||
      previousStudent.currentStudent?.id === studentId
    ) {
      return;
    }

    set(currentStudentAtom, {
      ...previousStudent,
      currentStudentState: "loading",
    });

    try {
      const currentStudent = await guiderApi.getGuiderStudent({
        studentId,
      });

      set(currentStudentAtom, {
        currentStudent,
        currentStudentState: "ready",
      });
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      if (isResponseError(err)) {
        set(currentStudentAtom, {
          currentStudent: previousStudent.currentStudent,
          currentStudentState: "error",
          errorMessage: err.message,
          errorCode: err.response.status,
        });
      }

      throw new Error("Failed to get current student");
    }
  }
);
