import { Plugin, Widget } from "ckeditor5";

/**
 * DivBlock editing plugin
 */
export default class DivBlockEditing extends Plugin {
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
      throw new Error("Editor instance is not available in DivBlockEditing");
    }

    this._defineSchema();
    this._defineConverters();
  }

  /**
   * Defines the data model schema for the divBlock
   */
  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register("divBlock", {
      allowWhere: "$block",
      allowContentOf: "$root",
      allowAttributes: ["styleSet", "class", "title", "id", "lang", "dir"],
      isBlock: true,
    });
  }

  /**
   * Defines converters for the divBlock
   */
  _defineConverters() {
    const conversion = this.editor.conversion;

    conversion.for("upcast").elementToElement({
      view: "div",
      // eslint-disable-next-line jsdoc/require-jsdoc
      model: (viewElement, { writer }) =>
        writer.createElement("divBlock", {
          styleSet: viewElement.getAttribute("class"),
          class: viewElement.getAttribute("class"),
          title: viewElement.getAttribute("title"),
          id: viewElement.getAttribute("id"),
          lang: viewElement.getAttribute("lang"),
          dir: viewElement.getAttribute("dir"),
        }),
    });

    conversion.for("dataDowncast").elementToElement({
      model: "divBlock",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer }) =>
        writer.createContainerElement("div", {
          class: modelElement.getAttribute("styleSet"),
          title: modelElement.getAttribute("title"),
          id: modelElement.getAttribute("id"),
          lang: modelElement.getAttribute("lang"),
          dir: modelElement.getAttribute("dir"),
        }),
    });

    conversion.for("editingDowncast").elementToElement({
      model: "divBlock",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer }) =>
        writer.createContainerElement("div", {
          class: modelElement.getAttribute("styleSet"),
          title: modelElement.getAttribute("title"),
          id: modelElement.getAttribute("id"),
          lang: modelElement.getAttribute("lang"),
          dir: modelElement.getAttribute("dir"),
        }),
    });
  }
}
