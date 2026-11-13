import { atom } from "jotai";
import { selectAtom } from "jotai/utils";
import { isEqual, pick } from "lodash";
import type {
  Language,
  MaterialContentNode,
  MaterialProducer,
} from "~/generated/client";

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
  producers: MaterialProducer[];
  assignmentType: MaterialContentNode["assignmentType"];
  viewRestrict: MaterialContentNode["viewRestrict"];
  correctAnswers: MaterialContentNode["correctAnswers"];
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

const PUBLISH_FIELDS: (keyof MaterialContentNode)[] = [
  "html",
  "title",
  "extraInfo",
  "titleLanguage",
  "license",
  "ai",
  "maxPoints",
  "producers",
  "assignmentType",
  "viewRestrict",
  "correctAnswers",
] as const;

/**
 * True when the draft has at least one publishable field that differs from the saved node.
 * @param page - Query-cache node
 * @param draft - In-memory patch
 */
export function isPageDraftPublishable(
  page: MaterialContentNode,
  draft: MaterialPageDraft | undefined
): boolean {
  if (!draft) return false;
  const saved = pick(page, PUBLISH_FIELDS);
  const next = { ...saved, ...pick(draft, PUBLISH_FIELDS) };
  return !isEqual(saved, next);
}

/**
 * Full draft for one page, including html. For toolbar dirty-check only.
 */
export function materialPageDraftAtom(workspaceMaterialId: number | undefined) {
  return selectAtom(materialPageDraftsAtom, (drafts) =>
    workspaceMaterialId != null ? drafts[workspaceMaterialId] : undefined
  );
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
        a?.maxPoints === b?.maxPoints &&
        a?.assignmentType === b?.assignmentType &&
        a?.viewRestrict === b?.viewRestrict &&
        a?.correctAnswers === b?.correctAnswers)
  );
}
