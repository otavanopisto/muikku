import { Plugin, Dialog, ButtonView, uid } from "ckeditor5";
import MemoFieldFormView from "./memofield-form-view";

/**
 * Memo field UI plugin
 */
export default class MemoFieldUI extends Plugin {
  private _form: MemoFieldFormView;
  private _dialog: Dialog;

  /**
   * Initializes the plugin
   */
  init() {
    // Make sure editor is available
    if (!this.editor) {
      throw new Error("Editor instance is not available in MemoFieldUI");
    }

    // Create dialog if not exists
    this._dialog = this.editor.plugins.get("Dialog");

    // Create the form view instance
    this._form = this._createFormView();

    // Add the toolbar button
    this._addToolbarButton();

    // Set up click listener for existing memo fields
    this._setupClickListener();
  }

  /**
   * Creates and configures the toolbar button
   */
  private _addToolbarButton(): void {
    this.editor.ui.componentFactory.add("muikku-memofield", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "Memo Field",
        tooltip: true,
        withText: true,
      });

      // Show form when button is clicked
      button.on("execute", () => {
        // Show the form UI
        this._showUI();
      });

      return button;
    });
  }

  /**
   * Creates and configures the form view. Here is event handlers defined.
   * @returns Configured TextFieldFormView instance
   */
  private _createFormView(): MemoFieldFormView {
    const editor = this.editor;
    const form = new MemoFieldFormView(editor.locale);

    // Handle form submission
    form.listenTo(form, "submit", () => {
      const formData = form.getData();
      const memoField = this._getSelectedTextField();

      editor.model.change((writer) => {
        if (memoField) {
          const name = memoField.getAttribute("name") as string;

          // Update existing text field
          writer.setAttribute("name", name, memoField);
          writer.setAttribute("rows", formData.rows, memoField);
          writer.setAttribute("maxChars", formData.maxChars, memoField);
          writer.setAttribute("maxWords", formData.maxWords, memoField);
          writer.setAttribute("example", formData.example, memoField);
          writer.setAttribute("richedit", formData.richEdit, memoField);
        } else {
          const name = `muikku-field-${uid()}`;

          // Create new text field
          const memoField = writer.createElement("memoField", {
            name,
            rows: formData.rows,
            maxChars: formData.maxChars,
            maxWords: formData.maxWords,
            example: formData.example,
            richEdit: formData.richEdit,
          });
          editor.model.insertContent(memoField);
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
    const textField = this._getSelectedTextField();

    if (textField) {
      // Editing existing field - populate form
      this._form.setData({
        rows: (textField.getAttribute("rows") as string) || "",
        maxChars: (textField.getAttribute("maxChars") as string) || "",
        maxWords: (textField.getAttribute("maxWords") as string) || "",
        example: (textField.getAttribute("example") as string) || "",
        richEdit: (textField.getAttribute("richedit") as boolean) || false,
      });
    } else {
      // Creating new field - clear form
      this._form.setData({
        rows: "",
        maxChars: "",
        maxWords: "",
        example: "",
        richEdit: false,
      });
    }

    // Show dialog with the form
    this._dialog.show({
      id: "muikku-textfield-dialog",
      title: "Text Field Properties",
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
   * Hides the form UI and resets it
   */
  private _hideUI() {
    this._dialog.hide();
    this._form.reset();
  }

  /**
   * Sets up click listener for existing text fields
   */
  private _setupClickListener() {
    this.editor.editing.view.document.on("click", (evt, data) => {
      const element = data.target;

      // Check if clicked element is a memo field
      if (
        element.is("element", "img") &&
        element.hasClass("muikku-memo-field")
      ) {
        // Show the form UI
        this._showUI();
      }
    });
  }

  /**
   * Gets the currently selected text field element if any
   * @returns Selected text field element or null
   */
  private _getSelectedTextField() {
    const selection = this.editor.model.document.selection;
    const selectedElement = selection.getSelectedElement();

    return selectedElement?.name === "memoField" ? selectedElement : null;
  }
}
