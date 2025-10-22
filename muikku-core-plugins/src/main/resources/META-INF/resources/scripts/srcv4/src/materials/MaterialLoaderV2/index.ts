// srcv4/src/materials/MaterialLoaderV2/index.ts

// Core exports
export * from "./core/types";
export * from "./core/state/AssignmentStateManager";
export * from "./core/hooks/useAssignmentState";

// Processor exports
export * from "./core/processors/HTMLProcessor";
export * from "./core/processors/HTMLPreprocessor";
export * from "./core/processors/FieldProcessor";
export * from "./core/processors/ProcessingRules";
export * from "./core/hooks/useContentProcessor";

// Config exports
export * from "./configs/MaterialLoaderConfigs";

// Re-export types for convenience
export type {
  Material,
  Workspace,
  MaterialCompositeReply,
  MaterialLoaderConfig,
  AssignmentStateConfig,
  ProcessingRuleContext,
  EnhancedHTMLToReactComponentRule,
} from "./core/types";
