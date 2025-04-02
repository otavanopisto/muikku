import { Plugin, ButtonView, Dialog, uid } from "ckeditor5";
import { SorterFieldItem } from "../types";
import SorterFieldFormView from "./sorterfield-form-view";

/**
 * SorterField UI plugin
 */
export default class SorterFieldUI extends Plugin {
  private _form: SorterFieldFormView;
  private _dialog: Dialog;

  /**
   * Initialize the plugin
   */
  init() {
    if (!this.editor) {
      throw new Error("Editor instance is not available in SorterFieldUI");
    }

    this._dialog = this.editor.plugins.get("Dialog");
    this._form = this._createFormView();

    this._addToolbarButton();
    this._setupClickListener();
  }

  /**
   * Creates and configures the toolbar button
   */
  private _addToolbarButton(): void {
    this.editor.ui.componentFactory.add("muikku-sorterfield", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "Sorter Field",
        tooltip: true,
        withText: true,
      });

      button.on("execute", () => {
        this._showUI();
      });

      return button;
    });
  }

  /**
   * Creates a new form view
   * @returns The form view
   */
  private _createFormView(): SorterFieldFormView {
    const editor = this.editor;
    const form = new SorterFieldFormView(editor.locale);

    // Handle form submission
    form.listenTo(form, "submit", () => {
      const formData = form.getData();
      const sorterField = this._getSelectedSorterField();

      editor.model.change((writer) => {
        if (sorterField) {
          const name = sorterField.getAttribute("name") as string;

          // Update existing text field
          writer.setAttribute("name", name, sorterField);
          writer.setAttribute("capitalize", formData.capitalize, sorterField);
          writer.setAttribute("orientation", formData.orientation, sorterField);
          writer.setAttribute("items", formData.items, sorterField);
        } else {
          const name = `muikku-field-${uid()}`;

          // Create new text field
          const sorterField = writer.createElement("sorterField", {
            name,
            capitalize: formData.capitalize,
            orientation: formData.orientation,
            items: formData.items,
          });
          editor.model.insertContent(sorterField);
        }
      });

      this._hideUI();
    });

    // Handle form cancellation
    form.on("cancel", () => {
      this._hideUI();
    });

    return form;
  }

  /**
   * Shows the UI
   */
  private _showUI() {
    const sorterField = this._getSelectedSorterField();

    if (sorterField) {
      // Editing existing field - populate form
      this._form.setData({
        orientation:
          (sorterField.getAttribute("orientation") as
            | "vertical"
            | "horizontal") || "vertical",
        capitalize:
          (sorterField.getAttribute("capitalize") as boolean) || false,
        items: (sorterField.getAttribute("items") as SorterFieldItem[]) || [],
      });
    } else {
      // Creating new field - clear form
      this._form.setData({
        orientation: "vertical",
        capitalize: false,
        items: [],
      });
    }

    this._dialog.show({
      id: "muikku-sorterfield-dialog",
      title: "Järjestelykentän ominaisuudet",
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

    this._form.focus();
  }

  /**
   * Hides the UI
   */
  private _hideUI() {
    this._dialog.hide();
    //this._form.reset();
  }

  /**
   * Sets up click listener for existing sorter fields
   */
  private _setupClickListener() {
    this.editor.editing.view.document.on("click", (evt, data) => {
      const element = data.target;

      if (
        element.is("element", "img") &&
        element.hasClass("muikku-sorter-field")
      ) {
        this._showUI();
      }
    });
  }

  /**
   * Gets the currently selected sorter field element if any
   * @returns Selected sorter field element or null
   */
  private _getSelectedSorterField() {
    const selection = this.editor.model.document.selection;
    const selectedElement = selection.getSelectedElement();

    return selectedElement?.name === "sorterField" ? selectedElement : null;
  }
}
