/* eslint-disable no-console */
import { Plugin, uid } from "ckeditor5";
import { Widget } from "ckeditor5";
import { OrganizerCategoryTerm, OrganizerFieldDataContent } from "../types";
import { OrganizerCategory, OrganizerTerm } from "../types";
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
      allowChildren: ["param"],
      allowWhere: "$text",
      allowAttributes: [
        "name",
        "termTitle",
        "categories",
        "terms",
        "categoryTerms",
      ],
    });
  }

  /**
   * Defines the converters for the organizer field
   */
  _defineConverters() {
    const conversion = this.editor.conversion;

    // Upcast (loading) - convert from HTML to editor model
    conversion.for("upcast").elementToElement({
      view: {
        name: "object",
        attributes: {
          type: "application/vnd.muikku.field.organizer",
        },
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      model: (viewElement, { writer: modelWriter }) => {
        let content: OrganizerFieldDataContent;

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
        return modelWriter.createElement("organizerField", {
          name: content.name || `muikku-field-${uid()}`,
          termTitle: content.termTitle || "",
          categories: content.categories || [],
          terms: content.terms || [],
          categoryTerms: content.categoryTerms || [],
        });
      },
    });

    // DataDowncast (Model -> HTML)
    conversion.for("dataDowncast").elementToElement({
      model: "organizerField",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer: viewWriter }) => {
        const content: OrganizerFieldDataContent = {
          name:
            (modelElement.getAttribute("name") as string) ||
            `muikku-field-${uid()}`,
          termTitle: (modelElement.getAttribute("termTitle") as string) || "",
          categories:
            (modelElement.getAttribute("categories") as OrganizerCategory[]) ||
            [],
          terms: (modelElement.getAttribute("terms") as OrganizerTerm[]) || [],
          categoryTerms:
            (modelElement.getAttribute(
              "categoryTerms"
            ) as OrganizerCategoryTerm[]) || [],
        };

        // Create the object element
        const objectElement = viewWriter.createContainerElement("object", {
          type: "application/vnd.muikku.field.organizer",
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
