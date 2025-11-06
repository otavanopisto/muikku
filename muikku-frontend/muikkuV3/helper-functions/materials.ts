/**
 * wordCount - Counts the amount of words
 * @param rawText rawText
 * @returns amount of words
 */
export function wordCount(rawText: string) {
  return rawText === "" ? 0 : rawText.trim().split(/\s+/).length;
}

/**
 * characterCount - Counts the amount of characters
 * @param rawText rawText
 * @returns amount of characters
 */
export function characterCount(rawText: string) {
  return rawText === ""
    ? 0
    : rawText
        .trim()
        .replace(/(\s|\r\n|\r|\n)+/g, "")
        .split("").length;
}
