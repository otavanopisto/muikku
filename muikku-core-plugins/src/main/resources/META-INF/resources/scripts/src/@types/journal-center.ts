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
  dueDate: Date | null;
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

/**
 * JournalNoteRead2
 */
/* export interface JournalNoteRead2 {
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
  state: "ONGOING" | "CHECKING" | "DONE";
  tasks: NoteTask[];
} */

/* type LinkedTaskType = MaterialTask | EvaluationTask; */

/**
 * MaterialTask
 */
/* interface MaterialTask {
  discriminate: "MaterialTask";
} */

/**
 * EvaluationTask
 */
/* interface EvaluationTask {
  discriminate: "EvaluationTask";
} */

/**
 * NoteTask
 */
/* interface NoteTask {
  id: number;
  name: string;
  description?: string;
  isDone: boolean;
  linkedTask?: LinkedTaskType;
} */

/* const tasks: NoteTask[] = [
  {
    id: 1,
    name: "Matikka tehtävä 1",
    description:
      "Matikka on haastava aine. Tee tämä tehtävä oppiaksesi matikan salat",
    isDone: false,
  },
]; */
