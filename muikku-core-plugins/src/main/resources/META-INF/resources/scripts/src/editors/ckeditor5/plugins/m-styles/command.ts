import { Command } from "ckeditor5";
import { MuikkuStyleDefinition } from "../types";
import { stylesSet } from "./styles";

const modelMap: Record<string, string> = {
  div: "htmlDivParagraph",
};

const ATTRIBUTES_TO_MATCH = ["class"];

/**
 * Checks if the classes match
 * @param elementClasses - The element classes
 * @param styleClass - The style class
 * @returns True if the classes match, false otherwise
 */
function classesMatch(elementClasses?: string[], styleClass?: string) {
  if (!elementClasses && !styleClass) return true;
  if (!elementClasses || !styleClass) return false;
  // Convert both to arrays
  const elementArr = Array.isArray(elementClasses)
    ? elementClasses
    : [elementClasses];
  const styleArr = styleClass.split(" ");
  // Check if all style classes are present in element classes
  return styleArr.every((cls) => elementArr.includes(cls));
}

/**
 * Command for applying a style to the currently selected element
 */
export default class MStylesCommand extends Command {
  /**
   * Refreshes the command
   */
  refresh() {
    const selection = this.editor.model.document.selection;
    const selectedElement =
      selection.getSelectedElement() || selection.getFirstPosition().parent;

    // Find the style that matches the current element and its attributes
    let currentStyle = null;

    // If element exists and is an actual element
    if (selectedElement && selectedElement.is("element")) {
      const elementAttr = selectedElement.getAttribute(
        "htmlDivAttributes"
      ) as Record<string, unknown>;

      // Check if the element matches any of the styles
      for (const style of stylesSet) {
        if (selectedElement.name === modelMap[style.element]) {
          let match = false;

          // Check only against specific attributes
          for (const key of ATTRIBUTES_TO_MATCH) {
            if (key === "class") {
              // In case of class, we need to check if the classes match because Ckeditor 5
              // returns an array of classes and check if classes matches
              match = classesMatch(
                (elementAttr?.classes as string[]) || undefined,
                style.attributes[key] as string
              );
            }
          }

          // If match is found, set the current style and end the loop
          if (match) {
            currentStyle = style;
            break;
          }
        }
      }
    }
    this.value = currentStyle; // or style name, or style id
    this.isEnabled = true; // or add logic to enable/disable
  }

  /**
   * Executes the command
   * @param styleDefinition - The style definition to apply
   */
  execute(styleDefinition: MuikkuStyleDefinition) {
    const model = this.editor.model;
    const selection = model.document.selection;

    model.change((writer) => {
      const selectedElement =
        selection.getSelectedElement() ||
        model.document.selection.getFirstPosition().parent;

      if (selectedElement && selectedElement.is("element")) {
        const targetModelName = modelMap[styleDefinition.element];

        if (!targetModelName) {
          return;
        }

        // Change the element type
        writer.rename(selectedElement, targetModelName);

        // Handle attributes properly
        if (styleDefinition.attributes) {
          // Initialize htmlDivAttributes if it doesn't exist
          const existingAttrs = (selectedElement.getAttribute(
            "htmlDivAttributes"
          ) || {}) as Record<string, unknown>;

          // Create new attributes object with default structure
          const newAttrs: Record<string, unknown> = {
            ...existingAttrs,
            classes: [], // Initialize classes array
          };

          for (const [key, value] of Object.entries(
            styleDefinition.attributes
          )) {
            if (key === "class") {
              // Special handling for class attribute
              newAttrs.classes = (value as string).split(" ");
            } else {
              // Handle all other attributes
              newAttrs[key] = value;
            }
          }
          // Set the htmlDivAttributes
          writer.setAttribute("htmlDivAttributes", newAttrs, selectedElement);
        }
      }
    });
  }
}
