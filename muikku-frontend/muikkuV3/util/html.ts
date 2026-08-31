import { MemoFieldContentFormat } from "./memo-content-format";

/**
 * Checks if the string is a valid HTML
 * @param str string to check
 * @returns boolean
 */
export const isValidHTML = (str: string): boolean => {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
};

/**
 * Escapes HTML characters in a string.
 * @param str string to escape
 * @returns escaped string
 */
export const escapeHtml = (str: string): string =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Extracts plain text from an HTML string.
 * @param html HTML string
 * @returns plain text
 */
export const htmlToPlainText = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent ?? "";
};

/**
 * Converts stored memo content to HTML the editor / readonly view can use.
 * Plain text is escaped so characters like <, > and & stay visible as text.
 * @param value value
 * @param format format
 * @param replaceNewlinesWithBreaks replace newlines with breaks
 * @returns memo display HTML string
 */
export const toMemoDisplayHtml = (
  value: string,
  format: MemoFieldContentFormat,
  replaceNewlinesWithBreaks: (str: string) => string
): string => {
  if (format === "html") {
    return value;
  }
  if (!value) {
    return "";
  }
  const normalized = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return "<p>" + replaceNewlinesWithBreaks(escapeHtml(normalized)) + "</p>";
};
