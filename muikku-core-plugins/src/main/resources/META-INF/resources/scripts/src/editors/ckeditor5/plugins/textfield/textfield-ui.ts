import { Plugin, Dialog, uid, ButtonView } from "ckeditor5";
import TextFieldFormView from "./textfield-form-view";
import { TextFieldAnswerChoice } from "../types";

/**
 * Textfield UI plugin
 */
export default class TextFieldUI extends Plugin {
  private _form: TextFieldFormView;
  private _dialog: Dialog;

  /**
   * Initialize the plugin
   */
  init() {
    // Make sure editor is available
    if (!this.editor) {
      throw new Error("Editor instance is not available in TextFieldUI");
    }

    // Create dialog if not exists
    this._dialog = this.editor.plugins.get("Dialog");

    // Create the form view instance
    this._form = this._createFormView();

    // Add the toolbar button
    this._addToolbarButton();

    // Set up click handling for existing text fields
    this._setupClickListener();
  }

  /**
   * Creates and configures the toolbar button
   */
  private _addToolbarButton(): void {
    this.editor.ui.componentFactory.add("muikku-textfield", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "Text Field",
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
  private _createFormView(): TextFieldFormView {
    const editor = this.editor;
    const form = new TextFieldFormView(editor.locale);

    // Handle form submission
    form.listenTo(form, "submit", () => {
      const formData = form.getData();
      const textField = this._getSelectedTextField();

      editor.model.change((writer) => {
        if (textField) {
          const name = textField.getAttribute("name") as string;

          // Update existing text field
          writer.setAttribute("name", name, textField);
          writer.setAttribute("width", formData.width, textField);
          writer.setAttribute("autoGrow", formData.autoGrow, textField);
          writer.setAttribute("hint", formData.hint, textField);
          writer.setAttribute(
            "answerChoices",
            formData.answerChoices,
            textField
          );
          //writer.setAttribute("name", name, textField);
        } else {
          const name = `muikku-field-${uid()}`;

          // Create new text field
          const textField = writer.createElement("textField", {
            name,
            width: formData.width || "",
            autoGrow: formData.autoGrow || false,
            hint: formData.hint || "",
            answerChoices: formData.answerChoices || [],
          });
          editor.model.insertContent(textField);
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
        width: (textField.getAttribute("width") as string) || "",
        autoGrow: (textField.getAttribute("autoGrow") as boolean) || false,
        hint: (textField.getAttribute("hint") as string) || "",
        answerChoices:
          (textField.getAttribute(
            "answerChoices"
          ) as TextFieldAnswerChoice[]) || [],
      });
    } else {
      // Creating new field - clear form
      this._form.setData({
        width: "",
        autoGrow: false,
        hint: "",
        answerChoices: [],
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

      // Check if clicked element is a text field
      if (
        element.is("element", "img") &&
        element.hasClass("muikku-text-field")
      ) {
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

    return selectedElement?.name === "textField" ? selectedElement : null;
  }
}
