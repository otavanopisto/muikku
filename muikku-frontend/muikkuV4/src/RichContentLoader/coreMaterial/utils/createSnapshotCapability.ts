import type {
  MaterialAnswerSnapshot,
  MaterialCompositeReply,
} from "~/generated/client";
import type {
  FieldSnapshotCapabilities,
  MaterialSnapshotCapability,
} from "../types";

/**
 * Gets the snapshots for a field from the composite reply
 * @param compositeReplies - The composite reply
 * @param fieldName - The field name
 * @returns The snapshots for the field
 */
export function getAnswerSnapshots(
  compositeReplies: MaterialCompositeReply | undefined,
  fieldName: string
): MaterialAnswerSnapshot[] {
  const answer = compositeReplies?.answers?.find(
    (a) => a.fieldName === fieldName
  );
  return answer?.snapshots ?? [];
}

/**
 * Builds the optional context capability from caps + app handlers
 * @param caps - The capabilities
 * @param compositeReplies - The composite reply
 * @param handlers - The handlers
 * @returns The snapshot capability
 */
export function createSnapshotCapability(
  caps: FieldSnapshotCapabilities,
  compositeReplies: MaterialCompositeReply | undefined,
  handlers?: {
    onTake?: (fieldName: string) => void;
    onDelete?: (fieldName: string, snapshotId: number) => void;
  }
): MaterialSnapshotCapability | undefined {
  if (!caps.enabled) {
    return undefined;
  }

  return {
    enabled: caps.enabled,
    canView: caps.canView,
    canTake: caps.canTake,
    canDelete: caps.canDelete,
    getSnapshots: (fieldName) =>
      getAnswerSnapshots(compositeReplies, fieldName),
    onTake:
      caps.canTake && handlers?.onTake
        ? (fieldName) => handlers.onTake!(fieldName)
        : undefined,
    onDelete:
      caps.canDelete && handlers?.onDelete
        ? (fieldName, id) => handlers.onDelete!(fieldName, id)
        : undefined,
  };
}
