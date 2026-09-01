/* eslint-disable @typescript-eslint/no-explicit-any */
import { UsedAs } from "~/@types/shared";
import {
  MaterialAnswerSnapshot,
  MaterialAssigmentType,
  MaterialCompositeReply,
  MaterialCompositeReplyStateType,
} from "~/generated/client";
import { StatusType } from "~/reducers/base/status";

/**
 * State configuration interface (cleaned up from current STATES array)
 */
export interface StateConfig {
  assignmentType: MaterialAssigmentType;
  states: MaterialCompositeReplyStateType[] | MaterialCompositeReplyStateType;
  buttonClass: string;
  buttonText: string;
  buttonDisabled: boolean;
  successState?: MaterialCompositeReplyStateType;
  fieldsReadOnly?: boolean;
  checksAnswers?: boolean;
  displaysHideShowAnswersButton?: boolean;
  modifyState?: MaterialCompositeReplyStateType;
  successText?: string;
}

/**
 * Common field props interface
 */
export interface CommonFieldProps {
  userId: number;
  workspaceMaterialId: number;
  key?: number;
  type: string;
  readOnly?: boolean;
  initialValue?: string;
  status: StatusType;
  usedAs: UsedAs;
  content: any;
  snapshots?: MaterialAnswerSnapshot[];
  onChange?: (
    context: React.Component<any, any>,
    name: string,
    newValue: any
  ) => any;
  invisible?: boolean;
  displayCorrectAnswers?: boolean;
  checkAnswers?: boolean;
  onAnswerChange?: (name: string, value: boolean) => any;

  // Field comments save
  onUpdateFieldWithComments?: (
    fieldName: string,
    content: string,
    onSuccess: () => void,
    onFail: () => void
  ) => void;

  // Field snapshot capabilities
  fieldFeaturesCapabilities?: FieldFeaturesCapabilities;
  onTakeFieldSnapshot?: (fieldName: string) => any;
  onDeleteFieldSnapshot?: (fieldName: string, snapshotId: number) => any;
}

/**
 * Field action capabilities
 */
export interface FieldActionCapabilities {
  /** Master switch: no UI for this feature */
  enabled: boolean;
  /** Show existing data */
  canView: boolean;
  /** Create / add (take snapshot, add comments) */
  canCreate: boolean;
  /** Remove */
  canDelete: boolean;
}

/**
 * All field features resolved for the current material page
 */
export interface FieldFeaturesCapabilities {
  snapshot: FieldActionCapabilities;
  comments: FieldActionCapabilities;
}

/**
 * Context passed to a field features policy
 */
export interface FieldActionPolicyContext {
  compositeReply?: MaterialCompositeReply;
  usedAs: UsedAs;
  lock?: MaterialCompositeReply["lock"];
}

/**
 * Static capabilities or a function of assignment context
 */
export type FieldFeaturesPolicy =
  | FieldFeaturesCapabilities
  | ((ctx: FieldActionPolicyContext) => FieldFeaturesCapabilities);

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
 * EvaluationHighlightDataset
 */
export interface EvaluationCommentDataset {
  text: string;
  type: "comment";
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

export type StaticDataset =
  | WordDefinitionDataset
  | LinkDataset
  | ImageDataset
  | IframeDataset
  | EvaluationCommentDataset;

/**
 * Fields sync status interface
 */
export interface FieldsSyncStatus {
  /** true when every registered field is synced and has no syncError */
  allSynced: boolean;
  /** true if any field has syncError set */
  hasSyncErrors: boolean;
  /** count of fields in nameContextRegistry that are not fully synced */
  pendingCount: number;
}

/**
 * Field sync state patch interface
 */
export interface FieldSyncStatePatch {
  synced?: boolean;
  syncError?: string | null;
}
