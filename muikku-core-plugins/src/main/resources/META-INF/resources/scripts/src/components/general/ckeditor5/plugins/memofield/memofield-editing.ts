import { Plugin, uid, Widget } from "ckeditor5";
import { MemoFieldDataContent } from "../types";
import placeholderImage from "./gfx/muikku-placeholder-memofield.gif";

/**
 * Memo field editing plugin
 */
export default class MemoFieldEditing extends Plugin {
  /**
   * Requires the widget plugin
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
      throw new Error("Editor instance is not available in MemoFieldEditing");
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

    // Register the memoField element in the schema
    schema.register("memoField", {
      isInline: true, // Allows inline placement
      isObject: true, // Treated as a single unit
      allowChildren: ["param"],
      allowWhere: "$text", // Can be placed wherever text is allowed
      allowAttributes: [
        "name",
        "example",
        "richedit",
        "maxChars",
        "maxWords",
        "rows",
      ], // Allowed attributes
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
          type: "application/vnd.muikku.field.memo",
        },
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      model: (viewElement, { writer: modelWriter }) => {
        let content: MemoFieldDataContent;

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
        return modelWriter.createElement("memoField", {
          name: content.name || `muikku-field-${uid()}`,
          rows: content.rows || "",
          maxChars: content.maxChars || "",
          maxWords: content.maxWords || "",
          example: content.example || "",
          richedit: content.richedit || false,
        });
      },
    });

    // DataDowncast (saving) - convert from model to HTML storage format
    conversion.for("dataDowncast").elementToElement({
      model: "memoField",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer: viewWriter }) => {
        // Create the content object
        const content: MemoFieldDataContent = {
          name: (modelElement.getAttribute("name") as string) || "",
          rows: (modelElement.getAttribute("rows") as string) || "",
          maxChars: (modelElement.getAttribute("maxChars") as string) || "",
          maxWords: (modelElement.getAttribute("maxWords") as string) || "",
          example: (modelElement.getAttribute("example") as string) || "",
          richedit: (modelElement.getAttribute("richedit") as boolean) || false,
        };

        // Create the object element
        const objectElement = viewWriter.createContainerElement("object", {
          type: "application/vnd.muikku.field.memo",
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
      model: "memoField",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer: viewWriter }) =>
        // Create the placeholder image element
        viewWriter.createEmptyElement("img", {
          src: placeholderImage,
          class: "muikku-memo-field",
          alt: "Memo Field",
          type: "application/vnd.muikku.field.memo",
        }),
    });
  }
}
