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
 * Toggle active class on material highlight spans (imperative v1).
 * @param activeItemId activeItemId
 */
export function syncActiveMaterialHighlight(activeItemId: number | null): void {
  const root = document.querySelector(MATERIALS_PANEL_SELECTOR) ?? document;

  root
    .querySelectorAll(".material-highlight--active")
    .forEach((el) => el.classList.remove("material-highlight--active"));

  if (activeItemId == null) {
    return;
  }

  root
    .querySelectorAll(
      `.material-highlight[data-muikku-highlight-id="${activeItemId}"]`
    )
    .forEach((el) => el.classList.add("material-highlight--active"));
}

/**
 * Scroll materials panel to page + highlight span.
 * @param workspaceMaterialId workspaceMaterialId
 * @param activeItemId activeItemId
 */
export function scrollToActiveMaterialItem(
  workspaceMaterialId: number,
  activeItemId: number
): void {
  const page = document.getElementById(`p-${workspaceMaterialId}`);
  page?.scrollIntoView({ behavior: "smooth", block: "start" });

  window.requestAnimationFrame(() => {
    const root = document.querySelector(MATERIALS_PANEL_SELECTOR) ?? document;
    const highlight = root.querySelector(
      `#p-${workspaceMaterialId} .material-highlight[data-muikku-highlight-id="${activeItemId}"]`
    );
    highlight?.scrollIntoView({ behavior: "smooth", block: "center" });
    syncActiveMaterialHighlight(activeItemId);
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
