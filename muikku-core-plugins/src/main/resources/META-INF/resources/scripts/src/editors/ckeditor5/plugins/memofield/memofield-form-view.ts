import {
  View,
  Locale,
  LabeledFieldView,
  InputTextView,
  SwitchButtonView,
  createLabeledInputText,
  submitHandler,
  TextareaView,
  createLabeledTextarea,
} from "ckeditor5";
import { MemoFieldFormData } from "../types";

/**
 * Memo field form view
 */
export default class MemoFieldFormView extends View {
  private rowsInput: LabeledFieldView<InputTextView>;
  private maxCharsInput: LabeledFieldView<InputTextView>;
  private maxWordsInput: LabeledFieldView<InputTextView>;
  private exampleInput: LabeledFieldView<TextareaView>;
  private richEditCheckbox: SwitchButtonView;

  /**
   * Creates an instance of MemoFieldFormView.
   * @param locale - The locale instance.
   */
  constructor(locale: Locale) {
    super(locale);

    // Create the input fields
    this.rowsInput = this._createInput("Rows");
    this.maxCharsInput = this._createInput("Max Chars");
    this.maxWordsInput = this._createInput("Max Words");
    this.exampleInput = this._createTextarea("Example");
    this.richEditCheckbox = this._createCheckbox("Rich Edit");

    // Define the form template structure
    this.setTemplate({
      tag: "form",
      attributes: {
        class: ["ck", "ck-memo-field-form"],
        tabindex: "-1",
      },
      children: [
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-form__body"],
            style: "padding: 10px;",
          },
          children: [
            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__row"],
              },
              children: [this.rowsInput],
            },
            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__row"],
              },
              children: [this.maxCharsInput],
            },
            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__row"],
              },
              children: [this.maxWordsInput],
            },
            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__row"],
              },
              children: [this.exampleInput],
            },
            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__row"],
              },
              children: [this.richEditCheckbox],
            },
          ],
        },
      ],
    });
  }

  /**
   * Creates a labeled input text field
   * @param label - The label text for the input field
   * @returns LabeledFieldView instance
   */
  private _createInput(label: string) {
    const labeledInput = new LabeledFieldView(
      this.locale,
      createLabeledInputText
    );

    labeledInput.label = label;

    return labeledInput;
  }

  /**
   * Creates a labeled textarea field
   * @param label - The label text for the textarea field
   * @returns LabeledFieldView instance
   */
  private _createTextarea(label: string) {
    const labeledTextarea = new LabeledFieldView(
      this.locale,
      createLabeledTextarea
    );

    labeledTextarea.label = label;

    return labeledTextarea;
  }

  /**
   * Creates a checkbox with a label
   * @param label - The label text for the checkbox
   * @returns LabeledFieldView instance
   */
  private _createCheckbox(label: string) {
    const checkbox = new SwitchButtonView(this.locale);

    checkbox.set({
      label,
      tooltip: true,
      isToggleable: true,
      withText: true,
    });

    // Handle the execute event to toggle the switch state
    checkbox.on("execute", (evt) => {
      checkbox.set({
        isOn: !checkbox.isOn,
      });
    });

    return checkbox;
  }

  /**
   * Gets the current form data
   * @returns MemoFieldFormData object containing form values
   */
  getData(): MemoFieldFormData {
    return {
      rows: this.rowsInput.fieldView.element.value,
      maxChars: this.maxCharsInput.fieldView.element.value,
      maxWords: this.maxWordsInput.fieldView.element.value,
      example: this.exampleInput.fieldView.element.value,
      richEdit: this.richEditCheckbox.isOn,
    };
  }

  /**
   * Sets the form field values
   * @param data - MemoFieldFormData object containing values to set
   */
  setData(data: MemoFieldFormData): void {
    this.rowsInput.fieldView.value = data.rows;
    this.maxCharsInput.fieldView.value = data.maxChars;
    this.maxWordsInput.fieldView.value = data.maxWords;
    this.exampleInput.fieldView.value = data.example;
    this.richEditCheckbox.isOn = data.richEdit;
  }

  /**
   * Resets the form
   */
  reset(): void {
    this.setData({
      rows: "",
      maxChars: "",
      maxWords: "",
      example: "",
      richEdit: false,
    });
  }

  /**
   * Focuses the width input field
   */
  focus(): void {
    this.rowsInput.focus();
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
