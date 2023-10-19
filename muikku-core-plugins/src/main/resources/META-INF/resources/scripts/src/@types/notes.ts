import { Note } from "~/generated/client";

/**
 * UseNotesItem
 */
export interface UseNotesItem {
  isLoadingList: boolean;
  isUpdatingList: boolean;
  notesItemList: Note[];
  notesArchivedItemList: Note[];
}

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
  notesItem: Note;
  inEditMode: boolean;
}
