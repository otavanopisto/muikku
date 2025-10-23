// srcv4/src/materials/MaterialLoaderV2/core/types/index.ts

import type {
  MaterialCompositeReply,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";

/**
 * Workspace
 */
export interface Workspace {
  id: number;
  urlName: string;
}

export type UsedAs = "default" | "evaluationTool";

/**
 * ProcessingRuleContext
 */
export interface ProcessingRuleContext {
  // Material data
  material: MaterialContentNode;
  workspace: Workspace;
  compositeReplies?: MaterialCompositeReply;
  assignment?: WorkspaceMaterial;

  // State
  readOnly: boolean;
  answerable: boolean;
  displayCorrectAnswers: boolean;
  checkAnswers: boolean;
  invisible: boolean;

  // Handlers
  onAnswerChange: (name: string, value: boolean) => void;
  onValueChange: (
    context: React.Component<any, any>,
    name: string,
    newValue: any
  ) => void;

  // Other props
  usedAs: UsedAs;
  answerRegistry: Record<string, any>;
}

/**
 * MaterialLoaderConfig
 */
export interface MaterialLoaderConfig {
  readOnly?: boolean;
  answerable?: boolean;
  showAnswers?: boolean;
  checkAnswers?: boolean;
  enableEditor?: boolean;
  enableButtons?: boolean;
  enableAssessment?: boolean;
  enableAI?: boolean;
  enableExternalContent?: boolean;
  enableAnswerCounter?: boolean;
  enableProducersLicense?: boolean;
  modifiers?: string | string[];
  className?: string;
}

/**
 * MaterialLoaderContextValue
 */
export interface MaterialLoaderContextValue {
  material: MaterialContentNode;
  workspace: Workspace;
  compositeReplies?: MaterialCompositeReply;
  assignment?: WorkspaceMaterial;
  assignmentState: AssignmentStateReturn;
  answerManager: AnswerManagerReturn;
  contentProcessor: React.ReactNode[];
  config: MaterialLoaderConfig;
}

/**
 * AssignmentStateReturn
 */
export interface AssignmentStateReturn {
  currentState: string;
  stateConfig: AssignmentStateConfig | null;
  readOnly: boolean;
  answerable: boolean;
  buttonConfig: ButtonConfig | null;
  handleStateTransition: (newState: string) => void;
}

/**
 * AnswerManagerReturn
 */
export interface AnswerManagerReturn {
  answersVisible: boolean;
  answersChecked: boolean;
  answerCheckable: boolean;
  answerRegistry: Record<string, any>;
  handleAnswerChange: (name: string, value: boolean) => void;
  toggleAnswersVisible: () => void;
  handleAnswerCheckableChange: (checkable: boolean) => void;
}

/**
 * ButtonConfig
 */
export interface ButtonConfig {
  className: string;
  text: string;
  disabled: boolean;
  successState?: string;
  successText?: string;
}

/**
 * AssignmentStateConfig
 */
export interface AssignmentStateConfig {
  assignmentType: string;
  state: string | string[];
  displaysHideShowAnswersOnRequestButtonIfAllowed?: boolean;
  buttonClass?: string;
  buttonText?: string;
  buttonDisabled?: boolean;
  successState?: string;
  successText?: string;
  fieldsReadOnly?: boolean;
  checksAnswers?: boolean;
  modifyState?: string;
}

/**
 * EnhancedHTMLToReactComponentRule
 */
export interface EnhancedHTMLToReactComponentRule {
  shouldProcessHTMLElement: (tag: string, element: HTMLElement) => boolean;
  preventChildProcessing?: boolean;
  processingFunction?: (
    tag: string,
    props: any,
    children: any[],
    element: HTMLElement,
    context?: ProcessingRuleContext
  ) => any;
  preprocessReactProperties?: (
    tag: string,
    props: any,
    children: any[],
    element: HTMLElement,
    context?: ProcessingRuleContext
  ) => string | void;
  preprocessElement?: (element: HTMLElement) => string | void;
  id?: string;
}

/**
 * FieldManagerReturn
 */
export interface FieldManagerReturn {
  handleValueChange: (
    context: React.Component<any, any>,
    name: string,
    newValue: any,
    onModification?: () => void
  ) => void;
  nameContextRegistry: Record<string, React.Component<any, any>>;
}

/**
 * MaterialLoaderReturn
 */
export interface MaterialLoaderReturn {
  // Core data
  material: MaterialContentNode;
  workspace: Workspace;
  compositeReplies?: MaterialCompositeReply;
  assignment?: WorkspaceMaterial;

  // State
  currentState: string;
  stateConfig: AssignmentStateConfig | null;
  readOnly: boolean;
  answerable: boolean;
  buttonConfig: ButtonConfig | null;
  answersVisible: boolean;
  answersChecked: boolean;
  answerCheckable: boolean;
  answerRegistry: Record<string, any>;

  // Processed content
  processedContent: React.ReactNode[];

  // Event handlers
  onAnswerChange: (name: string, value: boolean) => void;
  onPushAnswer: (newState: string) => void;
  onToggleAnswersVisible: () => void;

  // Configuration
  config: MaterialLoaderConfig;

  // Field management
  fieldManager: FieldManagerReturn;
}

/**
 * MaterialLoaderContextValue
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MaterialLoaderContextValue extends MaterialLoaderReturn {
  // Additional context-specific properties can be added here
}

// DATASETS
/**
 * WordDefinitionDataset
 */
export interface WordDefinitionDataset {
  muikkuWordDefinition: string;
}

/**
 * LinkDataset
 */
export interface LinkDataset {
  url?: string;
}

/**
 * ImageDataset
 */
export interface ImageDataset {
  author: string;
  authorUrl: string;
  license: string;
  licenseUrl: string;
  source: string;
  sourceUrl: string;
  original?: string;
}

/**
 * IframeDataset
 */
export interface IframeDataset {
  url?: string;
}

/**
 * SourceDataset
 */
export interface SourceDataset {
  original?: string;
}

export type StaticDataset =
  | WordDefinitionDataset
  | LinkDataset
  | ImageDataset
  | IframeDataset
  | SourceDataset;

/**
 * Common field props interface
 */
export interface CommonFieldProps {
  userId: number;
  key?: number;
  type: string;
  readOnly?: boolean;
  initialValue?: string;
  status: any;
  usedAs: UsedAs;
  content: any;
  onChange?: (
    context: React.Component<any, any>,
    name: string,
    newValue: any
  ) => any;
  invisible?: boolean;
  displayCorrectAnswers?: boolean;
  checkAnswers?: boolean;
  onAnswerChange?: (name: string, value: boolean) => any;
}
