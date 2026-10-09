import type {
  FieldSnapshotCapabilities,
  FieldSnapshotPolicyContext,
} from "../types";
import { DISABLED_FIELD_SNAPSHOT_CAPABILITIES } from "./defaults";

/**
 * Evaluation policy: view always when reply exists;
 * take/delete only when SUBMITTED or INCOMPLETE.
 * (No usedAs — the evaluation shell decides to use this policy.)
 */
export function resolveEvaluationSnapshotCapabilities(
  ctx: FieldSnapshotPolicyContext
): FieldSnapshotCapabilities {
  const { compositeReply } = ctx;
  if (!compositeReply) {
    return DISABLED_FIELD_SNAPSHOT_CAPABILITIES;
  }

  const state = compositeReply.state;
  const canTake = state === "SUBMITTED" || state === "INCOMPLETE";

  return {
    enabled: true,
    canView: true,
    canTake,
    canDelete: canTake,
  };
}
