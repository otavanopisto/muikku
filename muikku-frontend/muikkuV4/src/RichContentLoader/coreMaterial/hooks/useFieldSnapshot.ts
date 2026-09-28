import { useMemo } from "react";
import { useMaterialContentContext } from "../MaterialContentProvider";

/**
 * Opt-in snapshot access for a single field (memo/journal/etc.).
 *
 * Owns:
 * - Reading MaterialContentLoaderValue.snapshots from context
 * - Returning null when snapshots capability is absent/disabled
 * - Resolving snapshot list + actions for the given fieldName
 *
 * Does not own:
 * - Creating the snapshots capability (orchestrator / createSnapshotCapability)
 * - API take/delete (handlers on the capability, usually from evaluation page)
 *
 * @param fieldName - Field content.name
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
