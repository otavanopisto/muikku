import { useMemo } from "react";
import { useContentProcessor } from "../core/hooks/useContentProcessor";
import { createMaterialsRules } from "./rules";
import { useAssignmentState } from "../coreMaterial/hooks/useAssignmentState";
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
import { useFieldManager } from "../coreMaterial/hooks/useFieldManager";

/**
 * Main hook that orchestrates all MaterialLoader functionality
 * Combines state management, answer management, field management, and content processing
 * @param material - The material to manage
 * @param workspace - The workspace to manage
 * @param compositeReplies - The composite replies to manage
 * @param assignment - The assignment to manage
 * @param config - The config to use for the material loader
 * @param onModification - The callback to call when the material is modified
 */
export function useMaterialsLoader(
  material: MaterialContentNode,
  workspace: Workspace,
  compositeReplies?: MaterialCompositeReply,
  assignment?: WorkspaceMaterial,
  config: MaterialLoaderConfig = {},
  onModification?: () => void,
  updateAssignmentState?: Parameters<typeof useAssignmentState>[3]
): MaterialContentLoaderValue {
  // Create assignment state
  const assignmentState = useAssignmentState(
    material,
    compositeReplies,
    onModification,
    updateAssignmentState
  );

  // Create answer manager
  const answerManager = useAnswerManager(
    material,
    compositeReplies,
    assignmentState.stateConfig,
    config
  );

  // Field management
  const fieldManager = useFieldManager(material, workspace);

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
      onValueChange: (_ctx, _name, _value) => {
        // TODO: useFieldManager.handleValueChange
        onModification?.();
      },
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
      onModification,
    ]
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
  };
}
