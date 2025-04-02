import {
  View,
  ButtonView,
  LabeledFieldView,
  createLabeledInputText,
  submitHandler,
  icons,
  Locale,
  uid,
  ViewCollection,
} from "ckeditor5";
import {
  ConnectedField,
  ConnectFieldAddPairOptions,
  ConnectFieldFormData,
  Connection,
  ConnectFieldPairData,
} from "../types";

/**
 * The form view for the connect field dialog.
 */
export default class ConnectFieldFormView extends View {
  /**
   * Collection of pair views
   */
  private readonly _pairsViewCollection: ViewCollection;

  /**
   * The container view for pairs
   */
  public pairsView: View;

  /**
   * Button to add new pairs
   */
  public addButton: ButtonView;

  /**
   * Maps to store pair data
   */
  private readonly _pairs: Map<string, ConnectFieldPairData> = new Map();

  /**
   * Constructor
   * @param locale - The locale
   */
  constructor(locale: Locale) {
    super(locale);

    // Initialize collections
    this._pairsViewCollection = new ViewCollection();
    this.pairsView = this._createPairsContainer();
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
        // Pairs container
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-form__row"],
          },
          children: [this.pairsView],
        },
        // Add button
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-form__row"],
          },
          children: [this.addButton],
        },
      ],
    });
  }

  /**
   * Creates the pairs container
   */
  private _createPairsContainer(): View {
    const containerView = new View(this.locale);

    containerView.setTemplate({
      tag: "div",
      attributes: {
        class: ["ck-connectfield-pairs-container"],
      },
      // Bind children to the pairs collection
      children: this._pairsViewCollection,
    });

    return containerView;
  }

  /**
   * Creates an add button
   */
  private _createAddButton(): ButtonView {
    const button = new ButtonView(this.locale);
    button.set({
      label: "Add Pair",
      icon: icons.plus,
      tooltip: true,
      class: "ck-button-add-pair",
    });

    button.on("execute", () => {
      this.addNewPair();
    });

    return button;
  }

  /**
   * Adds a new pair to the form
   * @param options - The options for the pair
   */
  addPair(options: ConnectFieldAddPairOptions = {}): void {
    const pairView = new View(this.locale);
    const pairId = `pair-${uid()}`;
    const fieldId = options.fieldId || `field-${uid()}`;
    const counterpartId = options.counterpartId || `counterpart-${uid()}`;

    // Create inputs
    const fieldInput = new LabeledFieldView(
      this.locale,
      createLabeledInputText
    );
    fieldInput.label = "Field";
    fieldInput.fieldView.value = options.fieldText || "";

    const counterpartInput = new LabeledFieldView(
      this.locale,
      createLabeledInputText
    );
    counterpartInput.label = "Counterpart";
    counterpartInput.fieldView.value = options.counterpartText || "";

    // Create delete button
    const deleteButton = new ButtonView(this.locale);
    deleteButton.set({
      icon: icons.remove,
      tooltip: "Delete pair",
      class: "ck-button-delete-pair",
    });

    // Set up pair view template
    pairView.setTemplate({
      tag: "div",
      attributes: {
        class: ["ck-connectfield-pair-row"],
        style: "display: flex; margin-bottom: 10px;",
        "data-pair-id": pairId,
      },
      children: [fieldInput, counterpartInput, deleteButton],
    });

    // Handle deletion
    deleteButton.on("execute", () => {
      this._pairs.delete(pairId);
      this._pairsViewCollection.remove(pairView);
      pairView.destroy();
    });

    // Add to collections
    this._pairsViewCollection.add(pairView);

    // Store all related data together
    this._pairs.set(pairId, {
      id: pairId,
      view: pairView,
      fieldInput,
      counterpartInput,
      fieldId,
      counterpartId,
    });
  }

  /**
   * Adds a new empty pair
   */
  addNewPair(): void {
    this.addPair();
  }

  /**
   * Gets the form data
   */
  getData(): ConnectFieldFormData {
    const fields: ConnectedField[] = [];
    const counterparts: ConnectedField[] = [];
    const connections: Connection[] = [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, pairData] of this._pairs) {
      fields.push({
        name: pairData.fieldId,
        text: pairData.fieldInput.fieldView.element.value,
      });

      counterparts.push({
        name: pairData.counterpartId,
        text: pairData.counterpartInput.fieldView.element.value,
      });

      connections.push({
        field: pairData.fieldId,
        counterpart: pairData.counterpartId,
      });
    }

    return {
      connections,
      fields,
      counterparts,
    };
  }

  /**
   * Sets the form data
   * @param data - The form data
   */
  setData(data: ConnectFieldFormData): void {
    // Clear existing data
    this._pairs.forEach((pairData) => {
      pairData.view.destroy();
    });
    this._pairs.clear();
    this._pairsViewCollection.clear();

    // Create pairs from data
    data.connections.forEach((connection) => {
      const field = data.fields.find((f) => f.name === connection.field);
      const counterpart = data.counterparts.find(
        (c) => c.name === connection.counterpart
      );

      if (field && counterpart) {
        this.addPair({
          fieldId: field.name,
          counterpartId: counterpart.name,
          fieldText: field.text,
          counterpartText: counterpart.text,
        });
      }
    });
  }

  /**
   * @inheritDoc
   */
  destroy(): void {
    // Properly destroy all pair views and their components
    this._pairs.forEach((pairData) => {
      pairData.fieldInput.destroy();
      pairData.counterpartInput.destroy();
      pairData.view.destroy();
    });
    this._pairs.clear();
    this._pairsViewCollection.clear();
    super.destroy();
  }

  /**
   * Renders the form
   */
  render(): void {
    super.render();
    submitHandler({
      view: this,
    });
  }
}
