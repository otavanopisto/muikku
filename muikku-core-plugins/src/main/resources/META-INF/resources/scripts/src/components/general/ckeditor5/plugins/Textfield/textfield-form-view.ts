import {
  View,
  LabeledFieldView,
  InputTextView,
  createLabeledInputText,
  SwitchButtonView,
  submitHandler,
  Locale,
  ButtonView,
  icons,
} from "ckeditor5";
import { TextFieldAnswerRow, TextFieldFormData } from "../types";

/**
 * Form view class for the TextField plugin.
 * Handles the UI form that appears when creating or editing a text field.
 */
export default class TextFieldFormView extends View {
  // Form elements
  public widthInput: LabeledFieldView<InputTextView>;
  public hintInput: LabeledFieldView<InputTextView>;
  public autoGrowCheckbox: ButtonView;
  public answersContainer: HTMLDivElement;
  public addAnswerButton: ButtonView;
  private answerRows: TextFieldAnswerRow[] = [];

  /**
   * Creates an instance of TextFieldFormView.
   * @param locale - The locale instance for internationalization
   */
  constructor(locale: Locale) {
    super(locale);

    // Create the width input field with label
    this.widthInput = this._createInput("Width");
    this.hintInput = this._createInput("Hint");
    this.autoGrowCheckbox = this._createCheckbox("Enable auto-growth");

    this.answersContainer = this._createAnswersContainer();
    this.addAnswerButton = this._createAddAnswerButton();

    // Define the form template structure
    this.setTemplate({
      tag: "form",
      attributes: {
        class: ["ck", "ck-text-field-form"],
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
            this.widthInput,
            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__row", "ck-autogrow-row"],
              },
              children: [this.autoGrowCheckbox],
            },
            this.hintInput,
            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__column", "ck-answers-section"],
              },
              children: [
                {
                  tag: "div",
                  attributes: {
                    class: ["ck", "ck-answers-header"],
                    style: "display: flex; align-items: center;",
                  },
                  children: [
                    {
                      tag: "label",
                      attributes: {
                        class: ["ck", "ck-label"],
                      },
                      children: ["Answers"],
                    },
                    this.addAnswerButton,
                  ],
                },
                this.answersContainer,
              ],
            },
          ],
        },
      ],
    });
  }

  /**
   * Creates an input field with a label
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
   * Creates a container for the answers
   * @returns HTMLDivElement instance
   */
  private _createAnswersContainer(): HTMLDivElement {
    const container = document.createElement("div");
    container.className = "ck-answers-container";
    return container;
  }

  /**
   * Creates a button for adding a new answer
   * @returns ButtonView instance
   */
  private _createAddAnswerButton(): ButtonView {
    const button = new ButtonView(this.locale);

    button.set({
      label: "Add Answer",
      withText: false,
      icon: icons.plus,
    });

    button.on("execute", () => {
      this._addNewAnswer();
    });

    return button;
  }

  /**
   * Adds a new answer to the answers container
   * @param text - The text of the answer
   * @param isCorrect - Whether the answer is correct
   */
  private _addNewAnswer(text: string = "", isCorrect: boolean = false) {
    const answerRow = document.createElement("div");
    answerRow.className = "ck-answer-row";

    // Create an input field
    const input = new InputTextView(this.locale);
    input.value = text;

    // Create a switch button
    const correctSwitch = new SwitchButtonView(this.locale);
    correctSwitch.set({
      label: "Correct",
      withText: true,
      isOn: isCorrect,
    });

    // Handle the execute event to toggle the switch state
    correctSwitch.on("execute", () => {
      correctSwitch.set({ isOn: !correctSwitch.isOn });
    });

    // Create a delete button
    const deleteButton = new ButtonView(this.locale);
    deleteButton.set({
      label: "Delete",
      withText: false,
      icon: icons.eraser,
    });

    // Handle the execute event to delete the answer
    deleteButton.on("execute", () => {
      answerRow.remove();
      // Remove this row from our tracking array
      const index = this.answerRows.findIndex(
        (row) => row.element === answerRow
      );
      if (index !== -1) {
        this.answerRows.splice(index, 1);
      }
    });

    // Render components
    input.render();
    correctSwitch.render();
    deleteButton.render();

    answerRow.appendChild(input.element);
    answerRow.appendChild(correctSwitch.element);
    answerRow.appendChild(deleteButton.element);

    this.answersContainer.appendChild(answerRow);

    this.answerRows.push({
      input,
      correctSwitch,
      deleteButton,
      element: answerRow,
    });
  }

  /**
   * Focuses the width input field
   */
  focus(): void {
    this.widthInput.focus();
  }

  /**
   * Resets the form
   */
  reset(): void {
    this.setData({
      width: "",
      hint: "",
      autoGrow: false,
      answerChoices: [],
    });
  }

  /**
   * Gets the current form data
   * @returns TextFieldFormData object containing form values
   */
  getData(): TextFieldFormData {
    return {
      width: this.widthInput.fieldView.element.value,
      autoGrow: this.autoGrowCheckbox.isOn,
      hint: this.hintInput.fieldView.element.value,
      answerChoices: this.answerRows.map((row) => ({
        text: row.input.element.value,
        isCorrect: row.correctSwitch.isOn,
      })),
    };
  }

  /**
   * Sets the form field values
   * @param data - TextFieldFormData object containing values to set
   */
  setData(data: TextFieldFormData): void {
    // Clear existing answers
    this.widthInput.fieldView.value = data.width || "";
    this.autoGrowCheckbox.isOn = data.autoGrow || false;
    this.hintInput.fieldView.value = data.hint || "";

    // Clear existing answers rows
    this.answerRows.forEach((row) => {
      row.element.remove(); // Remove DOM element
      row.input.destroy(); // Destroy CKEditor components
      row.correctSwitch.destroy();
      row.deleteButton.destroy();
    });
    this.answerRows = [];
    this.answersContainer.innerHTML = "";

    (data.answerChoices || []).forEach((answer) => {
      this._addNewAnswer(answer.text, answer.isCorrect);
    });
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
