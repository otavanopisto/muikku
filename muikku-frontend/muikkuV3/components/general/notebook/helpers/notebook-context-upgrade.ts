import { NotebookNote, NotebookNoteType } from "~/generated/client";
import { isNotebookContextHighlight } from "~/helper-functions/notebook";
import { draftTitleFromSelection } from "./notebook-drafts";

export type ContextHighlightNote = Extract<
  NotebookNote,
  { type: typeof NotebookNoteType.WorkspaceMaterialContextHighlight }
>;

/**
 * If note is a context highlight note.
 * @param note note
 */
export function isContextHighlightNote(
  note: NotebookNote
): note is ContextHighlightNote {
  return isNotebookContextHighlight(note);
}

/**
 * Get context highlight upgrade editor defaults.
 * @param highlight highlight
 */
export function getContextHighlightUpgradeEditorDefaults(
  highlight: ContextHighlightNote
) {
  const selectedText = highlight.text.trim();

  return {
    title: draftTitleFromSelection(selectedText),
    text: `<blockquote><p>${selectedText}</p></blockquote><p></p>`,
  };
}

/**
 * Build upgraded context note.
 * @param highlight highlight
 * @param text text
 */
export function buildUpgradedContextNote(
  highlight: ContextHighlightNote,
  text: string
): Extract<
  NotebookNote,
  { type: typeof NotebookNoteType.WorkspaceMaterialContextNote }
> {
  return {
    ...highlight,
    type: NotebookNoteType.WorkspaceMaterialContextNote,
    title: "",
    text,
  };
}
