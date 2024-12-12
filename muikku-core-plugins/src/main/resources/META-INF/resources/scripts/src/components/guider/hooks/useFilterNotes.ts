import { Note } from "~/generated/client";
import { GuiderNoteFiltersState } from "../context";

export const UseFilterNotes = (
  notes: Note[],
  filters: GuiderNoteFiltersState
) => {
  const allFilters: boolean[] = Object.values(filters).filter(
    (filter) => typeof filter === "boolean"
  );
  // If no filters are active, return all notes
  if (allFilters.every((filter) => !filter)) {
    return notes;
  } else {
    return notes.filter((note) => {
      if (filters.high && note.priority === "HIGH") {
        return true;
      }
      if (filters.normal && note.priority === "NORMAL") {
        return true;
      }
      if (filters.low && note.priority === "LOW") {
        return true;
      }
      return false;
    });
  }
};
