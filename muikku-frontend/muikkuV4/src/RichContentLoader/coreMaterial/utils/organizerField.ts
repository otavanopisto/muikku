import type {
  OrganizerCategory,
  OrganizerFieldContent,
  OrganizerTerm,
} from "../types";

export type OrganizerBoxes = Record<string, string[]>;
export type OrganizerTermResult = "PASS" | "FAIL";

/**
 * Organizer check result
 */
export interface OrganizerCheckResult {
  overall: OrganizerTermResult;
  boxes: Record<
    string,
    { overall: OrganizerTermResult } & Record<string, OrganizerTermResult>
  >;
  missing: Record<string, string[]>;
}

/**
 * Fisher–Yates shuffle.
 * @param items - Items to shuffle
 */
export function shuffleItems<T>(items: readonly T[]): T[] {
  const array = [...items];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = array[index];
    const next = array[swapIndex];
    if (current === undefined || next === undefined) {
      continue;
    }
    array[index] = next;
    array[swapIndex] = current;
  }
  return array;
}

/**
 * Parse `{ [categoryId]: termId[] }`.
 * @param initialValue - Saved JSON
 */
export function parseOrganizerAnswer(initialValue?: string): OrganizerBoxes {
  if (!initialValue) {
    return {};
  }
  try {
    const parsed: unknown = JSON.parse(initialValue);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const boxes: OrganizerBoxes = {};
    for (const [categoryId, terms] of Object.entries(parsed)) {
      if (!Array.isArray(terms)) {
        continue;
      }
      boxes[categoryId] = terms.filter(
        (termId): termId is string => typeof termId === "string"
      );
    }
    return boxes;
  } catch {
    return {};
  }
}

/**
 * Empty boxes plus any saved term lists.
 * @param categories - Category definitions
 * @param initialValue - Saved JSON
 */
export function initOrganizerBoxes(
  categories: readonly OrganizerCategory[],
  initialValue?: string
): OrganizerBoxes {
  const saved = parseOrganizerAnswer(initialValue);
  const boxes: OrganizerBoxes = {};
  for (const category of categories) {
    boxes[category.id] = [...(saved[category.id] ?? [])];
  }
  return boxes;
}

/**
 * Flattened term ids currently placed (duplicates if used in several boxes).
 * @param boxes - Category → term ids
 */
export function usedTermIds(boxes: OrganizerBoxes): string[] {
  return Object.values(boxes).flat();
}

/**
 * Add a term to a category unless it is already there.
 * @param boxes - Current boxes
 * @param categoryId - Target category
 * @param termId - Term to add
 */
export function addTermToBox(
  boxes: OrganizerBoxes,
  categoryId: string,
  termId: string
): OrganizerBoxes {
  const current = boxes[categoryId] ?? [];
  if (current.includes(termId)) {
    return boxes;
  }
  return { ...boxes, [categoryId]: [...current, termId] };
}

/**
 * Remove one occurrence of a term from a category.
 * @param boxes - Current boxes
 * @param categoryId - Category
 * @param termId - Term to remove
 */
export function removeTermFromBox(
  boxes: OrganizerBoxes,
  categoryId: string,
  termId: string
): OrganizerBoxes {
  const current = boxes[categoryId] ?? [];
  const index = current.indexOf(termId);
  if (index < 0) {
    return boxes;
  }
  const next = [...current];
  next.splice(index, 1);
  return { ...boxes, [categoryId]: next };
}

/**
 * Move a placed term from one category to another.
 * No-op if source and target are the same. If the target already has
 * the term, it is only removed from the source (true move, not a second copy).
 * @param boxes - Current boxes
 * @param fromCategoryId - Source category
 * @param toCategoryId - Target category
 * @param termId - Term to move
 */
export function moveTermBetweenBoxes(
  boxes: OrganizerBoxes,
  fromCategoryId: string,
  toCategoryId: string,
  termId: string
): OrganizerBoxes {
  if (fromCategoryId === toCategoryId) {
    return boxes;
  }
  const removed = removeTermFromBox(boxes, fromCategoryId, termId);
  return addTermToBox(removed, toCategoryId, termId);
}

/**
 * Grade boxes against categoryTerms.
 * @param boxes - Student placement
 * @param content - Field definition
 */
export function checkOrganizerAnswers(
  boxes: OrganizerBoxes,
  content: OrganizerFieldContent
): OrganizerCheckResult {
  const result: OrganizerCheckResult = {
    overall: "PASS",
    boxes: {},
    missing: {},
  };

  for (const category of content.categories) {
    const correlation = content.categoryTerms.find(
      (row) => row.category === category.id
    );
    const expected = new Set(correlation?.terms ?? []);
    const placed = boxes[category.id] ?? [];
    const boxResult: OrganizerCheckResult["boxes"][string] = {
      overall: "PASS",
    };

    for (const termId of placed) {
      const ok = expected.has(termId);
      boxResult[termId] = ok ? "PASS" : "FAIL";
      if (!ok) {
        boxResult.overall = "FAIL";
        result.overall = "FAIL";
      }
      expected.delete(termId);
    }

    const missing = Array.from(expected);
    result.missing[category.id] = missing;
    if (missing.length > 0) {
      boxResult.overall = "FAIL";
      result.overall = "FAIL";
    }
    result.boxes[category.id] = boxResult;
  }

  return result;
}

/**
 * Lookup term label.
 * @param terms - Term definitions
 * @param termId - Term id
 */
export function termLabel(
  terms: readonly OrganizerTerm[],
  termId: string
): string {
  return terms.find((term) => term.id === termId)?.name ?? termId;
}
