/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  View,
  LabeledFieldView,
  createLabeledInputText,
  submitHandler,
  InputTextView,
  ButtonView,
  icons,
} from "ckeditor5";
import { Locale } from "ckeditor5";
import { OrganizerFormData } from "../types";

/**
 * Organizer field form view
 * @module muikku-organizerfield
 */
export default class OrganizerFieldFormView extends View {
  /**
   * The title input field
   */
  public titleInput: LabeledFieldView<InputTextView>;

  /**
   * Button to add new categories
   */
  public addCategoryButton: ButtonView;

  /**
   * Container for category elements
   */
  public categoriesContainer: HTMLDivElement;

  /**
   * Constructor
   * @param locale - The locale
   */
  constructor(locale: Locale) {
    super(locale);

    // Create form elements
    this.titleInput = this._createInput("Termien otsikko");
    this.addCategoryButton = this._createAddCategoryButton();
    this.categoriesContainer = this._createCategoriesContainer();

    // Set up the form template
    this.setTemplate({
      tag: "form",
      attributes: {
        class: ["ck", "ck-organizer-field-form"],
        tabindex: "-1",
      },
      children: [
        // Title section
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-form__row"],
          },
          children: [this.titleInput],
        },
        // Categories section
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
              children: ["Ryhmät"],
            },
            this.categoriesContainer,
          ],
        },
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-form__row"],
          },
          children: [this.addCategoryButton],
        },
      ],
    });
  }

  /**
   * Creates a labeled input field
   * @param label - The label text
   * @returns The labeled input field
   * @private
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
   * Creates the add category button
   * @returns The button view
   * @private
   */
  private _createAddCategoryButton(): ButtonView {
    const button = new ButtonView(this.locale);

    button.set({
      label: "Lisää ryhmä",
      icon: icons.plus,
      tooltip: true,
      withText: true,
    });

    button.on("execute", () => {
      console.log("Add category button clicked");
    });

    return button;
  }

  /**
   * Creates the categories container
   * @returns The container element
   * @private
   */
  private _createCategoriesContainer(): HTMLDivElement {
    const container = document.createElement("div");
    container.classList.add("ck-organizer-categories-container");
    return container;
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
    this.titleInput.fieldView.element.value = "";
    this.categoriesContainer.innerHTML = "";
  }

  /**
   * Gets the form data
   * @returns The form data
   */
  getData() {
    return {
      title: this.titleInput.fieldView.element.value,
      //categories: [], // We'll implement this later
    };
  }

  /**
   * Sets the form field values
   * @param data - OrganizerFormData object containing values to set
   */
  setData(data: OrganizerFormData): void {
    this.titleInput.fieldView.value = data.termTitle || "";
    this.categoriesContainer.innerHTML = ""; // Clear categories
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
