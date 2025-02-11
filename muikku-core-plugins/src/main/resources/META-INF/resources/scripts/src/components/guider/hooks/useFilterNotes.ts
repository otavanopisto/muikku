import { Note } from "~/generated/client";
import { GuiderNoteFiltersState } from "../context";
import { useMemo } from "react";

/**
 * useFilterNotes
 * @param notes array of notes
 * @param filters note filters
 * @returns memoized filtered list of notes
 */
export const useFilterNotes = (
  notes: Note[],
  filters: GuiderNoteFiltersState
) => {
  const filteredNotes = useMemo(() => {
    const allFilters: boolean[] = Object.values(filters).filter(
      (filter: string | boolean) => typeof filter === "boolean"
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
  }, [notes, filters]);

  return filteredNotes;
};
