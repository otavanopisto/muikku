import { Plugin } from "ckeditor5";
import { Widget, toWidget } from "ckeditor5";

/**
 * @module muikku-organizerfield
 */
export default class OrganizerFieldEditing extends Plugin {
  /**
   * @inheritDoc
   */
  static get requires() {
    return [Widget];
  }

  /**
   * @inheritDoc
   */
  init() {
    this._defineSchema();
    this._defineConverters();
  }

  /**
   * @private
   */
  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register("organizerField", {
      isObject: true,
      allowWhere: "$block",
      allowAttributes: ["name", "termTitle"],
    });

    schema.register("organizerFieldCategory", {
      isLimit: true,
      allowIn: "organizerField",
      allowAttributes: ["id", "name"],
    });

    schema.register("organizerFieldTerm", {
      isLimit: true,
      allowIn: "organizerFieldCategory",
      allowAttributes: ["id", "name"],
    });
  }

  /**
   * @private
   */
  _defineConverters() {
    const conversion = this.editor.conversion;

    // HTML -> Model (upcast) conversion
    conversion.for("upcast").elementToElement({
      // eslint-disable-next-line jsdoc/require-jsdoc
      model: (viewElement, { writer: modelWriter }) =>
        // Create the organizerField element with attributes from HTML
        modelWriter.createElement("organizerField", {
          name: viewElement.getAttribute("data-name"),
          termTitle: viewElement.getAttribute("data-term-title"),
          categories: viewElement.getAttribute("data-categories"),
          terms: viewElement.getAttribute("data-terms"),
        }),
      view: {
        name: "div",
        classes: "muikku-organizer-field",
      },
    });

    // Model -> Data (dataDowncast) conversion
    conversion.for("dataDowncast").elementToElement({
      model: "organizerField",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer: viewWriter }) =>
        // Convert model to HTML for saving
        viewWriter.createContainerElement("div", {
          class: "muikku-organizer-field",
          "data-name": modelElement.getAttribute("name"),
          "data-term-title": modelElement.getAttribute("termTitle"),
          "data-categories": modelElement.getAttribute("categories"),
          "data-terms": modelElement.getAttribute("terms"),
        }),
    });

    // Model -> Editing view (editingDowncast) conversion
    conversion.for("editingDowncast").elementToElement({
      model: "organizerField",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer: viewWriter }) => {
        // Create editable widget in the editor
        const div = viewWriter.createContainerElement("div", {
          class: "muikku-organizer-field",
          "data-name": modelElement.getAttribute("name"),
        });

        // Create a preview of the organizer field
        const container = viewWriter.createContainerElement("div", {
          class: "organizer-field-content",
        });

        // Add title if exists
        const termTitle = modelElement.getAttribute("termTitle");
        if (termTitle) {
          const titleElement = viewWriter.createContainerElement("div", {
            class: "organizer-field-title",
          });
          viewWriter.insert(
            viewWriter.createPositionAt(titleElement, 0),
            viewWriter.createText(termTitle as string)
          );
          viewWriter.insert(
            viewWriter.createPositionAt(container, 0),
            titleElement
          );
        }

        viewWriter.insert(viewWriter.createPositionAt(div, 0), container);

        // Convert to widget for better editing experience
        return toWidget(div, viewWriter);
      },
    });

    // Rest of the converters...
  }
}
