/**
 * NotesItemCreation
 */
export enum NotesItemCreation {
  MANUAL = "MANUAL",
  AUTOMATIC = "AUTOMATIC",
}

/**
 * NotesItemStatus
 */
export enum NotesItemStatus {
  ONGOING = "ONGOING",
  APPROVAL_PENDING = "APPROVAL_PENDING",
  APPROVED = "APPROVED",
}

/**
 * NotesItemPriority
 */
export enum NotesItemPriority {
  OWN = "OWN",
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
}

/**
 * NotesItemRead
 */
export interface NotesItemRead {
  id: number;
  title: string;
  description: string;
  type: NotesItemCreation;
  priority: NotesItemPriority;
  pinned: boolean;
  isActive: boolean;
  isArchived: boolean;
  owner: number;
  creator: number;
  creatorName: string;
  created: string;
  startDate: Date | null;
  dueDate: Date | null;
  status: NotesItemStatus;
}

/**
 *  NotesItemCreate
 */
export interface NotesItemCreate {
  title: string;
  description: string;
  type: NotesItemCreation;
  priority: NotesItemPriority;
  pinned: boolean;
  owner: number;
  startDate: Date | null;
  dueDate: Date | null;
}

/**
 * NotesItemUpdate
 */
export interface NotesItemUpdate {
  title: string;
  description: string;
  priority: NotesItemPriority;
  pinned: boolean;
  startDate: Date | null;
  dueDate: Date | null;
  status: NotesItemStatus;
}

/**
 * UseNotesItem
 */
export interface UseNotesItem {
  isLoadingList: boolean;
  isUpdatingList: boolean;
  notesItemList: NotesItemRead[];
  notesArchivedItemList: NotesItemRead[];
}

/**
 * OptionType
 */
export type OptionType = {
  label: string;
  value: NotesItemPriority;
};

/**
 * NotesItemFilters
 */
export interface NotesItemFilters {
  high: boolean;
  normal: boolean;
  low: boolean;
  own: boolean;
  guider: boolean;
}

/**
 * NotesLocation
 */
export type NotesLocation = "records" | "guider";

/**
 * SelectedNotesItem
 */
export interface SelectedNotesItem {
  notesItem: NotesItemRead;
  inEditMode: boolean;
}
