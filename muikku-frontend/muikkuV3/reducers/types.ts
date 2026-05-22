// Types that are shared potentially across all reducers. Naming should be generic enough.

/**
 * State type for tracking the state of a reducer. Could be used for invidual data fetching states.
 */
export type ReducerStatusType =
  | "LOADING"
  | "LOADING_MORE"
  | "ERROR"
  | "READY"
  | "IDLE";

/**
 * Initialize status type for tracking the initialization state of a reducer. Used mainly
 * to describe reducer main context initialization status.
 */
export type ReducerInitializeStatusType =
  | "INITIALIZING"
  | "INITIALIZED"
  | "INITIALIZATION_FAILED"
  | "IDLE";
