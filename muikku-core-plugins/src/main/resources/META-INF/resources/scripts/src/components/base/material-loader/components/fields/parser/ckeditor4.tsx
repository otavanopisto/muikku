import { FieldDataParser } from "../types";

/**
 * CKEditor 4 parser that handles all field types
 */
export default class CKEditor4Parser implements FieldDataParser {
  /**
   * Parse field data from a CKEditor 4 element
   * @param element - The CKEditor 4 element to parse
   * @returns The parsed field data
   */
  parseFieldData(element: HTMLElement) {
    const type = element.getAttribute("type");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parameters: Record<string, any> = {};

    // Parse common CKEditor 4 structure
    element.querySelectorAll("param").forEach((node) => {
      parameters[node.getAttribute("name")] = node.getAttribute("value");
    });

    let content = null;
    if (parameters.type === "application/json") {
      try {
        content = JSON.parse(parameters.content || "null");
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to parse field content", e);
      }
    }

    return {
      type,
      content,
      parameters,
    };
  }
}
