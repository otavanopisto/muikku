import { Plugin, uid, Widget } from "ckeditor5";
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
          type: "application/vnd.muikku.field.sorter",
        },
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      model: (viewElement, { writer: modelWriter }) =>
        modelWriter.createElement("sorterField", {
          name: `muikku-sorter-${uid()}`,
        }),
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

        const content = {
          name: modelElement.getAttribute("name"),
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
