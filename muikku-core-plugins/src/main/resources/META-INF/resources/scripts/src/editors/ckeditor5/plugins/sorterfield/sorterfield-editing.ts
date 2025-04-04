import { Plugin, uid, Widget } from "ckeditor5";
import { SorterFieldDataContent, SorterFieldItem } from "../types";
import placeholderImage from "./gfx/muikku-placeholder-sorterfield.gif";

/**
 * SorterField editing plugin that handles the data model and conversions
 */
export default class SorterFieldEditing extends Plugin {
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
    if (!this.editor) {
      throw new Error("Editor instance is not available in SorterFieldEditing");
    }

    this._defineSchema();
    this._defineConverters();
  }

  /**
   * Defines the data model schema for the sorter field
   */
  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register("sorterField", {
      isInline: true,
      isObject: true,
      allowWhere: "$text",
      allowChildren: ["param"],
      allowAttributes: ["name", "items", "capitalize", "orientation"],
    });
  }

  /**
   * Defines converters for the sorter field
   */
  _defineConverters() {
    const conversion = this.editor.conversion;

    // Upcast (loading) - convert from HTML to editor model
    conversion.for("upcast").elementToElement({
      view: {
        name: "object",
        attributes: {
          type: "application/vnd.muikku.field.sorter",
        },
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      model: (viewElement, { writer: modelWriter }) => {
        let content: SorterFieldDataContent;

        // Because Ckeditor 5 probably doesn't know what to do with param tags,
        // they are included in the custom properties of the object element.
        // We need to extract the content from the object element manually.
        const rawContentArray = viewElement.getCustomProperties().next().value;

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
        return modelWriter.createElement("sorterField", {
          name: content.name || `muikku-field-${uid()}`,
          orientation: content.orientation || "vertical",
          capitalize: content.capitalize || false,
          items: content.items || [],
        });
      },
    });

    // DataDowncast (saving) - convert from model to HTML storage format
    conversion.for("dataDowncast").elementToElement({
      model: "sorterField",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer: viewWriter }) => {
        const objectElement = viewWriter.createContainerElement("object", {
          type: "application/vnd.muikku.field.sorter",
        });

        const typeParam = viewWriter.createContainerElement("param", {
          name: "type",
          value: "application/json",
        });

        const content: SorterFieldDataContent = {
          name: (modelElement.getAttribute("name") as string) || "",
          orientation:
            (modelElement.getAttribute("orientation") as
              | "vertical"
              | "horizontal") || "vertical",
          capitalize:
            (modelElement.getAttribute("capitalize") as boolean) || false,
          items:
            (modelElement.getAttribute("items") as SorterFieldItem[]) || [],
        };

        const contentParam = viewWriter.createContainerElement("param", {
          name: "content",
          value: JSON.stringify(content),
        });

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

    // EditingDowncast - convert to placeholder image in editor
    conversion.for("editingDowncast").elementToElement({
      model: "sorterField",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer: viewWriter }) =>
        viewWriter.createEmptyElement("img", {
          src: placeholderImage,
          class: "muikku-sorter-field",
          alt: "Sorter Field",
          type: "application/vnd.muikku.field.sorter",
        }),
    });
  }
}
