import { useMemo } from "react";
import type {
  Workspace,
  MaterialLoaderConfig,
  ProcessingRuleContext,
} from "../types";
import { useAssignmentState } from "./useAssignmentState";
import { useAnswerManager } from "./useAnswerManager";
import { useFieldManager } from "./useFieldManager";
import { useContentProcessor } from "./useContentProcessor";
import type {
  MaterialCompositeReply,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";
import { createProcessingRules } from "../processors/ProcessingRules";

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
export function useMaterialLoader(
  material: MaterialContentNode,
  workspace: Workspace,
  compositeReplies?: MaterialCompositeReply,
  assignment?: WorkspaceMaterial,
  config: MaterialLoaderConfig = {},
  onModification?: () => void
) {
  // Assignment state management
  const assignmentState = useAssignmentState(material, compositeReplies);

  // Answer management
  const answerManager = useAnswerManager(
    material,
    compositeReplies,
    assignmentState.stateConfig,
    config
  );

  // Field management
  const fieldManager = useFieldManager(material, workspace);

  // Create processing context
  const processingContext: ProcessingRuleContext = useMemo(
    () => ({
      material,
      workspace,
      compositeReplies,
      readOnly: assignmentState.readOnly,
      answerable: assignmentState.answerable,
      displayCorrectAnswers: config.showAnswers ?? false,
      checkAnswers: config.checkAnswers ?? false,
      invisible: false, // This should come from props
      onAnswerChange: answerManager.handleAnswerChange,
      onValueChange: (context, name, newValue) =>
        fieldManager.handleValueChange(context, name, newValue, onModification),
      usedAs: "default", // This should come from props
      answerRegistry: answerManager.answerRegistry,
    }),
    [
      material,
      workspace,
      compositeReplies,
      assignmentState.readOnly,
      assignmentState.answerable,
      config.showAnswers,
      config.checkAnswers,
      answerManager.handleAnswerChange,
      answerManager.answerRegistry,
      fieldManager,
      onModification,
    ]
  );

  const processingRules = createProcessingRules("materials");

  // Content processing
  const processedContent = useContentProcessor(
    material.html,
    processingRules,
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
