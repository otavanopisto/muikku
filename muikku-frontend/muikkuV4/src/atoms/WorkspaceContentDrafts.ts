import { atom } from "jotai";

/**
 * Unsaved HTML keyed by workspaceMaterialId.
 * Production editor/preview read this; the query cache stays static until save.
 */
export const materialHtmlDraftsAtom = atom<Record<number, string>>({});

/**
 * Write one page's HTML draft. No-op if the value is unchanged.
 */
export const setMaterialHtmlDraftAtom = atom(
  null,
  (get, set, payload: { workspaceMaterialId: number; html: string }) => {
    const drafts = get(materialHtmlDraftsAtom);
    if (drafts[payload.workspaceMaterialId] === payload.html) {
      return;
    }
    set(materialHtmlDraftsAtom, {
      ...drafts,
      [payload.workspaceMaterialId]: payload.html,
    });
  }
);

/**
 * Effective HTML for a page: draft if present, otherwise static html.
 * @param drafts - Draft map
 * @param workspaceMaterialId - Page id
 * @param fallbackHtml - Static node html
 */
export function resolvedMaterialHtml(
  drafts: Record<number, string>,
  workspaceMaterialId: number | null | undefined,
  fallbackHtml: string | null | undefined
): string {
  if (workspaceMaterialId == null) {
    return fallbackHtml ?? "";
  }
  return drafts[workspaceMaterialId] ?? fallbackHtml ?? "";
}
