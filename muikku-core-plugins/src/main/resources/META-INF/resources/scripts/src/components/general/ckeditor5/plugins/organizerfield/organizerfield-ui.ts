/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin, Editor } from "ckeditor5";
import { ButtonView } from "ckeditor5";
import { Element } from "ckeditor5";
import { FormData, OrganizerFieldAttributes } from ".";
import OrganizerFieldFormView from "./organizerfield-form-view";
//import organizerFieldIcon from "./icons/organizerfield.svg";

/**
 * @module muikku-organizerfield
 */
export default class OrganizerFieldUI extends Plugin {
  // Properties for the UI plugin
  private _form: OrganizerFieldFormView;
  readonly editor: Editor;

  /**
   * Get the plugin name
   * @inheritDoc
   */
  static get pluginName(): string {
    return "OrganizerFieldUI";
  }

  /**
   * Constructor
   * @param editor - The editor instance
   */
  constructor(editor: Editor) {
    super(editor);
    this.editor = editor;
  }

  /**
   * @inheritDoc
   */
  init(): void {
    // Create the form view
    this._form = this._createFormView();

    // Add the toolbar button
    this._createToolbarButton();
  }

  /**
   * Create and configure the toolbar button
   * @private
   */
  private _createToolbarButton(): void {
    const editor = this.editor;
    const t = editor.t; // Translation helper

    editor.ui.componentFactory.add("muikku-organizerfield", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: t("Organizer Field"),
        icon: undefined,
        tooltip: true,
        withText: true,
      });

      // Show form when button is clicked
      this.listenTo(button, "execute", () => {
        this._showUI();
      });

      return button;
    });
  }

  /**
   * Show the editing interface
   * @private
   */
  private _showUI(): void {
    const organizerField = this._getSelectedOrganizerField();

    if (organizerField) {
      this._populateFormWithData(organizerField);
    } else {
      this._clearForm();
    }

    // Focus the form
    this._form.focus();
  }

  /**
   * Populate the form with data from the selected organizer field element
   * @param element - The selected organizer field element
   * @private
   */
  private _populateFormWithData(element: Element): void {
    const formData: Partial<FormData> = {
      termTitle: (element.getAttribute("termTitle") as string) || "",
      categories: JSON.parse(
        (element.getAttribute("categories") as string) || "[]"
      ),
    };
    this._form.setData(formData);
  }

  /**
   * Clear the form
   * @private
   */
  private _clearForm(): void {
    const emptyData: Partial<FormData> = {
      termTitle: "",
      categories: [],
    };
    this._form.setData(emptyData);
  }

  /**
   * Hide the editing interface
   * @private
   */
  private _hideUI(): void {
    this.editor.editing.view.focus();
  }

  /**
   * Create the form view instance
   * @private
   */
  private _createFormView(): OrganizerFieldFormView {
    const form = new OrganizerFieldFormView(this.editor.locale);

    // Handle form submit
    this._handleFormSubmit(form);

    // Handle form cancel
    this._handleFormCancel(form);

    return form;
  }

  /**
   * Handle form submit
   * @param form - The form view instance
   * @private
   */
  private _handleFormSubmit(form: OrganizerFieldFormView): void {
    this.listenTo(form, "submit", () => {
      const formData = form.getData();
      const organizerField = this._getSelectedOrganizerField();

      this.editor.model.change((writer) => {
        if (organizerField) {
          this._updateExistingField(writer, organizerField, formData);
        } else {
          this._createNewField(writer, formData);
        }
      });

      this._hideUI();
    });
  }

  /**
   * Handle form cancel
   * @param form - The form view instance
   * @private
   */
  private _handleFormCancel(form: OrganizerFieldFormView): void {
    this.listenTo(form, "cancel", () => {
      this._hideUI();
    });
  }

  /**
   * Update an existing organizer field
   * @param writer - The writer instance
   * @param element - The organizer field element
   * @param formData - The form data
   * @private
   */
  private _updateExistingField(
    writer: any,
    element: Element,
    formData: FormData
  ): void {
    const attributes: OrganizerFieldAttributes = {
      name: element.getAttribute("name") as string,
      termTitle: formData.termTitle,
      categories: JSON.stringify(formData.categories),
      terms: JSON.stringify(formData.terms || []),
    };

    for (const [key, value] of Object.entries(attributes)) {
      writer.setAttribute(key, value, element);
    }
  }

  /**
   * Create a new organizer field
   * @param writer - The writer instance
   * @param formData - The form data
   * @private
   */
  private _createNewField(writer: any, formData: FormData): void {
    const attributes: OrganizerFieldAttributes = {
      name: this._generateUniqueName(),
      termTitle: formData.termTitle,
      categories: JSON.stringify(formData.categories),
      terms: JSON.stringify(formData.terms || []),
    };

    const element = writer.createElement("organizerField", attributes);
    this.editor.model.insertContent(element);
  }

  /**
   * Get the currently selected organizer field element
   * @private
   */
  private _getSelectedOrganizerField(): Element | null {
    const selection = this.editor.model.document.selection;
    const selectedElement = selection.getSelectedElement();

    return selectedElement?.name === "organizerField" ? selectedElement : null;
  }

  /**
   * Generate a unique name for new organizer fields
   * @private
   */
  private _generateUniqueName(): string {
    return `organizer-field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
