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
 * If the page HTML is missing, the status is orphaned with reason "html_missing".
 * @param note note
 * @param materialHtml materialHtml
 */
export function resolveNotebookContextOrphanStatus(
  note: NotebookNote,
  materialHtml?: string
): NotebookContextOrphanStatus {
  if (!isNotebookContextHighlight(note) && !isNotebookContextNote(note)) {
    return null;
  }

  if (!materialHtml) {
    return {
      isOrphaned: true,
      reason: "anchor_missing",
    };
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
