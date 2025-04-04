import { Plugin, uid, Widget, ViewElement, Writer } from "ckeditor5";
import placeholderCheckbox from "./gfx/muikku-placeholder-checkbox.gif";
import placeholderRadio from "./gfx/muikku-placeholder-radio.gif";
import placeholderDropdown from "./gfx/muikku-placeholder-dropdown.gif";
import placeholderList from "./gfx/muikku-placeholder-list.gif";
import {
  SelectionFieldDataContent,
  SelectionFieldOption,
  SelectionFieldType,
} from "../types";

/**
 * Selection field editing plugin
 */
export default class SelectionFieldEditing extends Plugin {
  /**
   * Requires the widget plugin
   */
  static get requires() {
    return [Widget];
  }

  /**
   * Initialize the plugin
   */
  init() {
    this._defineSchema();
    this._defineConverters();
  }

  /**
   * Define the data model schema for selection fields
   */
  private _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register("selectionField", {
      isInline: true,
      isObject: true,
      allowWhere: "$text",
      allowChildren: ["param"],
      allowAttributes: ["name", "listType", "explanation", "options"],
    });
  }

  /**
   * Parse the content from the view element
   * @param viewElement - The view element
   * @returns The content of the selection field
   */
  private _parseContentFromViewElement(
    viewElement: ViewElement
  ): SelectionFieldDataContent | null {
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
          return JSON.parse(contentParam.getAttribute("value"));
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("Failed to parse content", e);
        }
      }
    }
    return null;
  }

  /**
   * Define converters between model and view
   */
  private _defineConverters() {
    const conversion = this.editor.conversion;

    /**
     * Create a selection field model element with appropriate defaults
     * @param modelWriter - The model writer
     * @param content - The content of the selection field
     * @param defaultListType - The default list type
     * @returns The selection field model element
     */
    const createSelectionFieldModel = (
      modelWriter: Writer,
      content: SelectionFieldDataContent | null,
      defaultListType: SelectionFieldType
    ) =>
      modelWriter.createElement("selectionField", {
        name: content?.name || `muikku-field-${uid()}`,
        listType: content?.listType || defaultListType,
        explanation: content?.explanation || "",
        options: content?.options || [],
      });

    /**
     * Check if the list type is a multiselect
     * @param listType - The list type
     * @returns True if the list type is a multiselect, false otherwise
     */
    const isMultiselect = (listType: SelectionFieldType) =>
      listType === "checkbox-horizontal" || listType === "checkbox-vertical";

    // Upcast (loading) - convert from HTML to editor model
    conversion.for("upcast").elementToElement({
      view: {
        name: "object",
        attributes: {
          type: "application/vnd.muikku.field.select",
        },
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      model: (viewElement, { writer: modelWriter }) => {
        const content = this._parseContentFromViewElement(viewElement);
        return createSelectionFieldModel(modelWriter, content, "dropdown");
      },
    });

    // Upcast (loading) - convert from HTML to editor model
    conversion.for("upcast").elementToElement({
      view: {
        name: "object",
        attributes: {
          type: "application/vnd.muikku.field.multiselect",
        },
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      model: (viewElement, { writer: modelWriter }) => {
        const content = this._parseContentFromViewElement(viewElement);
        return createSelectionFieldModel(
          modelWriter,
          content,
          "checkbox-vertical"
        );
      },
    });

    // DataDowncast (Model -> HTML)
    conversion.for("dataDowncast").elementToElement({
      model: "selectionField",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer: viewWriter }) => {
        const content: SelectionFieldDataContent = {
          name: (modelElement.getAttribute("name") as string) || "",
          listType:
            (modelElement.getAttribute("listType") as SelectionFieldType) ||
            "dropdown",
          options:
            (modelElement.getAttribute("options") as SelectionFieldOption[]) ||
            [],
          explanation:
            (modelElement.getAttribute("explanation") as string) || "",
        };

        // Create the object element
        const objectElement = viewWriter.createContainerElement("object", {
          type: isMultiselect(content.listType)
            ? "application/vnd.muikku.field.multiselect"
            : "application/vnd.muikku.field.select",
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
      model: "selectionField",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer: viewWriter }) => {
        // Get the list type from the model element
        const listType: SelectionFieldType =
          (modelElement.getAttribute("listType") as SelectionFieldType) ||
          "dropdown";

        // Determine which placeholder image to use
        let placeholderSrc;
        switch (listType) {
          case "dropdown":
            placeholderSrc = placeholderDropdown;
            break;
          case "list":
            placeholderSrc = placeholderList;
            break;
          case "radio-horizontal":
          case "radio-vertical":
            placeholderSrc = placeholderRadio;
            break;
          case "checkbox-horizontal":
          case "checkbox-vertical":
            placeholderSrc = placeholderCheckbox;
            break;
          default:
            placeholderSrc = placeholderDropdown;
        }

        return viewWriter.createEmptyElement("img", {
          src: placeholderSrc,
          class: "muikku-selection-field",
          alt: "Selection Field",
          type: isMultiselect(listType)
            ? "application/vnd.muikku.field.multiselect"
            : "application/vnd.muikku.field.select",
        });
      },
    });
  }
}
