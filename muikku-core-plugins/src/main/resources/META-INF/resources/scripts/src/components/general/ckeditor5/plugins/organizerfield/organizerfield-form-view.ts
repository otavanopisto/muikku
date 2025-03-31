/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  View,
  LabeledFieldView,
  createLabeledInputText,
  submitHandler,
  InputTextView,
} from "ckeditor5";
import { Locale } from "ckeditor5";
import { OrganizerFormData } from "../types";

/**
 * Organizer field form view
 * @module muikku-organizerfield
 */
export default class OrganizerFieldFormView extends View {
  public titleInput: LabeledFieldView<InputTextView>;

  /**
   * Constructor
   * @param locale - The locale
   */
  constructor(locale: Locale) {
    super(locale);

    // Create a simple input field
    this.titleInput = this._createInput("Title");

    // Set up the form template
    this.setTemplate({
      tag: "form",
      attributes: {
        class: ["ck", "ck-organizer-field-form"],
        tabindex: "-1",
      },
      children: [
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-form__row"],
          },
          children: [this.titleInput],
        },
      ],
    });
  }

  /**
   * Creates a labeled input field
   * @param label - The label
   * @returns The labeled input field
   */
  private _createInput(label: string): LabeledFieldView<InputTextView> {
    const labeledInput = new LabeledFieldView(
      this.locale,
      createLabeledInputText
    );
    labeledInput.label = label;
    return labeledInput;
  }

  /**
   * Focuses the title input
   */
  focus(): void {
    this.titleInput.focus();
  }

  /**
   * Resets the form
   */
  reset(): void {
    this.setData({
      termTitle: "",
      categories: [],
      terms: [],
    });
  }

  /**
   * Gets the form data
   * @returns The form data
   */
  getData() {
    return {
      title: this.titleInput.fieldView.element.value,
    };
  }

  /**
   * Sets the form field values
   * @param data - TextFieldFormData object containing values to set
   */
  setData(data: OrganizerFormData): void {
    // Clear existing answers
    this.titleInput.fieldView.value = data.termTitle || "";
  }

  /**
   * Renders the form
   */
  render(): void {
    super.render();

    // Submit the form when the user clicked the save button
    // or pressed enter in the input.
    submitHandler({
      view: this,
    });
  }
}
