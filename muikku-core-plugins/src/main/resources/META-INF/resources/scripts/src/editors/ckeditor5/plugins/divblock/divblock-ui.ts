import { Plugin, Dialog, ButtonView } from "ckeditor5";
import DivBlockFormView from "./divblock-form-view";

/**
 * Textfield UI plugin
 */
export default class DivBlockUI extends Plugin {
  private _dialog: Dialog;
  private _form: DivBlockFormView;

  /**
   * Initialize the plugin
   */
  init() {
    // Make sure editor is available
    if (!this.editor) {
      throw new Error("Editor instance is not available in DivBlockUI");
    }

    // Create dialog if not exists
    this._dialog = this.editor.plugins.get("Dialog");

    // Create the form view instance
    this._form = this._createFormView();

    // Add the toolbar button
    this._addToolbarButton();

    // Set up click handling for existing text fields
    //this._setupClickListener();
  }

  /**
   * Creates and configures the toolbar button
   */
  private _addToolbarButton(): void {
    this.editor.ui.componentFactory.add("muikku-divblock", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "Div Block",
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
   * Creates and configures the form view. Here is event handlers defined.
   * @returns Configured TextFieldFormView instance
   */
  private _createFormView(): DivBlockFormView {
    const editor = this.editor;
    const form = new DivBlockFormView(editor.locale);

    // Handle form submission
    form.listenTo(form, "submit", () => {
      const formData = form.getData();
      const selection = editor.model.document.selection;
      const selectedElement =
        selection.getSelectedElement() || selection.getFirstPosition().parent;

      editor.model.change((writer) => {
        if (selectedElement && selectedElement.is("element")) {
          // Create new text field
          const divBlock = writer.createElement("divBlock", {
            styleSet: formData.styleSet || "",
            title: formData.title || "",
            id: formData.id || "",
            lang: formData.lang || "",
            dir: formData.dir || "",
          });
          // Create range on the selected element
          const range = writer.createRangeOn(selectedElement);

          // Wrap the selected element with our new divBlock
          writer.wrap(range, divBlock);
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
   * Shows the form UI and populates it with data if editing existing field
   */
  private _showUI() {
    // Creating new field - clear form
    this._form.setData({
      styleSet: "",
      title: "",
      id: "",
      lang: "",
      dir: "",
    });

    // Show dialog with the form
    this._dialog.show({
      id: "muikku-divblock-dialog",
      title: "Div Block Properties",
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

    //this._form.focus();
  }

  /**
   * Hides the form UI and resets it
   */
  private _hideUI() {
    this._dialog.hide();
    this._form.reset();
  }

  /**
   * Sets up click listener for existing text fields
   */
  // private _setupClickListener() {
  //   this.editor.editing.view.document.on("click", (evt, data) => {
  //     const element = data.target;

  //     // Check if clicked element is a text field
  //     if (
  //       element.is("element", "img") &&
  //       element.hasClass("muikku-text-field")
  //     ) {
  //       this._showUI();
  //     }
  //   });
  // }
}
