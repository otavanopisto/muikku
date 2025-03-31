/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin, ButtonView, uid, Dialog } from "ckeditor5";
import { OrganizerCategory, OrganizerTerm } from "../types";
import OrganizerFieldFormView from "./organizerfield-form-view";

/**
 * Organizer field UI plugin
 * @module muikku-organizerfield
 */
export default class OrganizerFieldUI extends Plugin {
  private _form: OrganizerFieldFormView;
  private _dialog: Dialog;

  /**
   * Initializes the plugin
   */
  init() {
    // Make sure editor is available
    if (!this.editor) {
      throw new Error("Editor instance is not available in OrganizerFieldUI");
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

    editor.ui.componentFactory.add("muikku-organizerfield", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "Organizer Field",
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
  private _createFormView(): OrganizerFieldFormView {
    const editor = this.editor;
    const form = new OrganizerFieldFormView(editor.locale);

    form.listenTo(form, "submit", () => {
      const formData = form.getData();
      const organizerField = this._getSelectedOrganizerField();

      editor.model.change((writer) => {
        if (organizerField) {
          const name = organizerField.getAttribute("name") as string;

          writer.setAttribute("name", name, organizerField);
          writer.setAttribute("title", formData.title, organizerField);
        } else {
          const name = `muikku-field-${uid()}`;

          // Create new text field
          const organizerField = writer.createElement("organizerField", {
            name,
          });
          editor.model.insertContent(organizerField);
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
    const organizerField = this._getSelectedOrganizerField();

    if (organizerField) {
      // Editing existing field - populate form
      this._form.setData({
        termTitle: (organizerField.getAttribute("title") as string) || "",
        categories:
          (organizerField.getAttribute("categories") as OrganizerCategory[]) ||
          [],
        terms: (organizerField.getAttribute("terms") as OrganizerTerm[]) || [],
      });
    } else {
      // Creating new field - clear form
      this._form.setData({
        termTitle: "",
        categories: [],
        terms: [],
      });
    }

    this._dialog.show({
      id: "organizer-field-dialog",
      title: "Organizer Field Properties",
      content: this._form,
      actionButtons: [
        {
          label: "Cancel",
          withText: true,
          // eslint-disable-next-line jsdoc/require-jsdoc
          onExecute: () => {
            // Fires the cancel event on the form
            this._form.fire("cancel");
          },
        },
        {
          label: "Save",
          withText: true,
          // eslint-disable-next-line jsdoc/require-jsdoc
          onExecute: () => {
            // Fires the submit event on the form
            this._form.fire("submit");
          },
        },
      ],
    });

    this._form.focus();
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
        element.hasClass("muikku-organizer-field")
      ) {
        this._showUI();
      }
    });
  }

  /**
   * Gets the currently selected organizer field element if any
   * @returns Selected organizer field element or null
   */
  private _getSelectedOrganizerField() {
    const selection = this.editor.model.document.selection;
    const selectedElement = selection.getSelectedElement();

    return selectedElement?.name === "organizerField" ? selectedElement : null;
  }
}
