import { useMemo } from "react";
import { useMaterialContentContext } from "../MaterialContentProvider";

/**
 * Opt-in helper for field components (memo/journal/etc.)
 */
export function useFieldSnapshots(fieldName: string) {
  const { snapshots } = useMaterialContentContext();

  return useMemo(() => {
    if (!snapshots?.enabled) {
      return null;
    }

    return {
      canView: snapshots.canView,
      canTake: snapshots.canTake,
      canDelete: snapshots.canDelete,
      items: snapshots.getSnapshots(fieldName),
      onTake: snapshots.onTake,
      onDelete: snapshots.onDelete,
    };
  }, [snapshots, fieldName]);
}
