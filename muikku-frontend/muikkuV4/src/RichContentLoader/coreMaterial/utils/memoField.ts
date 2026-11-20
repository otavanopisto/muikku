export type MemoContentFormat = "plain" | "html";

const HTML_ROOT_TAGS = new Set([
  "p",
  "h3",
  "h4",
  "div",
  "ul",
  "ol",
  "blockquote",
  "table",
  "figure",
  "pre",
  "br",
]);

/**
 * Parse a positive integer limit from field content.
 * @param value - Raw string from content
 */
export function parseMemoLimit(value?: string): number | undefined {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

/**
 * Characters excluding whitespace (V3).
 * @param rawText - Plain text
 */
export function getMemoCharacters(rawText: string): string[] {
  if (!rawText) {
    return [];
  }
  return rawText
    .trim()
    .replace(/(\s|\r\n|\r|\n)+/g, "")
    .split("");
}

/**
 * Words split on whitespace (V3).
 * @param rawText - Plain text
 */
export function getMemoWords(rawText: string): string[] {
  if (!rawText.trim()) {
    return [];
  }
  return rawText.trim().split(/\s+/);
}

/**
 * Strip tags for counting.
 * @param html - Stored or editor HTML
 */
export function htmlToPlainText(html: string): string {
  if (!html) {
    return "";
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent ?? "";
}

/**
 * Whether stored memo looks like CKEditor/Tiptap HTML, not typed `<`.
 * @param value - Stored answer
 */
export function getMemoContentFormat(value: string): MemoContentFormat {
  const trimmed = (value ?? "").trim();
  if (!trimmed.startsWith("<")) {
    return "plain";
  }
  const match = /^<([a-z][a-z0-9]*)/i.exec(trimmed);
  if (!match || !HTML_ROOT_TAGS.has(match[1].toLowerCase())) {
    return "plain";
  }
  const doc = new DOMParser().parseFromString(trimmed, "text/html");
  const children = Array.from(doc.body.childNodes);
  const hasLooseText = children.some(
    (node) =>
      node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim() !== ""
  );
  if (hasLooseText) {
    return "plain";
  }
  return children.some((node) => node.nodeType === Node.ELEMENT_NODE)
    ? "html"
    : "plain";
}

/**
 * Escape plain text for HTML display.
 * @param value - Plain text
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * HTML for readonly view. Plain text keeps newlines.
 * @param value - Stored answer
 */
export function toMemoDisplayHtml(value: string): string {
  if (!value) {
    return "";
  }
  if (getMemoContentFormat(value) === "html") {
    return value;
  }
  const normalized = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return `<p>${escapeHtml(normalized).replace(/\n/g, "<br />")}</p>`;
}

/**
 * Counts from stored value (HTML or plain).
 * @param value - Stored answer
 */
export function countMemoText(value: string): {
  words: number;
  characters: number;
  plain: string;
} {
  const plain =
    getMemoContentFormat(value) === "html" ? htmlToPlainText(value) : value;
  return {
    plain,
    words: getMemoWords(plain).length,
    characters: getMemoCharacters(plain).length,
  };
}

/**
 * Whether the next plain text would exceed max chars/words.
 * @param nextPlain - Candidate plain text
 * @param maxChars - Optional char cap
 * @param maxWords - Optional word cap
 */
export function exceedsMemoLimit(
  nextPlain: string,
  maxChars?: number,
  maxWords?: number
): "characters" | "words" | null {
  if (maxChars && getMemoCharacters(nextPlain).length > maxChars) {
    return "characters";
  }
  if (maxWords && getMemoWords(nextPlain).length > maxWords) {
    return "words";
  }
  return null;
}

/**
 * Visible textarea rows from content.
 * @param rows - Raw content.rows
 */
export function memoRowCount(rows?: string): number {
  const parsed = Number.parseInt(rows ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3;
}
