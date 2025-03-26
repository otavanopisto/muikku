import { FieldDataParser } from "../types";

/**
 * CKEditor 5 parser that handles all field types
 */
export default class CKEditor5Parser implements FieldDataParser {
  /**
   * Parse field data from a CKEditor 5 element
   * @param element - The CKEditor 5 element to parse
   * @returns The parsed field data
   */
  parseFieldData(element: HTMLElement) {
    let content = null;
    const contentAttr = element.getAttribute("data-field-content");

    if (contentAttr) {
      try {
        content = JSON.parse(contentAttr);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to parse field content", e);
      }
    }

    return {
      type: element.getAttribute("data-field-type") || "",
      content,
      parameters: JSON.parse(element.getAttribute("data-field-params") || "{}"),
    };
  }
}
