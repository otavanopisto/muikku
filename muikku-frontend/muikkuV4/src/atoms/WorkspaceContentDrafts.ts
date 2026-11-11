import { atom } from "jotai";
import { selectAtom } from "jotai/utils";
import type { Language, MaterialContentNode } from "~/generated/client";

/**
 * Unsaved page fields. Missing keys mean “use the static node”.
 */
export type MaterialPageDraft = Partial<{
  html: string;
  title: string;
  extraInfo: string;
  titleLanguage: Language;
  license: string;
  ai: MaterialContentNode["ai"];
  maxPoints: number;
}>;

/**
 * Unsaved patches keyed by workspaceMaterialId.
 */
export const materialPageDraftsAtom = atom<Record<number, MaterialPageDraft>>(
  {}
);

/**
 * Merge a patch into one page's draft.
 */
export const patchMaterialPageDraftAtom = atom(
  null,
  (
    get,
    set,
    payload: { workspaceMaterialId: number; patch: MaterialPageDraft }
  ) => {
    const drafts = get(materialPageDraftsAtom);
    const current = drafts[payload.workspaceMaterialId] ?? {};
    set(materialPageDraftsAtom, {
      ...drafts,
      [payload.workspaceMaterialId]: { ...current, ...payload.patch },
    });
  }
);

/**
 * Drop the in-memory draft for one page (revert to static).
 */
export const clearMaterialPageDraftAtom = atom(
  null,
  (get, set, workspaceMaterialId: number) => {
    const drafts = get(materialPageDraftsAtom);
    if (!(workspaceMaterialId in drafts)) return;
    const next = { ...drafts };
    delete next[workspaceMaterialId];
    set(materialPageDraftsAtom, next);
  }
);

/**
 * Static node with the unsaved patch overlaid.
 * @param page - Query-cache node
 * @param draft - In-memory patch
 */
export function resolvedPageDraft(
  page: MaterialContentNode,
  draft: MaterialPageDraft | undefined
): MaterialContentNode {
  if (!draft) return page;
  return { ...page, ...draft };
}

/**
 * Draft for one page. Html changes do not count as a UI update.
 */
export function materialPageDraftUiAtom(
  workspaceMaterialId: number | undefined
) {
  return selectAtom(
    materialPageDraftsAtom,
    (drafts) =>
      workspaceMaterialId != null ? drafts[workspaceMaterialId] : undefined,
    (a, b) =>
      a === b ||
      (a?.title === b?.title &&
        a?.extraInfo === b?.extraInfo &&
        a?.titleLanguage === b?.titleLanguage &&
        a?.license === b?.license &&
        a?.ai === b?.ai &&
        a?.maxPoints === b?.maxPoints)
  );
}
