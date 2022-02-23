/**
 * JournalCreationType
 */
export enum JournalCreationType {
  MANUAL = "MANUAL",
  AUTOMATIC = "AUTOMATIC",
}

/**
 * JournalStatusType
 */
export enum JournalStatusType {
  ONGOING = "ONGOING",
  APPROVAL_PENDING = "APPROVAL_PENDING",
  APPROVED = "APPROVED",
}

/**
 * JournalPriority
 */
export enum JournalPriority {
  OWN = "OWN",
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
}

/**
 * JournalNoteRead
 */
export interface JournalNoteRead {
  id: number;
  title: string;
  description: string;
  type: JournalCreationType;
  priority: JournalPriority;
  pinned: boolean;
  owner: number;
  creator: number;
  creatorName: string;
  created: string;
  dueDate: Date | null;
  status: JournalStatusType;
}

/**
 * JournalNote
 */
export interface JournalNoteCreate {
  title: string;
  description: string;
  type: JournalCreationType;
  priority: JournalPriority;
  pinned: boolean;
  owner: number;
  dueDate: Date | null;
}

/**
 * JournalNote
 */
export interface JournalNoteUpdate {
  title: string;
  description: string;
  priority: JournalPriority;
  pinned: boolean;
  dueDate: Date | null;
  status: JournalStatusType;
}

/**
 * UseSuggestion
 */
export interface UseJournals {
  isLoadingList: boolean;
  isUpdatingList: boolean;
  journalsList: JournalNoteRead[];
  journalsArchivedList: JournalNoteRead[];
}

/**
 * OptionType
 */
export type OptionType = {
  label: string;
  value: JournalPriority;
};

/**
 * JournalPriorityFiltters
 */
export interface JournalFilters {
  high: boolean;
  normal: boolean;
  low: boolean;
  own: boolean;
  guider: boolean;
}

/**
 * JournalCenterUsePlaceType
 */
export type JournalCenterUsePlaceType = "records" | "guider";
