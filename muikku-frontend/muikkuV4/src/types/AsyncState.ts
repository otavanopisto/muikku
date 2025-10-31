export type AsyncState = "loading" | "error" | "ready" | "idle";

/**
 * AsyncStateError - Async state error
 */
export interface AsyncStateError {
  message: string;
  //code: number;
}

/**
 * AsyncStateData - Async state data
 */
export interface AsyncStateData<T> {
  state: AsyncState;
  data: T | null;
  error: AsyncStateError | null;
}
