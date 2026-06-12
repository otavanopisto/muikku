import { NotebookNote } from "~/generated/client";
import {
  isNotebookContextHighlight,
  isNotebookContextNote,
} from "~/helper-functions/notebook";
import {
  AnnotationOrphanReason,
  classifyAnnotation,
  getAnnotationOrphanReason,
  getSearchableFromMaterialHtml,
  isAnnotationOrphaned,
} from "~/util/html";

export type NotebookContextOrphanStatus = {
  isOrphaned: boolean;
  reason: AnnotationOrphanReason | null;
};

/**
 * Resolve orphan status for context highlight / context note against page HTML.
 * Returns null for non-context notes or when page HTML is unavailable.
 * @param note note
 * @param materialHtml materialHtml
 * @returns NotebookContextOrphanStatus | null
 */
export function resolveNotebookContextOrphanStatus(
  note: NotebookNote,
  materialHtml?: string
): NotebookContextOrphanStatus | null {
  if (!isNotebookContextHighlight(note) && !isNotebookContextNote(note)) {
    return null;
  }

  if (!materialHtml) {
    return null;
  }

  const searchable = getSearchableFromMaterialHtml(materialHtml);
  const result = classifyAnnotation(
    {
      start: note.start,
      end: note.end,
      index: note.index,
    },
    searchable.text
  );

  return {
    isOrphaned: isAnnotationOrphaned(result),
    reason: getAnnotationOrphanReason(result),
  };
}
