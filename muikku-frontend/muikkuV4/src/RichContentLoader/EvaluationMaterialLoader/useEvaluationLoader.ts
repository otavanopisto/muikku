import { useMemo } from "react";
import { useContentProcessor } from "../core/hooks/useContentProcessor";
import { createEvaluationMaterialsRules } from "./rules";
import { useAnswerManager } from "../coreMaterial/hooks/useAnswerManager";
import type {
  MaterialContentLoaderValue,
  MaterialLoaderConfig,
  MaterialProcessingContext,
  Workspace,
} from "../coreMaterial/types";
import type {
  MaterialCompositeReply,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";
import { useAssignmentState } from "../coreMaterial/hooks/useAssignmentState";
import { resolveEvaluationSnapshotCapabilities } from "../coreMaterial/utils/resolveEvaluationSnapshotCapabilities";
import { createSnapshotCapability } from "../coreMaterial/utils/createSnapshotCapability";

/**
 * Evaluation orchestrator for EvaluationMaterialLoader.
 *
 * Composes:
 * - useAnswerManager — registry for preprocess boxes / counts (when wired)
 * - useContentProcessor + evaluation rules — HTML → React
 * - Optional snapshots capability (policy + app take/delete handlers)
 *
 * Policy (fixed for evaluation):
 * - readOnly, not answerable
 * - answers always checked/visible for field UI
 *
 * Does not own:
 * - Student submit/withdraw or field websocket saves
 * - Snapshot API actions (injected snapshotHandlers)
 * - Materials modifyState / UNANSWERED→ANSWERED side effects
 *
 * @param material
 * @param workspace
 * @param compositeReplies
 * @param assignment
 * @param config - Merged with evaluation defaults
 * @param snapshotHandlers - Optional take/delete from evaluation feature
 * @returns MaterialContentLoaderValue for EvaluationContentProvider
 */
export function useEvaluationMaterialsLoader(
  material: MaterialContentNode,
  workspace: Workspace,
  compositeReplies?: MaterialCompositeReply,
  assignment?: WorkspaceMaterial,
  config: MaterialLoaderConfig = {},
  snapshotHandlers?: {
    onTake?: (fieldName: string) => void;
    onDelete?: (fieldName: string, snapshotId: number) => void;
  }
): MaterialContentLoaderValue {
  // Assignment state management
  const assignmentState = useAssignmentState(
    workspace,
    material,
    compositeReplies
  );

  // No assignment button machine on evaluation side (for now)
  const answerManager = useAnswerManager(
    material,
    compositeReplies,
    assignmentState.stateConfig,
    config
  );

  const snapshotCapability = useMemo(
    () =>
      createSnapshotCapability(
        resolveEvaluationSnapshotCapabilities({
          compositeReply: compositeReplies,
          lock: compositeReplies?.lock,
        }),
        compositeReplies,
        snapshotHandlers
      ),
    [compositeReplies, snapshotHandlers]
  );

  const processingContext = useMemo<MaterialProcessingContext>(
    () => ({
      material,
      workspace,
      compositeReplies,
      readOnly: true, // <--- evaluation is always read only
      answerable: false, // <--- evaluation is always not answerable
      displayCorrectAnswers: true, // <--- evaluation is always shows correct answers
      checkAnswers: true, // <--- evaluation is always checks answers
      invisible: false,
      answerRegistry: answerManager.answerRegistry,
      snapshots: snapshotCapability,
    }),
    [
      material,
      workspace,
      compositeReplies,
      answerManager.answerRegistry,
      snapshotCapability,
    ]
  );

  // Create processing rules
  const rules = useMemo(() => createEvaluationMaterialsRules(), []);

  // Process content
  const processedContent = useContentProcessor(
    material.html ?? null,
    rules,
    processingContext
  );

  return {
    material,
    workspace,
    processedContent,
    config,
    readOnly: true, // <--- evaluation is always read only
    answerable: false, // <--- evaluation is always not answerable

    // what evaluation cares about: show/check answers
    answersVisible: true, // <--- evaluation is always shows correct answers
    answersChecked: true, // <--- evaluation is always checks answers
    answerRegistry: answerManager.answerRegistry,

    // optional data
    compositeReplies,
    assignment,

    // optional capabilities
    snapshots: snapshotCapability,
  };
}
