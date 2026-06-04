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
 * Converts an HTML string to a memo display HTML string.
 * @param value value
 * @param replaceNewlinesWithBreaks replace newlines with breaks
 * @returns memo display HTML string
 */
export const toMemoDisplayHtml = (
  value: string,
  replaceNewlinesWithBreaks: (str: string) => string
): string => "<p>" + replaceNewlinesWithBreaks(escapeHtml(value)) + "</p>";
