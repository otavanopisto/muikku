import { atom } from "jotai";
import MApi, { isMApiError, isResponseError } from "~/api";
import {
  atomWithQuery,
  atomWithInfiniteQuery,
  type AtomWithQueryResult,
  type AtomWithInfiniteQueryResult,
} from "jotai-tanstack-query";
import type { FlaggedStudent, GuiderStudent } from "~/generated/client";
import type { InfiniteData } from "@tanstack/react-query";
import { userAtom } from "./auth";

const guiderApi = MApi.getGuiderApi();

export type FlaggedStudents = AtomWithInfiniteQueryResult<
  InfiniteData<{
    data: FlaggedStudent[];
    hasMore: boolean;
    nextPage: number | undefined;
  }>
>;

export type CurrentStudent = AtomWithQueryResult<GuiderStudent>;

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

  return query;
});

// Keep the original getCurrentStudentAtom for backward compatibility
export const getCurrentStudentAtom = atom(null, (_, set, studentId: string) => {
  // Simply set the student ID, which will trigger the query
  set(currentStudentIdAtom, studentId);
});

// Query filter atom
export const guiderStudentsQueryAtom = atom<string>("");

// Students infinite query atom
export const guiderStudentsInfiniteQueryAtom = atomWithInfiniteQuery((get) => {
  const query = get(guiderStudentsQueryAtom);
  const flagOwnerIdentifier = get(userAtom)?.identifier ?? "";

  if (!flagOwnerIdentifier) {
    throw new Error("Flag owner identifier is required");
  }

  return {
    initialPageParam: 0,
    queryKey: ["guider-students", query, flagOwnerIdentifier],
    queryFn: async ({ pageParam = 0 }) => {
      const MAX_LOADED_AT_ONCE = 25;
      const firstResult = pageParam as number;
      const maxResults = MAX_LOADED_AT_ONCE + 1;

      try {
        let students = await guiderApi.getGuiderStudents({
          firstResult,
          maxResults,
          flagOwnerIdentifier,
          q: query || undefined,
        });

        // Handle null response (server returns null instead of empty array)
        students = students || [];
        const hasMore = students.length === MAX_LOADED_AT_ONCE + 1;

        // Remove extra item if we have more results
        const actualStudents = students.concat([]);
        if (hasMore) {
          actualStudents.pop();
        }

        return {
          data: actualStudents,
          hasMore,
          nextPage: hasMore ? firstResult + MAX_LOADED_AT_ONCE : undefined,
        };
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        if (isResponseError(err)) {
          const error = new Error(err.message);
          throw error;
        }

        throw new Error("Failed to load students");
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!flagOwnerIdentifier,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  };
});

export const guiderStudents = atom((get) => {
  const query = get(guiderStudentsInfiniteQueryAtom);

  return query;
});

export const loadMoreGuiderStudentsAtom = atom(null, (get) => {
  const query = get(guiderStudentsInfiniteQueryAtom);
  if (query.hasNextPage && !query.isFetchingNextPage) {
    void query.fetchNextPage();
  }
});
