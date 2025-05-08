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

    schema.extend("$block", {
      allowAttributes: ["htmlDivAttributes"],
    });
  }

  /**
   * Defines converters for the mStyles
   */
  _defineConverters() {
    const conversion = this.editor.conversion;

    conversion.for("editingDowncast").elementToElement({
      model: "htmlDivParagraph",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer }) => {
        const htmlAttrs =
          (modelElement.getAttribute("htmlDivAttributes") as Record<
            string,
            unknown
          >) || {};

        const viewAttrs = {
          ...htmlAttrs,
          class: (htmlAttrs?.classes as string[])?.join(" ") || "",
        } as Record<string, unknown>;

        delete viewAttrs.classes;
        return writer.createContainerElement("div", viewAttrs);
      },
    });

    conversion.for("dataDowncast").elementToElement({
      model: "htmlDivParagraph",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer }) => {
        const htmlAttrs =
          (modelElement.getAttribute("htmlDivAttributes") as Record<
            string,
            unknown
          >) || {};

        const viewAttrs = {
          ...htmlAttrs,
          class: (htmlAttrs.classes as string[])?.join(" ") || "",
        } as Record<string, unknown>;
        delete viewAttrs.classes;
        return writer.createContainerElement("div", viewAttrs);
      },
    });

    conversion.for("upcast").elementToElement({
      view: "div",
      // eslint-disable-next-line jsdoc/require-jsdoc
      model: (viewElement, { writer }) => {
        const attrs = {} as Record<string, unknown>;
        if (viewElement.hasAttribute("class")) {
          attrs.classes = viewElement.getAttribute("class").split(" ");
        }

        for (const [key, value] of Object.entries(
          viewElement.getAttributes()
        )) {
          if (key !== "class") {
            attrs[key] = value;
          }
        }
        return writer.createElement("htmlDivParagraph", {
          htmlDivAttributes: attrs,
        });
      },
    });
  }
}
