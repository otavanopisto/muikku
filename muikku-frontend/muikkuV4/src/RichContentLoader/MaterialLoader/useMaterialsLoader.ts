import { useCallback, useMemo } from "react";
import { useContentProcessor } from "../core/hooks/useContentProcessor";
import { createMaterialsRules } from "./rules";
import { useAssignmentState } from "../coreMaterial/hooks/useAssignmentState";
import { useAnswerManager } from "../coreMaterial/hooks/useAnswerManager";
import type {
  MaterialContentLoaderValue,
  MaterialEditingConfig,
  MaterialEditingHandlers,
  MaterialLoaderConfig,
  MaterialProcessingContext,
  Workspace,
} from "../coreMaterial/types";
import type {
  MaterialCompositeReply,
  MaterialCompositeReplyStateType,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";
import { useFieldManager } from "../coreMaterial/hooks/useFieldManager";
import { createEditingCapability } from "../coreMaterial/utils/createEditingCapability";

/**
 * Student/materials orchestrator for MaterialLoader.
 *
 * Composes:
 * - useAssignmentState — reply state machine + submit button
 * - useAnswerManager — correctness registry / show answers
 * - useFieldManager — websocket save + sync
 * - useContentProcessor + materials rules — HTML → React
 *
 * Additionally owns materials-specific side effects:
 * - handleAnswerSynced: after save, if UNANSWERED → ANSWERED (localOnly)
 * - handleModification: on edit, apply stateConfig.modifyState when needed (localOnly)
 *
 * Does not own:
 * - How updateAssignmentState is implemented (injected from app)
 * - Field/static component rendering (registry + stubs)
 *
 * @param material
 * @param workspace
 * @param compositeReplies
 * @param assignment
 * @param config
 * @param updateAssignmentState - Required for submit + local state bumps when wired
 * @returns MaterialContentLoaderValue for MaterialContentProvider
 */
export function useMaterialsLoader(
  material: MaterialContentNode,
  workspace: Workspace,
  compositeReplies?: MaterialCompositeReply,
  assignment?: WorkspaceMaterial,
  config: MaterialLoaderConfig = {},
  updateAssignmentState?: (
    newState: MaterialCompositeReplyStateType,
    localOnly: boolean,
    workspaceId: number,
    workspaceMaterialId: number,
    successText?: string,
    callback?: () => void
  ) => void,
  onAssignmentStateModified?: () => void,
  editingConfig?: Partial<MaterialEditingConfig>,
  editingHandlers?: MaterialEditingHandlers
): MaterialContentLoaderValue {
  // Create assignment state
  const assignmentState = useAssignmentState(
    workspace,
    material,
    compositeReplies,
    updateAssignmentState,
    onAssignmentStateModified
  );

  // Create answer manager
  const answerManager = useAnswerManager(
    material,
    compositeReplies,
    assignmentState.stateConfig,
    config
  );

  /**
   * After a field answer is confirmed saved: bump UNANSWERED → ANSWERED locally
   * (server already has the answer; no state API call).
   */
  const handleAnswerSynced = useCallback(() => {
    if (!compositeReplies || compositeReplies.state === "UNANSWERED") {
      updateAssignmentState?.(
        "ANSWERED",
        true, // localOnly — no server call (answer already saved)
        workspace.id,
        material.workspaceMaterialId ?? 0,
        assignmentState.stateConfig?.successText
      );
    }
  }, [
    assignmentState.stateConfig?.successText,
    compositeReplies,
    material.workspaceMaterialId,
    updateAssignmentState,
    workspace.id,
  ]);

  /**
   * When the student edits a field: if stateConfig.modifyState is set and
   * current reply state differs, apply modifyState locally (e.g. exercise
   * SUBMITTED → ANSWERED).
   */
  const handleModification = useCallback(() => {
    const modifyState = assignmentState.stateConfig?.modifyState;
    const currentState = compositeReplies?.state ?? "UNANSWERED";
    if (modifyState && currentState !== modifyState) {
      updateAssignmentState?.(
        modifyState,
        true, // localOnly
        workspace.id,
        material.workspaceMaterialId ?? 0,
        assignmentState.stateConfig?.successText
      );
    }
  }, [
    assignmentState.stateConfig?.modifyState,
    assignmentState.stateConfig?.successText,
    compositeReplies?.state,
    material.workspaceMaterialId,
    updateAssignmentState,
    workspace.id,
  ]);

  // Field management
  const fieldManager = useFieldManager(
    material,
    workspace,
    handleAnswerSynced,
    handleModification
  );

  // Create processing context
  const processingContext = useMemo<MaterialProcessingContext>(
    () => ({
      material,
      workspace,
      compositeReplies,
      readOnly: config.readOnly ?? assignmentState.readOnly,
      answerable: config.answerable ?? assignmentState.answerable,
      displayCorrectAnswers: config.showAnswers ?? answerManager.answersVisible,
      checkAnswers: config.checkAnswers ?? answerManager.answersChecked,
      invisible: false,
      onAnswerChange: answerManager.handleAnswerChange,
      onValueChange: fieldManager.handleValueChange,
      answerRegistry: answerManager.answerRegistry,
    }),
    [
      material,
      workspace,
      compositeReplies,
      config.readOnly,
      config.answerable,
      config.showAnswers,
      config.checkAnswers,
      assignmentState.readOnly,
      assignmentState.answerable,
      answerManager.answersVisible,
      answerManager.answersChecked,
      answerManager.handleAnswerChange,
      answerManager.answerRegistry,
      fieldManager,
    ]
  );

  // Create editing capability
  const editing = useMemo(
    () => createEditingCapability(editingConfig, editingHandlers),
    [editingConfig, editingHandlers]
  );

  // Create processing rules
  const rules = useMemo(() => createMaterialsRules(), []);

  // Process content
  const processedContent = useContentProcessor(
    material.html ?? null,
    rules,
    processingContext
  );

  const { answersVisible, answersChecked, answerCheckable, answerRegistry } =
    answerManager;

  const { currentState, stateConfig, readOnly, answerable, buttonConfig } =
    assignmentState;

  return {
    // Core data
    material,
    workspace,
    compositeReplies,
    assignment,

    // State
    currentState,
    stateConfig,
    readOnly,
    answerable,
    buttonConfig,
    // Answer management
    answersVisible,
    answersChecked,
    answerCheckable,
    answerRegistry,

    // Processed content
    processedContent,

    // Event handlers
    onAnswerChange: answerManager.handleAnswerChange,
    onPushAnswer: assignmentState.handleStateTransition,
    onToggleAnswersVisible: answerManager.toggleAnswersVisible,

    // Configuration
    config,

    // Field management
    fieldManager,

    // Editing capability
    editing,
  };
}
