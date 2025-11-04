import type { AtomWithQueryResult } from "jotai-tanstack-query";
import type { AsyncState, AsyncStateError } from "~/src/types/AsyncState";

/**
 * getAsyncStateValue - Get async state value
 * @param query - Query to get value from
 * @returns Async state value
 */
export const parseAsyncStateFromQuery = (
  query: AtomWithQueryResult
): AsyncState => {
  if (query.isLoading) return "loading";
  if (query.isError) return "error";
  if (query.data) return "ready";
  return "idle";
};

/**
 * Create error object from Error
 */
export function createAsyncError(error: Error | null): AsyncStateError | null {
  return error
    ? {
        message: error.message,
      }
    : null;
}
