// srcv4/src/materials/MaterialLoaderV2/core/types/index.ts

import type {
  MaterialAssigmentType,
  MaterialCompositeReply,
  MaterialCompositeReplyStateType,
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
  currentState: MaterialCompositeReplyStateType;
  stateConfig: AssignmentStateConfig | null;
  readOnly: boolean;
  answerable: boolean;
  buttonConfig: ButtonConfig | null;
  handleStateTransition: (newState: MaterialCompositeReplyStateType) => void;
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
  successState?: MaterialCompositeReplyStateType;
  successText?: string;
  displaysHideShowAnswersOnRequestButtonIfAllowed?: boolean;
}

/**
 * AssignmentStateConfig
 */
export interface AssignmentStateConfig {
  assignmentType: MaterialAssigmentType;
  states: MaterialCompositeReplyStateType[] | MaterialCompositeReplyStateType;
  displaysHideShowAnswersOnRequestButtonIfAllowed?: boolean;
  buttonClass?: string;
  buttonText?: string;
  buttonDisabled?: boolean;
  successState?: MaterialCompositeReplyStateType;
  successText?: string;
  fieldsReadOnly?: boolean;
  checksAnswers?: boolean;
  modifyState?: MaterialCompositeReplyStateType;
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
  currentState: MaterialCompositeReplyStateType;
  stateConfig: AssignmentStateConfig | null;
  readOnly: boolean;
  answerable: boolean;
  buttonConfig: ButtonConfig | null;
  // Answer management
  answersVisible: boolean;
  answersChecked: boolean;
  answerCheckable: boolean;
  answerRegistry: Record<string, any>;

  // Processed content
  processedContent: React.ReactNode[];

  // Event handlers
  onAnswerChange: (name: string, value: boolean) => void;
  onPushAnswer: (newState: MaterialCompositeReplyStateType) => void;
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

/**
 * Base field content interface
 */
export interface BaseFieldContent {
  name: string;
  fieldName: string;
}

/**
 * Text field content interface
 */
export interface TextFieldContent extends BaseFieldContent {
  fieldName: "text";
  autogrow: boolean;
  columns: string;
  hint: string;
  name: string;
  rightAnswers: {
    caseSensitive: boolean;
    correct: boolean;
    normalizeWhitespace: boolean;
    text: string;
  }[];
}

/**
 * Select field content interface
 */
export interface SelectFieldContent extends BaseFieldContent {
  fieldName: "select";
  name: string;
  explanation: string;
  listType: "dropdown" | "list" | "radio-horizontal" | "radio-vertical";
  options: {
    correct: boolean;
    text: string;
    value: string;
  }[];
}

/**
 * Multi select field content interface
 */
export interface MultiSelectFieldContent extends BaseFieldContent {
  fieldName: "multiselect";
  name: string;
  explanation: string;
  listType: "checkbox-horizontal" | "checkbox-vertical";
  options: {
    correct: boolean;
    text: string;
    value: string;
  }[];
}

/**
 * Memo field content interface
 */
export interface MemoFieldContent extends BaseFieldContent {
  fieldName: "memo";
  example: string;
  columns: string;
  rows: string;
  name: string;
  richedit: boolean;
  maxChars: string;
  maxWords: string;
}

/**
 * File field content interface
 */
export interface FileFieldContent extends BaseFieldContent {
  fieldName: "file";
  name: string;
}

/**
 * FieldType
 */
interface FieldType {
  name: string;
  text: string;
}

/**
 * Connect field content interface
 */
export interface ConnectFieldContent extends BaseFieldContent {
  fieldName: "connect";
  name: string;
  fields: FieldType[];
  counterparts: FieldType[];
  connections: {
    field: string;
    counterpart: string;
  }[];
}

/**
 * TermType
 */
interface TermType {
  id: string;
  name: string;
}

/**
 * CategoryType
 */
interface CategoryType {
  id: string;
  name: string;
}

/**
 * CategoryTerm
 */
interface CategoryTerm {
  category: string;
  terms: string[];
}

/**
 * Organizer field content interface
 */
export interface OrganizerFieldContent extends BaseFieldContent {
  fieldName: "organizer";
  name: string;
  termTitle: string;
  terms: TermType[];
  categories: CategoryType[];
  categoryTerms: CategoryTerm[];
}

/**
 * SorterFieldItemType
 */
interface SorterFieldItemType {
  id: string;
  name: string;
}

/**
 * Sorter field content interface
 */
export interface SorterFieldContent extends BaseFieldContent {
  fieldName: "sorter";
  name: string;
  orientation: "vertical" | "horizontal";
  capitalize: boolean;
  items: SorterFieldItemType[];
}

/**
 * Math field content interface
 */
export interface MathFieldContent extends BaseFieldContent {
  fieldName: "math";
  name: string;
}

/**
 * Journal field content interface
 */
export interface JournalFieldContent extends BaseFieldContent {
  fieldName: "journal";
  name: string;
}

/**
 * Audio field content interface
 */
export interface AudioFieldContent extends BaseFieldContent {
  fieldName: "audio";
  name: string;
}

/**
 * Union type for all field content types
 */
export type FieldContent =
  | TextFieldContent
  | SelectFieldContent
  | MultiSelectFieldContent
  | MemoFieldContent
  | FileFieldContent
  | ConnectFieldContent
  | OrganizerFieldContent
  | SorterFieldContent
  | MathFieldContent
  | JournalFieldContent
  | AudioFieldContent;

/**
 * Field parameters that get passed to field components
 */
export interface FieldParameters {
  content: FieldContent | null;
  type: string;
  status: any; // This should be StatusType from your existing types
  readOnly: boolean;
  usedAs: string;
  initialValue?: string; // This should be properly typed based on field type
  onChange: (
    context: React.Component<any, any>,
    name: string,
    newValue: any
  ) => void;
  displayCorrectAnswers: boolean;
  checkAnswers: boolean;
  onAnswerChange: (name: string, value: boolean) => void;
  invisible: boolean;
  userId: number;
}

/**
 * Field component props interface
 */
export interface FieldComponentProps<T extends FieldContent> {
  content: T | null;
  status: any; // StatusType
  readOnly: boolean;
  usedAs: string;
  initialValue?: string;
  onChange: (
    context: React.Component<any, any>,
    name: string,
    newValue: any
  ) => void;
  displayCorrectAnswers: boolean;
  checkAnswers: boolean;
  onAnswerChange: (name: string, value: boolean) => void;
  invisible: boolean;
  userId: number;
}

/**
 * Field type registry entry
 */
export interface FieldRegistryEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
  processor: (
    element: HTMLElement,
    context: ProcessingRuleContext
  ) => FieldParameters;
  validator?: (content: FieldContent) => boolean;
  canCheckAnswers: (content: FieldContent) => boolean;
}

/**
 * Answer checkable function type
 */
export type AnswerCheckableFunction = (content: FieldContent) => boolean;

/**
 * Field processor function type
 */
export type FieldProcessorFunction = (
  element: HTMLElement,
  context: ProcessingRuleContext
) => FieldParameters;
