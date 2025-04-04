import { Plugin, uid, Widget } from "ckeditor5";
import { AudioFieldDataContent } from "../types";
import placeholderImage from "./gfx/muikku-placeholder-audio.gif";

/**
 * Audio field editing plugin
 */
export default class AudioFieldEditing extends Plugin {
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
      throw new Error("Editor instance is not available in AudioFieldEditing");
    }

    this._defineSchema();
    this._defineConverters();
  }

  /**
   * Defines the data model schema for the sorter field
   */
  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register("audioField", {
      isInline: true,
      isObject: true,
      allowWhere: "$text",
      allowAttributes: ["name"],
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
          type: "application/vnd.muikku.field.audio",
        },
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      model: (viewElement, { writer: modelWriter }) => {
        let content: AudioFieldDataContent;

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
        return modelWriter.createElement("audioField", {
          name: content.name || `muikku-field-${uid()}`,
        });
      },
    });

    // DataDowncast (saving) - convert from model to HTML storage format
    conversion.for("dataDowncast").elementToElement({
      model: "audioField",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer: viewWriter }) => {
        // Create the content object
        const content: AudioFieldDataContent = {
          name:
            (modelElement.getAttribute("name") as string) ||
            `muikku-field-${uid()}`,
        };

        // Create the object element
        const objectElement = viewWriter.createContainerElement("object", {
          type: "application/vnd.muikku.field.audio",
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

        const audioInput = viewWriter.createContainerElement("input", {
          name: content.name,
          type: "file",
          accept: "audio/*",
          capture: "microphone",
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
        viewWriter.insert(
          viewWriter.createPositionAt(objectElement, "end"),
          audioInput
        );

        return objectElement;
      },
    });

    // EditingDowncast remains the same (showing as img)
    conversion.for("editingDowncast").elementToElement({
      model: "audioField",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer: viewWriter }) =>
        // Create the placeholder image element
        viewWriter.createEmptyElement("img", {
          src: placeholderImage,
          class: "muikku-audio-field",
          alt: "Audio Field",
          type: "application/vnd.muikku.field.audio",
        }),
    });
  }
}
