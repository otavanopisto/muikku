import { isMApiError, isResponseError } from "~/api";

/** Handle Atom API errors */
export function handleApiError(error: unknown, message: string): void {
  if (!isMApiError(error)) throw error;
  if (isResponseError(error)) {
    throw new Error(error.message);
  }
  throw new Error(message);
}
