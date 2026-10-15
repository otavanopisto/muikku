import { useMemo, useReducer, useRef } from "react";

/**
 * Sync flags the field manager writes via setState.
 */
export interface FieldSyncState {
  modified: boolean;
  synced: boolean;
  syncError: string | null;
}

/**
 * Class-component-shaped handle for useFieldManager.
 */
export function useFieldSyncHandle() {
  const syncRef = useRef<FieldSyncState>({
    modified: false,
    synced: true,
    syncError: null,
  });
  const [, bump] = useReducer((n: number) => n + 1, 0);

  return useMemo(
    () => ({
      get state() {
        return syncRef.current;
      },
      setState(update: Partial<FieldSyncState>) {
        syncRef.current = { ...syncRef.current, ...update };
        bump();
      },
    }),
    []
  );
}
