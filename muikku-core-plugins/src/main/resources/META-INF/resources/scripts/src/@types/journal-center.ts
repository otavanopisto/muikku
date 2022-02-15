/**
 * JournalCreationType
 */
export enum JournalCreationType {
  MANUAL = "MANUAL",
  AUTOMATIC = "AUTOMATIC",
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
}

/**
 * JournalNote
 */
export interface JournalNoteUpdate {
  title: string;
  description: string;
  priority: JournalPriority;
  pinned: boolean;
}

/**
 * UseSuggestion
 */
export interface UseJournals {
  isLoadingList: boolean;
  isUpdatingList: boolean;
  journalsList: JournalNoteRead[];
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
export interface JournalFiltters {
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
