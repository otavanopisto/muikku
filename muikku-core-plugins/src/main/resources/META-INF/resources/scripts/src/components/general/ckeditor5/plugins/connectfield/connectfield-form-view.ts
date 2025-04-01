import {
  View,
  ButtonView,
  LabeledFieldView,
  createLabeledInputText,
  submitHandler,
  icons,
  Locale,
  InputTextView,
} from "ckeditor5";

/**
 * The form view for the connect field dialog.
 */
export default class ConnectFieldFormView extends View {
  private pairs: Array<PairRowView>;

  private addButton: ButtonView;

  /**
   * Constructor
   * @param locale - The locale
   */
  constructor(locale: Locale) {
    super(locale);

    // Initialize properties
    this.pairs = [];
    this.addButton = this._createAddButton();

    this.setTemplate({
      tag: "form",
      attributes: {
        class: ["ck", "ck-connectfield-form"],
        tabindex: "-1",
        style: "padding: 10px;",
      },
      children: [
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-connectfield-form-header"],
          },
          children: [
            {
              text: "Connect Field Properties",
            },
          ],
        },
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-connectfield-pairs-container"],
          },
          children: this.pairs,
        },
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-form__row", "ck-autogrow-row"],
          },
          children: [this.addButton],
        },
      ],
    });
  }

  /**
   * Creates an add button
   */
  private _createAddButton() {
    const button = new ButtonView(this.locale);
    button.set({
      label: "Add Pair",
      icon: icons.plus,
      tooltip: true,
      class: "ck-button-add-pair",
    });

    button.on("execute", () => {
      this.addPair();
    });

    return button;
  }

  /**
   * Creates a new pair row and adds it to the form
   */
  addPair() {
    const pairRow = new PairRowView(this.locale);
    this.pairs.push(pairRow);

    this.listenTo(pairRow, "remove", () => {
      this.removePair(pairRow);
    });

    // If the view is already rendered, we need to manually render the new row
    if (this.element) {
      const container = this.element.querySelector(
        ".ck-connectfield-pairs-container"
      );
      pairRow.render();
      container.appendChild(pairRow.element);
    }

    return pairRow;
  }

  /**
   * Removes a pair row from the form
   * @param pairRow - The pair row to remove
   */
  removePair(pairRow: PairRowView) {
    const index = this.pairs.indexOf(pairRow);
    if (index > -1) {
      this.pairs.splice(index, 1);
      pairRow.element?.remove();
      pairRow.destroy();
    }
  }

  /**
   * Gets the data from the form
   */
  getData() {
    return {
      pairs: [] as any[],
    };
  }

  /**
   * Sets the data to the form
   * @param data - The data to set
   */
  setData(data: any) {
    this.pairs = data.pairs.map((pair: any) => new PairRowView(this.locale));
  }

  /**
   * Renders the form
   */
  render() {
    super.render();
    submitHandler({
      view: this,
    });
  }
}

/**
 * A single pair row view containing two input fields and a delete button
 */
class PairRowView extends View {
  private leftInput: LabeledFieldView<InputTextView>;
  private rightInput: LabeledFieldView<InputTextView>;
  private deleteButton: ButtonView;

  /**
   * Constructor
   * @param locale - The locale
   */
  constructor(locale: Locale) {
    super(locale);

    this.leftInput = this._createInput("Left");
    this.rightInput = this._createInput("Right");
    this.deleteButton = this._createDeleteButton();

    this.setTemplate({
      tag: "div",
      attributes: {
        class: ["ck", "ck-connectfield-pair-row"],
        style: "display: flex; margin-bottom: 10px;",
      },
      children: [this.leftInput, this.rightInput, this.deleteButton],
    });
  }

  /**
   * Creates a delete button
   */
  private _createDeleteButton() {
    const button = new ButtonView(this.locale);
    button.set({
      icon: icons.remove,
      tooltip: "Delete pair",
      class: "ck-button-delete-pair",
    });

    button.on("execute", () => {
      // Find the parent form view and remove this row
      this.fire("remove");
    });

    return button;
  }

  /**
   * Creates an input
   * @param label - The label of the input
   */
  private _createInput(label: string): LabeledFieldView<InputTextView> {
    const labeledInput = new LabeledFieldView(
      this.locale,
      createLabeledInputText
    );
    labeledInput.label = label;
    return labeledInput;
  }
}
