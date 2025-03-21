/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  View,
  LabeledFieldView,
  createLabeledInputText,
  ButtonView,
  submitHandler,
  ViewCollection,
} from "@ckeditor/ckeditor5-ui";
import { icons } from "@ckeditor/ckeditor5-core";
import { Locale } from "@ckeditor/ckeditor5-utils";
import {
  OrganizerFieldData,
  CategoryData,
  TermData,
  FormData,
  CategoryElementData,
} from "./organizerfield";

/**
 * @module muikku-organizerfield
 */
export default class OrganizerFieldFormView extends View {
  // Declare form elements
  public termTitleInput: LabeledFieldView;
  public saveButton: ButtonView;
  public cancelButton: ButtonView;
  public categoryContainer: HTMLElement;
  public addCategoryButton: ButtonView;
  private _categories: CategoryData[];
  readonly locale: Locale;

  /**
   * Constructor
   * @param locale - The locale object
   */
  constructor(locale: Locale) {
    super(locale);

    this.locale = locale;
    this._categories = [];

    // Create UI elements
    this._createInputs();
    this._createButtons();
    this._createCategoryList();

    // Create the form template
    this._createFormTemplate();

    // Set up event handling
    this._setupEventHandling();
  }

  /**
   * Create input fields
   * @private
   */
  private _createInputs() {
    // Create term title input
    this.termTitleInput = new LabeledFieldView(
      this.locale,
      createLabeledInputText
    );
    this.termTitleInput.placeholder = "Enter term title...";
  }

  /**
   * Create form buttons
   * @private
   */
  private _createButtons() {
    const t = this.locale.t;

    // Save button
    this.saveButton = new ButtonView(this.locale);
    this.saveButton.set({
      type: "submit",
      label: t("Save"),
      icon: icons.check,
      class: "ck-button-save",
    });

    // Cancel button
    this.cancelButton = new ButtonView(this.locale);
    this.cancelButton.set({
      label: t("Cancel"),
      icon: icons.cancel,
      class: "ck-button-cancel",
    });

    // Add category button
    this.addCategoryButton = new ButtonView(this.locale);
    this.addCategoryButton.set({
      label: t("Add Category"),
      icon: icons.plus,
      class: "ck-button-add-category",
    });
  }

  /**
   * Create the category management section
   * @private
   */
  private _createCategoryList() {
    this.categoryContainer = document.createElement("div");
    this.categoryContainer.classList.add("organizer-field-categories");
  }

  /**
   * Create the form template
   * @private
   */
  private _createFormTemplate() {
    this.setTemplate({
      tag: "form",
      attributes: {
        class: ["ck", "ck-organizer-field-form"],
        tabindex: "-1",
      },
      children: [
        this.termTitleInput,
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-organizer-field-categories-section"],
          },
          children: [
            {
              tag: "h3",
              attributes: {
                class: ["ck", "ck-organizer-field-categories-header"],
              },
              children: [this.locale.t("Categories")],
            },
            this.categoryContainer,
            this.addCategoryButton,
          ],
        },
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-organizer-field-actions"],
          },
          children: [this.saveButton, this.cancelButton],
        },
      ],
    });
  }

  /**
   * Set up event handlers
   * @private
   */
  private _setupEventHandling() {
    // Handle form submission
    submitHandler({
      view: this,
    });

    // Add category button handler
    this.addCategoryButton.on("execute", () => {
      this.addCategory();
    });

    // Cancel button handler
    this.cancelButton.on("execute", () => {
      this.fire("cancel");
    });
  }

  /**
   * Add a new category
   * @param categoryData - The category data
   * @private
   */
  public addCategory(
    categoryData: CategoryElementData = this._createEmptyCategoryData()
  ): void {
    const categoryElement = this._createCategoryElement(categoryData);
    this.categoryContainer.appendChild(categoryElement);
    this._categories.push(categoryData);
  }

  /**
   * Create an empty category data
   * @returns The empty category data
   * @private
   */
  private _createEmptyCategoryData(): CategoryElementData {
    return {
      id: this._generateUniqueId(),
      name: "",
      terms: [],
    };
  }

  /**
   * Create a category element
   * @param categoryData - The category data
   * @private
   */
  private _createCategoryElement(
    categoryData: CategoryElementData
  ): HTMLElement {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("organizer-field-category");
    categoryDiv.dataset.categoryId = categoryData.id;

    const nameInput = this._createCategoryNameInput(categoryData);
    const termsContainer = this._createTermsContainer(categoryData);
    const termInput = this._createTermInput(termsContainer, categoryData);
    const deleteButton = this._createDeleteCategoryButton(
      categoryDiv,
      categoryData
    );

    categoryDiv.append(nameInput, deleteButton, termsContainer, termInput);

    return categoryDiv;
  }

  /**
   * Create a category name input
   * @param categoryData - The category data
   * @private
   */
  private _createCategoryNameInput(
    categoryData: CategoryElementData
  ): HTMLInputElement {
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = categoryData.name;
    nameInput.placeholder = "Category name...";
    nameInput.classList.add("ck-input", "category-name-input");

    nameInput.addEventListener("change", () => {
      categoryData.name = nameInput.value;
    });

    return nameInput;
  }

  /**
   * Create a terms container
   * @param categoryData - The category data
   * @private
   */
  private _createTermsContainer(
    categoryData: CategoryElementData
  ): HTMLElement {
    const termsContainer = document.createElement("div");
    termsContainer.classList.add("category-terms");

    categoryData.terms.forEach((term) => {
      this._addTermToCategory(termsContainer, term, categoryData);
    });

    return termsContainer;
  }

  /**
   * Create a term input
   * @param termsContainer - The terms container element
   * @param categoryData - The category data
   * @private
   */
  private _createTermInput(
    termsContainer: HTMLElement,
    categoryData: CategoryElementData
  ): HTMLInputElement {
    const termInput = document.createElement("input");
    termInput.type = "text";
    termInput.placeholder = "Add term...";
    termInput.classList.add("ck-input", "term-input");

    termInput.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const termText = termInput.value.trim();
        if (termText) {
          const newTerm: TermData = {
            id: this._generateUniqueId(),
            text: termText,
          };
          this._addTermToCategory(termsContainer, newTerm, categoryData);
          termInput.value = "";
        }
      }
    });

    return termInput;
  }

  /**
   * Add a term to a category
   * @param container - The container element
   * @param term - The term
   * @param categoryData - The category data
   * @private
   */
  private _addTermToCategory(
    container: HTMLElement,
    term: TermData,
    categoryData: CategoryElementData
  ): void {
    const termSpan = document.createElement("span");
    termSpan.classList.add("category-term");
    termSpan.dataset.termId = term.id;
    termSpan.textContent = term.text;

    const deleteButton = this._createDeleteTermButton(
      termSpan,
      term,
      categoryData
    );
    termSpan.appendChild(deleteButton);
    container.appendChild(termSpan);

    if (!categoryData.terms.some((t) => t.id === term.id)) {
      categoryData.terms.push(term);
    }
  }

  private _createDeleteTermButton(
    termElement: HTMLElement,
    term: TermData,
    categoryData: CategoryElementData
  ): HTMLButtonElement {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("term-delete");
    deleteButton.innerHTML = "×";

    deleteButton.addEventListener("click", () => {
      termElement.remove();
      categoryData.terms = categoryData.terms.filter((t) => t.id !== term.id);
    });

    return deleteButton;
  }

  private _createDeleteCategoryButton(
    categoryElement: HTMLElement,
    categoryData: CategoryElementData
  ): HTMLButtonElement {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("ck-button", "category-delete");
    deleteButton.innerHTML = "×";

    deleteButton.addEventListener("click", () => {
      categoryElement.remove();
      this._categories = this._categories.filter(
        (c) => c.id !== categoryData.id
      );
    });

    return deleteButton;
  }

  /**
   * Get form data
   * @returns The form data
   */
  public getData(): FormData {
    const terms: TermData[] = [];
    this._categories.forEach((category) => {
      category.terms.forEach((term) => {
        terms.push(term);
      });
    });

    return {
      termTitle: this.termTitleInput.fieldView.element.getAttribute("value"),
      categories: this._categories.map((category) => ({
        id: category.id,
        name: category.name,
        terms: category.terms,
      })),
      terms: terms,
    };
  }

  /**
   * Set form data
   * @param data - The form data
   */
  public setData(data: Partial<FormData>): void {
    this.termTitleInput.fieldView.element.setAttribute(
      "value",
      data.termTitle || ""
    );
    this._categories = [];
    this.categoryContainer.innerHTML = "";

    (data.categories || []).forEach((category) => {
      this.addCategory({
        id: category.id || this._generateUniqueId(),
        name: category.name,
        terms: category.terms || [],
      });
    });
  }

  /**
   * Focus the first input when form opens
   */
  public focus(): void {
    this.termTitleInput.focus();
  }

  /**
   * Generate a unique ID
   * @returns The unique ID
   * @private
   */
  private _generateUniqueId(): string {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
