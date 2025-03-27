import { FieldDataParser, MaterialLoaderBaseData } from "../types";

/**
 * CKEditor 4 parser that handles all field types
 */
export default class CKEditor4Parser implements FieldDataParser {
  /**
   * Parse field data from a CKEditor 4 element
   * @param element - The CKEditor 4 element to parse
   * @param materialBaseData - The material base data
   * @returns The parsed field data
   */
  parseFieldData(
    element: HTMLElement,
    materialBaseData: MaterialLoaderBaseData
  ) {
    const parameters: Record<string, any> = {};

    // Parse all params from the element
    element.querySelectorAll("param").forEach((node) => {
      parameters[node.getAttribute("name")] = node.getAttribute("value");
    });

    // Handle JSON content parsing
    if (parameters["type"] === "application/json") {
      try {
        parameters["content"] =
          parameters["content"] && JSON.parse(parameters["content"]);
      } catch (e) {
        console.error("Failed to parse field content", e);
      }
    }

    // Set defaults
    if (!parameters["type"]) {
      parameters["type"] = "application/json";
    }

    if (!parameters["content"]) {
      parameters["content"] = null;
    }

    // Handle composite replies if props are provided
    if (materialBaseData) {
      parameters["initialValue"] = null;
      if (materialBaseData.compositeReplies?.answers) {
        parameters["initialValue"] =
          materialBaseData.compositeReplies.answers.find(
            (answer) =>
              answer.fieldName ===
              (parameters.content && parameters.content.name)
          );

        // Handle .value field case
        if (
          parameters["initialValue"] &&
          typeof parameters["initialValue"].value !== "undefined"
        ) {
          parameters["initialValue"] = parameters["initialValue"].value;
        }
      }

      // Add props-based parameters
      Object.assign(parameters, {
        status: materialBaseData.status,
        readOnly: materialBaseData.readOnly,
        usedAs: materialBaseData.usedAs,
        displayCorrectAnswers: materialBaseData.displayCorrectAnswers,
        checkAnswers: materialBaseData.checkAnswers,
        onAnswerChange: materialBaseData.onAnswerChange,
        invisible: materialBaseData.invisible,
        userId: materialBaseData.status.userId,
      });
    }

    return {
      type: element.getAttribute("type") || "",
      content: parameters.content,
      parameters,
    };
  }
}
