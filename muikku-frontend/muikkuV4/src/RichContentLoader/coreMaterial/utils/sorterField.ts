import { arrayMove } from "@dnd-kit/helpers";
import type { SorterFieldContent, SorterFieldItem } from "../types";

export type SorterRowResult = "PASS" | "FAIL";

/**
 * Fisher–Yates shuffle.
 * @param items - Items to shuffle
 */
export function shuffleSorterItems<T>(items: readonly T[]): T[] {
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
 * Parse saved `[id, id, …]`.
 * @param initialValue - Composite-reply JSON
 */
export function parseSorterAnswer(initialValue?: string): string[] {
  if (!initialValue) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(initialValue);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

/**
 * Restore saved order, or shuffle. Missing ids are appended from a shuffle.
 * @param content - Field definition
 * @param initialValue - Saved JSON
 */
export function initSorterItems(
  content: SorterFieldContent | null,
  initialValue?: string
): SorterFieldItem[] {
  if (!content) {
    return [];
  }
  const byId = new Map(content.items.map((item) => [item.id, item]));
  const savedIds = parseSorterAnswer(initialValue);
  if (savedIds.length === 0) {
    return shuffleSorterItems(content.items);
  }

  const used = new Set<string>();
  const items: SorterFieldItem[] = [];
  for (const id of savedIds) {
    const item = byId.get(id);
    if (item && !used.has(id)) {
      items.push(item);
      used.add(id);
    }
  }
  const leftover = shuffleSorterItems(
    content.items.filter((item) => !used.has(item.id))
  );
  return [...items, ...leftover];
}

/**
 * Persistable answer: item ids in current order.
 * @param items - Current list
 */
export function serializeSorterAnswer(
  items: readonly SorterFieldItem[]
): string {
  return JSON.stringify(items.map((item) => item.id));
}

/**
 * Insert-move (sortable preview).
 * @param items - Current list
 * @param from - Drag start index
 * @param to - Drop index
 */
export function moveSorterItem(
  items: readonly SorterFieldItem[],
  from: number,
  to: number
): SorterFieldItem[] {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= items.length ||
    to >= items.length
  ) {
    return [...items];
  }
  return arrayMove([...items], from, to);
}

/**
 * Grade by index against author order. Duplicate names (case-insensitive) can PASS.
 * @param items - Student order
 * @param content - Field definition
 */
export function checkSorterAnswers(
  items: readonly SorterFieldItem[],
  content: SorterFieldContent
): SorterRowResult[] {
  return items.map((item, index) => {
    const expected = content.items[index];
    if (!expected) {
      return "FAIL";
    }
    if (expected.id === item.id) {
      return "PASS";
    }
    if (item.name.toLocaleLowerCase() === expected.name.toLocaleLowerCase()) {
      return "PASS";
    }
    return "FAIL";
  });
}

/**
 * Whether every row passed.
 * @param answerState - Per-item results
 */
export function isSorterFieldCorrect(
  answerState: readonly SorterRowResult[]
): boolean {
  return answerState.length > 0 && !answerState.includes("FAIL");
}

/**
 * First item is capitalized when the field asks for it (display only).
 * @param name - Item name
 * @param index - Position
 * @param capitalize - Field flag
 */
export function sorterItemLabel(
  name: string,
  index: number,
  capitalize: boolean
): string {
  if (index !== 0 || !capitalize || name.length === 0) {
    return name;
  }
  return name.charAt(0).toLocaleUpperCase() + name.slice(1);
}
