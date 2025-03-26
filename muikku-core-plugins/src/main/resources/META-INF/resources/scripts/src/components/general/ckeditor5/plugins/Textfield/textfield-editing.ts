/* eslint-disable jsdoc/require-jsdoc */
import { Plugin } from "ckeditor5";
import { Widget } from "ckeditor5";
import placeholderImage from "./gfx/muikku-placeholder-textfield.gif";

/**
 * TextField editing plugin that handles the data model and conversions
 */
export default class TextFieldEditing extends Plugin {
  /**
   * Required plugins
   */
  static get requires() {
    return [Widget];
  }

  /**
   * Initializes the plugin
   */
  init() {
    // Make sure editor is available
    if (!this.editor) {
      throw new Error("Editor instance is not available in TextFieldEditing");
    }

    this._defineSchema();
    this._defineConverters();
  }

  /**
   * Defines the data model schema for the text field
   * Specifies how the text field can be used in the editor
   */
  _defineSchema() {
    const schema = this.editor.model.schema;

    // Register the textField element in the schema
    schema.register("textField", {
      isInline: true, // Allows inline placement
      isObject: true, // Treated as a single unit
      allowWhere: "$text", // Can be placed wherever text is allowed
      allowAttributes: ["width"], // Allowed attributes
    });
  }

  /**
   * Defines converters for the text field
   * Handles conversion between model and view (editing and data)
   */
  _defineConverters() {
    const conversion = this.editor.conversion;

    // Convert from model to editing view
    conversion.for("editingDowncast").elementToElement({
      model: "textField",
      view: (modelElement, { writer: viewWriter }) => {
        const width = modelElement.getAttribute("width") || "";

        // Create the placeholder image element
        return viewWriter.createEmptyElement("img", {
          src: placeholderImage,
          class: "muikku-text-field",
          alt: "Text Field",
          "data-width": width,
          "data-hint": modelElement.getAttribute("hint") || "",
          "data-answer-choices":
            modelElement.getAttribute("answerChoices") || "",
          "data-auto-grow": modelElement.getAttribute("autoGrow") || false,
        });
      },
    });

    // Convert from model to data (saving)
    conversion.for("dataDowncast").elementToElement({
      model: "textField",
      view: (modelElement, { writer: viewWriter }) =>
        // Create the object element for saving
        viewWriter.createEmptyElement("object", {
          type: "application/vnd.muikku.field.text",
          "data-width": modelElement.getAttribute("width") || "",
          "data-hint": modelElement.getAttribute("hint") || "",
          "data-answer-choices":
            modelElement.getAttribute("answerChoices") || "",
          "data-auto-grow": modelElement.getAttribute("autoGrow") || false,
        }),
    });

    // Convert from data to model (loading)
    conversion.for("upcast").elementToElement({
      view: {
        name: "object",
        attributes: {
          type: "application/vnd.muikku.field.text",
        },
      },
      model: (viewElement, { writer: modelWriter }) =>
        // Create the model element from saved data
        modelWriter.createElement("textField", {
          name: `text-field-${Date.now()}`,
          width: viewElement.getAttribute("data-width") || "",
          hint: viewElement.getAttribute("data-hint") || "",
          answerChoices: viewElement.getAttribute("data-answer-choices") || "",
          autoGrow: viewElement.getAttribute("data-auto-grow") || false,
        }),
    });
  }
}
