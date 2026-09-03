import { NotebookNote } from "~/generated/client";
import { NotebookV2DraftsState } from "./notebook-drafts";

const MATERIALS_PANEL_SELECTOR = ".content-panel--workspace-materials";

/**
 * Resolve page id for scrolling when a note/draft is activated.
 * @param noteId noteId
 * @param notes notes
 * @param drafts drafts
 * @returns number | undefined
 */
export function resolveWorkspaceMaterialIdForActiveItem(
  noteId: number,
  notes: NotebookNote[] | null,
  drafts: NotebookV2DraftsState
): number | undefined {
  const saved = notes?.find((n) => n.id === noteId);
  if (saved && "workspaceMaterialId" in saved) {
    return saved.workspaceMaterialId;
  }

  const contextDraft = drafts.contextNotes.find((d) => d.clientId === noteId);
  if (contextDraft) {
    return contextDraft.workspaceMaterialId;
  }

  return undefined;
}

/**
 * Scroll materials panel to page + highlight span.
 * @param workspaceMaterialId workspaceMaterialId
 * @param highlightId highlightId
 */
export function scrollToMaterialHighlightItem(
  workspaceMaterialId: number,
  highlightId: number
): void {
  const page = document.getElementById(`p-${workspaceMaterialId}`);
  page?.scrollIntoView({ behavior: "smooth", block: "start" });

  window.requestAnimationFrame(() => {
    const root = document.querySelector(MATERIALS_PANEL_SELECTOR) ?? document;
    const highlight = root.querySelector(
      `#p-${workspaceMaterialId} .material-annotation[data-muikku-annotation-id="${highlightId}"]`
    );
    highlight?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/**
 * Scroll notebook panel to a saved note row.
 * @param noteId noteId
 */
export function scrollToNotebookItem(noteId: number): void {
  window.requestAnimationFrame(() => {
    const el = document.querySelector(`[data-notebook-item-id="${noteId}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}
