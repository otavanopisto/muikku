import { MaterialHighlight } from "~/components/base/material-loader/types";
import { NotebookNote, NotebookNoteType } from "~/generated/client";

/**
 * Checks if the note is a workspace note
 * @param note - Notebook note to check
 * @returns True if the note is a workspace note
 */
export function isNotebookWorkspaceNote(
  note: NotebookNote
): note is Extract<NotebookNote, { type: typeof NotebookNoteType.Workspace }> {
  return note.type === NotebookNoteType.Workspace;
}

/**
 * Checks if the note is a workspace material note
 * @param note - Notebook note to check
 * @returns True if the note is a workspace material note
 */
export function isNotebookWorkspaceMaterialNote(
  note: NotebookNote
): note is Extract<
  NotebookNote,
  { type: typeof NotebookNoteType.WorkspaceMaterial }
> {
  return note.type === NotebookNoteType.WorkspaceMaterial;
}

/**
 * Checks if the note is a workspace material context highlight
 * @param note - Notebook note to check
 * @returns True if the note is a workspace material context highlight
 */
export function isNotebookContextHighlight(
  note: NotebookNote
): note is Extract<
  NotebookNote,
  { type: typeof NotebookNoteType.WorkspaceMaterialContextHighlight }
> {
  return note.type === NotebookNoteType.WorkspaceMaterialContextHighlight;
}

/**
 * Checks if the note is a workspace material context note
 * @param note - Notebook note to check
 * @returns True if the note is a workspace material context note
 */
export function isNotebookContextNote(
  note: NotebookNote
): note is Extract<
  NotebookNote,
  { type: typeof NotebookNoteType.WorkspaceMaterialContextNote }
> {
  return note.type === NotebookNoteType.WorkspaceMaterialContextNote;
}

/**
 * Maps a workspace material context highlight to a MaterialLoader inject model
 * @param note - Workspace material context highlight note
 * @returns MaterialLoader inject model
 */
export function notebookContextHighlightToMaterialHighlight(
  note: Extract<
    NotebookNote,
    { type: typeof NotebookNoteType.WorkspaceMaterialContextHighlight }
  >
): MaterialHighlight {
  return {
    id: note.id,
    workspaceMaterialId: note.workspaceMaterialId,
    fieldName: null,
    start: note.start,
    end: note.end,
    index: note.index,
    kind: "highlight",
  };
}

/**
 * Maps a workspace material context note to a MaterialLoader inject model
 * @param note - Workspace material context note
 * @returns MaterialLoader inject model
 */
export function notebookContextNoteToMaterialHighlight(
  note: Extract<
    NotebookNote,
    { type: typeof NotebookNoteType.WorkspaceMaterialContextNote }
  >
): MaterialHighlight {
  return {
    id: note.id,
    workspaceMaterialId: note.workspaceMaterialId,
    fieldName: null,
    start: note.start,
    end: note.end,
    index: note.index,
    kind: "note",
  };
}

/**
 * Gets the material highlights by page from notes
 * @param notes notes
 * @returns Record<number, MaterialHighlight[]>
 */
export function getMaterialHighlightsByPageFromNotes(
  notes: NotebookNote[] | null | undefined
): Record<number, MaterialHighlight[]> {
  const map: Record<number, MaterialHighlight[]> = {};
  if (!notes?.length) return map;
  for (const note of notes) {
    if (isNotebookContextHighlight(note)) {
      const list = map[note.workspaceMaterialId] ?? [];
      list.push(notebookContextHighlightToMaterialHighlight(note));
      map[note.workspaceMaterialId] = list;
    } else if (isNotebookContextNote(note)) {
      const list = map[note.workspaceMaterialId] ?? [];
      list.push(notebookContextNoteToMaterialHighlight(note));
      map[note.workspaceMaterialId] = list;
    }
  }
  return map;
}
