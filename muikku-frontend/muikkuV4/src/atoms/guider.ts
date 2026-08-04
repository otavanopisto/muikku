import { atom } from "jotai";
import { atomWithQuery, atomWithInfiniteQuery } from "jotai-tanstack-query";
import type { FlaggedStudent, GuiderStudent } from "~/generated/client";
import { userAtom } from "./auth";
import { getGuiderApi, isMApiError, isResponseError } from "~/api";
import type { AsyncState } from "src/types/AsyncState";

const guiderApi = getGuiderApi();

const EMPTY_STUDENTS: FlaggedStudent[] = [];

/** Drives current-student query — set from guiderStudentLoader. */
export const currentStudentIdAtom = atom<string | null>(null);

/** Server cache — do not useAtomValue in components. */
export const currentStudentQueryAtom = atomWithQuery((get) => {
  const studentId = get(currentStudentIdAtom);

  return {
    queryKey: ["guider", "student", studentId],
    queryFn: async (): Promise<GuiderStudent> => {
      if (!studentId) {
        throw new Error("Student ID is required");
      }

      try {
        return await guiderApi.getGuiderStudent({ studentId });
      } catch (err) {
        if (!isMApiError(err)) throw err;
        if (isResponseError(err)) {
          throw new Error(err.message);
        }
        throw new Error("Failed to get current student");
      }
    },
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
    retry: false,
  };
});

// logic atoms
export const currentStudentDataAtom = atom(
  (get) => get(currentStudentQueryAtom).data ?? null
);
export const currentStudentIsLoadingAtom = atom(
  (get) => get(currentStudentQueryAtom).isLoading
);
export const currentStudentErrorAtom = atom(
  (get) => get(currentStudentQueryAtom).error ?? null
);

/** Current student async state atom */
export const currentStudentAsyncStateAtom = atom<AsyncState>((get) => {
  const query = get(currentStudentQueryAtom);
  if (query.isLoading) return "loading";
  if (query.isError) return "error";
  if (query.data) return "ready";
  return "idle";
});

/** Refetch current student */
export const refetchCurrentStudentAtom = atom(null, (get) => {
  void get(currentStudentQueryAtom).refetch();
});

/** Search string — synced from URL in guiderLoader / StudentsList. */
export const guiderStudentsQueryAtom = atom<string>("");

/** Server cache — do not useAtomValue in components. */
export const guiderStudentsInfiniteQueryAtom = atomWithInfiniteQuery((get) => {
  const query = get(guiderStudentsQueryAtom);
  const flagOwnerIdentifier = get(userAtom)?.identifier ?? "";

  return {
    initialPageParam: 0,
    queryKey: ["guider", "students", query, flagOwnerIdentifier],
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

        students = students || [];
        const hasMore = students.length === MAX_LOADED_AT_ONCE + 1;
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
        if (!isMApiError(err)) throw err;
        if (isResponseError(err)) {
          throw new Error(err.message);
        }
        throw new Error("Failed to load students");
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!flagOwnerIdentifier,
    staleTime: 5 * 60 * 1000,
    retry: false,
  };
});

// Guider students data atoms
export const guiderStudentsDataAtom = atom((get) => {
  const data = get(guiderStudentsInfiniteQueryAtom).data;
  if (!data) return EMPTY_STUDENTS;
  return data.pages.flatMap((page) => page.data);
});

// Logic atoms
export const guiderStudentsHasNextPageAtom = atom(
  (get) => get(guiderStudentsInfiniteQueryAtom).hasNextPage ?? false
);
export const guiderStudentsIsFetchingNextPageAtom = atom(
  (get) => get(guiderStudentsInfiniteQueryAtom).isFetchingNextPage
);
export const guiderStudentsIsLoadingAtom = atom(
  (get) => get(guiderStudentsInfiniteQueryAtom).isLoading
);
export const guiderStudentsErrorAtom = atom(
  (get) => get(guiderStudentsInfiniteQueryAtom).error ?? null
);

/** Guider students async state atom */
export const guiderStudentsAsyncStateAtom = atom<AsyncState>((get) => {
  const query = get(guiderStudentsInfiniteQueryAtom);
  if (query.isLoading) return "loading";
  if (query.isError) return "error";
  if (query.data) return "ready";
  return "idle";
});

/** Load more guider students */
export const loadMoreGuiderStudentsAtom = atom(null, (get) => {
  const query = get(guiderStudentsInfiniteQueryAtom);
  if (query.hasNextPage && !query.isFetchingNextPage) {
    void query.fetchNextPage();
  }
});

/** Refetch guider students */
export const refetchGuiderStudentsAtom = atom(null, (get) => {
  void get(guiderStudentsInfiniteQueryAtom).refetch();
});
