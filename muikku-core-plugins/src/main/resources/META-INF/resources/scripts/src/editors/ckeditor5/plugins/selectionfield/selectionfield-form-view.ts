import {
  View,
  Locale,
  DropdownButtonView,
  DropdownView,
  DropdownPanelView,
  ButtonView,
  submitHandler,
  ViewCollection,
  LabeledFieldView,
  createLabeledInputText,
  icons,
  uid,
  SwitchButtonView,
  createLabeledTextarea,
  TextareaView,
} from "ckeditor5";
import {
  SelectionFieldAddOptionsParams,
  SelectionFieldFormData,
  SelectionFieldOption,
  SelectionFieldOptionData,
  SelectionFieldType,
} from "../types";

// The options for the list type select
const options: {
  label: string;
  value: SelectionFieldType;
}[] = [
  { label: "Dropdown", value: "dropdown" },
  { label: "List", value: "list" },
  { label: "Radio - Vaaka", value: "radio-horizontal" },
  { label: "Radio - Pysty", value: "radio-vertical" },
  { label: "Checkbox - Vaaka", value: "checkbox-horizontal" },
  { label: "Checkbox - Pysty", value: "checkbox-vertical" },
];

/**
 * Selection field form view
 */
export default class SelectionFieldFormView extends View {
  private listTypeSelectValue: SelectionFieldType = "dropdown";
  private listTypeSelect: DropdownView;
  private addOptionButton: ButtonView;
  private explanationInput: LabeledFieldView<TextareaView>;

  private optionsView: View;
  private readonly _optionsViewCollection: ViewCollection;
  private readonly _options: Map<string, SelectionFieldOptionData> = new Map();

  /**
   * Constructor
   * @param locale - The locale
   */
  constructor(locale: Locale) {
    super(locale);

    this._optionsViewCollection = new ViewCollection();

    this.explanationInput = this._createExplanationInput();
    this.listTypeSelect = this._createListTypeSelect();
    this.addOptionButton = this._createAddOptionButton();
    this.optionsView = this._createOptionsContainer();
    this.setTemplate({
      tag: "form",
      attributes: {
        class: ["ck", "ck-field-form"],
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
              children: [this.listTypeSelect],
            },
            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__row"],
              },
              children: [
                {
                  tag: "label",
                  attributes: {
                    class: ["ck", "ck-label"],
                  },
                  children: ["Vaihtoehdot", this.addOptionButton],
                },
              ],
            },
            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__row"],
              },
              children: [this.optionsView],
            },
            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__row"],
              },
              children: [this.explanationInput],
            },
          ],
        },
      ],
    });
  }

  /**
   * Creates the explanation textarea input
   */
  private _createExplanationInput(): LabeledFieldView<TextareaView> {
    const explanationInput = new LabeledFieldView(
      this.locale,
      createLabeledTextarea
    );
    explanationInput.label = "Selitys";
    explanationInput.fieldView.placeholder = "Kirjoita selitys tähän...";

    return explanationInput;
  }

  /**
   * Creates the categories container using CKEditor's view system
   * @returns The container view
   * @private
   */
  private _createOptionsContainer(): View {
    const containerView = new View(this.locale);

    containerView.setTemplate({
      tag: "div",
      attributes: {
        class: ["ck-sorter-terms-container"],
        style: "display: flex; flex-direction: column; gap: 10px;",
      },
      // Bind children to the categories collection
      children: this._optionsViewCollection,
    });

    return containerView;
  }

  /**
   * @returns The directionSelect dropdown field
   */
  private _createListTypeSelect(): DropdownView {
    const button = new DropdownButtonView(this.locale);
    const panel = new DropdownPanelView(this.locale);
    const dropdown = new DropdownView(this.locale, button, panel);

    button.set({
      label: "Tyyppi",
      withText: true,
      tooltip: true,
    });

    // Create items collection and add options
    const itemsView = new View(this.locale);
    const items: ButtonView[] = [];

    options.forEach((option) => {
      const buttonView = new ButtonView(this.locale);

      buttonView.set({
        label: option.label,
        withText: true,
      });

      // Handle option selection
      buttonView.on("execute", () => {
        this.listTypeSelectValue = option.value;
        button.label = option.label; // Update button label
        dropdown.isOpen = false; // Close the dropdown after selection
      });

      items.push(buttonView);
    });

    // Set up the items view
    itemsView.setTemplate({
      tag: "div",
      attributes: {
        class: ["ck", "ck-dropdown__panel-items"],
        style: "display: flex; flex-direction: column; gap: 4px;",
      },
      children: items,
    });

    // Add items view to the panel
    dropdown.panelView.children.add(itemsView);

    // Bind panel to button
    dropdown.bind("isEnabled").to(button);

    // Enable the dropdown
    dropdown.isEnabled = true;

    return dropdown;
  }

  /**
   * Creates the add term button
   * @returns The add term button
   */
  private _createAddOptionButton(): ButtonView {
    const button = new ButtonView(this.locale);
    button.set({
      label: "Lisää vaihtoehto",
      withText: true,
    });

    button.on("execute", () => {
      this._addNewOption();
    });

    return button;
  }

  /**
   * Adds a new term to the terms container
   * @param options The options for the term
   */
  private _addOptions(options: SelectionFieldAddOptionsParams = {}): void {
    const optionView = new View(this.locale);
    const optionId = options.id || `selection-option-${uid()}`;

    // Create drag handle
    const dragHandle = new ButtonView(this.locale);
    dragHandle.set({
      icon: icons.dragIndicator,
      class: ["ck-selection-option-handle"],
    });

    // Create term input
    const optionInput = new LabeledFieldView(
      this.locale,
      createLabeledInputText
    );
    optionInput.label = "Vaihtoehto";
    optionInput.placeholder = "Uusi vaihtoehto";
    optionInput.fieldView.value = options.name || "";

    // Create a switch button
    const correctSwitch = new SwitchButtonView(this.locale);
    correctSwitch.set({
      label: "Correct",
      withText: true,
      isOn: options.isCorrect,
    });

    // Handle the execute event to toggle the switch state
    correctSwitch.on("execute", () => {
      correctSwitch.set({ isOn: !correctSwitch.isOn });
    });

    // Create delete button
    const deleteButton = new ButtonView(this.locale);
    deleteButton.set({
      label: "Poista",
      icon: icons.cancel,
      class: "ck-selection-option-delete",
      tooltip: true,
    });

    // Set up term view template
    optionView.setTemplate({
      tag: "div",
      attributes: {
        class: ["ck-selection-option"],
        style: "display: flex; gap: 4px; align-items: center;",
        "data-option-id": optionId,
        draggable: "true",
      },
      children: [dragHandle, optionInput, correctSwitch, deleteButton],
    });

    // Handle term deletion
    deleteButton.on("execute", () => {
      this._options.delete(optionId);
      this._optionsViewCollection.remove(optionView);
      optionView.destroy();
    });

    // Store term data
    this._options.set(optionId, {
      id: optionId,
      name: "",
      view: optionView,
      nameInput: optionInput,
      correctSwitch,
    });

    // Add to collection
    this._optionsViewCollection.add(optionView);

    // Set up drag and drop after rendering
    optionView.on("render", () => {
      this._setupDragAndDrop(optionView);
    });

    // If the view is already rendered, set up drag and drop immediately
    if (optionView.element) {
      this._setupDragAndDrop(optionView);
    }
  }

  /**
   * Adds a new term to the terms container
   */
  private _addNewOption(): void {
    this._addOptions();
  }

  /**
   * Sets up drag and drop functionality for a option view
   * @param optionView The option view to set up drag and drop for
   */
  private _setupDragAndDrop(optionView: View): void {
    const element = optionView.element;
    if (!element) {
      return;
    }

    // Find the handle element
    const handleElement = element.querySelector(".ck-selection-option-handle");
    if (!handleElement) {
      return;
    }

    // Only allow dragging from the handle
    // by adding the draggable attribute to the handle element
    handleElement.addEventListener("mousedown", () => {
      element.setAttribute("draggable", "true");
    });

    // Remove the draggable attribute when the mouse is released
    element.addEventListener("mouseup", () => {
      element.setAttribute("draggable", "false");
    });

    // When the drag starts, store the term ID in the data transfer
    element.addEventListener("dragstart", (evt) => {
      if (evt.dataTransfer) {
        // Store the term ID in the data transfer
        evt.dataTransfer.setData(
          "application/option-id",
          element.dataset.optionId || ""
        );
        evt.dataTransfer.effectAllowed = "move";
      }
      element.classList.add("ck-selection-option--dragging");
    });

    // When the mouse is over an element, add an indicator of where the element will be dropped
    element.addEventListener("dragover", (evt) => {
      evt.preventDefault();

      // Get the term ID from the data transfer
      const draggedId = evt.dataTransfer.types.includes("application/option-id")
        ? evt.dataTransfer.getData("application/option-id")
        : null;

      if (!draggedId || draggedId === element.dataset.optionId) return;

      const rect = element.getBoundingClientRect();
      const dropPosition =
        evt.clientY < rect.top + rect.height / 2 ? "above" : "below";

      // Remove indicators from all elements
      document.querySelectorAll(".ck-selection-option").forEach((option) => {
        option.classList.remove(
          "ck-selection-option--drop-above",
          "ck-selection-option--drop-below"
        );
      });

      // Add indicator to current element
      element.classList.add(`ck-selection-option--drop-${dropPosition}`);
    });

    // When the element is dropped, move the term to the new position
    element.addEventListener("drop", (evt) => {
      evt.preventDefault();

      const draggedId = evt.dataTransfer.getData("application/option-id");
      if (!draggedId || draggedId === element.dataset.optionId) return;

      const rect = element.getBoundingClientRect();
      const dropPosition =
        evt.clientY < rect.top + rect.height / 2 ? "above" : "below";

      // Find indices using term IDs instead of elements
      const items = Array.from(this._optionsViewCollection);
      const draggedIndex = items.findIndex(
        (view) => view.element.dataset.termId === draggedId
      );
      let dropIndex = items.findIndex(
        (view) => view.element?.dataset.termId === element.dataset.termId
      );

      if (dropPosition === "below") {
        dropIndex++;
      }

      if (draggedIndex !== -1) {
        const draggedView = this._optionsViewCollection.get(draggedIndex);
        if (draggedView) {
          this._optionsViewCollection.remove(draggedView);
          this._optionsViewCollection.add(
            draggedView,
            dropIndex > draggedIndex ? dropIndex - 1 : dropIndex
          );
        }
      }

      // Clean up
      document.querySelectorAll(".ck-selection-option").forEach((option) => {
        option.classList.remove(
          "ck-selection-option--drop-above",
          "ck-selection-option--drop-below",
          "ck-selection-option--dragging"
        );
      });
    });

    // When the drag ends, clean up any remaining visual states
    element.addEventListener("dragend", () => {
      document.querySelectorAll(".ck-selection-option").forEach((option) => {
        option.classList.remove(
          "ck-selection-option--drop-above",
          "ck-selection-option--drop-below",
          "ck-selection-option--dragging"
        );
      });
    });
  }

  /**
   * Gets the form data
   * @returns The form data
   */
  getData(): SelectionFieldFormData {
    // Get options in the order they appear in the ViewCollection
    const options: SelectionFieldOption[] = Array.from(
      this._optionsViewCollection
    )
      .map((view) => {
        const optionId = view.element.dataset.optionId;
        if (!optionId) return null;

        const optionData = this._options.get(optionId);
        if (!optionData) return null;

        return {
          name: optionData.id,
          text: optionData.nameInput.fieldView.element.value,
          correct: optionData.correctSwitch.isOn,
        };
      })
      .filter((option): option is SelectionFieldOption => option !== null);

    return {
      listType: this.listTypeSelectValue,
      options: options,
      explanation: this.explanationInput.fieldView.element.value,
    };
  }

  /**
   * Sets the form data
   * @param data The form data
   */
  setData(data: SelectionFieldFormData): void {
    this.listTypeSelectValue = data.listType;

    const selectedOption = options.find((opt) => opt.value === data.listType);

    if (selectedOption) {
      this.listTypeSelect.buttonView.label = selectedOption.label;
    }

    // Clear existing options
    this._options.clear();
    this._optionsViewCollection.clear();

    // Add new options
    if (data.options.length) {
      data.options.forEach((option) => {
        this._addOptions({
          id: option.name,
          name: option.text,
          isCorrect: option.correct,
        });
      });
    }

    this.explanationInput.fieldView.value = data.explanation;
  }

  /**
   * Resets the form
   */
  reset(): void {
    this.setData({
      listType: "dropdown",
      options: [],
      explanation: "",
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

  /**
   * Destroys the form
   */
  destroy(): void {
    // Properly destroy all option views and their components
    this._options.forEach((optionData) => {
      optionData.nameInput.destroy();
      optionData.view.destroy();
    });
    this._options.clear();
    this._optionsViewCollection.clear();
    super.destroy();
  }
}
