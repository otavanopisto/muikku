import {
  View,
  ButtonView,
  ViewCollection,
  Locale,
  SwitchButtonView,
  DropdownView,
  DropdownPanelView,
  DropdownButtonView,
  submitHandler,
  icons,
  uid,
  createLabeledInputText,
  LabeledFieldView,
} from "ckeditor5";
import {
  SorterFieldAddTermOptions,
  SorterFieldFormData,
  SorterFieldItem,
  SorterFieldItemData,
} from "../types";

// Define your options with values
const options: { label: string; value: "vertical" | "horizontal" }[] = [
  { label: "Pysty", value: "vertical" },
  { label: "Vaaka", value: "horizontal" },
];

/**
 * The sorterfield form view displayed in a dialog.
 */
export default class SorterFieldFormView extends View {
  private orientationValue: "vertical" | "horizontal" = "vertical";

  private directionSelect: DropdownView;
  private firstTermUppercaseCheckbox: SwitchButtonView;
  private addTermButton: ButtonView;
  private termsView: View;
  private readonly _termsViewCollection: ViewCollection;
  private readonly _terms: Map<string, SorterFieldItemData> = new Map();

  /**
   * @param locale The locale instance.
   */
  constructor(locale: Locale) {
    super(locale);

    this._termsViewCollection = new ViewCollection();

    // Create form fields
    this.directionSelect = this._createDirectionDropdown();
    this.firstTermUppercaseCheckbox = this._createFirstTermUppercaseToggle(
      "Ensimmäinen termi isolla alkukirjaimella"
    );
    this.termsView = this._createTermsContainer();
    this.addTermButton = this._createAddTermButton();

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
              children: [this.directionSelect],
            },
            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__row"],
              },
              children: [this.firstTermUppercaseCheckbox],
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
                  children: ["Termit", this.addTermButton],
                },
              ],
            },

            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__row"],
              },
              children: [this.termsView],
            },
          ],
        },
      ],
    });
  }

  /**
   * Creates the categories container using CKEditor's view system
   * @returns The container view
   * @private
   */
  private _createTermsContainer(): View {
    const containerView = new View(this.locale);

    containerView.setTemplate({
      tag: "div",
      attributes: {
        class: ["ck-sorter-terms-container"],
        style: "display: flex; flex-direction: column; gap: 10px;",
      },
      // Bind children to the categories collection
      children: this._termsViewCollection,
    });

    return containerView;
  }

  /**
   * Creates the add term button
   * @returns The add term button
   */
  private _createAddTermButton(): ButtonView {
    const button = new ButtonView(this.locale);
    button.set({
      label: "Lisää termi",
      withText: true,
    });

    button.on("execute", () => {
      this._addNewTerm();
    });

    return button;
  }

  /**
   * @returns The directionSelect dropdown field
   */
  private _createDirectionDropdown(): DropdownView {
    const button = new DropdownButtonView(this.locale);
    const panel = new DropdownPanelView(this.locale);
    const dropdown = new DropdownView(this.locale, button, panel);

    button.set({
      label: "Suunta",
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
        this.orientationValue = option.value;
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
   * @returns The first term uppercase toggle field
   * @param label The label for the toggle field
   */
  private _createFirstTermUppercaseToggle(label: string): SwitchButtonView {
    const toggle = new SwitchButtonView(this.locale);

    toggle.set({
      label,
      withText: true,
      isOn: false,
      class: "ck-switchbutton",
    });

    toggle.on("execute", () => {
      toggle.set({ isOn: !toggle.isOn });
    });

    return toggle;
  }

  /**
   * Adds a new term to the terms container
   * @param options The options for the term
   */
  private _addTerm(options: SorterFieldAddTermOptions = {}): void {
    const termView = new View(this.locale);
    const termId = options.id || `sorter-term-${uid()}`;

    // Create drag handle
    const dragHandle = new ButtonView(this.locale);
    dragHandle.set({
      icon: icons.dragIndicator,
      class: ["ck-sorter-term-handle"],
    });

    // Create term input
    const termInput = new LabeledFieldView(this.locale, createLabeledInputText);
    termInput.label = "Termi";
    termInput.placeholder = "Uusi termi";
    termInput.fieldView.value = options.name || "";

    // Create delete button
    const deleteButton = new ButtonView(this.locale);
    deleteButton.set({
      label: "Poista",
      icon: icons.cancel,
      class: "ck-sorter-term-delete",
      tooltip: true,
    });

    // Set up term view template
    termView.setTemplate({
      tag: "div",
      attributes: {
        class: ["ck-sorter-term"],
        style: "display: flex; gap: 4px; align-items: center;",
        "data-term-id": termId,
        draggable: "true",
      },
      children: [dragHandle, termInput, deleteButton],
    });

    // Handle term deletion
    deleteButton.on("execute", () => {
      this._terms.delete(termId);
      this._termsViewCollection.remove(termView);
      termView.destroy();
    });

    // Store term data
    this._terms.set(termId, {
      id: termId,
      name: "",
      view: termView,
      nameInput: termInput,
    });

    // Add to collection
    this._termsViewCollection.add(termView);

    // Set up drag and drop after rendering
    termView.on("render", () => {
      this._setupDragAndDrop(termView);
    });

    // If the view is already rendered, set up drag and drop immediately
    if (termView.element) {
      this._setupDragAndDrop(termView);
    }
  }

  /**
   * Sets up drag and drop functionality for a term view
   * @param termView The term view to set up drag and drop for
   */
  private _setupDragAndDrop(termView: View): void {
    const element = termView.element;
    if (!element) {
      return;
    }

    // Find the handle element
    const handleElement = element.querySelector(".ck-sorter-term-handle");
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
          "application/term-id",
          element.dataset.termId || ""
        );
        evt.dataTransfer.effectAllowed = "move";
      }
      element.classList.add("ck-sorter-term--dragging");
    });

    // When the mouse is over an element, add an indicator of where the element will be dropped
    element.addEventListener("dragover", (evt) => {
      evt.preventDefault();

      // Get the term ID from the data transfer
      const draggedId = evt.dataTransfer.types.includes("application/term-id")
        ? evt.dataTransfer.getData("application/term-id")
        : null;

      if (!draggedId || draggedId === element.dataset.termId) return;

      const rect = element.getBoundingClientRect();
      const dropPosition =
        evt.clientY < rect.top + rect.height / 2 ? "above" : "below";

      // Remove indicators from all elements
      document.querySelectorAll(".ck-sorter-term").forEach((term) => {
        term.classList.remove(
          "ck-sorter-term--drop-above",
          "ck-sorter-term--drop-below"
        );
      });

      // Add indicator to current element
      element.classList.add(`ck-sorter-term--drop-${dropPosition}`);
    });

    // When the element is dropped, move the term to the new position
    element.addEventListener("drop", (evt) => {
      evt.preventDefault();

      const draggedId = evt.dataTransfer.getData("application/term-id");
      if (!draggedId || draggedId === element.dataset.termId) return;

      const rect = element.getBoundingClientRect();
      const dropPosition =
        evt.clientY < rect.top + rect.height / 2 ? "above" : "below";

      // Find indices using term IDs instead of elements
      const items = Array.from(this._termsViewCollection);
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
        const draggedView = this._termsViewCollection.get(draggedIndex);
        if (draggedView) {
          this._termsViewCollection.remove(draggedView);
          this._termsViewCollection.add(
            draggedView,
            dropIndex > draggedIndex ? dropIndex - 1 : dropIndex
          );
        }
      }

      // Clean up
      document.querySelectorAll(".ck-sorter-term").forEach((term) => {
        term.classList.remove(
          "ck-sorter-term--drop-above",
          "ck-sorter-term--drop-below",
          "ck-sorter-term--dragging"
        );
      });
    });

    // When the drag ends, clean up any remaining visual states
    element.addEventListener("dragend", () => {
      document.querySelectorAll(".ck-sorter-term").forEach((term) => {
        term.classList.remove(
          "ck-sorter-term--drop-above",
          "ck-sorter-term--drop-below",
          "ck-sorter-term--dragging"
        );
      });
    });
  }

  /**
   * Adds a new term to the terms container
   */
  private _addNewTerm(): void {
    this._addTerm();
  }

  /**
   * Gets the form data
   * @returns Form data
   */
  getData(): SorterFieldFormData {
    // Get terms in the order they appear in the ViewCollection
    const terms: SorterFieldItem[] = Array.from(this._termsViewCollection)
      .map((view) => {
        const termId = view.element.dataset.termId;
        if (!termId) return null;

        const termData = this._terms.get(termId);
        if (!termData) return null;

        return {
          id: termId,
          name: termData.nameInput.fieldView.element.value,
        };
      })
      .filter((term): term is SorterFieldItem => term !== null);

    return {
      orientation: this.orientationValue,
      capitalize: this.firstTermUppercaseCheckbox.isOn,
      items: terms,
    };
  }

  /**
   * Sets the form data
   * @param data Form data
   */
  setData(data: SorterFieldFormData): void {
    this.orientationValue = data.orientation;
    this.firstTermUppercaseCheckbox.isOn = data.capitalize;

    const selectedOption = options.find(
      (opt) => opt.value === data.orientation
    );

    if (selectedOption) {
      this.directionSelect.buttonView.label = selectedOption.label;
    }

    // Clear existing terms
    this._terms.clear();
    this._termsViewCollection.clear();

    // Add new terms
    if (data.items.length) {
      data.items.forEach((item) => {
        this._addTerm({
          id: item.id,
          name: item.name,
        });
      });
    }
  }

  /**
   * Resets the form
   */
  reset() {
    this.setData({
      orientation: "vertical",
      capitalize: false,
      items: [],
    });
  }

  /**
   * Focuses the first input
   */
  focus(): void {
    this.directionSelect.focus();
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
    // Properly destroy all pair views and their components
    this._terms.forEach((termData) => {
      termData.nameInput.destroy();
      termData.view.destroy();
    });
    this._terms.clear();
    this._termsViewCollection.clear();
    super.destroy();
  }
}
