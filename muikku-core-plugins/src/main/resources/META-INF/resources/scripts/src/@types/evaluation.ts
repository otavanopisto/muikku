import { MaterialCompositeRepliesStateType } from "./../reducers/workspaces/index";
import { JournalComment } from "~/@types/journal";
import { MaterialAssignmentType } from "../reducers/workspaces/index";

/**
 * EvaluationJournalFilters
 */
export interface EvaluationJournalFilters {
  showMandatory: boolean;
  showOthers: boolean;
}

/**
 * Interface for evaluation study diary event
 */
export interface EvaluationStudyDiaryEvent {
  commentCount: number;
  content: string;
  created: string;
  firstName: string;
  id: number;
  lastName: string;
  title: string;
  userEntityId: number;
  workspaceEntityId: number;
  /**
   * Whether journal is "mandatory" assignment and material field
   */
  isMaterialField: boolean;
  /**
   * Material field reply status. ANSWERED | "SUBMITTED" are only ones
   * that matters
   */
  workspaceMaterialReplyState: MaterialCompositeRepliesStateType | null;
}

/**
 * EvaluationJournalCommentsByJournal
 */
export interface EvaluationJournalCommentsByJournal {
  [journalEntryId: number]: JournalComment[];
}

/**
 * Interface for latest evaluation per subject
 */
export interface EvaluationLatestSubjectEvaluationIndex {
  [subjectIdentifier: string]: number;
}

/**
 * Interface for last evaluation per subject
 */
export interface EvaluationLastSubjectEvaluationIndex
  extends EvaluationLatestSubjectEvaluationIndex {}

/**
 * EvaluationStatus
 */
export interface EvaluationStatus {
  key: string;
  value: string;
}

/**
 * BasePriceById
 */
export interface EvaluationBasePriceById {
  [id: string]: number;
}

/**
 * SortBy type
 */
export type SortBy =
  | "sort-amount-asc"
  | "sort-amount-desc"
  | "sort-alpha-asc"
  | "sort-alpha-desc"
  | "sort-workspace-alpha-asc"
  | "sort-workspace-alpha-desc"
  | "no-sort";

/**
 * EvaluationSort
 */
export interface EvaluationSort {
  key: string;
  value: SortBy;
}

/**
 * UpdateImportanceObject
 */
export interface UpdateImportanceObject {
  importantAssessments: EvaluationImportance;
  unimportantAssessments: EvaluationImportance;
}

/**
 * EvaluationImportance
 */
export interface EvaluationImportance {
  key: "important-evaluation-requests" | "unimportant-evaluation-requests";
  value: string;
}

/**
 * EvaluationFilters
 */
export interface EvaluationFilters {
  evaluated: boolean;
  notEvaluated: boolean;
  assessmentRequest: boolean;
  supplementationRequest: boolean;
}

/**
 * EvaluationImportantStatus
 */
export type EvaluationImportantStatus =
  | "important"
  | "unimportant"
  | "nostatus";

/**
 * EvaluationStateType
 */
export type EvaluationStateType = "LOADING" | "READY" | "ERROR";

/**
 * BilledPrice
 */
export interface BilledPrice {
  assessmentIdentifier: string;
  editable: boolean;
  price: number;
}

/**
 * EvaluationAssigmentData
 */
export interface EvaluationAssigmentData {
  assigments: MaterialAssignmentType[];
}

/**
 * BilledPriceRequest
 */
export interface BilledPriceRequest {
  assessmentIdentifier: string;
  price: string;
}

/**
 * WorkspaceUserEntity
 */
export interface WorkspaceUserEntity {
  active: boolean;
  firstName: string;
  hasImage: boolean;
  lastName: string;
  nickname: string;
  studyProgrammeName: string;
  userEntityId: number;
  userIdentifier: string;
  workspaceUserEntityId: number;
}
