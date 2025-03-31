/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsdoc/require-jsdoc */
import { Plugin, uid, Widget } from "ckeditor5";
import {
  TextFieldAnswerChoice,
  TextFieldDataContent,
  TextFieldRightAnswer,
} from "../types";
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
      allowChildren: ["param"],
      allowWhere: "$text", // Can be placed wherever text is allowed
      allowAttributes: ["width", "hint", "autoGrow", "name", "answerChoices"], // Allowed attributes
    });
  }

  /**
   * Defines converters for the text field
   * Handles conversion between model and view (editing and data)
   */
  _defineConverters() {
    const conversion = this.editor.conversion;

    // Upcast (loading) - convert from HTML to editor model
    conversion.for("upcast").elementToElement({
      view: {
        name: "object",
        attributes: {
          type: "application/vnd.muikku.field.text",
        },
      },
      model: (viewElement, { writer: modelWriter }) => {
        let content: TextFieldDataContent;

        // Because Ckeditor 5 probably doesn't know what to do with param tags,
        // they are included in the custom properties of the object element.
        // We need to extract the content from the object element manually.
        const rawContentArray = viewElement.getCustomProperties().next().value;

        // If there is a content param, parse it
        if (rawContentArray && rawContentArray[1]) {
          // Create a temporary div to parse the HTML
          // and insert custom properties into it because it is html tags (at least in this case)
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = rawContentArray[1];

          // Find the content param element
          const contentParam = tempDiv.querySelector('param[name="content"]');

          // If the content param exists, parse it
          if (contentParam && contentParam.getAttribute("value")) {
            try {
              content = JSON.parse(contentParam.getAttribute("value"));
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error("Failed to parse content", e);
            }
          }
        }

        // Always return a valid model element with defaults
        return modelWriter.createElement("textField", {
          name: content.name || `muikku-field-${uid()}`,
          width: content.columns || "",
          hint: content.hint || "",
          answerChoices: Array.isArray(content.rightAnswers)
            ? content.rightAnswers.map((answer) => ({
                text: answer.text || "",
                isCorrect: !!answer.correct,
              }))
            : [],
          autoGrow: content.autogrow || false,
        });
      },
    });

    // DataDowncast (saving) - convert from model to HTML storage format
    conversion.for("dataDowncast").elementToElement({
      model: "textField",
      view: (modelElement, { writer: viewWriter }) => {
        // Get answer choices and convert them to the right format
        const rightAnswers = (
          (modelElement.getAttribute(
            "answerChoices"
          ) as TextFieldAnswerChoice[]) || []
        ).map<TextFieldRightAnswer>((answer) => ({
          caseSensitive: false,
          normalizeWhitespace: true,
          correct: answer.isCorrect,
          text: answer.text,
        }));

        // Create the content object
        const content: TextFieldDataContent = {
          name:
            (modelElement.getAttribute("name") as string) ||
            `muikku-field-${uid()}`,
          columns: (modelElement.getAttribute("width") as string) || "",
          hint: (modelElement.getAttribute("hint") as string) || "",
          rightAnswers,
          autogrow: (modelElement.getAttribute("autoGrow") as boolean) || false,
        };

        // Create the object element
        const objectElement = viewWriter.createContainerElement("object", {
          type: "application/vnd.muikku.field.text",
        });

        // Add type param
        const typeParam = viewWriter.createContainerElement("param", {
          name: "type",
          value: "application/json",
        });

        // Add content param
        const contentParam = viewWriter.createContainerElement("param", {
          name: "content",
          value: JSON.stringify(content),
        });

        // Add params to object
        viewWriter.insert(
          viewWriter.createPositionAt(objectElement, 0),
          typeParam
        );
        viewWriter.insert(
          viewWriter.createPositionAt(objectElement, "end"),
          contentParam
        );

        return objectElement;
      },
    });

    // EditingDowncast remains the same (showing as img)
    conversion.for("editingDowncast").elementToElement({
      model: "textField",
      view: (modelElement, { writer: viewWriter }) =>
        // Create the placeholder image element
        viewWriter.createEmptyElement("img", {
          src: placeholderImage,
          class: "muikku-text-field",
          alt: "Text Field",
          type: "application/vnd.muikku.field.text",
        }),
    });
  }
}
