import { Plugin } from "ckeditor5";
import { Widget } from "ckeditor5";
import placeholderImage from "./gfx/muikku-placeholder-organizerfield.gif";

/**
 * @module muikku-organizerfield
 */
export default class OrganizerFieldEditing extends Plugin {
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
    this._defineSchema();
    this._defineConverters();
  }

  /**
   * Defines the schema for the organizer field
   */
  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register("organizerField", {
      isObject: true,
      isInline: true,
      allowWhere: "$text",
      allowAttributes: ["name"],
    });
  }

  /**
   * Defines the converters for the organizer field
   */
  _defineConverters() {
    const conversion = this.editor.conversion;

    // Upcast (HTML -> Model)
    conversion.for("upcast").elementToElement({
      // eslint-disable-next-line jsdoc/require-jsdoc
      model: (viewElement, { writer: modelWriter }) =>
        modelWriter.createElement("organizerField", {
          name: viewElement.getAttribute("data-name"),
        }),
      view: {
        name: "div",
        classes: "muikku-organizer-field",
      },
    });

    // DataDowncast (Model -> HTML)
    conversion.for("dataDowncast").elementToElement({
      model: "organizerField",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer: viewWriter }) =>
        viewWriter.createContainerElement("div", {
          class: "muikku-organizer-field",
          "data-name": modelElement.getAttribute("name"),
        }),
    });

    // EditingDowncast (Model -> Editing View)
    conversion.for("editingDowncast").elementToElement({
      model: "organizerField",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer: viewWriter }) =>
        viewWriter.createEmptyElement("img", {
          src: placeholderImage,
          class: "muikku-organizer-field",
          alt: "Organizer Field",
          type: "application/vnd.muikku.field.organizer",
        }),
    });
  }
}
