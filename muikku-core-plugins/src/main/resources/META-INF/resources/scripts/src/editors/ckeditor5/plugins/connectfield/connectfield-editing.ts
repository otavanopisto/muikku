import { Plugin, uid, Widget } from "ckeditor5";
import { ConnectedField, ConnectFieldDataContent, Connection } from "../types";
import placeholderImage from "./gfx/muikku-placeholder-connectfield.gif";

/**
 * The editing part of the Connect Field feature.
 * This class handles the model definition, conversions between model and view,
 * and the business logic of the feature.
 */
export class ConnectFieldEditing extends Plugin {
  /**
   * Required plugins for the editing functionality.
   */
  static get requires() {
    return [Widget];
  }

  /**
   * Initializes the editing functionality:
   * - Defines the data model
   * - Sets up conversion between model and view
   */
  init() {
    this._defineSchema();
    this._defineConverters();
  }

  /**
   * Defines the connect field schema in the editor model.
   * The connect field is registered as an object that can be placed where blocks are allowed
   * and can have a name attribute.
   *
   * @private
   */
  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register("connectField", {
      isInline: true,
      isObject: true,
      allowWhere: "$text",
      allowChildren: ["param"],
      allowAttributes: ["name", "connections", "fields", "counterparts"],
    });
  }

  /**
   * Defines converters for the connect field feature.
   * Sets up three-way conversion between the model and both editing and data views.
   *
   * @private
   */
  _defineConverters() {
    const conversion = this.editor.conversion;

    // Upcast (loading) - convert from HTML to editor model
    conversion.for("upcast").elementToElement({
      view: {
        name: "object",
        attributes: {
          type: "application/vnd.muikku.field.connect",
        },
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      model: (viewElement, { writer: modelWriter }) => {
        let content: ConnectFieldDataContent;

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
        return modelWriter.createElement("connectField", {
          name: content.name || `muikku-field-${uid()}`,
          fields: content.fields || [],
          counterparts: content.counterparts || [],
          connections: content.connections || [],
        });
      },
    });

    // DataDowncast (saving) - convert from model to HTML storage format
    conversion.for("dataDowncast").elementToElement({
      model: "connectField",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer: viewWriter }) => {
        // Create the content object
        const content: ConnectFieldDataContent = {
          name:
            (modelElement.getAttribute("name") as string) ||
            `muikku-field-${uid()}`,
          fields:
            (modelElement.getAttribute("fields") as ConnectedField[]) || [],
          counterparts:
            (modelElement.getAttribute("counterparts") as ConnectedField[]) ||
            [],
          connections:
            (modelElement.getAttribute("connections") as Connection[]) || [],
        };

        const objectElement = viewWriter.createContainerElement("object", {
          type: "application/vnd.muikku.field.connect",
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

    // EditingDowncast (Model -> Editing View)
    conversion.for("editingDowncast").elementToElement({
      model: "connectField",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (
        modelElement,
        { writer: viewWriter } // Create the placeholder image element
      ) =>
        viewWriter.createEmptyElement("img", {
          src: placeholderImage,
          class: "muikku-connect-field",
          alt: "Connect Field",
          type: "application/vnd.muikku.field.connect",
        }),
    });
  }
}
