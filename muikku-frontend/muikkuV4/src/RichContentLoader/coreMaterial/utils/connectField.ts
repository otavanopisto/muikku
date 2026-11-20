import type { ConnectFieldContent, ConnectFieldItem } from "../types";
import { arrayMove } from "@dnd-kit/helpers";

export type ConnectRowResult = "PASS" | "FAIL";

/**
 * Fisher–Yates shuffle (same idea as V3, unseeded).
 * @param items - Items to shuffle
 */
export function shuffleConnectItems<T>(items: readonly T[]): T[] {
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
 * Parse the persisted `{ termName: counterpartName }` JSON map.
 * @param initialValue - Composite-reply JSON string
 */
export function parseConnectAnswer(
  initialValue?: string
): Record<string, string> {
  if (!initialValue) {
    return {};
  }
  try {
    const parsed: unknown = JSON.parse(initialValue);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const answer: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string" && value.length > 0) {
        answer[key] = value;
      }
    }
    return answer;
  } catch {
    return {};
  }
}

/**
 * Persistable answer: term name → counterpart name.
 * @param fields - Left column (author order)
 * @param counterparts - Right column (current pairing by index)
 */
export function serializeConnectAnswer(
  fields: readonly ConnectFieldItem[],
  counterparts: readonly ConnectFieldItem[]
): string {
  const value: Record<string, string> = {};
  fields.forEach((field, index) => {
    const counterpart = counterparts[index];
    if (counterpart) {
      value[field.name] = counterpart.name;
    }
  });
  return JSON.stringify(value);
}

/**
 * Left terms stay in author order. Right column is restored from the saved
 * map, or shuffled when there is no answer.
 * @param content - Field definition
 * @param initialValue - Saved JSON map
 */
export function initConnectLayout(
  content: ConnectFieldContent | null,
  initialValue?: string
): {
  fields: ConnectFieldItem[];
  counterparts: ConnectFieldItem[];
} {
  if (!content) {
    return { fields: [], counterparts: [] };
  }

  const fields = [...content.fields];
  const answer = parseConnectAnswer(initialValue);

  if (Object.keys(answer).length === 0) {
    return {
      fields,
      counterparts: shuffleConnectItems(content.counterparts),
    };
  }

  const used = new Set<string>();
  fields.forEach((field) => {
    const counterpartName = answer[field.name];
    if (counterpartName) {
      used.add(counterpartName);
    }
  });

  const leftover = shuffleConnectItems(
    content.counterparts.filter((item) => !used.has(item.name))
  );
  let leftoverIndex = 0;

  const counterparts = fields
    .map((field) => {
      let counterpartName = answer[field.name];
      if (!counterpartName) {
        counterpartName = leftover[leftoverIndex]?.name;
        leftoverIndex += 1;
      }
      return (
        content.counterparts.find((item) => item.name === counterpartName) ??
        leftover[leftoverIndex - 1]
      );
    })
    .filter((item): item is ConnectFieldItem => Boolean(item));

  return { fields, counterparts };
}

/**
 * Swap two counterparts by name. Other rows stay put.
 * @param counterparts - Current right column
 * @param sourceName - Dragged counterpart name
 * @param targetName - Drop-target counterpart name
 */
export function swapCounterparts(
  counterparts: readonly ConnectFieldItem[],
  sourceName: string,
  targetName: string
): ConnectFieldItem[] {
  const from = counterparts.findIndex((item) => item.name === sourceName);
  const to = counterparts.findIndex((item) => item.name === targetName);
  if (from < 0 || to < 0 || from === to) {
    return [...counterparts];
  }
  const next = [...counterparts];
  const source = next[from];
  const target = next[to];
  if (!source || !target) {
    return next;
  }
  next[from] = target;
  next[to] = source;
  return next;
}

/**
 * Grade one row. Duplicate texts (case-insensitive) can still PASS.
 * @param field - Term
 * @param counterpart - Counterpart on the same row
 * @param content - Field definition
 */
export function checkConnectRow(
  field: ConnectFieldItem,
  counterpart: ConnectFieldItem,
  content: ConnectFieldContent
): ConnectRowResult {
  const connection = content.connections.find(
    (row) => row.field === field.name
  );
  if (!connection) {
    return "FAIL";
  }
  if (connection.counterpart === counterpart.name) {
    return "PASS";
  }

  const matchingCounterpartNames = content.counterparts
    .filter(
      (item) =>
        item.text.toLocaleLowerCase() === counterpart.text.toLocaleLowerCase()
    )
    .map((item) => item.name);

  const sameTextFields = content.fields.filter(
    (item) => item.text.toLocaleLowerCase() === field.text.toLocaleLowerCase()
  );
  const sameTextConnections = sameTextFields
    .map((item) => content.connections.find((row) => row.field === item.name))
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  const matchesDuplicateText = sameTextConnections.some((row) =>
    matchingCounterpartNames.includes(row.counterpart)
  );
  return matchesDuplicateText ? "PASS" : "FAIL";
}

/**
 * Grade every row. Field is correct when nothing FAILs.
 * @param fields - Left column
 * @param counterparts - Right column
 * @param content - Field definition
 */
export function checkConnectAnswers(
  fields: readonly ConnectFieldItem[],
  counterparts: readonly ConnectFieldItem[],
  content: ConnectFieldContent
): ConnectRowResult[] {
  return fields.map((field, index) => {
    const counterpart = counterparts[index];
    if (!counterpart) {
      return "FAIL";
    }
    return checkConnectRow(field, counterpart, content);
  });
}

/**
 * Whether every row passed.
 * @param answerState - Per-row results
 */
export function isConnectFieldCorrect(
  answerState: readonly ConnectRowResult[]
): boolean {
  return answerState.length > 0 && !answerState.includes("FAIL");
}

/**
 * Term number (1-based) that a counterpart should be next to.
 * @param counterpartName - Counterpart name
 * @param fields - Left column
 * @param content - Field definition
 */
export function correctTermNumber(
  counterpartName: string,
  fields: readonly ConnectFieldItem[],
  content: ConnectFieldContent
): number | null {
  const connection = content.connections.find(
    (row) => row.counterpart === counterpartName
  );
  if (!connection) {
    return null;
  }
  const index = fields.findIndex((field) => field.name === connection.field);
  return index >= 0 ? index + 1 : null;
}

/**
 * Insert a counterpart at a new index (sortable preview / drop).
 * @param counterparts - Current right column
 * @param from - Drag start index
 * @param to - Drop index
 */
export function moveCounterpart(
  counterparts: readonly ConnectFieldItem[],
  from: number,
  to: number
): ConnectFieldItem[] {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= counterparts.length ||
    to >= counterparts.length
  ) {
    return [...counterparts];
  }
  return arrayMove([...counterparts], from, to);
}
