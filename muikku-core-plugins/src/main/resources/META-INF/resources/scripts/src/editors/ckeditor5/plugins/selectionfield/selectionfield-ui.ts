import { Plugin, ButtonView, uid, Dialog } from "ckeditor5";
import { SelectionFieldOption, SelectionFieldType } from "../types";
import SelectionFieldFormView from "./selectionfield-form-view";
import placeholderCheckbox from "./gfx/muikku-placeholder-checkbox.gif";
import placeholderRadio from "./gfx/muikku-placeholder-radio.gif";
import placeholderDropdown from "./gfx/muikku-placeholder-dropdown.gif";
import placeholderList from "./gfx/muikku-placeholder-list.gif";

/**
 * Selection field UI plugin
 */
export default class SelectionFieldUI extends Plugin {
  private _form: SelectionFieldFormView;
  private _dialog: Dialog;

  /**
   * Initialize the plugin
   */
  init() {
    if (!this.editor) {
      throw new Error("Editor instance is not available in SelectionFieldUI");
    }

    // Create dialog if not exists
    this._dialog = this.editor.plugins.get("Dialog");

    // Create the form view instance
    this._form = this._createFormView();

    // Add the toolbar button
    this._addToolbarButton();

    // Set up click listener for existing organizer fields
    this._setupClickListener();
  }

  /**
   * Adds a toolbar button
   */
  private _addToolbarButton(): void {
    const editor = this.editor;

    editor.ui.componentFactory.add("muikku-selectionfield", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "Selection Field",
        tooltip: true,
        withText: true,
      });

      // Show form when button is clicked
      button.on("execute", () => {
        this._showUI();
      });

      return button;
    });
  }

  /**
   * Creates a form view
   * @returns The form view
   */
  private _createFormView(): SelectionFieldFormView {
    const editor = this.editor;
    const form = new SelectionFieldFormView(editor.locale);

    form.listenTo(form, "submit", () => {
      const formData = form.getData();
      const selectionField = this._getSelectedSelectionField();

      editor.model.change((writer) => {
        if (selectionField) {
          const name = selectionField.getAttribute("name") as string;

          writer.setAttribute("name", name, selectionField);
          writer.setAttribute("listType", formData.listType, selectionField);
          writer.setAttribute("options", formData.options, selectionField);
          writer.setAttribute(
            "explanation",
            formData.explanation,
            selectionField
          );

          // Get the view element
          const viewElement =
            editor.editing.mapper.toViewElement(selectionField);

          // Check if the view element is an img element
          if (viewElement && viewElement.is("element", "img")) {
            // Update the src attribute of the img element
            let placeholderSrc: string;
            switch (formData.listType) {
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

            // Update the view directly
            editor.editing.view.change((viewWriter) => {
              viewWriter.setAttribute("src", placeholderSrc, viewElement);
            });
          }
        } else {
          const name = `muikku-field-${uid()}`;

          // Create new text field
          const selectionField = writer.createElement("selectionField", {
            name,
            listType: formData.listType,
            options: formData.options,
            explanation: formData.explanation,
          });
          editor.model.insertContent(selectionField);
        }
      });

      this._hideUI();
    });

    form.on("cancel", () => {
      this._hideUI();
    });
    return form;
  }

  /**
   * Shows the form UI
   */
  private _showUI(): void {
    const selectionField = this._getSelectedSelectionField();

    if (selectionField) {
      // Editing existing field - populate form
      this._form.setData({
        listType:
          (selectionField.getAttribute("listType") as SelectionFieldType) ||
          "dropdown",
        options:
          (selectionField.getAttribute("options") as SelectionFieldOption[]) ||
          [],
        explanation:
          (selectionField.getAttribute("explanation") as string) || "",
      });
    } else {
      // Creating new field - clear form
      this._form.setData({
        listType: "dropdown",
        options: [],
        explanation: "",
      });
    }

    this._dialog.show({
      id: "selection-field-dialog",
      title: "Selection Field Properties",
      content: this._form,
      actionButtons: [
        {
          label: "Cancel",
          withText: true,
          // eslint-disable-next-line jsdoc/require-jsdoc
          onExecute: () => {
            this._form.fire("cancel");
          },
        },
        {
          label: "Save",
          withText: true,
          // eslint-disable-next-line jsdoc/require-jsdoc
          onExecute: () => {
            this._form.fire("submit");
          },
        },
      ],
    });
  }

  /**
   * Hides the form UI
   */
  private _hideUI(): void {
    this._dialog.hide();
  }

  /**
   * Sets up click listener for existing text fields
   */
  private _setupClickListener() {
    this.editor.editing.view.document.on("click", (evt, data) => {
      const element = data.target;

      // Check if clicked element is a text field
      if (
        element.is("element", "img") &&
        element.hasClass("muikku-selection-field")
      ) {
        this._showUI();
      }
    });
  }

  /**
   * Gets the currently selected organizer field element if any
   * @returns Selected organizer field element or null
   */
  private _getSelectedSelectionField() {
    const selection = this.editor.model.document.selection;
    const selectedElement = selection.getSelectedElement();

    return selectedElement?.name === "selectionField" ? selectedElement : null;
  }
}
