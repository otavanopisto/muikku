/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RichContentProcessingContext } from "../core/types";
import type {
  MaterialAnswerSnapshot,
  MaterialAssigmentType,
  MaterialCompositeReply,
  MaterialCompositeReplyStateType,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";

/**
 * Optional snapshot capability — omit on loaders that don't use snapshots
 */
export interface MaterialSnapshotCapability {
  enabled: boolean;
  canView: boolean;
  canTake: boolean;
  canDelete: boolean;
  /** Snapshots for a field (from composite reply answers) */
  getSnapshots: (fieldName: string) => MaterialAnswerSnapshot[];
  onTake?: (fieldName: string) => void;
  onDelete?: (fieldName: string, snapshotId: number) => void;
}

/**
 * Field snapshot capabilities
 */
export interface FieldSnapshotCapabilities {
  enabled: boolean;
  canView: boolean;
  canTake: boolean;
  canDelete: boolean;
}

/**
 * Field snapshot policy context
 */
export interface FieldSnapshotPolicyContext {
  compositeReply?: MaterialCompositeReply;
  lock?: MaterialCompositeReply["lock"];
}

/**
 * Field snapshot policy
 */
export type FieldSnapshotPolicy =
  | FieldSnapshotCapabilities
  | ((ctx: FieldSnapshotPolicyContext) => FieldSnapshotCapabilities);

/**
 * MaterialContentLoaderValue
 */
export interface MaterialContentLoaderValue {
  // --- required core ---
  material: MaterialContentNode;
  workspace: Workspace;
  processedContent: React.ReactNode[];
  config: MaterialLoaderConfig;

  /** Always meaningful for field rendering / processing */
  readOnly: boolean;
  answerable: boolean;

  /** Used by content rules (exercise boxes, field check UI) */
  answersVisible: boolean;
  answersChecked: boolean;
  answerRegistry: Record<string, any>;

  // --- optional data ---
  compositeReplies?: MaterialCompositeReply;
  assignment?: WorkspaceMaterial;

  // --- optional assignment-state machine (materials submit/withdraw) ---
  currentState?: MaterialCompositeReplyStateType;
  stateConfig?: AssignmentStateConfig | null;
  buttonConfig?: ButtonConfig | null;
  onPushAnswer?: (newState: MaterialCompositeReplyStateType) => void;

  // --- optional answer UI helpers ---
  answerCheckable?: boolean;
  onAnswerChange?: (name: string, value: boolean | null) => void;
  onToggleAnswersVisible?: () => void;

  // --- optional field sync ---
  fieldManager?: FieldManagerReturn | null;

  // --- optional capabilities ---
  snapshots?: MaterialSnapshotCapability;
}

/**
 * Workspace
 */
export interface Workspace {
  id: number;
  urlName: string;
}

/**
 * Material-domain processing context (extends core's open context)
 */
export interface MaterialProcessingContext extends Record<string, any> {
  material: MaterialContentNode;
  workspace: Workspace;
  compositeReplies?: MaterialCompositeReply;
  assignment?: WorkspaceMaterial;
  readOnly: boolean;
  answerable: boolean;
  displayCorrectAnswers: boolean;
  checkAnswers: boolean;
  invisible: boolean;
  answerRegistry: Record<string, any>;

  // --- optional snapshot capabilities ---
  snapshots?: MaterialSnapshotCapability;

  // --- optional event handlers ---
  onAnswerChange?: (name: string, value: boolean) => void;
  onValueChange?: (context: any, name: string, newValue: any) => void;
}

export type MaterialRichContentContext =
  | MaterialProcessingContext
  | RichContentProcessingContext;

/**
 * MaterialLoaderConfig
 */
export interface MaterialLoaderConfig {
  readOnly?: boolean;
  answerable?: boolean;
  showAnswers?: boolean;
  checkAnswers?: boolean;
  enableButtons?: boolean;
  enableAssessment?: boolean;
  modifiers?: string | string[];
  className?: string;
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

export type FieldTypeName =
  | "application/vnd.muikku.field.text"
  | "application/vnd.muikku.field.select"
  | "application/vnd.muikku.field.multiselect"
  | "application/vnd.muikku.field.memo"
  | "application/vnd.muikku.field.file"
  | "application/vnd.muikku.field.connect"
  | "application/vnd.muikku.field.organizer"
  | "application/vnd.muikku.field.sorter"
  | "application/vnd.muikku.field.math"
  | "application/vnd.muikku.field.journal";

/**
 * FieldComponentProps
 */
export interface FieldComponentProps<TContent = FieldContent> {
  content: TContent | null;
  readOnly?: boolean;
  initialValue?: string;
  invisible?: boolean;
  displayCorrectAnswers?: boolean;
  checkAnswers?: boolean;
  onAnswerChange?: (name: string, value: boolean) => void;
  onChange?: (context: any, name: string, newValue: any) => void;
  userId?: number;
  status?: any;
}

/**
 * FieldParameters
 */
export interface FieldParameters {
  content: FieldContent | null;
  readOnly: boolean;
  initialValue?: string;
  invisible?: boolean;
  displayCorrectAnswers?: boolean;
  checkAnswers?: boolean;
  onAnswerChange?: (name: string, value: boolean) => void;
  onChange?: (context: any, name: string, newValue: any) => void;
  userId?: number;
}

/**
 * FieldRegistryEntry
 */
export interface FieldRegistryEntry<TContent = unknown> {
  component: React.ComponentType<FieldComponentProps<TContent>>;
  processor: (
    element: HTMLElement,
    context: MaterialProcessingContext
  ) => FieldParameters;
  canCheckAnswers: (content: TContent) => boolean;
}

export type FieldRegistry = Partial<
  Record<FieldTypeName, FieldRegistryEntry<any>>
> &
  Record<string, FieldRegistryEntry<any>>;

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
  handleAnswerChange: (name: string, value: boolean | null) => void;
  toggleAnswersVisible: () => void;
  handleAnswerCheckableChange: (checkable: boolean) => void;
}

/**
 * FieldManagerReturn
 */
export interface FieldManagerReturn {
  handleValueChange: (
    context: any,
    name: string,
    newValue: any,
    onModification?: () => void
  ) => void;
}
