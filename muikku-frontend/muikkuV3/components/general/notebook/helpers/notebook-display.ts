import { NotebookNote, NotebookNoteType } from "~/generated/client";
import {
  isNotebookContextHighlight,
  isNotebookContextNote,
  isNotebookWorkspaceMaterialNote,
  isNotebookWorkspaceNote,
} from "~/helper-functions/notebook";

/**
 * List title for any notebook note variant.
 * @param note note
 */
export function getNotebookNoteListTitle(note: NotebookNote): string {
  if (isNotebookWorkspaceNote(note)) {
    return note.title || "";
  }

  if (isNotebookWorkspaceMaterialNote(note)) {
    return note.title || "";
  }

  if (isNotebookContextNote(note)) {
    return note.title || "";
  }

  return "";
}

/**
 * Rich text body for list / PDF (Bit 2+).
 * @param note note
 * @returns string
 */
export function getNotebookNoteBodyHtml(note: NotebookNote): string {
  if (
    isNotebookWorkspaceNote(note) ||
    isNotebookWorkspaceMaterialNote(note) ||
    isNotebookContextNote(note)
  ) {
    return note.text || "";
  }

  if (isNotebookContextHighlight(note)) {
    return `<blockquote><p>${note.text}</p></blockquote>`;
  }

  return "";
}

/**
 * BEM modifier classes for notebook item rows.
 * @param note note
 * @returns string
 */
export function getNotebookItemClassName(note: NotebookNote): string {
  if (isNotebookWorkspaceNote(note)) {
    return "";
  }
  if (isNotebookWorkspaceMaterialNote(note)) {
    return "notebook__item--material";
  }
  if (isNotebookContextHighlight(note)) {
    return "notebook__item--annotation notebook__item--highlight";
  }
  if (isNotebookContextNote(note)) {
    return "notebook__item--annotation notebook__item--note";
  }
  return "";
}

/**
 * Editable in CKEditor flow (not context highlights).
 * @param note note
 * @returns boolean
 */
export function isNotebookNoteEditable(note: NotebookNote): boolean {
  return (
    isNotebookWorkspaceNote(note) ||
    isNotebookWorkspaceMaterialNote(note) ||
    isNotebookContextNote(note)
  );
}

/**
 * All note types can be deleted in v2 mock mode.
 * @param _note note
 * @returns boolean
 */
export function isNotebookNoteDeletable(_note: NotebookNote): boolean {
  return true;
}

/**
 * Build updated note for save (editable types only).
 * @param note note
 * @param title title
 * @param text text
 * @returns NotebookNote | null
 */
export function buildEditedNotebookNote(
  note: NotebookNote,
  title: string,
  text: string
): NotebookNote | null {
  if (!isNotebookNoteEditable(note)) {
    return null;
  }

  if (note.type === NotebookNoteType.Workspace) {
    return { ...note, title, text };
  }

  if (note.type === NotebookNoteType.WorkspaceMaterial) {
    return { ...note, title, text };
  }

  if (note.type === NotebookNoteType.WorkspaceMaterialContextNote) {
    return { ...note, title, text };
  }

  return null;
}
