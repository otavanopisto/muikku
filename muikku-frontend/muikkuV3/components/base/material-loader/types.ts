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

  // Field snapshot capabilities
  fieldSnapshotCapabilities?: FieldSnapshotCapabilities;
  onTakeFieldSnapshot?: (fieldName: string) => any;
  onDeleteFieldSnapshot?: (fieldName: string, snapshotId: number) => any;
}

/**
 * Field snapshot capabilities
 */
export interface FieldSnapshotCapabilities {
  /** Master switch: no snapshot UI at all */
  snapshotEnabled: boolean;
  /** Show list / accordions (read-only history) */
  snapshotCanView: boolean;
  /** Show “take snapshot” control */
  snapshotCanTake: boolean;
  /** Show delete on each snapshot */
  snapshotCanDelete: boolean;
}

/**
 * Field snapshot policy context
 */
export interface FieldSnapshotPolicyContext {
  compositeReply?: MaterialCompositeReply;
  usedAs: UsedAs;
  lock?: MaterialCompositeReply["lock"];
}

/**
 * Field snapshot policy
 */
export type FieldSnapshotPolicy =
  | FieldSnapshotCapabilities
  | ((ctx: FieldSnapshotPolicyContext) => FieldSnapshotCapabilities);

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

export type StaticDataset =
  | WordDefinitionDataset
  | LinkDataset
  | ImageDataset
  | IframeDataset;

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
