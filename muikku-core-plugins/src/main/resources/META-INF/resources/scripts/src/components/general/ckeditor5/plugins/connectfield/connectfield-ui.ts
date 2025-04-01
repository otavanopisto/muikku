/**
 * @module connectfield/connectfield-ui
 */

import { Plugin, ButtonView, Dialog, uid } from "ckeditor5";
import ConnectFieldFormView from "./connectfield-form-view";

/**
 * The UI part of the Connect Field feature.
 * This class handles the user interface elements like toolbar buttons
 * and dialogs related to the connect field feature.
 */
export class ConnectFieldUI extends Plugin {
  private _form: ConnectFieldFormView;
  private _dialog: Dialog;

  /**
   * Initializes the UI components:
   * - Adds the connect field button to the editor toolbar
   * - Sets up button click handling
   */
  init() {
    // Make sure editor is available
    if (!this.editor) {
      throw new Error("Editor instance is not available in ConnectFieldUI");
    }

    // Create dialog if not exists
    this._dialog = this.editor.plugins.get("Dialog");

    // Create the form view instance
    this._form = this._createFormView();

    // Add the toolbar button
    this._addToolbarButton();

    // Set up click handling for existing connect fields
    this._setupClickListener();
  }

  /**
   * Adds a toolbar button
   */
  private _addToolbarButton(): void {
    const editor = this.editor;

    editor.ui.componentFactory.add("muikku-connectfield", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "Connect Field",
        tooltip: true,
        withText: true,
      });

      // Execute command when the button is clicked
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
  private _createFormView(): ConnectFieldFormView {
    const editor = this.editor;
    const form = new ConnectFieldFormView(editor.locale);

    // Handle form submission
    form.listenTo(form, "submit", () => {
      const formData = form.getData();
      const connectField = this._getSelectedConnectField();

      editor.model.change((writer) => {
        if (connectField) {
          const name = connectField.getAttribute("name") as string;

          // Update existing text field
          writer.setAttribute("name", name, connectField);

          //writer.setAttribute("name", name, textField);
        } else {
          const name = `muikku-field-${uid()}`;

          // Create new text field
          const connectField = writer.createElement("connectField", {
            name,
          });
          editor.model.insertContent(connectField);
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
    const connectField = this._getSelectedConnectField();

    if (connectField) {
      // Editing existing field - populate form
      /* this._form.setData({
        width: (textField.getAttribute("width") as string) || "",
        autoGrow: (textField.getAttribute("autoGrow") as boolean) || false,
        hint: (textField.getAttribute("hint") as string) || "",
        answerChoices:
          (textField.getAttribute(
            "answerChoices"
          ) as TextFieldAnswerChoice[]) || [],
      }); */
    } else {
      // Creating new field - clear form
      /* this._form.setData({
        width: "",
        autoGrow: false,
        hint: "",
        answerChoices: [],
      }); */
    }

    // Show dialog with the form
    this._dialog.show({
      id: "muikku-connectfield-dialog",
      title: "Connect Field Properties",
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
    //this._form.reset();
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
        element.hasClass("muikku-connect-field")
      ) {
        this._showUI();
      }
    });
  }

  /**
   * Gets the currently selected text field element if any
   * @returns Selected text field element or null
   */
  private _getSelectedConnectField() {
    const selection = this.editor.model.document.selection;
    const selectedElement = selection.getSelectedElement();

    return selectedElement?.name === "connectField" ? selectedElement : null;
  }
}
