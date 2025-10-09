import { atom } from "jotai";
import MApi, { isMApiError, isResponseError } from "~/api";
import { atomWithQuery } from "jotai-tanstack-query";
import type { GuiderStudent } from "~/generated/client";
import type { AsyncStateData } from "~/src/types/AsyncState";
import {
  createAsyncError,
  parseAsyncStateFromQuery,
} from "../utils/AtomHelpers";

const guiderApi = MApi.getGuiderApi();

export type CurrentStudent = AsyncStateData<GuiderStudent>;

// Student ID atom - this will trigger the query
export const currentStudentIdAtom = atom<string | null>(null);

// TanStack Query integrated atom
export const currentStudentQueryAtom = atomWithQuery((get) => {
  const studentId = get(currentStudentIdAtom);

  return {
    queryKey: ["student", studentId],
    queryFn: async () => {
      if (!studentId) {
        throw new Error("Student ID is required");
      }

      // Your 5-second test delay
      await new Promise((resolve) => setTimeout(resolve, 5000));

      try {
        const currentStudent = await guiderApi.getGuiderStudent({
          studentId,
        });

        return currentStudent;
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        if (isResponseError(err)) {
          // Create a custom error with more details
          const error = new Error(err.message);
          // (error as any).status = err.response.status;
          // (error as any).code = err.response.status;
          throw error;
        }

        throw new Error("Failed to get current student");
      }
    },
    enabled: !!studentId, // Only run if studentId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  };
});

// Derived atoms for easy access
export const currentStudentAtom = atom<CurrentStudent>((get) => {
  const query = get(currentStudentQueryAtom);
  return {
    data: query.data ?? null,
    state: parseAsyncStateFromQuery(query),
    error: createAsyncError(query.error),
  };
});

// Keep the original getCurrentStudentAtom for backward compatibility
export const getCurrentStudentAtom = atom(null, (_, set, studentId: string) => {
  // Simply set the student ID, which will trigger the query
  set(currentStudentIdAtom, studentId);
});
