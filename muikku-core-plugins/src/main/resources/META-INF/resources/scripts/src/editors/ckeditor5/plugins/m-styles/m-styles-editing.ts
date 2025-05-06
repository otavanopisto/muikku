import { Plugin, Widget } from "ckeditor5";
import MStylesCommand from "./command";

/**
 * MStyles editing plugin
 */
export default class MStylesEditing extends Plugin {
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
      throw new Error("Editor instance is not available in MStylesEditing");
    }

    this.editor.commands.add("mStylesApply", new MStylesCommand(this.editor));

    this._defineSchema();
    this._defineConverters();
  }

  /**
   * Defines the data model schema for the mStyles
   */
  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register("mStyles", {
      allowWhere: "$block",
      allowContentOf: "$block",
      allowAttributes: ["class", "data-show", "data-name"],
    });
  }

  /**
   * Defines converters for the mStyles
   */
  _defineConverters() {
    const conversion = this.editor.conversion;

    conversion.for("editingDowncast").elementToElement({
      model: "div",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer }) =>
        writer.createContainerElement("div", modelElement.getAttributes()),
    });
    conversion.for("dataDowncast").elementToElement({
      model: "div",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer }) =>
        writer.createContainerElement("div", modelElement.getAttributes()),
    });
    conversion.for("upcast").elementToElement({
      view: "div",
      // eslint-disable-next-line jsdoc/require-jsdoc
      model: (viewElement, { writer }) =>
        writer.createElement("div", viewElement.getAttributes()),
    });
  }
}
