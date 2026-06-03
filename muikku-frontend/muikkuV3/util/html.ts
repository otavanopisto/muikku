/**
 * Checks if the string is a valid HTML
 * @param str string to check
 * @returns boolean
 */
export const isValidHTML = (str: string): boolean => {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return Array.from(doc.body.childNodes).every((node) => node.nodeType === 1);
};
